import { User } from '../models/user.entities.js';
import { AppDataSource } from './data.source.js';

const seed = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Conexion establecida para el seeding ...");

        const userReository = AppDataSource.getRepository(User);

        const usersToSeed = [
            {
                email: "admin@sistema-cad.com",
                password: "admin1234",
                role: "admin"
            },
            {
                email: "operador1@sistema-cad.com",
                password: "operador1234",
                role: "operator"
            },
            {
                email: "oficial1@sistema-cad.com",
                password: "oficial1234",
                role: "officer"
            }
        ];

        for (const userData of usersToSeed) {
            const exists = await userReository.findOne({ where: { email: userData.email } });

            if (!exists) {

                const newUser = userReository.create(userData as any);
                await userReository.save(newUser);
                console.log(`Usuario ${userData.email} creado.`);
            } else {
                console.log(`Usuario ${userData.email} ya existe. Omitiendo...`);
            }

            console.log("Seeding completado.");
            process.exit(0);

        }
    } catch (error) {
        console.error("Error durante el seeding:", error);
        process.exit(1);
    }

};

seed();