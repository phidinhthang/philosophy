import { Migration } from '@mikro-orm/migrations';

export class Migration20210915125414 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "users" add column "first_name" varchar(255) not null, add column "last_name" varchar(255) not null, add column "avatar_url" varchar(255) null;',
    );

    this.addSql(
      'create table "score_per_day" ("id" varchar(255) not null default uuid_generate_v4(), "owner_id" varchar(255) not null, "day" int4 not null, "score" int4 not null);',
    );
    this.addSql(
      'alter table "score_per_day" add constraint "score_per_day_pkey" primary key ("id");',
    );

    this.addSql(
      'alter table "score_per_day" add constraint "score_per_day_owner_id_foreign" foreign key ("owner_id") references "users" ("id") on update cascade;',
    );
  }
}
