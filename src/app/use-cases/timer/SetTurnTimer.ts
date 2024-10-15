import { DomainEventEmitter } from "@/domain/service/DomainEventEmitter";
import { TurnTimerFinishedEvent } from "@/domain/service/domainEvents/TurnTimerFinishedEvent";
import {
  CancelTimerCommand,
  GetRemainingTimeCommand,
  RestartTimerCommand,
  SetTimerCommand,
} from "@/domain/service/timer/TimerCommands";
import TimerService from "@/domain/service/timer/TimerService";

const DEFAULT_TURN_MINUTES = 2;
const DEFAULT_TURN_SECONDS = 0;

export default class SetTurnTimer {
  constructor(
    private timerService: TimerService,
    private eventEmitter: DomainEventEmitter
  ) {}
  private getDefaultDuration(): number {
    return (DEFAULT_TURN_MINUTES * 60 + DEFAULT_TURN_SECONDS) * 1000;
  }

  execute(command: SetTimerCommand) {
    let duration;
    if (!command.duration) {
      duration = this.getDefaultDuration();
    } else {
      duration = command.duration;
    }
    this.timerService.setTimer(command.timerId, duration, () => {
      const event = new TurnTimerFinishedEvent(command.timerId);
      this.eventEmitter.emit(event);
    });
  }

  cancel(command: CancelTimerCommand) {
    this.timerService.cancelTimer(command.timerId);
  }

  restart(command: RestartTimerCommand) {
    let duration;
    if (!command.duration) {
      duration = this.getDefaultDuration();
    } else {
      duration = command.duration;
    }
    this.timerService.restartTimer(command.timerId, duration, () => {
      const event = new TurnTimerFinishedEvent(command.timerId);
      this.eventEmitter.emit(event);
    });
  }

  getRemainingTime(command: GetRemainingTimeCommand): number | null {
    const remainingTime = this.timerService.getRemainingTime(command.timerId);
    return remainingTime;
  }
}
