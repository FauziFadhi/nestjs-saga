import {
  CommandHandler,
  EventsHandler,
  ICommandHandler,
  IEventHandler,
} from '@nestjs/cqrs';
import { Hero } from './hero.class';

export class HeroKilledDragonEvent {
  constructor(
    public readonly heroId: string,
    public readonly dragonId: string,
  ) {}
}

@EventsHandler(HeroKilledDragonEvent)
export class HeroKilledDragonHandler
  implements IEventHandler<HeroKilledDragonEvent>
{
  handle(event: HeroKilledDragonEvent) {
    // logic
    console.log('hero killed handler dragon');
    return {
      id: '1',
      name: 'fauzi',
    };
  }
}

@CommandHandler(HeroKilledDragonEvent)
export class HeroKilledDragonCommandHandler
  implements ICommandHandler<HeroKilledDragonEvent>
{
  async execute(event: HeroKilledDragonEvent) {
    // logic
    console.log('hero killed command dragon');
    return {
      id: '1',
      name: 'fauzi',
    };
  }
}

export class KillDragonCommand {
  constructor(
    public readonly heroId: string,
    public readonly dragonId: string,
  ) {}
}

@EventsHandler(KillDragonCommand)
export class KillDragonHandler implements IEventHandler<HeroKilledDragonEvent> {
  handle(event: HeroKilledDragonEvent) {
    // logic
    console.log('kill event dragon');
    return {
      id: 'mantap',
      name: 'asdasd',
    };
  }
}

@CommandHandler(KillDragonCommand)
export class KillDragonCommandHandler
  implements ICommandHandler<KillDragonCommand>
{
  async execute(command: KillDragonCommand) {
    console.log('kill dragon command handler');
    return {
      id: '1',
      age: 2,
    };
  }
}
