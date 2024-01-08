import express, { Application } from "express";
import { videosRouter } from "./controllers";

export const app: Application = express();

const port: string | number = process.env.PORT || 3000;

app.use(express.json());

app.use("/videos", videosRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
