/**
 * @disc:圆形
 */

import {fabric as Fabric} from "fabric";
import {CreateShape} from "../extends/CreateShape";

class Circle extends CreateShape{
    protected circleOptions:any = {
        stroke: "#ff0000",
        strokeWidth: 1,
        fill: "#eeb324",
        radius: 0,
    };
    constructor(canvas:any){
        super(canvas);
        this.circleOptions = {...super.getAllOptions(), ...this.circleOptions}
    }
    public setOptions(options: any){
        this.circleOptions = {...this.circleOptions, ...options}
    }
    public getOptions(){
        return this.circleOptions;
    }
    protected onMouseMove(event:any){
        if (super.isMove(event)) {
            super.onMouseMove(event);
            const {radius, x1, y1} = super.getValues();
            const rect = new Fabric.Circle();
            let opt = {...this.circleOptions};
            opt.left = x1;
            opt.top = y1;
            opt.radius = radius;
            opt.originX = "center";
            opt.originY = "center";
            super.moveEnd(rect, opt, "render");
        }
    }
}

export {Circle};