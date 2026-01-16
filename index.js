import express from "express"
import bootstap from "./src/app.controller.js"
import path from "node:path"
import dotenv from "dotenv"
dotenv.config({ path: path.resolve("./src/config/.env") })
import http from "http";
import { initializeSocket } from "./src/modules/socketServer/socketIndex.js";
console.log("🔹 JWT_SECRET:", process.env.JWT_SECRET);


const app = express()
const port = process.env.PORT||3000

const server = http.createServer(app);
const io = initializeSocket(server);

console.log("Email:", process.env.EMAIL);
console.log("Password exists?", !!process.env.EMAIL_PASSWORD);
bootstap(app ,express)



server.listen(port, () => {
  console.log(`🚀 Server is running on port ${port} mr abdo welcome`);
  console.log(`📡 Socket.io server initialized`);
});


