import { ConnectionOptions } from 'mongoose';

export type DataSourcesModuleConfig = {
  mongooseConfig: {
    uri: string;
    options: ConnectionOptions;
  };
};
