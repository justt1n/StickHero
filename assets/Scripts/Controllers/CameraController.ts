import { _decorator, Component, Node, Vec3, misc } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraController')
export class CameraController extends Component {

    public static Instance: CameraController = null;

    @property(Node)
    Player: Node | null = null;

    onLoad() {
        CameraController.Instance = this;
    }

    start() {

    }

    update(deltaTime: number) {
        let target_position = this.Player.getPosition();
        target_position.x += 50;
        target_position.y += 50;
        let currentPosition = this.node.getPosition();
        currentPosition.x += 50;
        currentPosition.y += 50;
        currentPosition.lerp(target_position, 0.1);
        currentPosition.y = misc.clampf(target_position.y, 0, 1920);    
        this.node.setPosition(currentPosition);
    }
}

