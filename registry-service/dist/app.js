"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const default_1 = require("./configuration/default");
const mongodb_1 = require("mongodb");
const server = (0, express_1.default)();
const ENV = process.env.NODE_ENV || 'development';
const config = default_1.Configuration[ENV];
const PORT = process.env.PORT || 3000;
server.use(express_1.default.json());
// connection URI
const uri = "mongodb://mongo:27017/db";
const client = new mongodb_1.MongoClient(uri);
async function run() {
    try {
        // Connect the client to the server
        await client.connect();
        // Establish and verify connection
        await client.db("admin").command({ ping: 1 });
        console.log("Connected successfully to server");
        client.db("admin").collection("test").insertOne({ category: "fruit", type: "mango" });
        const r = client.db("admin").collection("test").find({});
        r.forEach(row => console.log(row));
    }
    finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);
console.log(true);
server.get("/", (req, res) => {
    return res.json({ result: req.socket.remoteAddress, result2: req.socket.remotePort, name: "Registry-service" });
});
server.listen(PORT, () => {
    console.log(`Service: '${config.packageName}' (${config.packageVersion}) Running here 👉 https://localhost:${PORT}`);
});
