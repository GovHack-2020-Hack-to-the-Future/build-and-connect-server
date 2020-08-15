import { GraphQLModule } from '@graphql-modules/core';

import { providers } from './providers';
import { typeDefs } from './type-defs';
import { commonModule } from '../common/common.module';
import { dataSourcesModule } from '../data-sources/data-sources.module';

export const usersModule = new GraphQLModule({
  providers,
  typeDefs,
  imports: [commonModule, dataSourcesModule],
  name: 'users',
});
