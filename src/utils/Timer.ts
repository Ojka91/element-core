import { setTimeout } from "timers";

type TimerHandler = ReturnType<typeof setTimeout>;

export type TimerCallback = (x: any) => void;

class Timer {
    private id?: TimerHandler; 
    private callback: TimerCallback;
    private delay: number;
    private remaining: number;
    private started?: Date;
    private running: boolean = false;

    constructor(callback: TimerCallback, delay: number){
        this.callback = callback;
        this.delay = delay;
        this.remaining = delay;
    }

    public start() {
        this.running = true
        this.started = new Date()
        this.id = setTimeout(this.callback, this.remaining)
    }

    public pause() {
        this.running = false
        if(this.id == null){
            throw new Error("Timer cannot be paused before start");
        }
        clearTimeout(this.id)
        const currentTime = new Date().getMilliseconds();
        const startedTime = this.started!.getMilliseconds();
        this.remaining -= (currentTime - startedTime);
    }

    public getTimeLeft(): number {
        if (this.running) {
            this.pause()
            this.start()
        }

        return this.remaining
    }

    public getStateRunning(): boolean {
        return this.running;
    }
}

export default Timer;