import { User } from '../models/user.entities.js';
import { AppDataSource } from './data.source.js';

// Se agrega 'export' para poder llamarlo desde main.ts
export const runSeeder = async () => {
    try {
        // Se elimina la inicialización manual aquí porque el DataSource ya se inicia en main.ts
        console.log("Iniciando proceso de seeding...");

        const userReository = AppDataSource.getRepository(User);

        const usersToSeed = [
            {
                email: "admin@sistema-cad.com",
                password: "admin1234",
                role: "admin" as const // Se ajusta al tipo literal permitido
            },
            {
                email: "operador1@sistema-cad.com",
                password: "operador1234",
                role: "operator" as const // Se ajusta al tipo literal permitido
            },
            {
                email: "oficial1@sistema-cad.com",
                password: "oficial1234",
                role: "officer" as const // Se ajusta al tipo literal permitido
            }
        ];

        for (const userData of usersToSeed) {
            const exists = await userReository.findOne({ where: { email: userData.email } });

            if (!exists) {
                const newUser = userReository.create(userData);
                await userReository.save(newUser);
                console.log(`Usuario ${userData.email} creado.`);
            } else {
                console.log(`Usuario ${userData.email} ya existe. Omitiendo...`);
            }
        }

        console.log("Seeding completado.");
        // Se elimina process.exit(0) para no cerrar el proceso del servidor principal

    } catch (error) {
        console.error("Error durante el seeding:", error);
        // Se elimina process.exit(1) para permitir que el servidor intente seguir corriendo
    }
};

// Se elimina la llamada automática 'seed()' al final para que solo se ejecute cuando main.ts lo pida