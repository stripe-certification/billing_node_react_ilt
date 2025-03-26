// Environment variables
import "./env.js";
import { resolve } from "path";
import { existsSync } from "fs";
import webhookRouter from "./routes/webhook";
import offeringsRouter from "./routes/offerings";
import usersRouter from "./routes/users";
import checkoutsRouter from "./routes/checkouts";
import chatRouter from "./routes/chat";
import cors from "cors";
import { dbService } from "./services/db";

// Express
import express, { json } from "express";
import session from "express-session";

async function startServer() {
  try {
    await dbService.init();

    const app = express();

    const store = dbService.getSessionStore(session);

    const sessionSecret = process.env.SESSION_SECRET;
    if (!sessionSecret) throw Error("SESSION_SECRET not set");

    app.use(
      cors({
        origin: `${process.env.CLIENT_HOSTNAME}:${process.env.CLIENT_PORT}`,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      })
    );

    app.use(
      session({
        store: store,
        secret: sessionSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 86400000,
          httpOnly: true,
          secure: false,
        },
      })
    );

    if (!process.env.STATIC_DIR) throw Error("STATIC_DIR not set");
    app.use(express.static(process.env.STATIC_DIR));

    app.use(webhookRouter);
    app.use(json());

    app.use(offeringsRouter);
    app.use(chatRouter);
    app.use(usersRouter);
    app.use(checkoutsRouter);

    app.get("/", (_, res) => {
      try {
        const path = resolve(`${process.env.STATIC_DIR}/index.html`);
        if (!existsSync(path)) throw Error();
        res.sendFile(path);
      } catch (error: any) {
        console.log(`Error loading static files: ${error.name}`);
        const path = resolve("./public/static-file-error.html");
        res.sendFile(path);
      }
    });

    app.listen(4242, "localhost", () => {
      console.log("FIXME: testing updated in unredacted code, remove if it works");
      console.log("Server is listening on port 4242...");
    });
  } catch (error) {
    console.error("Error during initialization: ", error);
    process.exit(1);
  }
}

startServer();
