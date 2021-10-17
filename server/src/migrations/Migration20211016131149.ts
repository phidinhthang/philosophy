import { Migration } from '@mikro-orm/migrations';

export class Migration20211016131149 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "exercise" add column "points" int4 not null, add column "creator_id" varchar(255) not null;',
    );

    this.addSql(
      'create table "upvote" ("user_id" varchar(255) not null, "exercise_id" varchar(255) not null, "value" int4 not null);',
    );
    this.addSql(
      'alter table "upvote" add constraint "upvote_pkey" primary key ("user_id", "exercise_id");',
    );

    this.addSql(
      'alter table "exercise" add constraint "exercise_creator_id_foreign" foreign key ("creator_id") references "users" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "upvote" add constraint "upvote_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "upvote" add constraint "upvote_exercise_id_foreign" foreign key ("exercise_id") references "exercise" ("id") on update cascade;',
    );
  }
}
