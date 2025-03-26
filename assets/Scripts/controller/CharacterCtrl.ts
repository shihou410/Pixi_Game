import { _decorator, Component, Node, NodeSpace, Animation, Vec3, Sprite } from 'cc';
import { InputMgr } from '../game/InputMgr';
const { ccclass, property } = _decorator;

@ccclass('CharacterCtrl')
export class CharacterCtrl extends Component {

    @property({ type: Number })
    moveSpeed: number = 36;

    animation: Animation = null;

    moveDirection: Vec3 = new Vec3(0, 0, 0);

    sprite: Sprite = null;
    start() {

        this.animation = this.getComponent(Animation);
        this.sprite = this.getComponentInChildren(Sprite);
        InputMgr.ins.on("JoystickStart", this.onJoystickStart, this);
        InputMgr.ins.on("JoystickMove", this.onJoystickMove, this);
        InputMgr.ins.on("JoystickEnd", this.onJoystickEnd, this);
        this.playAnima("knight_idle");
    }
    protected onDestroy(): void {
        InputMgr.ins.off("JoystickStart", this.onJoystickStart, this);
        InputMgr.ins.off("JoystickMove", this.onJoystickMove, this);
        InputMgr.ins.off("JoystickEnd", this.onJoystickEnd, this);
    }
    movePosition: Vec3 = new Vec3;
    update(deltaTime: number) {
        const moveX = this.moveDirection.x * this.moveSpeed * deltaTime;
        const moveY = this.moveDirection.y * this.moveSpeed * deltaTime;
        this.movePosition.set(moveX, moveY, 0);

        if (moveX != 0 || moveY != 0) {
            this.playAnima("knight_walk");
            this.sprite.node.setScale(Math.sign(moveX), 1);
        } else {
            this.playAnima("knight_idle");
        }
    }

    protected lateUpdate(dt: number): void {
        Vec3.add(this.node.position, this.movePosition, this.node.position);
        this.node.translate(this.movePosition, NodeSpace.LOCAL);
    }



    private onJoystickStart() { }

    private onJoystickMove(angle: number) {
        const radian = angle * Math.PI / 180;
        this.moveDirection.set(Math.cos(radian), Math.sin(radian), 0);

    }

    private onJoystickEnd() {
        this.moveDirection.set(0, 0, 0);
    }

    currentState: string = "";
    private playAnima(state: string) {
        if (state != this.currentState) {
            this.currentState = state;
            this.animation.play(this.currentState);
        }
    }


}