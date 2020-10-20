import { withIronSession } from 'next-iron-session';

export default function withSession(handler) {
  return withIronSession(handler, {
    cookieName: 'fictional-train-app',
    ttl: 2147483647,
    password: process.env.APPLICATION_SECRET,
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  });
}
