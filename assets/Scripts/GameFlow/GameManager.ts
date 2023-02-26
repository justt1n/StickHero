import { _decorator, Component, Node, Vec3, Prefab, instantiate, input, Input, EventTouch, tween, UITransform, v2, v3, BoxCollider, BoxCollider2D, Size, Vec2, random, UI } from 'cc';
import { CameraController } from '../Controllers/CameraController';

const { ccclass, property } = _decorator;

export enum States {
    IDLE, //0
    TOUCHING, //1
    END //2
}

export enum playerStates {
    IDLE,
    FALL,
    RUN,
    Appearing,
    Desappearing
}


@ccclass('GameManager')
export class GameManager extends Component {
    public static Instance: GameManager = null;

    @property(Prefab)
    playerPrefab: Prefab | null = null;

    @property(Prefab)
    groundPrefab: Prefab | null = null;

    @property(Prefab)
    stickPrefab: Prefab | null = null;

    @property(Number)
    speed: number | null = 10;

    private stick;
    private currentGround;
    private nextGround;
    private player;
    private CameraPos: number = 0;

    gameState;
    playerState;

    //Cocos

    onLoad() {
        GameManager.Instance = this;
        this.onTouchHandler();
    }

    start() {
        //console.log("IDLE")
        this.gameState = States.IDLE;
        this.playerState = playerStates.IDLE;
        this.initPlayer();
        this.initFirst2Grounds();
    }

    update(deltaTime: number) {
        console.log(this.gameState)
        if (this.gameState == States.TOUCHING) {
            this.onGrown(deltaTime);
        }
        if(this.gameState == States.END) {
            this.onCheck();
        }
    }


    //Event Handlers
    onTouchHandler() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        if (this.gameState != States.IDLE) {
            return;
        }
        this.initStick();
        this.gameState = States.TOUCHING;
        ("TOUCHING")
    }

    onTouchEnd() {
        this.onStickFall();
        this.gameState = States.END;
        console.log("END")
    }

    onGrown(deltaTime: number) {
        this.stick.getComponent(UITransform).height += this.speed * deltaTime;
        if (this.stick.getComponent(UITransform).height >= 500) {
            this.onTouchEnd();
        }
    }

    onStickFall() {
        tween(this.stick)
            .to(0.3, { angle: -90 })
            .start();
    }

    onPlayerFall() {
            let playerPos = this.player.getPosition();
            let stickPos = this.stick.getPosition();
            tween(this.player)
                .to(2, {position: new Vec3(stickPos.x + this.stick.getComponent(UITransform).height, playerPos.y, 0)})
                .to(0.5, {position: new Vec3(stickPos.x + this.stick.getComponent(UITransform).height, -960, 0)})
                .start();
    }

    onPlayerMove() {
            // console.log("ground pos: " + this.nextGround.getPosition().x)
            // console.log("ground w: " + this.nextGround.getComponent(UITransform).width)
            // console.log("player w: " + this.player.getComponent(UITransform).width)
            let nextGroundEdge = this.nextGround.getPosition().x - this.player.getComponent(UITransform).width - 10;
            //let speed = nextGroundEdge / this.speed;
            let playerY = this.player.getPosition().y;
            tween(this.player)
                .to(0.5, { position: new Vec3(nextGroundEdge, playerY, 0) })
                .start()
            console.log("onPlayerMove")
            this.initNewGround();
    }

    onCheck() {
        // console.log("Stick len: " + this.stick.getComponent(UITransform).height);
        // console.log("Stick len + stick x: " + this.stick.getPosition().x + this.stick.getComponent(UITransform).height);
        // console.log("Next Ground Pos X: " + this.nextGround.getPosition().x);
        // console.log("Distance between 2 grounds by anchors: " + (this.nextGround.getPosition().x - this.currentGround.getPosition().x));
        // console.log("realDistance: " + ( (this.nextGround.getPosition().x - this.nextGround.getComponent(UITransform).width) - (this.currentGround.getPosition().x)));
        let distanceBetween2Grounds = this.nextGround.getPosition().x - this.nextGround.getComponent(UITransform).width - this.currentGround.getPosition().x;
        if (this.stick.getComponent(UITransform).height >= distanceBetween2Grounds) {
            this.onPlayerMove();
            this.gameState = States.IDLE;
        } else {
            console.log("Fail")
            //this.onPlayerFall();
            this.gameState = States.IDLE;
        }
    }

    //Init Functions
    initStick() {
        this.stick = instantiate(this.stickPrefab);
        this.stick.getComponents(UITransform).height = 0;
        this.stick.getComponents(UITransform).angle = 0;
        this.stick.setPosition(new Vec3(this.player.getPosition().x + this.player.getComponent(UITransform).width + 10, -280, 0));
        this.syncCollider(this.stick);
        this.node.addChild(this.stick);
    }

    initPlayer() {
        // console.log("Initing Player");
        this.player = instantiate(this.playerPrefab);
        this.player.position = new Vec3(-430, 0, 0);
        this.node.addChild(this.player);

        CameraController.Instance.Player = this.player;
        // console.log("Camera conected: " + CameraController.Instance.Player.getPosition());
        //console.log("Inited Player");
    }


    initFirst2Grounds() {
        this.currentGround = instantiate(this.groundPrefab);
        this.currentGround.setPosition(new Vec3(-310, -960, 0));
        this.currentGround.getComponent(UITransform).width = 200;
        this.syncCollider(this.currentGround);
        this.node.addChild(this.currentGround);

        this.nextGround = instantiate(this.groundPrefab);
        this.nextGround.setPosition(new Vec3(-20, -960, 0));
        this.nextGround.getComponent(UITransform).width = 150;
        this.syncCollider(this.nextGround);
        this.node.addChild(this.nextGround);
    }


    initNewGround() {
        this.currentGround = this.nextGround;
        this.syncCollider(this.currentGround);
        this.nextGround = instantiate(this.groundPrefab);
        this.nextGround.setPosition(new Vec3(this.currentGround.getPosition().x + this.random(300,700), -960, 0));
        this.nextGround.getComponent(UITransform).width = this.random(100,200);
        this.syncCollider(this.nextGround);
        this.node.addChild(this.nextGround);
    }


    //helper
    syncCollider(object: Node) { //with anchor point (1,0)
        let uiHeight = object.getComponent(UITransform).height;
        let uiWidth = object.getComponent(UITransform).width;
        object.getComponent(BoxCollider2D).size = new Size(uiWidth, uiHeight);
        object.getComponent(BoxCollider2D).offset = new Vec2(-uiWidth / 2, uiHeight / 2);
    }

    private random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}

