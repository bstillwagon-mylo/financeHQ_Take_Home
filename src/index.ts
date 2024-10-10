import express, { Request } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { createContext } from './context';
import {verify} from 'jsonwebtoken'

async function startServer() {
  const app: any = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: createContext
  })

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  const HOST = '0.0.0.0';
  
  app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}${server.graphqlPath}`);
  });
}

startServer().catch(error => {
  console.error('Error starting server:', error);
});

// const getUser = (token: string) => {

//   if (token) {

//     try {

//       return verify(token, process.env.JWT_SECRET || '');

//     } catch (err) {
//       return { error: true, msg: "Session invalid" };
//     }
//   }
// };