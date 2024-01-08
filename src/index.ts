import express, { Application } from "express";
import router from "./controllers/router";

export const app: Application = express();

app.use(express.json());

app.use("/", router);

module.exports = app;
