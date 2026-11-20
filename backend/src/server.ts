import "reflect-metadata";
import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { buildSchema } from "type-graphql";
import { authChecker, buildContext } from "./context";
import { AuthResolver } from "./resolvers/auth-resolver";
import { CategoryResolver } from "./resolvers/category-resolver";
import { TransactionResolver } from "./resolvers/transaction-resolver";

async function main() {
  const schema = await buildSchema({
    resolvers: [AuthResolver, CategoryResolver, TransactionResolver],
    authChecker,
  });

  const server = new ApolloServer({ schema });
  await server.start();

  const app = express();
  app.use("/graphql", cors(), express.json(), expressMiddleware(server, { context: buildContext }));

  const port = Number(process.env.PORT ?? 4000);
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}/graphql`);
  });
}

main();
