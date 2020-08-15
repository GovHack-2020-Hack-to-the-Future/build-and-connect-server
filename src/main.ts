import cors from 'cors';
import express from 'express';
import jwt from 'express-jwt';
import { express as voyagerMiddleware } from 'graphql-voyager/middleware';
import jwks from 'jwks-rsa';

import { apolloServer } from './apollo-server';
import { environment } from './environment';

declare const module: NodeModule;

const app = express();
const voyagerEndpointUrl = environment.voyager.endpointUrl;

app.use(cors({ origin: environment.apollo.server.cors.origins }));

app.use(
  jwt({
    algorithms: ['RS256'],
    audience: environment.auth.jwt.audience,
    credentialsRequired: false,
    issuer: environment.auth.jwt.issuer,
    secret: jwks.expressJwtSecret({
      cache: environment.auth.jwks.cache,
      rateLimit: environment.auth.jwks.rateLimit,
      jwksRequestsPerMinute: environment.auth.jwks.requestPerMinute,
      jwksUri: environment.auth.jwks.uri,
    }),
  })
);

if (voyagerEndpointUrl) {
  app.use(
    '(/:baseDir)?/voyager',
    voyagerMiddleware({ endpointUrl: voyagerEndpointUrl })
  );
}

apolloServer.applyMiddleware({ app, path: '/', cors: false });

const port = environment.port;
const httpServer = app.listen(port);

console.log(`GraphQL server is listening on port ${port}. `);

// Hot module replacement.
if (module.hot) {
  module.hot.accept();
  module.hot.dispose((): void => {
    if (httpServer && typeof httpServer.close === 'function') {
      httpServer.close();
    }
  });
}
