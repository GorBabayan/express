import { MigrationInterface, Table, QueryRunner } from "typeorm";

export class CreateProjectsTable1755516026899 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'projects',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isNullable: false,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                       name: 'name',
                       type: 'text',
                       isNullable: false,
                       isUnique: true,
                    },
                    {
                       name: 'description',
                       type: 'text',
                       isNullable: true,
                    },
                    {
                       name: 'created_at',
                       type: 'timestamp',
                       default: 'NOW()',
                    },
                    {
                       name: 'updated_at',
                       type: 'timestamp',
                       default: 'NOW()',
                    },
                ]
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('projects');
    }
}
