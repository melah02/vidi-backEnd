import { Resend } from 'resend';
import 'dotenv/config';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMessage = async (messageData) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: messageData.to,
      subject: messageData.subject,
      html: messageData.html,
      text: messageData.text
    });

    if (error) {
      console.error(error);
      throw error;
    }

    console.log('Email sent:', data);
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};