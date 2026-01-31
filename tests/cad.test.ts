import { jest } from '@jest/globals';
import express from 'express';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { authenticateToken } from '../middleware/auth.middleware.js';

// 1. Definimos los tipos de los mocks explícitamente para evitar 'never'
const mockCadRepository = {
    find: jest.fn<any>(),
    create: jest.fn<any>(),
    save: jest.fn<any>(),
};

// 2. Mock de AppDataSource con tipado manual para initialize
jest.unstable_mockModule('../config/data.source.js', () => ({
    AppDataSource: {
        // Forzamos a que initialize sea tratado como una función mock que devuelve Promise<boolean>
        initialize: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
        getRepository: jest.fn(() => mockCadRepository),
    }
}));

// 3. Importación dinámica (Obligatorio en ESM tras un mockModule)
const { getAllCads, createCad } = await import('../controllers/cad.controller.js');

const app = express();
app.use(express.json());

app.get('/api/cad', authenticateToken, getAllCads);
app.post('/api/cad', authenticateToken, createCad);

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
        it('debería retornar 200 y la lista de CADs', async () => {
            const mockData = [{ id: '1', incidente: 'Robo', status: 'pendiente' }];
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