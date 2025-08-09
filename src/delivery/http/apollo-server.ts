import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
// @ts-ignore
import graphqlUploadExpress from 'graphql-upload/public/graphqlUploadExpress.js';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { itemTypeDefs } from '../../infrastructure/graphql/schemas/item.schema';
import { receiptTypeDefs } from '../../infrastructure/graphql/schemas/receipt.schema';
import { baseTypeDefs } from '../../infrastructure/graphql/schemas/schema';
import { itemResolvers } from '../../infrastructure/graphql/resolvers/item.resolver';
import { receiptResolvers } from '../../infrastructure/graphql/resolvers/receipt.resolver';

const typeDefs = mergeTypeDefs([baseTypeDefs, itemTypeDefs, receiptTypeDefs]);
const resolvers = [itemResolvers, receiptResolvers];

export async function startApolloServer() {
  const app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app, cors: { origin: true, credentials: true } });

  const port = 4000;
  app.listen({ port }, () => {
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
  });
}
// @ts-ignore
import graphqlUploadExpress from 'graphql-upload/public/graphqlUploadExpress.js';
