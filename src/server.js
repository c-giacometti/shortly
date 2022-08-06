import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import urlRoutes from "./routes/urlRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import rankingRoutes from "./routes/rankingRoutes.js";

dotenv.config();
const server = express();

server.use(cors());
server.use(express.json());

server.use(authRoutes);
server.use(urlRoutes);
server.use(userRoutes);
server.use(rankingRoutes);

server.listen(process.env.PORT, () =>
    console.log("servidor rodando")
);