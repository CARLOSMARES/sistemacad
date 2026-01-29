import dotenv from 'dotenv';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_jwt_secret';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {

    const authHeder = req.headers['authorization'];
    const token = authHeder && authHeder.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Acceso denegado. Token no proporcionado." });
    }

    try {

        const decoded = jwt.verify(token, JWT_SECRET);
        (req as any).user = decoded;
        next();

    }
    catch (error) {
        return res.status(403).json({ message: "Token inválido o expirado." });
    }

};