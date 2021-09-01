import { Migration } from '@mikro-orm/migrations';

export class Migration20210901125219 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "questions" ("id" varchar(255) not null, "title" varchar(255) not null, "exercise_id" varchar(255) not null, "correct_id" varchar(255) not null);');
    this.addSql('alter table "questions" add constraint "questions_pkey" primary key ("id");');
    this.addSql('alter table "questions" add constraint "questions_correct_id_unique" unique ("correct_id");');

    this.addSql('create table "answer" ("id" varchar(255) not null, "text" varchar(255) not null, "question_id" varchar(255) not null);');
    this.addSql('alter table "answer" add constraint "answer_pkey" primary key ("id");');

    this.addSql('alter table "questions" add constraint "questions_exercise_id_foreign" foreign key ("exercise_id") references "exercise" ("id") on update cascade;');
    this.addSql('alter table "questions" add constraint "questions_correct_id_foreign" foreign key ("correct_id") references "answer" ("id") on update cascade;');

    this.addSql('alter table "answer" add constraint "answer_question_id_foreign" foreign key ("question_id") references "questions" ("id") on update cascade;');
  }

}
