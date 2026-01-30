import cors from 'cors';
import express from 'express';
import { AppDataSource } from './config/data.source.js';
import { User } from './models/user.entities.js'; // Importamos la entidad User
import router from './routes/routes.js';

const app = express();

const PORT = process.env.API_PORT || 3000; //

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

// Función de Seeding Automático
const runSeeder = async () => {
    const userRepository = AppDataSource.getRepository(User); //

    // Datos del administrador inicial
    const adminEmail = 'admin@sistema-cad.com';

    const adminExists = await userRepository.findOneBy({ email: adminEmail }); //

    if (!adminExists) {
        console.log("Poblando base de datos con usuarios iniciales...");

        const initialUsers = [
            {
                email: adminEmail,
                password: 'admin123',
                role: 'oficial' // Rol oficial como admin
            },
            {
                email: 'usuario@sistema-cad.com',
                password: 'usuario123',
                role: 'operador' // Rol operador
            }
        ];

        // El hook hashPassword de user.entities.ts se encargará del cifrado
        const users = userRepository.create(initialUsers);
        await userRepository.save(users);
        console.log("Usuarios iniciales creados con éxito.");
    }
};

AppDataSource.initialize()
    .then(async () => { // Marcamos como async para ejecutar el seed
        console.log("Conexion a la base de datos establecida con exito.");

        // Ejecutar el seed antes de iniciar el servidor
        await runSeeder();

        app.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error al conectar a la base de datos:", error);
    });