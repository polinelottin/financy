import "reflect-metadata";
import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { buildSchema } from "type-graphql";
import { HealthResolver } from "./resolvers/health-resolver";

async function main() {
  const schema = await buildSchema({
    resolvers: [HealthResolver],
  });

  const server = new ApolloServer({ schema });
  await server.start();

  const app = express();
  app.use("/graphql", cors(), express.json(), expressMiddleware(server));

  const port = Number(process.env.PORT ?? 4000);
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}/graphql`);
  });
}

main();
