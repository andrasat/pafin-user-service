import fastify, { FastifyServerOptions } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import jwtPlugin from "./plugins/jwt";

import authRoutes from "./routes/auth";
import usersRoutes from "./routes/users";

async function buildApp(opts?: FastifyServerOptions) {
  const server = fastify(opts);

  server.register(jwtPlugin);

  server.register(swagger, {
    openapi: {
      info: {
        title: "Pafin User Service API",
        description: "Pafin User Service API Documentation",
        version: "0.0.0-alpha",
      },
      servers: [{
        url: "http://localhost:8081",
      }],
      components: {
        securitySchemes: {
          jwt: {
            type: "http",
            bearerFormat: "JWT",
            scheme: "bearer",
          },
        },
      },
    },
  });

  server.register(swaggerUI, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    }
  });

  server.register(authRoutes, { prefix: "/auth" });
  server.register(usersRoutes, { prefix: "/users" });
  server.get("/", (_, reply) => reply.send("OK"));
  server.all("*", (_, reply) => reply.status(404).send("Not Found"));

  await server.ready();
  server.swagger();

  return server;
}

export default buildApp;
