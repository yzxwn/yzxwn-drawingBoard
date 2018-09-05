/**
 * @disc:等腰三角形
 */

import {fabric as Fabric} from "fabric";
import {CreateShape} from "../extends/CreateShape";

class Triangle extends CreateShape{
    protected triangleOptions:any = {
        stroke: "#ff0000",
        strokeWidth: 1,
        fill: "#eeb324",
    };
    constructor(canvas:any){
        super(canvas);
        this.triangleOptions = {...super.getAllOptions(), ...this.triangleOptions}
    }
    public setOptions(options: any){
        this.triangleOptions = {...this.triangleOptions, ...options}
    }
    public getOptions(){
        return this.triangleOptions;
    }
    protected onMouseMove(event:any){
        if (super.isMove(event)) {
            super.onMouseMove(event);
            const {width, height, left, top, x1, y1, x2, y2} = super.getValues();
            const rect = new Fabric.Triangle();
            let opt = {...this.triangleOptions};
            opt.left = left;
            opt.top = top;
            opt.width = width;
            opt.height = height;
            opt.flipY = y1 > y2;
            opt.flipX = x1 > x2;
            super.moveEnd(rect, opt, "render");
        }
    }
}

export {Triangle};