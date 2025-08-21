import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert } from 'typeorm';
import bcrypt from 'bcryptjs';
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

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
    
    async validatePassword(password: string) {
        return bcrypt.compare(password, this.password);
    }

    @Column({ type: 'jsonb', nullable: true })
    meta: any;

    @OneToMany(() => Project, (project) => project.owner)
    projects: Project[];

    @OneToMany(() => Task, (task) => task.assignedTo)
    tasks: Task[];

    @OneToMany(() => Comment, (comment) => comment.author)
    comments: Comment[];
}