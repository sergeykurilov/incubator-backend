import express, { Application } from "express";
import router from "./controllers/router";

export const app: Application = express();

const port: string | number = process.env.PORT || 3000;

app.use(express.json());

app.use("/api", router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
