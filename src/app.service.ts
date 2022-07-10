import { Injectable } from '@nestjs/common';
import { CommandBus, EventBus, ofType, Saga } from '@nestjs/cqrs';
import { catchError, delay, map, Observable, of, throwError } from 'rxjs';
import { HeroKilledDragonEvent, KillDragonCommand } from './event.handler';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

@Injectable()
export class TestSaga {
  constructor(
    private readonly eventBus: EventBus,
    private commandBus: CommandBus,
  ) {}
  @Saga()
  testSaga(event: Observable<any>) {
    console.log('asd');
    const a = event.pipe(
      ofType(HeroKilledDragonEvent),
      delay(1000),
      map((event) => {
        console.log('event saga', event);
        // this.commandBus.execute(
        // throw Error('zxc');
        return new KillDragonCommand(event.heroId, event.dragonId);
        // );
      }),
      catchError((e) => {
        return throwError('xcv');
      }),
      delay(1000),
      map((event) => {
        console.log(event, 'asd');
        throw Error('error');
        return;
      }),
      catchError((e) => {
        console.log('atas');
        return throwError('bb');
      }),
      catchError((e) => {
        console.log('bawah');
        return of();
      }),
    );

    return a;
  }

  async a() {
    return {
      name: 'asd',
    };
  }

  async b() {
    await this.a()
      .then((resp) => {
        return {
          ...resp,
          id: 1,
        };
      })
      .then((resp) => {
        
      });
  }
}
