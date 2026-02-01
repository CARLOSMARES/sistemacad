import { jest } from '@jest/globals';
import express from 'express';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { authenticateToken } from '../middleware/auth.middleware.js';

// 1. Definimos los mocks de las funciones del repositorio
const mockUserRepository = {
    find: jest.fn<any>(),
    findOneBy: jest.fn<any>(),
    create: jest.fn<any>(),
    save: jest.fn<any>(),
    merge: jest.fn<any>(),
    delete: jest.fn<any>(),
};

// 2. Mock de la base de datos
jest.unstable_mockModule('../config/data.source.js', () => ({
    AppDataSource: {
        getRepository: jest.fn(() => mockUserRepository),
        initialize: jest.fn<() => Promise<boolean>>().mockResolvedValue(true)
    }
}));

// 3. Importación dinámica del controlador (necesario en ESM)
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = await import('../controllers/user.controller.js');

const app = express();
app.use(express.json());

// Definición de rutas para el test
app.get('/api/users', authenticateToken, getAllUsers);
app.get('/api/users/:id', authenticateToken, getUserById);
app.post('/api/users', authenticateToken, createUser);
app.put('/api/users/:id', authenticateToken, updateUser);
app.delete('/api/users/:id', authenticateToken, deleteUser);

describe('User Controller', () => {
    const JWT_SECRET = process.env.JWT_SECRET || 'SISTEMA_CAD_METRIX_NETWORKS_2026_S3';
    let token: string;

    beforeAll(() => {
        token = jwt.sign({ id: 'admin-id', role: 'admin' }, JWT_SECRET);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('GET /api/users - debería retornar todos los usuarios', async () => {
        const mockUsers = [{ email: 'test@test.com', role: 'operator' }];
        mockUserRepository.find.mockResolvedValue(mockUsers);

        const res = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockUsers);
    });

    it('POST /api/users - debería crear un usuario nuevo', async () => {
        const userData = { email: 'new@test.com', password: 'password123', role: 'operator' };

        mockUserRepository.findOneBy.mockResolvedValue(null); // No existe previo
        mockUserRepository.create.mockReturnValue(userData);
        mockUserRepository.save.mockResolvedValue({ id: 'new-id', ...userData });

        const res = await request(app)
            .post('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .send(userData);

        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Usuario creado con éxito');
    });

    it('PUT /api/users/:id - debería actualizar un usuario', async () => {
        const updateData = { role: 'admin' };
        const existingUser = { id: 'uuid', email: 'test@test.com', role: 'operator' };

        mockUserRepository.findOneBy.mockResolvedValue(existingUser);
        mockUserRepository.save.mockResolvedValue({ ...existingUser, ...updateData });

        const res = await request(app)
            .put('/api/users/uuid')
            .set('Authorization', `Bearer ${token}`)
            .send(updateData);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Usuario actualizado');
    });

    it('DELETE /api/users/:id - debería eliminar un usuario', async () => {
        mockUserRepository.delete.mockResolvedValue({ affected: 1 });

        const res = await request(app)
            .delete('/api/users/uuid')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Usuario eliminado correctamente');
    });
});