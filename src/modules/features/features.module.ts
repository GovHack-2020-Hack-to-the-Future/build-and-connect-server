import { GraphQLModule } from '@graphql-modules/core';

import { providers } from './providers';
import { resolvers } from './resolvers';
import { typeDefs } from './type-defs';
import { commonModule } from '../common/common.module';
import { dataSourcesModule } from '../data-sources/data-sources.module';

export const featuresModule = new GraphQLModule({
  providers,
  resolvers,
  typeDefs,
  imports: [commonModule, dataSourcesModule],
  name: 'feature',
});
