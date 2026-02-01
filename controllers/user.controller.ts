import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import type { Request, Response } from "express";
import { AppDataSource } from "../config/data.source.js";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto.js";
import { User } from "../models/user.entities.js";

const userRepository = AppDataSource.getRepository(User);

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await userRepository.find();
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id || typeof id !== 'string') return res.status(400).json({ message: "ID inválido" });

        const user = await userRepository.findOneBy({ id: id as any });
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const dto = plainToInstance(CreateUserDto, req.body);
        const errors = await validate(dto);
        if (errors.length > 0) return res.status(400).json({ errors });

        // Verificar si ya existe
        const existingUser = await userRepository.findOneBy({ email: dto.email });
        if (existingUser) return res.status(400).json({ message: "El email ya está registrado" });

        const newUser = userRepository.create(dto);
        await userRepository.save(newUser);

        res.status(201).json({ message: "Usuario creado con éxito", id: newUser.id });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id || typeof id !== 'string') return res.status(400).json({ message: "ID inválido" });

        const dto = plainToInstance(UpdateUserDto, req.body);
        const errors = await validate(dto);
        if (errors.length > 0) return res.status(400).json({ errors });

        const user = await userRepository.findOneBy({ id: id as any });
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        userRepository.merge(user, dto);
        await userRepository.save(user);

        res.status(200).json({ message: "Usuario actualizado", data: user });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id || typeof id !== 'string') return res.status(400).json({ message: "ID inválido" });

        const result = await userRepository.delete(id);
        if (result.affected === 0) return res.status(404).json({ message: "Usuario no encontrado" });

        res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};