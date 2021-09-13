import fp from 'fastify-plugin';
import passport from 'fastify-passport';
import fastifySecureSession from 'fastify-secure-session';
import { magicLink } from './magic-link';
import STRATEGY from './strategy';
import { NexusGenRootTypes } from 'src/graphql/nexus-types.generated';

const FAKE_DB: Record<string, any> = {
  'me@example.com': { id: 1, name: 'me', email: 'me@example.com' }
};

type User = NexusGenRootTypes['User'];
declare module 'fastify' {
  interface PassportUser extends User {
    redirect: string
  }
}

const COOKIE_SECRET = process.env.COOKIE_SECRET as string;

export const passportSetup = fp(async (instance) => {
  instance.register(fastifySecureSession, {
    key: Buffer.from(COOKIE_SECRET, 'hex'),
    cookieName: 'session',
    cookie: {
      maxAge: 24 * 60 * 60 * 1000 * 30,
      // Do not change the lines below, they make cy.auth() work in e2e tests
      secure: process.env.NODE_ENV !== 'development' && !process.env.INSECURE_AUTH,
      signed: process.env.NODE_ENV !== 'development' && !process.env.INSECURE_AUTH,
    },
  });
  instance.register(passport.initialize());
  instance.register(passport.secureSession());

  passport.registerUserSerializer(async (passportUser: { email: string, redirect: string }) => {
    const { email, redirect } = passportUser;

    const userId = FAKE_DB[email as string];
    // here we would retrieve userId based on the email
    return { userId, redirect };
  });

  passport.registerUserDeserializer(async ({ userId, redirect }: { userId: string, redirect: string }) => {
    const user: any = Object.values(FAKE_DB).find(usr => usr.id === userId);
    return { ...user, redirect };
  });

  passport.use(STRATEGY, magicLink);
});
