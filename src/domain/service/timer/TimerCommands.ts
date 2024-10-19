export class SetTimerCommand {
    constructor(
    public readonly timerId: string,
    public readonly duration?: number
    ) {}
}

export class CancelTimerCommand {
    constructor(public readonly timerId: string) {}
}

export class RestartTimerCommand {
    constructor(
    public readonly timerId: string,
    public readonly duration?: number
    ) {}
}

export class GetRemainingTimeCommand {
    constructor(public readonly timerId: string) {}
}