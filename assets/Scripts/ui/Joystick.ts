import { _decorator, Component, Node, NodeEventType, EventTouch, Camera, Vec2, Vec3 } from 'cc';
import { InputMgr } from '../game/InputMgr';
const { ccclass, property } = _decorator;

@ccclass('Joystick')
export default class Joystick extends Component {

    @property({ type: Number })
    public radius: number = 120;


    private aix: Node = null;

    private startWp: Vec3 = null;

    private targetWp: Vec3 = new Vec3;
    start() {

        this.node.on(NodeEventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(NodeEventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(NodeEventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(NodeEventType.TOUCH_CANCEL, this.onTouchEnd, this);

        this.aix = this.node.getChildByName('aix');
        this.startWp = this.aix.worldPosition.clone();
        this.targetWp = this.startWp.clone();
    }


    protected update(dt: number): void {
        this.aix.worldPosition = Vec3.lerp(this.aix.worldPosition, this.aix.worldPosition, this.targetWp, 0.3);
    }


    private onTouchStart(e: EventTouch) {
        InputMgr.ins.emit("JoystickStart");
    }
    private onTouchMove(e: EventTouch) {

        const deltaX = e.getLocation().x - this.node.worldPosition.x;
        const deltaY = e.getLocation().y - this.node.worldPosition.y;

        const angleRad = Math.atan2(deltaY, deltaX);
        const angleDeg = angleRad * (180 / Math.PI);
        const normalizedAngle = (angleDeg + 360) % 360;


        this.targetWp.set(deltaX, deltaY);
        this.targetWp.normalize();

        this.targetWp.x = this.targetWp.x * this.radius + this.node.worldPosition.x;
        this.targetWp.y = this.targetWp.y * this.radius + this.node.worldPosition.y;

        InputMgr.ins.emit("JoystickMove", normalizedAngle);

    }
    private onTouchEnd(e: EventTouch) {
        this.targetWp = this.startWp.clone();
        InputMgr.ins.emit("JoystickEnd");
    }
}
