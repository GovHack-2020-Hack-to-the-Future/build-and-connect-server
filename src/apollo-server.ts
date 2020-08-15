import responseCachePlugin from 'apollo-server-plugin-response-cache';
import { ApolloServer } from 'apollo-server-express';
import { GraphQLRequestContext } from 'apollo-server-types';

import { environment } from './environment';
import { mainModule } from './modules/main.module';

export const apolloServer = new ApolloServer({
  cache: mainModule.selfCache,
  context: (session) => session,
  introspection: environment.apollo.server.introspection,
  playground: environment.apollo.server.playground,
  plugins: [
    responseCachePlugin({
      sessionId: (requestContext: GraphQLRequestContext) =>
        requestContext?.request?.http?.headers.get('sessionid') || null,
    }),
  ],
  schema: mainModule.schema,
});
