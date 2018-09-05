
/**
 * @disc:图形基本类
 */

abstract class CreateShape{
    protected canvas: any;
    protected canvasEngine: any;
    protected enable: any;
    protected start: any;
    protected end: any;
    protected instance: any;
    protected sin120:number=Math.sin(120/180 * Math.PI);
    protected sin240:number=Math.sin(240/180 * Math.PI);
    protected cos120:number=Math.cos(120/180 * Math.PI);
    protected cos240:number=Math.cos(240/180 * Math.PI);
    protected sin18:number=Math.abs(Math.sin(18/180 * Math.PI));
    protected sin36:number=Math.sin(36/180 * Math.PI);
    protected sin72:number=Math.sin(72/180 * Math.PI);
    protected sin108:number=Math.sin(108/180 * Math.PI);
    protected sin144:number=Math.sin(144/180 * Math.PI);
    protected cos36:number=Math.cos(36/180 * Math.PI);
    protected cos72:number=Math.cos(72/180 * Math.PI);
    protected cos108:number=Math.cos(108/180 * Math.PI);
    protected cos144:number=Math.cos(144/180 * Math.PI);
    protected sin216:number=Math.sin(216/180 * Math.PI);
    protected sin288:number=Math.sin(288/180 * Math.PI);
    protected cos216:number=Math.cos(216/180 * Math.PI);
    protected cos288:number=Math.cos(288/180 * Math.PI);
    protected sin60:number=Math.sin(60/180 * Math.PI);
    protected cos60:number=Math.cos(60/180 * Math.PI);
    protected allOptions: any = {
        opacity: 1,
        angle: 0,
        scaleX: 1,
        scaleY: 1,
    };
    protected onMouseDown?(event:any):void;
    protected onMouseMove?(event:any):void;
    protected onMouseUp?(event:any):void;
    constructor(canvas:any){
        this.canvasEngine = canvas;
        this.canvas = canvas.getCanvas();
        // bind this
        if(void 0 !== this.onMouseDown){
            this.onMouseDown=this.onMouseDown.bind(this);
        }
        if(void 0 !== this.onMouseMove){
            this.onMouseMove=this.onMouseMove.bind(this);
        }
        if(void 0 !== this.onMouseUp){
            this.onMouseUp=this.onMouseUp.bind(this);
        }
    }
    protected getAllOptions(){
        return this.allOptions;
    }
    public setEnable(enable:boolean) {
        if (this.enable === enable) {
            return;
        }
        this.enable = enable;
        const activePlugin = this.canvasEngine.getActivePlugin();
        if (enable) {
            // 关闭当前激活的组件
            if (activePlugin) {
                activePlugin.setEnable(false);
            }
            this.canvasEngine.setActivePlugin(this);
            if (void 0 !== this.onMouseDown) {
                this.canvas.on('mouse:down', this.onMouseDown);
            }
            if (void 0 !== this.onMouseMove) {
                this.canvas.on('mouse:move', this.onMouseMove);
            }
            if (void 0 !== this.onMouseUp) {
                this.canvas.on('mouse:up', this.onMouseUp);
            }
        } else {
            if (activePlugin && activePlugin instanceof this.constructor) {
                this.canvasEngine.setActivePlugin(undefined);
            }
            if (void 0 !== this.onMouseDown) {
                this.canvas.off('mouse:down', this.onMouseDown);
            }
            if (void 0 !== this.onMouseMove) {
                this.canvas.off('mouse:move', this.onMouseMove);
            }
            if (void 0 !== this.onMouseUp) {
                this.canvas.off('mouse:up', this.onMouseUp);
            }
        }
        return this;
    }
    protected onMouseDown(event:any){
        this.start = this.canvas.getPointer(event.e);
    }
    protected onMouseMove(event:any){
        this.end = this.canvas.getPointer(event.e);
    }
    protected onMouseUp(event?:any){
        this.instance&&this.canvas.setActiveObject(this.instance);
        this.start = "";
        this.end = "";
        this.instance = "";
        this.canvasEngine.changeCanvas();
    };
    protected isMove(event:any){
        return this.start&&(event.pointer.x-this.start.x||event.pointer.y-this.start.y);
    }
    protected getValues() {
        const x1 = this.start.x, y1 = this.start.y, x2 = this.end.x, y2 = this.end.y;
        const radius = Math.sqrt(Math.pow(x1 - x2,2)+Math.pow(y1 - y2,2));
        const width=Math.abs(x2-x1);
        const height=Math.abs(y2-y1);
        const length = Math.sqrt(2) * Math.sqrt(Math.pow(width,2)+Math.pow(height,2));
        const left = Math.min(x2, x1);
        const top = Math.min(y2, y1);
        return {radius, width, height, length, left, top, x1, y1, x2, y2};
    }
    protected moveEnd(rect: any, opt:any, create:any){
        if (create === "remove") {
            this.instance && this.canvas.remove(this.instance);
            this.instance = rect;
            this.instance.set(opt);
            this.canvas.add(this.instance);
        } else if (create === "render") {
            if (this.instance) {
                this.instance.set({...opt}).setCoords();
                this.canvas.renderAll();
            } else {
                this.instance = rect;
                this.instance.set({...opt});
                this.canvas.add(this.instance);
            }
        }
    }
    protected calcAngle(start: any, end: any){
        let angle = 0;
        const x1 = start.x, y1 = start.y, x2 = end.x, y2 = end.y;
        if (x1 - x2 !== 0 || y1 - y2 !== 0) {
            angle = Math.atan((y2- y1) / (x2 - x1))/Math.PI * 180;
            if(x2>=x1){
                // 右侧
                if(y2>=y1){

                }else{
                    angle += 360;
                }
            }else{
                // 左侧
                if(y2>=y1){
                    angle += 180;
                }else{
                    angle += 180;
                }
            }
        }
        return angle;
    };
}

export {CreateShape};