/**
 * @disc:梯形
 */

import {fabric as Fabric} from "fabric";
import {CreateShape} from "../extends/CreateShape";

class Trapezoid extends CreateShape{
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
            const {x1, y1, x2, y2, height} = super.getValues();
            const points = [{x: x1, y: y1}, {x: x1 - height, y: y2}, {x: x2, y: y2}, {x: x2 - height, y: y1}];
            const rect = new Fabric.Polygon(points);
            let opt = {...this.rectOptions};
            opt.points = points;
            super.moveEnd(rect, opt, "remove");
        }
    }
}

export {Trapezoid};