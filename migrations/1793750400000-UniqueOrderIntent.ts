import { MigrationInterface, QueryRunner } from 'typeorm';
export class UniqueOrderIntent1793750400000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE \"order\" ADD CONSTRAINT \"UQ_aaaa10740d13a947d0d115dc921\" UNIQUE (\"intentId\")");
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE \"order\" DROP CONSTRAINT \"UQ_aaaa10740d13a947d0d115dc921\"");
  }
}
