import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Task } from './tasks';
import { User } from './users';

@Entity({ name: "comments" })
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    text: string;

    @ManyToOne(() => Task, (task) => task.comments, { onDelete: "CASCADE" })
    @JoinColumn({ name: "task_id" })
    task: Task;

    @Column({ name: "task_id", type: "uuid" })
    taskId: string;

    @ManyToOne(() => User, (user) => user.comments, { onDelete: "CASCADE" })
    @JoinColumn({ name: "author_id" })
    author: User;

    @Column({ name: "author_id", type: "uuid" })
    authorId: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}