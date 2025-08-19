import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './users';
import { Task } from './tasks';

@Entity({ name: "projects" })
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ nullable: true })
    description: string;

    @ManyToOne(() => User, (user) => user.projects, { onDelete: "CASCADE", nullable: true })
    owner: User;

    @OneToMany(() => Task, (task) => task.project)
    tasks: Task[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}