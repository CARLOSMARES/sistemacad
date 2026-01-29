import bcrypt from "bcrypt";
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

/**
 * @openapi
 * components:
 * schemas:
 * User:
 * type: object
 * required:
 * - email
 * - password
 * - role
 * properties:
 * id:
 * type: string
 * format: uuid
 * email:
 * type: string
 * format: email
 * role:
 * type: string
 * example: "user"
 */
@Entity("user")
export class User {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 100, nullable: false, unique: true })
    email!: string;

    @Column({ type: "varchar", length: 100, nullable: false, select: false })
    password!: string;

    @Column({
        type: "enum",
        enum: ["operador", "oficial"],
        default: "operador"
    })
    role!: "operador" | "oficial";

    // Hook: Se ejecuta antes de insertar en la base de datos
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password && !this.password.startsWith('$2b$')) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }
}