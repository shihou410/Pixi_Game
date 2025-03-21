import { _decorator, Component, Camera } from 'cc';
import { InputMgr } from './InputMgr';
const { ccclass, property } = _decorator;

@ccclass('CameraMain')
export class CameraMain extends Component {

    camera: Camera;

    start() {
        this.camera = this.getComponent(Camera);
        this.camera.orthoHeight = 64;

        InputMgr.ins.on("keyDown", (code => {
            console.log(code);
        }), this);

    }

}


