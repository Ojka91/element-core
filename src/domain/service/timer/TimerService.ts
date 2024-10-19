type Timer = {
  timeoutId: ReturnType<typeof setTimeout>;
  startTime: number;
  duration: number;
};

export default class TimerService {
    private timers: Map<string, Timer> = new Map();

    setTimer(timerId: string, duration: number, callback: () => void): void {
        if (this.timers.has(timerId)) {
            this.cancelTimer(timerId);
        }

        const startTime = Date.now();
        const timeoutId: ReturnType<typeof setTimeout> = setTimeout(() => {
            this.timers.delete(timerId);
            callback();
        }, duration);
        const timer: Timer = {
            timeoutId: timeoutId,
            startTime: startTime,
            duration: duration
        }
        this.timers.set(timerId, timer);
    }

    cancelTimer(timerId: string): void {
        const timer = this.timers.get(timerId);
        if (timer) {
            clearTimeout(timer.timeoutId);
            this.timers.delete(timerId);
        }
    }

    restartTimer(timerId: string, duration: number, callback: () => void): void {
        this.cancelTimer(timerId);
        this.setTimer(timerId, duration, callback);
    }

    getRemainingTime(timerId: string): number | null {
        const timer = this.timers.get(timerId);
        if (timer) {
            const elapsedTime = Date.now() - timer.startTime;
            const remainingTime = timer.duration - elapsedTime;
            return remainingTime > 0 ? remainingTime : 0;
        }
        return null;
    }
}
