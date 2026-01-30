import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

// DTO para crear un registro CAD
export class CreateCadDto {
    @IsString()
    status!: string;

    @IsOptional()
    @IsString()
    folio?: string;

    @IsString()
    incidente!: string;

    @IsEnum(['alta', 'media', 'baja'], { message: 'Prioridad no válida' })
    prioridad!: string;

    @IsString()
    calle!: string;

    @IsString()
    colonia!: string;

    @IsString()
    alcaldia!: string;

    @IsOptional()
    @IsString()
    telefono?: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsOptional()
    @IsInt()
    edad?: number;

    @IsOptional()
    @IsString()
    sexo?: string;
}

// DTO para actualizar un registro CAD (todos los campos opcionales)
export class UpdateCadDto {
    @IsOptional() @IsString() status?: string;
    @IsOptional() @IsString() tiempo_transcurrido?: string;
    @IsOptional() @IsString() incidente?: string;
    @IsOptional() @IsEnum(['alta', 'media', 'baja']) prioridad?: string;
    @IsOptional() @IsString() descripcion?: string;
    @IsOptional() @IsString() narrativa_fin?: string;
    @IsOptional() @IsString() unidad?: string;
    @IsOptional() @IsString() eco_unidad?: string;
    // Agrega aquí cualquier otro campo que necesites permitir actualizar
}