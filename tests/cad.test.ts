import { jest } from '@jest/globals';
import express from 'express';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { createCad, getAllCads } from '../controllers/cad.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const app = express();
app.use(express.json());

app.get('/api/cad', authenticateToken, getAllCads);
app.post('/api/cad', authenticateToken, createCad);

// SOLUCIÓN: Definir los mocks con <any, any> para que acepten cualquier argumento de retorno
const mockCadRepository = {
    find: jest.fn<any>(),
    create: jest.fn<any>(),
    save: jest.fn<any>(),
};

jest.unstable_mockModule('../config/data.source.js', () => ({
    AppDataSource: {
        getRepository: jest.fn(() => mockCadRepository)
    }
}));

describe('CAD Controller & Routes', () => {
    const JWT_SECRET = process.env.JWT_SECRET || 'SISTEMA_CAD_METRIX_NETWORKS_2026_S3';
    let token: string;

    beforeAll(() => {
        token = jwt.sign({ id: 'test-uuid', role: 'operator' }, JWT_SECRET);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/cad', () => {
        it('debería retornar la lista de CADs si el token es válido', async () => {
            const mockData = [{ id: '1', incidente: 'Robo', status: 'pendiente' }];

            // Ahora TypeScript aceptará mockData porque el mock es genérico
            mockCadRepository.find.mockResolvedValue(mockData);

            const res = await request(app)
                .get('/api/cad')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockData);
        });
    });

    describe('POST /api/cad', () => {
        const validCadData = {
            status: 'pendiente',
            incidente: 'Accidente Vial',
            prioridad: 'alta',
            calle: 'Av. Insurgentes',
            colonia: 'Roma',
            alcaldia: 'Cuauhtémoc'
        };

        it('debería crear un nuevo registro CAD con éxito', async () => {
            mockCadRepository.create.mockReturnValue(validCadData);
            mockCadRepository.save.mockResolvedValue({ id: 'new-uuid', ...validCadData });

            const res = await request(app)
                .post('/api/cad')
                .set('Authorization', `Bearer ${token}`)
                .send(validCadData);

            expect(res.status).toBe(201);
            expect(res.body.message).toBe('Registro CAD creado');
        });
    });
});