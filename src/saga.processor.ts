import { Command, SagaDefinition, STEP_PHASE } from './saga.builder';

export class SagaProcessor {
  constructor(private sagaDefinitions: SagaDefinition[]) {}

  async makeStepForward<T, X>(index: number, payload: T) {
    if (index >= this.sagaDefinitions.length) {
      console.log('====> Saga finished and transaction successful');
      return;
    }
    const stepForward: Command<T> =
      this.sagaDefinitions[index].phases[STEP_PHASE.STEP_FORWARD].command;
    try {
      const nextPayload = await stepForward(payload, index);
      await this.makeStepForward(index + 1, nextPayload as X);
    } catch (e) {
      await this.makeStepBackward(index - 1, payload);
    }
    return;
  }

  async makeStepBackward(index: number, payload: any) {
    if (index < 0) {
      console.log('===> Saga finished and transaction rolled back');
      return;
    }
    const stepBackward =
      this.sagaDefinitions[index].phases[STEP_PHASE.STEP_BACKWARD].command;
    const previousPayload = await stepBackward(payload);
    await this.makeStepBackward(index - 1, previousPayload);
    return;
  }

  async start<T>(payload: T) {
    console.log('Saga started');
    await this.makeStepForward(0, payload);
  }
}
