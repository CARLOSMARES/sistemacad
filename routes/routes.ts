import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import { createCad, getAllCads, updateCad } from "../controllers/cad.controller.js";
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

// --- Rutas de CAD (Protegidas) ---

/**
 * @openapi
 * /api/cad:
 * get:
 * summary: Obtener todos los registros CAD
 * tags: [CAD]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Lista de registros obtenida con éxito
 * 401:
 * description: No autorizado
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
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Cad'
 * responses:
 * 201:
 * description: Registro CAD creado exitosamente
 * 400:
 * description: Error de validación en los datos
 * 401:
 * description: No autorizado
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
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * format: uuid
 * description: ID del registro CAD a actualizar
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Cad'
 * responses:
 * 200:
 * description: Registro actualizado correctamente
 * 404:
 * description: Registro no encontrado
 * 401:
 * description: No autorizado
 */
router.put("/cad/:id", authenticateToken, updateCad);

export default router;