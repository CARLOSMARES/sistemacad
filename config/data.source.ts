import dotenv from "dotenv";
import "reflect-metadata";
import { DataSource } from "typeorm";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    // Si en docker-compose usaste 3307 hacia afuera, 
    // pero la app corre DENTRO de la red de docker, debe usar 3306.
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || "metrix_cad",
    password: process.env.DB_PASSWORD || "rKeEIErZskcH",
    database: process.env.DB_NAME || "metrix_cad",
    synchronize: true, // true: crea tablas automáticamente (solo en desarrollo)
    logging: true,
    entities: ["dist/models/**/*.js"], // Importante: apunta a los archivos compilados
    migrations: ["dist/migrations/**/*.js"],
    subscribers: [],
});