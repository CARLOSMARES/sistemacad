import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

// DTO para crear un usuario
export class CreateUserDto {
    @IsEmail({}, { message: 'El formato del email no es válido' })
    email!: string;

    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password!: string;

    @IsEnum(['operator', 'officer', 'admin'], { message: 'Rol no válido' })
    role!: 'operator' | 'officer' | 'admin';
}

// DTO para actualizar un usuario (campos opcionales)
export class UpdateUserDto {
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;

    @IsOptional()
    @IsEnum(['operator', 'officer', 'admin'])
    role?: 'operator' | 'officer' | 'admin';
}