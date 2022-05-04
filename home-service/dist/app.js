"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const default_1 = require("./configuration/default");
const server = (0, express_1.default)();
const ENV = process.env.NODE_ENV || 'development';
const config = default_1.Configuration[ENV];
const PORT = process.env.PORT || 3080;
server.use(express_1.default.json());
server.listen(PORT, () => {
    console.log(`Service: '${config.packageName}' (${config.packageVersion}) Running here 👉 https://localhost:${PORT}`);
});
