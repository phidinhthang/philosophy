import { Migration } from '@mikro-orm/migrations';

export class Migration20211002165105 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "users" add column "email" varchar(255) null;');
  }
}
