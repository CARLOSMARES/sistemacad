import dotenv from "dotenv";
import path from "path";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { fileURLToPath } from "url";

// Configuración para obtener rutas en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "",
    synchronize: true, // Esto creará las tablas automáticamente en SeeNode
    logging: true,
    entities: [path.join(__dirname, "../models/**/*.{ts,js}")],
});