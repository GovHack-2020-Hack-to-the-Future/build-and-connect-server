import { GraphQLModule } from '@graphql-modules/core';

import { typeDefs } from './type-defs';

export const commonModule = new GraphQLModule({
  typeDefs,
  name: 'common',
});
