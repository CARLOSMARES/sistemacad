import express from 'express';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { createCad, getAllCads } from '../controllers/cad.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

// Configuración de la App para pruebas
const app = express();
app.use(express.json());

// Definimos las rutas en la app de test tal cual están en la realidad
app.get('/api/cad', authenticateToken, getAllCads);
app.post('/api/cad', authenticateToken, createCad);

// Mock del Repositorio de TypeORM
const mockCadRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
};

// Mock de AppDataSource
jest.mock('../config/data.source.js', () => ({
    AppDataSource: {
        getRepository: jest.fn(() => mockCadRepository)
    }
}));

describe('CAD Controller & Routes', () => {
    const JWT_SECRET = process.env.JWT_SECRET || 'SISTEMA_CAD_METRIX_NETWORKS_2026_S3';
    let token: string;

    beforeAll(() => {
        // Generamos un token válido para todas las pruebas
        token = jwt.sign({ id: 'test-uuid', role: 'operator' }, JWT_SECRET);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/cad', () => {
        it('debería retornar 401 si no hay token', async () => {
            const res = await request(app).get('/api/cad');
            expect(res.status).toBe(401);
        });

        it('debería retornar la lista de CADs si el token es válido', async () => {
            const mockData = [{ id: '1', incidente: 'Robo', status: 'pendiente' }];
            mockCadRepository.find.mockResolvedValue(mockData);

            const res = await request(app)
                .get('/api/cad')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockData);
            expect(mockCadRepository.find).toHaveBeenCalled();
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
            expect(res.body.data.incidente).toBe('Accidente Vial');
        });

        it('debería retornar 400 si faltan campos obligatorios (Validation DTO)', async () => {
            const incompleteData = { status: 'pendiente' }; // Falta incidente, calle, etc.

            const res = await request(app)
                .post('/api/cad')
                .set('Authorization', `Bearer ${token}`)
                .send(incompleteData);

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('errors');
        });
    });
});