import { _decorator, Component, Input, input, EventKeyboard, EventTarget } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('InputMgr')
export class InputMgr extends Component {
    private static _ins: InputMgr = null;

    public static get ins(): InputMgr {
        return this._ins;
    }

    private target: EventTarget = null;
    private eventTypes: string[];

    protected onLoad(): void {
        this.eventTypes = [];
        InputMgr._ins = this;
    }

    start() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        this.target = new EventTarget();
    }

    private onKeyDown(e: EventKeyboard) {
        this.target.emit("keyDown", e.keyCode);
    }
    private onKeyUp(e: EventKeyboard) {
        this.target.emit("keyUp", e.keyCode);
    }

    public on(type: string, call: (...args: any[]) => void, target: any): void {
        if (!(type in this.eventTypes)) {
            this.eventTypes.push(type);
        }
        this.target.on(type, call, target);
    }
    public once(type: string, call: (...args: any[]) => void, target: any): void {
        this.target.once(type, call, target);
    }
    public off(type: string, call: (...args: any[]) => void, target: any): void {
        let index = this.eventTypes.indexOf(type);
        if (index >= 0) {
            this.eventTypes.splice(index, 1);
        }
        this.target.off(type, call, target);
    }

    public emit(type: string, ...args: any[]) {
        this.target.emit(type, args);
    }

    public removeAll() {
        this.eventTypes.forEach(type => {
            this.target.removeAll(type);
        });
    }

    protected onDestroy(): void {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
        this.removeAll();
    }


}


