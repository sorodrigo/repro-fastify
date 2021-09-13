import { extendType, objectType } from 'nexus';

const User = objectType({
  name: 'User',
  definition(t) {
    t.id('id');
    t.string('email');
  },
});

const queries = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('currentUser', {
      type: 'User',
      resolve: async (e, args, ctx) => {
        const user = ctx.user;
        if (!user?.id) return null;

        return user;
      },
    });
  },
});

export default [User, undefined, queries];
