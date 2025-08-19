import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAuthorIdToComments1755607395854 implements MigrationInterface {
    name = 'AddAuthorIdToComments1755607395854'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "comments" 
            ADD COLUMN IF NOT EXISTS "author_id" uuid
        `);

        await queryRunner.query(`
            ALTER TABLE "comments" 
            ALTER COLUMN "author_id" SET NOT NULL
        `);

        await queryRunner.query(`
            ALTER TABLE "comments"
            ADD CONSTRAINT "FK_comments_author" 
            FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "comments"
            DROP CONSTRAINT "FK_comments_author"
        `);

        await queryRunner.query(`
            ALTER TABLE "comments"
            DROP COLUMN "author_id"
        `);
    }
}
