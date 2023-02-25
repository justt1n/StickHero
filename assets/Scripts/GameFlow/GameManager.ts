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
    playerPos;

    //get set
    getPlayerPos() {
        return this.playerPos;
    }

    // Setter
    setPlayerPos(value: Vec3) {
        this.playerPos = value;
        this.gameState = States.IDLE;
        this.playerState = playerStates.IDLE;
    }

    //Cocos

    onLoad() {
        GameManager.Instance = this;
        this.onTouchHandler();
    }

    start() {
        console.log("IDLE")
        this.initPlayer();
        this.initFirst2Grounds();
    }

    update(deltaTime: number) {
        //console.log(this.gameState)
        if (this.gameState == States.TOUCHING) {
            this.onGrown(deltaTime);
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
        console.log("TOUCHING")
    }

    onTouchEnd() {
        this.onFalling();
        this.gameState = States.END;
        this.onPlayerMove();
        console.log("END")
    }

    onGrown(deltaTime: number) {
        this.stick.getComponent(UITransform).height += this.speed * deltaTime;
        if (this.stick.getComponent(UITransform).height >= 500) {
            this.onTouchEnd();
        }
    }

    onFalling() {
        tween(this.stick)
            .to(0.3, { angle: -90 })
            .start();
    }

    onPlayerMove() {
        if (this.gameState == States.END) {
            let nextGroundEdge = this.nextGround.x + this.nextGround.width - this.player.width / 4;
            this.playerPos = nextGroundEdge - this.player.x;
            let walkTime = this.playerPos / this.speed;
            console.log("Run")
            tween(this.player)
                .to(2, { position: new Vec3(nextGroundEdge, this.playerPos.y, 0) })
                .start()
            this.gameState = States.IDLE;
            console.log("IDLE")
            this.initNewGround();
        }
    }

    //Init Functions
    initStick() {
        this.stick = instantiate(this.stickPrefab);
        this.stick.getComponents(UITransform).height = 0;
        this.stick.getComponents(UITransform).angle = 0;
        this.stick.setPosition(new Vec3(this.playerPos.x + 110, this.playerPos.y, 0));
        this.syncCollider(this.stick);
        this.node.addChild(this.stick);
    }

    initPlayer() {
        console.log("Initing Player");
        this.player = instantiate(this.playerPrefab);
        this.player.position = new Vec3(-450, 0, 0);
        this.playerPos = this.player.position;
        this.node.addChild(this.player);

        CameraController.Instance.Player = this.player;
        console.log("Camera conected: " + CameraController.Instance.Player.getPosition());
        console.log("Inited Player");
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
        this.nextGround = instantiate(this.groundPrefab);
        this.nextGround.setPosition(new Vec3(100, -960, 0));
        this.nextGround.getComponent(UITransform).width = 100;
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

