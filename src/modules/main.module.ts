import 'reflect-metadata';
import { GraphQLModule } from '@graphql-modules/core';

import { authModule } from './auth/auth.module';
import { dataSourcesModule } from './data-sources/data-sources.module';
import { featuresModule } from './features/features.module';
import { environment } from '../environment';

export const mainModule = new GraphQLModule({
  imports: [
    dataSourcesModule.forRoot({
      mongooseConfig: environment.dataSources.mongoose,
    }),
    authModule.forRoot({
      userInfoUri: environment.auth.userInfoUri,
    }),
    featuresModule,
  ],
  name: 'main',
});
