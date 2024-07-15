"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const http_status_codes_interface_1 = require("../interfaces/http-status-codes.interface");
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
class AuthGuard {
    execute(req, res, next) {
        const auth = req.headers["authorization"];
        if (!auth) {
            res.status(http_status_codes_interface_1.HttpStatusCodes.UNAUTHORIZED).send("Unauthorized");
            return;
        }
        const [basic, token] = auth.split(" ");
        if (basic !== "Basic") {
            res.sendStatus(http_status_codes_interface_1.HttpStatusCodes.UNAUTHORIZED);
            return;
        }
        const decodedData = Buffer.from(token, "base64").toString();
        const [login, password] = decodedData.split(":");
        if (login !== "admin" || password !== "qwerty") {
            res.sendStatus(http_status_codes_interface_1.HttpStatusCodes.UNAUTHORIZED);
            return;
        }
        return next();
    }
}
exports.AuthGuard = AuthGuard;
