import { GraphQLModule } from '@graphql-modules/core';
import mongoose from 'mongoose';

import { providers } from './providers';
import { DataSourcesModuleConfig } from './types/data-source-module-config.type';

export const dataSourcesModule = new GraphQLModule<DataSourcesModuleConfig>({
  providers: ({ config }: { config: DataSourcesModuleConfig }) => [
    {
      provide: 'mongooseConnection',
      useValue: mongoose.createConnection(
        config.mongooseConfig.uri,
        config.mongooseConfig.options
      ),
    },
    ...providers,
  ],
  name: 'dataSources',
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    process.exit(0);
  });
});
