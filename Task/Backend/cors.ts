import cors from "@elysiajs/cors";
import type Elysia from "elysia";


const getAllowedOrigins = () => {
  return [
    "http://localhost:3001",
    "http://localhost:3000",  
  ];
};
export const Cors = (app: Elysia) =>
  app.use(
    cors({
      origin: getAllowedOrigins(),
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      credentials: true,
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Origin",
        "Cache-Control",
        "X-Api-Key",
        "X-Organization-Id",
      ],
      maxAge: 86400, // Cache preflight requests for 24 hours
    })
  );
