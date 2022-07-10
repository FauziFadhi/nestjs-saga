import { SagaProcessor } from './saga.processor';
export enum STEP_PHASE {
  STEP_FORWARD = 'STEP_FORWARD',
  STEP_BACKWARD = 'STEP_BACKWARD',
}

export type SagaMessage<P = any> = {
  payload: P;
  saga: {
    index: number;
    phase: STEP_PHASE;
  };
};

export type Command<P = any, RES = unknown> = (
  payload?: P,
  index?: number,
) => Promise<RES> | RES;

export type SagaDefinition = {
  stepName: string;
  phases: { [key in STEP_PHASE]?: { command: Command } };
};

export class SagaDefinitionBuilder<T> {
  index: number | null = null;
  sagaDefinitions: SagaDefinition[] = [];

  step<TPayload>(
    name: string,
    {
      onReply,
      withCompensation,
    }: {
      onReply: Command<T, TPayload>;
      withCompensation?: Command;
    },
  ): SagaDefinitionBuilder<TPayload> {
    this.index = this.index === null ? 0 : this.index + 1;
    this.sagaDefinitions = [
      ...this.sagaDefinitions,
      { stepName: name, phases: {} },
    ];

    if (onReply) {
      this.sagaDefinitions[this.index].phases[STEP_PHASE.STEP_FORWARD] = {
        command: onReply,
      };
    }

    if (withCompensation) {
      this.sagaDefinitions[this.index].phases[STEP_PHASE.STEP_BACKWARD] = {
        command: withCompensation,
      };
    }
    return this as any;
  }

  async build(): Promise<SagaProcessor> {
    const sagaProcessor = new SagaProcessor(this.sagaDefinitions);
    return sagaProcessor;
  }
}
