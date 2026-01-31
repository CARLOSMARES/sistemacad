import { User } from '../models/user.entities.js';
import { AppDataSource } from './data.source.js';

export const runSeeder = async () => {
    try {
        console.log("Iniciando proceso de seeding...");
        const userRepository = AppDataSource.getRepository(User);

        const usersToSeed = [
            { email: "admin@sistema-cad.com", password: "admin1234", role: "admin" as const },
            { email: "operador1@sistema-cad.com", password: "operador1234", role: "operator" as const },
            { email: "oficial1@sistema-cad.com", password: "oficial1234", role: "officer" as const }
        ];

        for (const userData of usersToSeed) {
            const exists = await userRepository.findOne({ where: { email: userData.email } });
            if (!exists) {
                const newUser = userRepository.create(userData);
                await userRepository.save(newUser);
                console.log(`[SEED] Usuario ${userData.email} creado.`);
            } else {
                console.log(`[SEED] Usuario ${userData.email} ya existe.`);
            }
        }
        console.log("[SEED] Seeding completado.");
    } catch (error) {
        console.error("[SEED] Error:", error);
    }
};