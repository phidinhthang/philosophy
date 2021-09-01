import { Migration } from '@mikro-orm/migrations';

export class Migration20210901122307 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "exercise" ("id" varchar(255) not null, "title" varchar(255) not null, "length" int4 not null);');
    this.addSql('alter table "exercise" add constraint "exercise_pkey" primary key ("id");');

    this.addSql('create table "completes" ("user_id" varchar(255) not null, "exercise_id" varchar(255) not null);');
    this.addSql('alter table "completes" add constraint "completes_pkey" primary key ("user_id", "exercise_id");');

    this.addSql('alter table "completes" add constraint "completes_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;');
    this.addSql('alter table "completes" add constraint "completes_exercise_id_foreign" foreign key ("exercise_id") references "exercise" ("id") on update cascade;');
  }

}
