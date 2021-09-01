import { Migration } from '@mikro-orm/migrations';

export class Migration20210831141135 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table if not exists "users" ("id" varchar(255) not null, "name" varchar(255) not null, "password" varchar(255) not null);',
    );
    this.addSql(
      'alter table "users" add constraint "users_pkey" primary key ("id");',
    );
  }
}
