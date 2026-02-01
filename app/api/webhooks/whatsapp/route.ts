
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '../../../../lib/db';
import { sendTextMessage, sendButtonMessage, sendListMessage } from '../../../../lib/whatsapp';
import { createStripePaymentLink } from '../../../../lib/payments/stripe';
import { createRazorpayPaymentLink } from '../../../../lib/payments/razorpay';
import { OrderSource, OrderStatus } from '../../../../types';

// Verify Webhook Signature (Security Rule)
function verifySignature(body: string, signature: string | null): boolean {
  if (!signature) return false;
  const appSecret = process.env.META_APP_SECRET;
  if (!appSecret) return true; // Fail open only if env is missing (dev), ideally fail closed.

  const [method, signatureHash] = signature.split('=');
  if (method !== 'sha256') return false;

  const expectedHash = crypto
    .createHmac('sha256', appSecret)
    .update(body)
    .digest('hex');

  return signatureHash === expectedHash;
}

// Verification for Meta (GET)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse('Forbidden', { status: 403 });
}

// Incoming Messages (POST)
export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-hub-signature-256');

    // 1. Verify Signature
    if (process.env.NODE_ENV === 'production' && !verifySignature(rawBody, signature)) {
      console.error("Invalid WhatsApp Signature");
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = JSON.parse(rawBody);

    // Check if it's a message
    if (body.object && body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
      const message = body.entry[0].changes[0].value.messages[0];
      const from = message.from; // Phone number
      const msgBody = message.text?.body;
      const btnId = message.interactive?.button_reply?.id;
      const listId = message.interactive?.list_reply?.id;

      await handleWhatsAppFlow(from, msgBody, btnId, listId);
    }

    return new NextResponse('EVENT_RECEIVED', { status: 200 });
  } catch (error) {
    console.error('WhatsApp Webhook Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Conversation State Machine
async function handleWhatsAppFlow(phone: string, text?: string, btnId?: string, listId?: string) {
  let session = await db.whatsAppSession.findUnique({ where: { phone } });

  // Initialize session if not exists
  if (!session) {
    session = await db.whatsAppSession.create({
      data: { phone, cart: [], step: 'MENU', metadata: {} }
    });
  }

  // Sanitized inputs
  const safeText = text?.trim().toLowerCase();

  // --- GLOBAL RESET ---
  if (safeText === 'hi' || safeText === 'menu' || safeText === 'reset' || safeText === 'start') {
    await db.whatsAppSession.update({
      where: { phone },
      data: { step: 'MENU', cart: [], metadata: {} }
    });
    
    await sendTextMessage(phone, "Welcome to *KAKATIYAS*.\nHeritage Luxury at your fingertips.");
    await sendButtonMessage(phone, "How can we assist you today?", [
      { id: 'BROWSE', title: 'Browse Collection' },
      { id: 'TALK_HUMAN', title: 'Talk to Artisan' }
    ]);
    return;
  }

  // --- STEP HANDLING ---
  
  // 1. MENU SELECTION
  if (session.step === 'MENU') {
    if (btnId === 'BROWSE') {
      await sendButtonMessage(phone, "Select a category:", [
        { id: 'CAT_FASHION', title: 'Fashion' },
        { id: 'CAT_JEWELRY', title: 'Jewelry' },
        { id: 'CAT_HANDLOOM', title: 'Handloom' }
      ]);
      await db.whatsAppSession.update({ where: { phone }, data: { step: 'BROWSING' } });
    } else if (btnId === 'TALK_HUMAN') {
      await sendTextMessage(phone, "A concierge will be with you shortly. You can type 'menu' to return.");
      // In a real app, this would trigger an alert to support staff
    }
    return;
  }

  // 2. BROWSING & PRODUCT SELECTION
  if (session.step === 'BROWSING') {
    if (btnId?.startsWith('CAT_')) {
      // Fetch Products (Limit 5 as per prompt)
      const categoryName = btnId.replace('CAT_', ''); // FASHION, JEWELRY
      const products = await db.product.findMany({
        where: { type: categoryName as any },
        take: 5
      });

      if (products.length === 0) {
        await sendTextMessage(phone, "No items found in this collection currently.");
        return;
      }

      const sections = [{
        title: "Available Pieces",
        rows: products.map(p => ({
          id: `PROD_${p.id}`,
          title: p.name.substring(0, 24),
          description: `₹${p.price.toLocaleString()} - ${p.sku || p.id.slice(-4)}`
        }))
      }];

      await sendListMessage(phone, `${categoryName} Collection`, "Select a masterpiece to add to your cart.", "View Products", sections);
      await db.whatsAppSession.update({ where: { phone }, data: { step: 'SELECTING_PRODUCT' } });
    }
    return;
  }

  // 3. PRODUCT SELECTED -> ASK QTY
  // Handle both List ID selection AND Manual Text Code entry (Fallback)
  if (session.step === 'SELECTING_PRODUCT') {
    let productId = null;

    if (listId?.startsWith('PROD_')) {
      productId = listId.replace('PROD_', '');
    } else if (text) {
      // Try to find product by exact SKU or ID
      const p = await db.product.findFirst({
        where: { OR: [{ sku: text }, { id: text }] }
      });
      if (p) productId = p.id;
    }

    if (productId) {
      await db.whatsAppSession.update({ 
        where: { phone }, 
        data: { 
          step: 'SELECTING_QTY',
          metadata: { selectedProductId: productId }
        } 
      });
      await sendTextMessage(phone, "Excellent choice. How many units would you like? (Please type a number, e.g., 1)");
    } else if (text) {
      await sendTextMessage(phone, "We couldn't find that product. Please select from the list or type 'menu' to restart.");
    }
    return;
  }

  // 4. QTY INPUT -> UPDATE CART -> ACTIONS
  if (session.step === 'SELECTING_QTY') {
    const qty = parseInt(text || '1');
    if (isNaN(qty) || qty < 1) {
      await sendTextMessage(phone, "Please enter a valid quantity (e.g., 1).");
      return;
    }

    // Update Cart
    const currentCart = (session.cart as any[]) || [];
    const meta = session.metadata as any;
    
    // Add item
    currentCart.push({ productId: meta.selectedProductId, quantity: qty });

    await db.whatsAppSession.update({
      where: { phone },
      data: {
        cart: currentCart,
        step: 'CART_ACTIONS',
        metadata: {} 
      }
    });

    await sendTextMessage(phone, `Added ${qty} item(s) to cart.`);
    await sendButtonMessage(phone, "What would you like to do next?", [
      { id: 'CHECKOUT', title: 'Checkout' },
      { id: 'CONTINUE', title: 'Add More Items' },
      { id: 'CLEAR', title: 'Clear Cart' }
    ]);
    return;
  }

  // 5. CART ACTIONS
  if (session.step === 'CART_ACTIONS') {
    if (btnId === 'CONTINUE') {
      await db.whatsAppSession.update({ where: { phone }, data: { step: 'MENU' } });
      // Re-trigger menu prompt immediately for UX
      await sendButtonMessage(phone, "Select a category:", [
        { id: 'CAT_FASHION', title: 'Fashion' },
        { id: 'CAT_JEWELRY', title: 'Jewelry' },
        { id: 'CAT_HANDLOOM', title: 'Handloom' }
      ]);
      await db.whatsAppSession.update({ where: { phone }, data: { step: 'BROWSING' } });
    } else if (btnId === 'CLEAR') {
      await db.whatsAppSession.update({ where: { phone }, data: { cart: [], step: 'MENU' } });
      await sendTextMessage(phone, "Cart cleared.");
      await handleWhatsAppFlow(phone, 'MENU');
    } else if (btnId === 'CHECKOUT') {
      await db.whatsAppSession.update({ where: { phone }, data: { step: 'CHECKOUT_ADDRESS' } });
      await sendTextMessage(phone, "Please type your full delivery address.");
    }
    return;
  }

  // 6. ADDRESS -> PAYMENT
  if (session.step === 'CHECKOUT_ADDRESS') {
    if (text) {
      await db.whatsAppSession.update({ 
        where: { phone }, 
        data: { 
          step: 'CHECKOUT_PAYMENT',
          metadata: { address: text }
        } 
      });
      await sendButtonMessage(phone, "Select Payment Method:", [
        { id: 'PAY_RAZORPAY', title: 'Razorpay Link' },
        { id: 'PAY_STRIPE', title: 'Stripe Link' },
        { id: 'PAY_WEB', title: 'Pay on Website' }
      ]);
    }
    return;
  }

  // 7. FINALIZE ORDER
  if (session.step === 'CHECKOUT_PAYMENT') {
    if (btnId === 'PAY_RAZORPAY' || btnId === 'PAY_STRIPE' || btnId === 'PAY_WEB') {
      const cart = session.cart as any[];
      if (!cart || cart.length === 0) {
        await sendTextMessage(phone, "Your cart is empty. Type 'menu' to start shopping.");
        return;
      }

      // Calculate Total & Validate Stock & Inventory Deduction
      // NOTE: For robustness, this should be a transaction.
      // We will perform a simplified check-and-create here.

      try {
        const order = await db.$transaction(async (tx) => {
           let total = 0;
           const orderItems = [];

           for (const item of cart) {
             const product = await tx.product.findUnique({ where: { id: item.productId } });
             if (!product) throw new Error(`Product not found: ${item.productId}`);
             if (product.stock < item.quantity) throw new Error(`Insufficient stock for ${product.name}`);

             // Deduct Inventory
             await tx.product.update({
               where: { id: item.productId },
               data: { stock: { decrement: item.quantity } }
             });

             total += product.price * item.quantity;
             orderItems.push({
               productId: product.id,
               quantity: item.quantity,
               price: product.price
             });
           }

           return await tx.order.create({
             data: {
               source: OrderSource.WHATSAPP,
               whatsappNumber: phone,
               status: OrderStatus.PENDING,
               total: total,
               items: {
                 create: orderItems
               }
             }
           });
        });

        // Generate Link
        let paymentLink = '';
        if (btnId === 'PAY_STRIPE') {
          paymentLink = (await createStripePaymentLink(order.total, order.id)) || '';
        } else if (btnId === 'PAY_RAZORPAY') {
          paymentLink = await createRazorpayPaymentLink(order.total, order.id, phone);
        } else {
          // Pay on Website (fallback)
          paymentLink = `${process.env.NEXTAUTH_URL}/profile/orders/${order.id}`;
        }

        // Send Response
        await sendTextMessage(phone, `*Order Placed Successfully!* 🏛️\nOrder ID: #${order.id.slice(-6)}\nTotal: ₹${order.total.toLocaleString()}\n\nPlease complete payment here: ${paymentLink}\n\nThank you for choosing Kakatiyas.`);

        // Reset Session
        await db.whatsAppSession.update({
          where: { phone },
          data: { cart: [], step: 'MENU', metadata: {} }
        });

      } catch (e: any) {
        console.error("Order Creation Error", e);
        await sendTextMessage(phone, `Unable to place order: ${e.message}. Please type 'menu' to try again.`);
      }
    }
    return;
  }
}
