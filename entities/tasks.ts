import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Project } from './projects';
import { User } from './users';
import { Comment } from './comments';

export type TaskStatus = 'todo' | 'in_progress' | 'done';

@Entity({ name: "tasks" })
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 200 })
    title: string;

    @Column({ type: 'varchar', default: 'todo' })
    status: TaskStatus;

    @Column({ type: 'date', nullable: true })
    dueDate?: string;

    @ManyToOne(() => Project, (project) => project.tasks, { onDelete: "CASCADE" })
    @JoinColumn({ name: "projectId" })
    project: Project;

    @ManyToOne(() => User, (user) => user.projects, { onDelete: "SET NULL", nullable: true })
    assignedTo?: User | null;

    @OneToMany(() => Comment, (comment) => comment.task)
    comments: Comment[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}