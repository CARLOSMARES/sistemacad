import cors from 'cors';
import express from 'express';
import { AppDataSource } from './config/data.source.js';
import { runSeeder } from './config/seeder.js'; // 1. Importamos el seeder
import router from './routes/routes.js';

const app = express();

const PORT = process.env.API_PORT || 3000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/api/health', (req, res) => {

    res.status(200).send("Health Check!");

});

app.use('/api', router);

AppDataSource.initialize()
    .then(async () => { // 2. Agregamos 'async' aquí
        console.log("Conexion a la base de datos establecida con exito.");

        // 3. Llamamos al seeder de forma automática
        await runSeeder();

        app.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error al conectar a la base de datos:", error);
    });