import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';
import express from 'express';
import http from 'http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { PubSub } from 'graphql-subscriptions';
import * as dotenv from 'dotenv';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import { GraphQLContext, Session, SubscritionContext } from './utils/types';

async function main() {
  dotenv.config();
  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql/subscriptions',
  });

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const pubsub = new PubSub();
  const prisma = new PrismaClient();

  // Save the returned server's info so we can shutdown this server later
  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx: SubscritionContext): Promise<GraphQLContext> => {
        if (ctx.connectionParams && ctx.connectionParams.session) {
          const { session } = ctx.connectionParams;

          return { session, prisma, pubsub };
        }

        return { session: null, prisma, pubsub };
      },
    },
    wsServer
  );

  const corsOptions = {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  };

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: 'bounded',
    context: async ({ req, res }): Promise<GraphQLContext> => {
      const session = (await getSession({ req })) as Session;
      // console.log('CONTEXT SESSION', session);

      return { session, prisma, pubsub };
    },
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });
  await server.start();
  server.applyMiddleware({ app, cors: corsOptions });
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

main().catch((err) => console.log(err));
