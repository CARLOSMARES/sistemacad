import express from 'express';
import request from 'supertest';
import { authenticateToken } from '../middleware/auth.middleware.js';

const app = express();
app.use(express.json());

// Ruta de prueba protegida
app.get('/test-auth', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Success' });
});

describe('Auth Middleware', () => {
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
    });
});