/**
 * @disc:矩形
 */

import {fabric as Fabric} from "fabric";
import {CreateShape} from "../extends/CreateShape";

class Rect extends CreateShape{
    protected rectOptions:any = {
        stroke: "#ff0000",
        strokeWidth: 1,
        fill: "#eeb324",
        width: 0,
        height: 0,
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
            const {width, height, left, top} = super.getValues();
            const rect = new Fabric.Rect();
            let opt = {...this.rectOptions};
            opt.left = left;
            opt.top = top;
            opt.width = width;
            opt.height = height;
            super.moveEnd(rect, opt, "render");
        }
    }
}

export {Rect};