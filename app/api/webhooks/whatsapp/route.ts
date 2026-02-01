
import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { sendTextMessage, sendButtonMessage, sendListMessage } from '../../../../lib/whatsapp';
import { createStripePaymentLink } from '../../../../lib/payments/stripe';
import { createRazorpayPaymentLink } from '../../../../lib/payments/razorpay';
import { OrderSource, OrderStatus } from '../../../../types';

// Verification for Meta
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

export async function POST(req: Request) {
  try {
    const body = await req.json();

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
      data: { phone, cart: [], step: 'MENU' }
    });
  }

  // --- GLOBAL RESET ---
  if (text?.toLowerCase() === 'hi' || text?.toLowerCase() === 'menu' || text?.toLowerCase() === 'reset') {
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
      await sendTextMessage(phone, "A concierge will be with you shortly.");
    }
    return;
  }

  // 2. BROWSING & PRODUCT SELECTION
  if (session.step === 'BROWSING') {
    if (btnId?.startsWith('CAT_')) {
      // Fetch Products
      const categoryName = btnId.replace('CAT_', ''); // FASHION, JEWELRY
      const products = await db.product.findMany({
        where: { type: categoryName as any },
        take: 8
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
          description: `₹${p.price} - ${p.description.substring(0, 30)}...`
        }))
      }];

      await sendListMessage(phone, `${categoryName} Collection`, "Select a masterpiece to add to your cart.", "View Products", sections);
      await db.whatsAppSession.update({ where: { phone }, data: { step: 'SELECTING_PRODUCT' } });
    }
    return;
  }

  // 3. PRODUCT SELECTED -> ASK QTY
  if (session.step === 'SELECTING_PRODUCT') {
    if (listId?.startsWith('PROD_')) {
      const productId = listId.replace('PROD_', '');
      await db.whatsAppSession.update({ 
        where: { phone }, 
        data: { 
          step: 'SELECTING_QTY',
          metadata: { selectedProductId: productId }
        } 
      });
      await sendTextMessage(phone, "Excellent choice. How many units would you like? (Please type a number, e.g., 1)");
    }
    return;
  }

  // 4. QTY INPUT -> UPDATE CART -> ACTIONS
  if (session.step === 'SELECTING_QTY') {
    const qty = parseInt(text || '1');
    if (isNaN(qty) || qty < 1) {
      await sendTextMessage(phone, "Please enter a valid quantity.");
      return;
    }

    // Update Cart
    const currentCart = session.cart as any[] || [];
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
      { id: 'CONTINUE', title: 'Continue Shopping' },
      { id: 'CLEAR', title: 'Clear Cart' }
    ]);
    return;
  }

  // 5. CART ACTIONS
  if (session.step === 'CART_ACTIONS') {
    if (btnId === 'CONTINUE') {
      await db.whatsAppSession.update({ where: { phone }, data: { step: 'MENU' } }); // Loop back logic could be better, simplified here
      await handleWhatsAppFlow(phone, 'MENU'); // Trigger menu again
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
        { id: 'PAY_STRIPE', title: 'Stripe Link' }
      ]);
    }
    return;
  }

  // 7. FINALIZE ORDER
  if (session.step === 'CHECKOUT_PAYMENT') {
    if (btnId === 'PAY_RAZORPAY' || btnId === 'PAY_STRIPE') {
      const cart = session.cart as any[];
      if (!cart || cart.length === 0) return;

      // Calculate Total & Validate Stock
      let total = 0;
      const orderItems = [];

      for (const item of cart) {
        const product = await db.product.findUnique({ where: { id: item.productId } });
        if (product) {
          total += product.price * item.quantity;
          orderItems.push({
            productId: product.id,
            quantity: item.quantity,
            price: product.price
          });
        }
      }

      // Create Order
      const order = await db.order.create({
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

      // Generate Link
      let paymentLink = '';
      try {
        if (btnId === 'PAY_STRIPE') {
          paymentLink = (await createStripePaymentLink(total, order.id)) || '';
        } else {
          paymentLink = await createRazorpayPaymentLink(total, order.id, phone);
        }
      } catch (e) {
        console.error(e);
        await sendTextMessage(phone, "Error generating payment link. Our team will contact you.");
        return;
      }

      // Send Response
      await sendTextMessage(phone, `*Order Placed Successfully!* 🏛️\nOrder ID: #${order.id.slice(-6)}\nTotal: ₹${total}\n\nPlease complete payment here: ${paymentLink}\n\nThank you for choosing Kakatiyas.`);

      // Reset Session
      await db.whatsAppSession.update({
        where: { phone },
        data: { cart: [], step: 'MENU', metadata: {} }
      });
    }
    return;
  }
}
