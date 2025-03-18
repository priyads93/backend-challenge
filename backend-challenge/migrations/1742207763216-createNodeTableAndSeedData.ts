import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateNodeTableAndSeedData1742207763216
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.createTable(
        new Table({
          name: 'node',
          columns: [
            {
              name: 'id',
              type: 'int',
              isPrimary: true,
            },
            {
              name: 'name',
              type: 'varchar',
            },
            {
              name: 'parentId',
              type: 'int',
              isNullable: true,
            },
            {
              name: 'mpath',
              type: 'varchar',
            },
          ],
        }),
        true,
      );

      await queryRunner.createIndex(
        'node',
        new TableIndex({
          name: 'FK_parentId',
          columnNames: ['parentId'],
        }),
      );

      await queryRunner.createForeignKey(
        'node',
        new TableForeignKey({
          columnNames: ['parentId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'node',
          onDelete: 'RESTRICT',
          onUpdate: 'RESTRICT',
        }),
      );
      await queryRunner.createTable(
        new Table({
          name: 'property',
          columns: [
            {
              name: 'id',
              type: 'int',
              isPrimary: true,
            },
            {
              name: 'name',
              type: 'varchar',
            },
            {
              name: 'nodeId',
              type: 'int',
            },
            {
              name: 'value',
              type: 'float',
            },
          ],
        }),
        true,
      );

      await queryRunner.createIndex(
        'property',
        new TableIndex({
          name: 'FK_nodeId',
          columnNames: ['nodeId'],
        }),
      );

      await queryRunner.createForeignKey(
        'property',
        new TableForeignKey({
          columnNames: ['nodeId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'node',
          onDelete: 'RESTRICT',
          onUpdate: 'RESTRICT',
        }),
      );
      const nodeTable = await queryRunner.getTable('node');
      // if node table is successfully created then we can seed data
      if (nodeTable) {
        // inseting root node
        await queryRunner.query(
          `INSERT INTO node (id, mpath, name,parentId) VALUES (1, '1.', 'AlphaPC',NULL);`,
        );
        // inseting other nodes
        await queryRunner.query(
          `INSERT INTO node (id, name, mpath, parentId) VALUES
              (2, 'Processing', '1.2.', 1),
              (3, 'CPU', '1.2.3.', 2),
              (4, 'Graphics', '1.2.4.',2),
              (5, 'Storage', '1.5.',1),
              (6, 'SSD', '1.5.6.', 5),
              (7, 'HDD', '1.5.7.', 5);`,
        );
      }

      const propertyTable = await queryRunner.getTable('property');
      //if property table is successfully created then we can seed data
      if (propertyTable) {
        //inserting properties
        await queryRunner.query(
          `INSERT INTO property (id,nodeId, name, value) VALUES
              (1,1, 'Height', 450.00),
              (2,1, 'Width', 180.00),
              (3,3, 'Cores', 4),
              (4,3, 'Power', 2.41),
              (5,4, 'RAM', 4000.00),
              (6,4, 'Ports', 8.00),
              (7,2, 'RAM', 32000.00),
              (8,6, 'Capacity', 1024.00),
              (9,6, 'WriteSpeed', 250.00),
              (10,7, 'Capacity', 5120.00),
              (11,7, 'WriteSpeed', 1.724752);`,
        );
      }
    } catch (error) {
      await this.down(queryRunner);
      throw new Error(`Error while performing migrations ${error}`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const propertyTable = await queryRunner.getTable('property');
    if (propertyTable) {
      const foreignKey = propertyTable?.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('nodeId') !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('property', foreignKey);
      }
      await queryRunner.dropTable('property');
    }

    const nodeTable = await queryRunner.getTable('node');
    if (nodeTable) {
      const nodeForeignKey = nodeTable?.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('parentId') !== -1,
      );
      if (nodeForeignKey) {
        await queryRunner.dropForeignKey('node', nodeForeignKey);
      }
      await queryRunner.dropTable('node');
    }
  }
}
