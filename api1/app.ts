import { json } from "body-parser";
import { api1Routes } from "./routes";

import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";
import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";

const PORT = process.env.PORT || 3001;

// set-up Express app
const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(helmet());
app.use(cors());


// set-up routers
app.use(api1Routes);


app.use("/", (_req: Request, res: Response) => {
  return res.status(200).send("Up!");
});

app.all("*", async (_req, _res) => {
  throw new NotFoundError();
});

app.use(errorHandler);



const start = async () => {


  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

start();