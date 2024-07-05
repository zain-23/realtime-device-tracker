import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// application middleware
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// routes
app.get("/", (req, res) => {
  res.render("index");
});

// socket connection
io.on("connection", (socket) => {
  console.log("a user connected", socket);
});

// server
server.listen(3000, () => {
  console.log(`server is running at port 3000`);
});
