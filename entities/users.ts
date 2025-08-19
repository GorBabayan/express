import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Project } from './projects';
import { Task } from './tasks';
import { Comment } from './comments';

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 100 })
    surname: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    email: string;

    @Column()
    password: string;
    
    @Column({ type: 'jsonb', nullable: true })
    meta: any;

    @OneToMany(() => Project, (project) => project.owner)
    projects: Project[];

    @OneToMany(() => Task, (task) => task.assignedTo)
    tasks: Task[];

    @OneToMany(() => Comment, (comment) => comment.author)
    comments: Comment[];
}