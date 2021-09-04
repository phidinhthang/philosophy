import { Migration } from '@mikro-orm/migrations';

export class Migration20210902111255 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "exercise" ("id" varchar(255) not null default uuid_generate_v4(), "title" varchar(255) not null, "length" int4 not null);');
    this.addSql('alter table "exercise" add constraint "exercise_pkey" primary key ("id");');

    this.addSql('create table "questions" ("id" varchar(255) not null default uuid_generate_v4(), "title" varchar(255) not null, "exercise_id" varchar(255) null);');
    this.addSql('alter table "questions" add constraint "questions_pkey" primary key ("id");');

    this.addSql('create table "answer" ("id" varchar(255) not null default uuid_generate_v4(), "text" varchar(255) not null, "question_id" varchar(255) null, "is_correct" bool not null default false);');
    this.addSql('alter table "answer" add constraint "answer_pkey" primary key ("id");');

    this.addSql('create table "users" ("id" varchar(255) not null default uuid_generate_v4(), "name" varchar(255) not null, "password" varchar(255) not null);');
    this.addSql('alter table "users" add constraint "users_pkey" primary key ("id");');

    this.addSql('create table "completes" ("user_id" varchar(255) not null default uuid_generate_v4(), "exercise_id" varchar(255) null default uuid_generate_v4());');
    this.addSql('alter table "completes" add constraint "completes_pkey" primary key ("user_id", "exercise_id");');

    this.addSql('alter table "questions" add constraint "questions_exercise_id_foreign" foreign key ("exercise_id") references "exercise" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "answer" add constraint "answer_question_id_foreign" foreign key ("question_id") references "questions" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "completes" add constraint "completes_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;');
    this.addSql('alter table "completes" add constraint "completes_exercise_id_foreign" foreign key ("exercise_id") references "exercise" ("id") on update cascade on delete set null;');
  }

}
