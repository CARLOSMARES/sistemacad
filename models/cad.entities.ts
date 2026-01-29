import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

/**
 * @openapi
 * components:
 * schemas:
 * Cad:
 * type: object
 * properties:
 * id:
 * type: string
 * format: uuid
 * folio:
 * type: string
 * example: "FOL-2026-0001"
 * status:
 * type: string
 * example: "pendiente"
 * incidente:
 * type: string
 * prioridad:
 * type: string
 * enum: [alta, media, baja]
 */
@Entity({ name: "cad" })
export class Cad {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    status!: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    tiempo_transcurrido!: string;

    @Column({ type: "date", nullable: true })
    fecha!: string;

    @Column({ type: "time", nullable: true })
    hora!: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    folio!: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    captada_por!: string;

    @Column({ type: "varchar", length: 20, nullable: true })
    telefono!: string;

    // Ubicación
    @Column({ type: "varchar", length: 255, nullable: true })
    calle!: string;

    @Column({ type: "varchar", length: 20, nullable: true })
    ext!: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    colonia!: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    alcaldia!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    entrecalleuno!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    entrecalledos!: string;

    @Column({ type: "text", nullable: true })
    referencias!: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    latitud!: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    longitud!: string;

    // Detalles del Incidente
    @Column({ type: "varchar", length: 255, nullable: true })
    incidente!: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    prioridad!: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    categoria!: string;

    @Column({ type: "text", nullable: true })
    descripcion!: string;

    // Datos del Ciudadano/Persona
    @Column({ type: "varchar", length: 100, nullable: true })
    nombre!: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    apellido_p!: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    apellido_m!: string;

    @Column({ type: "int", nullable: true })
    edad!: number;

    @Column({ type: "varchar", length: 20, nullable: true })
    sexo!: string;

    // Gestión Policial / Unidades
    @Column({ type: "varchar", length: 100, nullable: true })
    pmi!: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    no_pmi!: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    vista!: string;

    @Column({ type: "time", nullable: true })
    hora_i!: string;

    @Column({ type: "text", nullable: true })
    narrativa_i!: string;

    @Column({ type: "time", nullable: true })
    hora_p!: string;

    @Column({ type: "text", nullable: true })
    narrativa_p!: string;

    @Column({ type: "time", nullable: true })
    hora_f!: string;

    @Column({ type: "text", nullable: true })
    narrativa_fin!: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    unidad!: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    eco_unidad!: string;

    @Column({ type: "time", nullable: true })
    hora_uin!: string;

    @Column({ type: "text", nullable: true })
    narra_uin!: string;

    @Column({ type: "time", nullable: true })
    hora_up!: string;

    @Column({ type: "text", nullable: true })
    narra_up!: string;

    @Column({ type: "time", nullable: true })
    hora_ucierre!: string;

    @Column({ type: "text", nullable: true })
    narra_ucierre!: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    tiempo_atencion!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}