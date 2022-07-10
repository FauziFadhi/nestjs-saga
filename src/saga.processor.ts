import { Command, SagaDefinition, STEP_PHASE } from './saga.builder';

export class SagaProcessor {
  private stepPayload = [];
  constructor(private sagaDefinitions: SagaDefinition[]) {}

  private async makeStepForward<T, X>(index: number, payload: T) {
    if (index >= this.sagaDefinitions.length) {
      return;
    }
    const stepForward: Command<T> =
      this.sagaDefinitions[index].phases[STEP_PHASE.STEP_FORWARD].command;
    try {
      this.stepPayload.push(payload);
      const nextPayload = await stepForward(payload, index);
      await this.makeStepForward(index + 1, nextPayload as X);
    } catch (e) {
      await this.makeStepBackward(index - 1, undefined);
    }
    return;
  }

  private async makeStepBackward(index: number, payload: any) {
    if (index < 0) {
      return;
    }
    const rollbackPayload = this.stepPayload[index];

    const stepBackward =
      this.sagaDefinitions[index].phases[STEP_PHASE.STEP_BACKWARD].command;
    await stepBackward(rollbackPayload);
    await this.makeStepBackward(index - 1, undefined);
    return;
  }

  async start<T>(payload: T) {
    await this.makeStepForward(0, payload);
  }
}
