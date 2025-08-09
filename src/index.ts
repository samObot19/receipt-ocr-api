import { startApolloServer } from './delivery/http/apollo-server';

async function startServer() {
  await startApolloServer();
}

startServer();
