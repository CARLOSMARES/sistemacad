import express from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../middleware/auth.middleware.js'; // Asegúrate de usar .js por el type: module

const router = express.Router();

// Ruta pública (Login)
router.post('/login', (req, res) => {
    // Aquí validarías al usuario con MySQL/TypeORM
    const user = { id: 1, username: 'carlos' };

    // Generar el token
    const token = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: '30d' });
    res.json({ token });
});

// Ruta protegida (Perfil)
router.get('/profile', authenticateToken, (req, res) => {
    res.json({
        message: "Bienvenido a tu perfil",
        userData: (req as any).user
    });
});

export default router;