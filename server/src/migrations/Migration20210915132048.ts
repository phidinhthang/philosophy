import { Migration } from '@mikro-orm/migrations';

export class Migration20210915132048 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "score_per_day" alter column "day" type varchar(255) using ("day"::varchar(255));',
    );
  }
}
