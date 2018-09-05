/**
 * @disc:自定义多边形
 */

import {fabric} from "fabric";
import {CreateShape} from "../extends/CreateShape";


class Point extends fabric.Point {
    public state:"final"|"temporary";
    constructor(x:number,y:number,state:"final"|"temporary"){
        super(x,y);
        this.state=state;
    }
}


class Polygon extends CreateShape{
    protected points:Point[]=[];
    protected circle:fabric.Circle;// 起始点磁贴效果
    protected polygonOptions:any = {
        stroke: "#ff0000",
        strokeWidth: 1,
        fill: "#eeb324",
    };
    constructor(canvas:any){
        super(canvas);
        this.polygonOptions = {...super.getAllOptions(), ...this.polygonOptions}
    }
    public setOptions(options: any){
        this.polygonOptions = {...this.polygonOptions, ...options}
    }
    public getOptions(){
        return this.polygonOptions;
    }
    protected onMouseDown(event:any){
        if(!this.start){
            // 起点
            super.onMouseDown(event);
            // 此时points length 为0
            this.points.push(new Point(this.start.x,this.start.y,"final"));
        }else{
            // 中间点
            this.points.pop();
            const finalPoint = this.canvas.getPointer(event.e);
            const close = this.requireClose(finalPoint);
            if(close){
                this.points.push(new Point(this.start.x,this.start.y,"final"));
                this.finish();
            }else{
                this.points.push(new Point(finalPoint.x,finalPoint.y,"final"));
            }
        }
    }
    protected onMouseMove(event:any){
        if(this.start){
            super.onMouseMove(event);
            this.canvas.renderOnAddRemove=false;// 渲染过程控制
            const lastPoint = this.points.pop() as Point;
            if("final"===lastPoint.state) {
                this.points.push(lastPoint,new Point(this.end.x,this.end.y,"temporary"));
            }else{
                this.points.push(new Point(this.end.x,this.end.y,"temporary"));
            }
            if(!this.instance){
                this.instance = new fabric.Polyline(this.points, this.polygonOptions);
                this.canvas.add(this.instance);
            }else{
                this.canvas.remove(this.instance);
                this.instance = new fabric.Polyline(this.points, this.polygonOptions);
                this.canvas.add(this.instance);
                const finalPoint = this.canvas.getPointer(event.e);
                this.showCanvas(finalPoint);
            }
            this.canvas.renderAll();
            this.canvas.renderOnAddRemove=true;// 渲染过程控制
        }
    }
    protected onMouseUp(event: any){
        if(this.requireClose(this.canvas.getPointer(event.e))) {
            super.onMouseUp();
        }
    }
    private finish(){
        this.canvas.renderOnAddRemove=false;// 渲染过程控制
        this.canvas.remove(this.instance);
        this.instance = new fabric.Polyline(this.points, this.polygonOptions);
        this.canvas.add(this.instance);
        this.circle&&this.canvas.remove(this.circle);
        this.canvas.setActiveObject(this.instance);//结束后选中
        this.canvas.renderAll();
        this.recovery();
        this.canvas.renderOnAddRemove=true;// 渲染过程控制
    }
    private recovery(){
        this.points=[];
        this.start = undefined as any;
        this.instance = undefined as any;
        this.circle = undefined as any;
    }
    private requireClose(pointer:{x:number,y:number}){
        const start = this.start;
        if(this.points.length <=2){return false}
        const offsetX = Math.abs(pointer.x-start.x);
        const offsetY = Math.abs(pointer.y-start.y);
        const range = 10;
        return offsetX < range && offsetY < range;
    }
    private showCanvas(pointer:{x:number,y:number}){
        const _close = this.requireClose(pointer);
        this.circle&&this.canvas.remove(this.circle);
        if(_close){
            this.circle = new fabric.Circle({...this.polygonOptions,
                originX:"center",
                originY:"center",
                left: this.start.x,
                top: this.start.y,
                radius:5,
            });
            this.canvas.add(this.circle);
        }
    }
}

export {Polygon};