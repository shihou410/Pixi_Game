import { _decorator, Component, Camera, Vec3, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraMain')
export class CameraMain extends Component {

    @property({ type: Node })
    follow: Node = null;

    camera: Camera;

    start() {
        this.camera = this.getComponent(Camera);
        this.camera.orthoHeight = 64;

    }

    private movePosition: Vec3 = new Vec3;
    protected update(dt: number): void {
        if (this.follow) {
            Vec3.lerp(this.movePosition, this.node.worldPosition, this.follow.worldPosition, 0.03);
            this.node.worldPosition = this.movePosition;
        }
    }


}


