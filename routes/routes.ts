import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import { createCad, getAllCads, updateCad } from "../controllers/cad.controller.js";
import {
    createUser,
    deleteUser,
    getAllUsers,
    getUserById,
    updateUser
} from "../controllers/user.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @openapi
 * components:
 * securitySchemes:
 * bearerAuth:
 * type: http
 * scheme: bearer
 * bearerFormat: JWT
 */

// --- Rutas de Autenticación (Públicas) ---
router.post("/auth/register", register);
router.post("/auth/login", login);

// --- Rutas de Usuarios (Protegidas) ---

/**
 * @openapi
 * /api/users:
 * get:
 * summary: Obtener todos los usuarios
 * tags: [Users]
 * security:
 * - bearerAuth: []
 */
router.get("/users", authenticateToken, getAllUsers);

/**
 * @openapi
 * /api/users/{id}:
 * get:
 * summary: Obtener un usuario por ID
 * tags: [Users]
 * security:
 * - bearerAuth: []
 */
router.get("/users/:id", authenticateToken, getUserById);

/**
 * @openapi
 * /api/users:
 * post:
 * summary: Crear un nuevo usuario (Admin)
 * tags: [Users]
 * security:
 * - bearerAuth: []
 */
router.post("/users", authenticateToken, createUser);

/**
 * @openapi
 * /api/users/{id}:
 * put:
 * summary: Actualizar un usuario
 * tags: [Users]
 * security:
 * - bearerAuth: []
 */
router.put("/users/:id", authenticateToken, updateUser);

/**
 * @openapi
 * /api/users/{id}:
 * delete:
 * summary: Eliminar un usuario
 * tags: [Users]
 * security:
 * - bearerAuth: []
 */
router.delete("/users/:id", authenticateToken, deleteUser);

// --- Rutas de CAD (Protegidas) ---

/**
 * @openapi
 * /api/cad:
 * get:
 * summary: Obtener todos los registros CAD
 * tags: [CAD]
 * security:
 * - bearerAuth: []
 */
router.get("/cad", authenticateToken, getAllCads);

/**
 * @openapi
 * /api/cad:
 * post:
 * summary: Crear un nuevo registro CAD
 * tags: [CAD]
 * security:
 * - bearerAuth: []
 */
router.post("/cad", authenticateToken, createCad);

/**
 * @openapi
 * /api/cad/{id}:
 * put:
 * summary: Actualizar un registro CAD existente
 * tags: [CAD]
 * security:
 * - bearerAuth: []
 */
router.put("/cad/:id", authenticateToken, updateCad);

export default router;