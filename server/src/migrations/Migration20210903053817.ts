import { Migration } from '@mikro-orm/migrations';

export class Migration20210903053817 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "completes" add column "corrects" int4 not null default 0;',
    );
  }
}
