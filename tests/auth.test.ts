import express from 'express';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { authenticateToken } from '../middleware/auth.middleware.js';

const app = express();
app.use(express.json());

// Ruta de prueba protegida
app.get('/test-auth', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Success', user: (req as any).user });
});

describe('Auth Middleware', () => {
    const JWT_SECRET = process.env.JWT_SECRET || 'SISTEMA_CAD_METRIX_NETWORKS_2026_S3';

    it('debería retornar 401 si no se proporciona un token', async () => {
        const response = await request(app).get('/test-auth');
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Acceso denegado. Token no proporcionado.');
    });

    it('debería retornar 403 si el token es inválido', async () => {
        const response = await request(app)
            .get('/test-auth')
            .set('Authorization', 'Bearer token_falso');

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Token inválido o expirado.');
    });

    it('debería permitir el acceso con un token válido', async () => {
        // Generamos un token simulando un UUID y un rol de tu entidad
        const payload = {
            id: '550e8400-e29b-41d4-a716-446655440000',
            role: 'operador'
        };
        const token = jwt.sign(payload, JWT_SECRET);

        const response = await request(app)
            .get('/test-auth')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Success');
        expect(response.body.user.role).toBe('operador');
    });
});