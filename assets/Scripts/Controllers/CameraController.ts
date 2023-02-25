import { _decorator, Component, Node } from 'cc';
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

        let currentPosition = this.node.getPosition();

        currentPosition.lerp(target_position, 0.1);

        this.node.setPosition(currentPosition);
    }
}

