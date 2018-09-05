/**
 * @disc:菱形
 */

import {fabric as Fabric} from "fabric";
import {CreateShape} from "../extends/CreateShape";

class Square extends CreateShape{
    protected rectOptions:any = {
        stroke: "#ff0000",
        strokeWidth: 1,
        fill: "#eeb324",
    };
    constructor(canvas:any){
        super(canvas);
        this.rectOptions = {...super.getAllOptions(), ...this.rectOptions}
    }
    public setOptions(options: any){
        this.rectOptions = {...this.rectOptions, ...options}
    }
    public getOptions(){
        return this.rectOptions;
    }
    protected onMouseMove(event:any){
        if (super.isMove(event)) {
            super.onMouseMove(event);
            const {length, x1, y1} = super.getValues();
            const rect = new Fabric.Rect();
            let opt = {...this.rectOptions};
            opt.left = x1;
            opt.top = y1;
            opt.width = length;
            opt.height = length;
            opt.angle = super.calcAngle(this.start, event.pointer) - 45;
            opt.originX = "center";
            opt.originY = "center";
            super.moveEnd(rect, opt, "render");
        }
    }
}

export {Square};