import { Controller, Get } from '@nestjs/common';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { AppService } from './app.service';
import { SagaDefinitionBuilder } from './saga.builder';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private commandBus: CommandBus,
    private readonly eventBus: EventBus,
  ) {}

  @Get()
  async getHello() {
    const sagaBuilder = new SagaDefinitionBuilder({ id: 1 })
      .step('Step 1', {
        command: (payload) => {
          console.log('STEP 1', payload);
          return {
            age: 10,
            name: 'asd',
          };
        },
        withCompensation: (payload) => {
          console.log('Compe 1', payload);
        },
      })
      .step('Step 2', {
        command: (payload) => {
          console.log('STEP 2', payload);
          return {
            mana: 100,
          };
        },
        withCompensation: (payload) => {
          console.log('Compe 2', payload);
        },
      })
      .step('STEP 3', {
        command: (payload) => {
          console.log('STEP 3', payload);
          throw Error('asd');
        },
        withCompensation: (payload) => {
          console.log('Compe 3', payload);
        },
      });

    // console.log(sagaBuilder);
    await sagaBuilder.build();

    return this.appService.getHello();
  }
}
