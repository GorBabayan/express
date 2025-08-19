import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUpdatedAtToProjects1755596375053 implements MigrationInterface {
    name = 'AddUpdatedAtToProjects1755596375053'

    public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE "users" SET surname = 'Unknown' WHERE surname IS NULL`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN surname SET DEFAULT 'Unknown'`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN surname SET NOT NULL`);

    await queryRunner.query(`ALTER TABLE "comments" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP DEFAULT now()`);
    await queryRunner.query(`UPDATE "comments" SET updated_at = now() WHERE updated_at IS NULL`);
    await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN updated_at SET NOT NULL`);

    await queryRunner.query(`ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP DEFAULT now()`);
    await queryRunner.query(`UPDATE "projects" SET updated_at = now() WHERE updated_at IS NULL`);
    await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN updated_at SET NOT NULL`);

    await queryRunner.query(`ALTER TABLE "tasks" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP DEFAULT now()`);
    await queryRunner.query(`UPDATE "tasks" SET updated_at = now() WHERE updated_at IS NULL`);
    await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN updated_at SET NOT NULL`);

    await queryRunner.query(`ALTER TABLE "comments" ADD COLUMN IF NOT EXISTS "text" character varying NOT NULL DEFAULT 'New comment'`);
    await queryRunner.query(`ALTER TABLE "tasks" ADD COLUMN IF NOT EXISTS "status" character varying NOT NULL DEFAULT 'todo'`);
}

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_a8e7e6c3f9d9528ed35fe5bae33"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_d020677feafe94eba0cb9d846d1"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_e08fca67ca8966e6b9914bf2956"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_4548cc4a409b8651ec75f70e280"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_9adf2d3106c6dc87d6262ccadfe"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "surname"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "description" text`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "name" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "UQ_2187088ab5ef2a918473cb99007" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "status" character varying(20) NOT NULL DEFAULT 'todo'`);
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "ownerId"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "assignedToId"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "projectId"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "dueDate"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "authorId"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "taskId"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "text"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "due_date" date`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "assigned_to" uuid`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "project_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "assigned_to" uuid`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "task_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "content" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_5770b28d72ca90c43b1381bf787" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_53f056ebc5e771ec6e5a01ee3cd" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_18c2493067c11f44efb35ca0e03" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
