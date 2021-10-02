import { Migration } from '@mikro-orm/migrations';

export class Migration20211002110923 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "exercise" add column "created_at" varchar(255) null;',
    );
  }
}
