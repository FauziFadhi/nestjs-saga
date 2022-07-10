import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AppController } from './app.controller';
import { AppService, TestSaga } from './app.service';
import {
  HeroKilledDragonCommandHandler,
  HeroKilledDragonHandler,
  KillDragonCommandHandler,
  KillDragonHandler,
} from './event.handler';
import { Hero } from './hero.class';

@Module({
  imports: [CqrsModule],
  controllers: [AppController],
  providers: [
    AppService,
    HeroKilledDragonHandler,
    KillDragonHandler,
    KillDragonCommandHandler,
    Hero,
    HeroKilledDragonCommandHandler,
    TestSaga,
  ],
})
export class AppModule {}
