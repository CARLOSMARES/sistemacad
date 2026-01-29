import cors from 'cors';
import express from 'express';
import { AppDataSource } from './config/data.source.js';
import router from './routes/routes.js';

const app = express();

const PORT = process.env.PORT || 3000;

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
    .then(() => {
        console.log("Conexion a la base de datos establecida con exito.");

        app.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto ${PORT}`);
        });


    })
    .catch((error) => {
        console.error("Error al conectar a la base de datos:", error);
    });