import express from "express";

export type RequestWithParams = express.Request<{ id?: number }, {}, {}, {}>;
