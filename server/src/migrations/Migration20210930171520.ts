import { Migration } from '@mikro-orm/migrations';

export class Migration20210930171520 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "saved_exercise" ("user_id" varchar(255) not null default uuid_generate_v4(), "exercise_id" varchar(255) not null default uuid_generate_v4());',
    );
    this.addSql(
      'alter table "saved_exercise" add constraint "saved_exercise_pkey" primary key ("user_id", "exercise_id");',
    );

    this.addSql(
      'alter table "saved_exercise" add constraint "saved_exercise_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "saved_exercise" add constraint "saved_exercise_exercise_id_foreign" foreign key ("exercise_id") references "exercise" ("id") on update cascade;',
    );
  }
}
