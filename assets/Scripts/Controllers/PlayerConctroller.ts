import { _decorator, Component, Node, UITransform, Vec2, Size, Vec3, Quat, CCInteger, Collider2D, Contact2DType, IPhysics2DContact, RigidBody2D, ERigidBody2DType } from 'cc';
import { GameManager } from '../GameFlow/GameManager';
const { ccclass, property } = _decorator;

@ccclass('PlayerConctroller')
export class PlayerConctroller extends Component {

    start() {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        
        //('onBeginContact');
        //console.log(GameManager.Instance.getPlayerPos());
        
        // if (this.node.getComponent(RigidBody2D).type == ERigidBody2DType.Dynamic) {
        //     this.node.getComponent(RigidBody2D).type = ERigidBody2DType.Kinematic;
        // }
    }
    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // will be called once when the contact between two colliders just about to end.
        //console.log('onEndContact');
    }
    update(deltaTime: number) {

    }
}

