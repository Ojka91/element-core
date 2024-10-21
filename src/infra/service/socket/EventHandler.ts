import TurnTimeout from "@/app/use-cases/game/TurnTimeout";
import SetTurnTimer from "@/app/use-cases/timer/SetTurnTimer";
import DomainEvent from "@/domain/service/domainEvents/DomainEvent";
import { TurnTimerFinishedEvent } from "@/domain/service/domainEvents/TurnTimerFinishedEvent";
import { GameUpdateService } from "./GameUpdate";

export class EventHandlerService {
    constructor(
        private gameUpdateService: GameUpdateService,
        private setTurnTimerUseCase: SetTurnTimer
    ) {}

    public async execute(event: DomainEvent) {
        switch (event.constructor) {
        case TurnTimerFinishedEvent: {
            const roomId = (event as TurnTimerFinishedEvent).timerId;

            try {
                const turnTimeoutUseCase = new TurnTimeout(this.setTurnTimerUseCase);
                const response = await turnTimeoutUseCase.execute(roomId);
                this.gameUpdateService.execute(roomId, response);
            } catch (error) {
                console.log((error as Error).message);
                this.setTurnTimerUseCase.cancel({ timerId: roomId });
            }
            break;
        }
        default:
            console.log(`Event ${event.constructor.name} not registered`);
            break;
        }
    }
}
