import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/data.source.js";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateUserDto } from "../dtos/user.dto.js"; // Asegúrate de que la ruta sea correcta

import { User } from "../models/user.entities.js";

const userRepository = AppDataSource.getRepository(User);

export const register = async (req: Request, res: Response) => {
    try {
        // 1. Transformar el body a una instancia del DTO
        const createUserDto = plainToInstance(CreateUserDto, req.body);

        // 2. Validar los datos del DTO
        const errors = await validate(createUserDto);
        if (errors.length > 0) {
            return res.status(400).json({
                message: "Validación fallida",
                errors: errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }))
            });
        }

        const { email, password, role } = createUserDto;

        // 3. Validar si el usuario ya existe
        const existingUser = await userRepository.findOneBy({ email });
        if (existingUser) {
            return res.status(400).json({ message: "El usuario ya existe" });
        }

        // 4. Crear instancia y guardar
        // El hook @BeforeInsert en user.entities.ts procesará el password
        const newUser = userRepository.create({ email, password, role });
        await userRepository.save(newUser);

        res.status(201).json({
            message: "Usuario registrado con éxito",
            id: newUser.id
        });

    } catch (error: any) {
        res.status(500).json({
            message: "Error al registrar usuario",
            error: error.message
        });
    }
};
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Buscamos al usuario incluyendo explícitamente el password (ya que tiene select: false)
        const user = await userRepository.findOne({
            where: { email },
            select: ["id", "email", "password", "role"]
        });

        if (!user) {
            return res.status(404).json({ message: "Credenciales inválidas" });
        }

        // Comparar contraseñas
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        // Generar Token JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || "SISTEMA_CAD_METRIX_NETWORKS_2026_S3",
            { expiresIn: "30d" }
        );

        res.json({ token, role: user.role });
    } catch (error: any) {
        res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};