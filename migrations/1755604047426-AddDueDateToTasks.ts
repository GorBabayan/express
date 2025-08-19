import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDueDateToTasks1755604047426 implements MigrationInterface {
    name = 'AddDueDateToTasks1755604047426'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" ADD "dueDate" date`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "projectId" uuid`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "assignedToId" uuid`);

        await queryRunner.query(`
            ALTER TABLE "tasks" 
            ADD CONSTRAINT "FK_tasks_projectId" 
            FOREIGN KEY ("projectId") REFERENCES "projects"("id") 
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "tasks" 
            ADD CONSTRAINT "FK_tasks_assignedToId" 
            FOREIGN KEY ("assignedToId") REFERENCES "users"("id") 
            ON DELETE SET NULL ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_tasks_assignedToId"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_tasks_projectId"`);

        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "assignedToId"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "projectId"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "dueDate"`);
    }
}
