import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    surname: string;

    @Column({ unique: true })
    email: string;

    @Column({ type: 'jsonb', nullable: true })
    meta: any;
}