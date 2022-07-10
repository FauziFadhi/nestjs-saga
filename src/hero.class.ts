import { AggregateRoot } from '@nestjs/cqrs';
import { HeroKilledDragonEvent } from './event.handler';

export class Hero extends AggregateRoot {
  constructor(private id: string) {
    super();
  }

  killEnemy(enemyId: string) {
    // logic
    this.apply(new HeroKilledDragonEvent(this.id, enemyId));
  }
}
