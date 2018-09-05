/**
 * @disc:画笔
 */

import {fabric as Fabric} from "fabric";
import {CreateShape} from "../extends/CreateShape";

class Pencil extends CreateShape{
    private polyLine:any;
    protected pencilType:any = "default"|"dashed";
    protected pencilOptions:any = {
        color: "red",
        width: 1,
    };
    constructor(canvas:any, pencilType?: any){
        super(canvas);
        this.pencilOptions = {...super.getAllOptions(), ...this.pencilOptions};
        this.pencilType = pencilType || "default";
        this.downHandler.bind(this);
        this.moveHandler.bind(this);
        this.upHandler.bind(this);
    }
    public setOptions(options: any){
        this.pencilOptions = {...this.pencilOptions, ...options}
    }
    public getOptions(){
        return this.pencilOptions;
    }
    private downHandler=(o:any)=>{
        this.start = this.canvas.getPointer(o.e);
        this.polyLine = new Fabric.PencilBrush();
        this.polyLine.color=this.pencilOptions.color;
        this.polyLine.width=this.pencilOptions.width;
        this.polyLine.initialize(this.canvas);
        this.polyLine.onMouseDown(this.start);
        this.canvas.on('mouse:move',this.moveHandler);
    };

    private moveHandler=(o:any)=>{
        const movePoint = this.canvas.getPointer(o.e);
        if(this.polyLine){
            this.polyLine.onMouseMove(movePoint);
        }
    };

    private upHandler=(o:any)=>{
        this.polyLine._finalizeAndAddPath();
        this.polyLine.initialize(undefined);
        this.canvas.off('mouse:move',this.moveHandler);
        this.canvasEngine.changeCanvas();
    };
    public setEnable(enable:boolean){
        if(this.enable===enable) {
            return ;
        }
        this.enable = enable;
        const activePlugin = this.canvasEngine.getActivePlugin();
        if(enable) {
            if(activePlugin) {
                activePlugin.setEnable(false);
            }
            this.canvasEngine.setActivePlugin(this);
            this.canvas.on('mouse:down',this.downHandler);
            // this.canvas.on('mouse:move',this.moveHandler);
            this.canvas.on('mouse:up',this.upHandler);
        }else {
            if(activePlugin && activePlugin instanceof Pencil) {
                this.canvasEngine.setActivePlugin(undefined);
            }
            this.canvas.off('mouse:down',this.downHandler);
            // this.canvas.off('mouse:move',this.moveHandler);
            this.canvas.off('mouse:up',this.upHandler);
        }
        return this;
    }
}

export {Pencil};