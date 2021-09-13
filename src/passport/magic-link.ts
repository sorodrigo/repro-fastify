import MagicLoginStrategy from 'passport-magic-login';
import { sendEmail } from '../utils/send-email';

if (!process.env.MAGIC_LINK_SECRET)
  throw new Error(`Please add process.env.MAGIC_LINK_SECRET to your .env file!`);

export const magicLink = new MagicLoginStrategy({
  secret: process.env.MAGIC_LINK_SECRET,
  callbackUrl: 'callback',
  sendMagicLink: async (destination, href, code, req) => {
    const link = `${req.headers.host}${req.url}${href}`;

    await sendEmail({
      to: destination,
      subject: `Your login link`,
      text: `Hey! Click on this link to finish logging in: ${link}\nMake sure the verification code matches ${code}!`,
    });
  },
  verify: (payload, callback) => {
    callback(undefined, {
      ...payload,
      email: payload.destination,
      provider: 'mail',
    });
  },
});
