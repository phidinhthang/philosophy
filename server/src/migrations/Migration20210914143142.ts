import { Migration } from '@mikro-orm/migrations';

export class Migration20210914143142 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "users" add column "score" int4 not null default 0;',
    );
  }
}
