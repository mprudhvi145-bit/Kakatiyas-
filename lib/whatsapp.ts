
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

const BASE_URL = `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_ID}/messages`;

const headers = {
  'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
  'Content-Type': 'application/json',
};

export async function sendTextMessage(to: string, text: string) {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: text },
      }),
    });
    return await res.json();
  } catch (error) {
    console.error('WhatsApp Text Error:', error);
  }
}

export async function sendButtonMessage(to: string, text: string, buttons: { id: string, title: string }[]) {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to,
        type: 'interactive',
        interactive: {
          type: 'button',
          body: { text: text },
          action: {
            buttons: buttons.map(btn => ({
              type: 'reply',
              reply: { id: btn.id, title: btn.title }
            }))
          }
        },
      }),
    });
    return await res.json();
  } catch (error) {
    console.error('WhatsApp Button Error:', error);
  }
}

export async function sendListMessage(to: string, header: string, body: string, buttonText: string, sections: { title: string, rows: { id: string, title: string, description?: string }[] }[]) {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to,
        type: 'interactive',
        interactive: {
          type: 'list',
          header: { type: 'text', text: header },
          body: { text: body },
          footer: { text: 'Kakatiyas Luxury' },
          action: {
            button: buttonText,
            sections: sections
          }
        },
      }),
    });
    return await res.json();
  } catch (error) {
    console.error('WhatsApp List Error:', error);
  }
}
