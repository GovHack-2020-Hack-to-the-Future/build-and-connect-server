import { GraphQLModule } from '@graphql-modules/core';

import { AuthModuleConfig } from './types';
import { providers } from './providers';
import { resolvers, resolversComposition } from './resolvers';
import { typeDefs } from './type-defs';
import { usersModule } from '../users/users.module';

export const authModule = new GraphQLModule<AuthModuleConfig>({
  providers,
  resolvers,
  resolversComposition,
  typeDefs,
  imports: [usersModule],
  name: 'auth',
});
