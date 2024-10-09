import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { resolvers } from './graphql/resolvers';
import { typeDefs } from './graphql/schema';

async function startServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = Number.parseInt(process.env.PORT) || 4000;
  const HOST = process.env.HOST || '0.0.0.0';
  
  app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}${server.graphqlPath}`);
  });
}

startServer().catch(error => {
  console.error('Error starting server:', error);
});