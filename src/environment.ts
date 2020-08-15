import { ConnectionOptions } from 'mongoose';

const defaultPort = 4000;

const getCorsOrigins = (origins: string | undefined): string[] | [] => {
  return origins
    ? origins.split(',').map((origin: string): string => origin.trim())
    : [];
};

export interface Environment {
  apollo: {
    server: {
      cors: {
        origins: string[] | [];
      };
      introspection: boolean;
      playground: boolean;
    };
  };
  auth: {
    jwks: {
      cache: boolean;
      rateLimit: boolean;
      requestPerMinute: number;
      uri: string;
    };
    jwt: {
      audience: string;
      issuer: string;
    };
    userInfoUri: string;
  };
  dataSources: {
    mongoose: {
      uri: string;
      options: ConnectionOptions;
    };
  };
  port: number | string;
  voyager: {
    endpointUrl: string | undefined;
  };
}

export const environment: Environment = {
  apollo: {
    server: {
      cors: {
        origins: getCorsOrigins(process.env.APOLLO_SERVER_CORS_ORIGINS),
      },
      introspection: process.env.APOLLO_SERVER_INTROSPECTION === 'true',
      playground: process.env.APOLLO_SERVER_PLAYGROUND === 'true',
    },
  },
  auth: {
    jwks: {
      cache: process.env.AUTH_JWKS_CACHE === 'true',
      rateLimit: process.env.AUTH_JWKS_RATE_LIMIT === 'true',
      requestPerMinute: parseInt(
        process.env.AUTH_JWKS_REQUEST_PER_MINUTE as string,
        10
      ),
      uri: process.env.AUTH_JWKS_URI as string,
    },
    jwt: {
      audience: process.env.AUTH_JWT_AUDIENCE as string,
      issuer: process.env.AUTH_JWT_ISSUER as string,
    },
    userInfoUri: process.env.AUTH_USER_INFO_URI as string,
  },
  dataSources: {
    mongoose: {
      uri: process.env.DATA_SOURCES_MONGOOSE_URI as string,
      options: {
        bufferCommands:
          process.env.DATA_SOURCES_MONGOOSE_OPTIONS_BUFFER_COMMANDS === 'true',
        bufferMaxEntries: parseInt(
          process.env
            .DATA_SOURCES_MONGOOSE_OPTIONS_BUFFER_MAX_ENTRIES as string,
          10
        ),
        poolSize: parseInt(
          process.env.DATA_SOURCES_MONGOOSE_OPTIONS_AUTO_INDEX as string,
          10
        ),
        useCreateIndex:
          process.env.DATA_SOURCES_MONGOOSE_OPTIONS_USE_CREATE_INDEX === 'true',
        useNewUrlParser:
          process.env.DATA_SOURCES_MONGOOSE_OPTIONS_USE_NEW_URL_PARSER ===
          'true',
        useUnifiedTopology:
          process.env.DATA_SOURCES_MONGOOSE_OPTIONS_USE_UNIFIED_TOPOLOGY ===
          'true',
      },
    },
  },
  port: process.env.PORT || defaultPort,
  voyager: {
    endpointUrl: process.env.VOYAGER_ENDPOINT_URL,
  },
};
