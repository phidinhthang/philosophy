import { Migration } from '@mikro-orm/migrations';

export class Migration20210929062903 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "users" add column "google_id" varchar(255) null;',
    );
    this.addSql(
      'alter table "users" alter column "password" type varchar(255) using ("password"::varchar(255));',
    );
    this.addSql('alter table "users" alter column "password" drop not null;');
  }
}
