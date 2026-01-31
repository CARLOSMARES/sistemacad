import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import type { Request, Response } from "express";
import { AppDataSource } from "../config/data.source.js";
import { CreateCadDto, UpdateCadDto } from "../dtos/cad.dto.js";
import { Cad } from "../models/cad.entities.js";

const cadRepository = AppDataSource.getRepository(Cad);

// Obtener todos los CADs
export const getAllCads = async (req: Request, res: Response) => {
    try {
        const cads = await cadRepository.find({
            order: { createdAt: "DESC" } // Ordenar por los más recientes
        });
        res.status(200).json(cads);
    } catch (error: any) {
        res.status(500).json({
            message: "Error al obtener los CADs",
            error: error.message
        });
    }
};

// Crear un nuevo CAD
export const createCad = async (req: Request, res: Response) => {
    try {
        const dto = plainToInstance(CreateCadDto, req.body);
        const errors = await validate(dto);

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const newCad = cadRepository.create(req.body);
        await cadRepository.save(newCad);

        res.status(201).json({ message: "Registro CAD creado", data: newCad });
    } catch (error: any) {
        res.status(500).json({ message: "Error al crear CAD", error: error.message });
    }
};

// Actualizar un CAD
export const updateCad = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const dto = plainToInstance(UpdateCadDto, req.body);
        const errors = await validate(dto);

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const cad = await cadRepository.findOneBy({ id });
        if (!cad) return res.status(404).json({ message: "CAD no encontrado" });

        cadRepository.merge(cad, req.body);
        await cadRepository.save(cad);

        res.json({ message: "CAD actualizado correctamente", data: cad });
    } catch (error: any) {
        res.status(500).json({ message: "Error al actualizar", error: error.message });
    }
};