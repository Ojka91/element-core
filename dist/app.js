"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = express_1.default();
app.use(cors_1.default({ exposedHeaders: ['*', 'token'] }));
app.options('*', cors_1.default());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
require('dotenv').config();
app.get('/', async (req, res) => {
    return res.send({ error: false, v: 5, jwt: process.env.jwtSecret });
});
const server = app.listen(process.env.PORT || 3000, () => {
    console.log("Server listening on port 3000");
});
if (process.env.NODE_ENV === 'production') {
    process.on('SIGINT', () => {
        server.close(() => {
            // close database
            process.exit(0);
        });
    });
}
//# sourceMappingURL=app.js.map