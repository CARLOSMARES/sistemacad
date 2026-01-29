import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
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

// Rutas Públicas
router.post("/auth/register", register);
router.post("/auth/login", login);

// Rutas Protegidas (Ejemplo para el CAD)
/**
 * @openapi
 * /cad:
 * post:
 * summary: Crear un nuevo registro CAD
 * tags: [CAD]
 * security:
 * - bearerAuth: []
 * responses:
 * 201:
 * description: Creado
 * 401:
 * description: No autorizado
 */
router.post("/cad", authenticateToken, (req, res) => {
    // Aquí iría la lógica del controlador de CAD
    res.status(201).json({ message: "Acceso concedido al CAD" });
});

export default router;