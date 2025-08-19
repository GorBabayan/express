import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTasksTable1699999999999 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "tasks",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "project_id",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "assigned_to",
                        type: "uuid",
                        isNullable: true,
                    },
                    {
                        name: "title",
                        type: "varchar",
                        length: "200",
                        isNullable: false,
                    },
                    {
                        name: "status",
                        type: "varchar",
                        length: "20",
                        isNullable: false,
                        default: "'todo'",
                    },
                    {
                        name: "due_date",
                        type: "date",
                        isNullable: true,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "NOW()",
                    },
                    {
                       name: 'updated_at',
                       type: 'timestamp',
                       default: 'NOW()',
                    },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "tasks",
            new TableForeignKey({
                columnNames: ["project_id"],
                referencedTableName: "projects",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "tasks",
            new TableForeignKey({
                columnNames: ["assigned_to"],
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                onDelete: "SET NULL",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("tasks");
    }
}
