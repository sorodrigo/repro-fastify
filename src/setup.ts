import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import Sensible from 'fastify-sensible';
import Cors from 'fastify-cors';
import Helmet from 'fastify-helmet';
import Mercurius from 'mercurius';
import { passportSetup } from './passport';
import { schema } from './graphql/schema';
import { NexusGenRootTypes } from './graphql/nexus-types.generated'

declare module 'mercurius' {
  interface MercuriusContext {
    user: NexusGenRootTypes['User']
  }
}

const config: FastifyServerOptions = {
  logger: true,
  ignoreTrailingSlash: true,
};

const setup = (): FastifyInstance => {
  const instance: FastifyInstance = fastify(config);
  instance.register(Sensible, { errorHandler: false });
  instance.register(Cors);
  instance.register(Helmet, {
    contentSecurityPolicy: {
      directives: {
        'default-src': "'self' https://unpkg.com 'unsafe-inline'",
      },
    },
  });

  instance.register(passportSetup);
  instance.register(
    Mercurius,
    {
      schema,
      graphiql: true,
      async context(request) {
        return {
          user: request.user // always null
        };
      }
    }
  );

  return instance;
};

export const server = setup();
