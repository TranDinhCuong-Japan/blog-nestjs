import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity('my_users')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    email: string

    @Column()
    password: string

    @Column()
    refresh_token: string

    @Column({default: 1})
    status: number

    @CreateDateColumn()
    created_at:  Date;

    @CreateDateColumn()
    updated_at:  Date;
}