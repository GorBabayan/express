import { MigrationInterface, Table, TableForeignKey, QueryRunner } from "typeorm";

export class CreateCommentsTable1755516122728 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'comments',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isNullable: false,
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'content',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'task_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'author_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'assigned_to',
                        type: 'uuid',
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
            true
        );

        await queryRunner.createForeignKey(
            'comments',
            new TableForeignKey({
                columnNames: ['task_id'],
                referencedTableName: 'tasks',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            })
        );

        await queryRunner.createForeignKey(
            'comments',
            new TableForeignKey({
                columnNames: ['author_id'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            })
        );

        await queryRunner.createForeignKey(
            'comments',
            new TableForeignKey({
                columnNames: ['assigned_to'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("comments", true, true);
    }
}
