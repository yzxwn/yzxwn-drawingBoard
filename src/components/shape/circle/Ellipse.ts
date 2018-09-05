/**
 * @disc:椭圆形
 */

import {fabric as Fabric} from "fabric";
import {CreateShape} from "../extends/CreateShape";

class Ellipse extends CreateShape{
    protected ellipseOptions:any = {
        stroke: "#ff0000",
        strokeWidth: 1,
        fill: "#eeb324",
        rx: 0,
        ry: 0
    };
    constructor(canvas:any){
        super(canvas);
        this.ellipseOptions = {...super.getAllOptions(), ...this.ellipseOptions}
    }
    public setOptions(options: any){
        this.ellipseOptions = {...this.ellipseOptions, ...options}
    }
    public getOptions(){
        return this.ellipseOptions;
    }
    protected onMouseMove(event:any){
        if (super.isMove(event)) {
            super.onMouseMove(event);
            const {width, height, left, top} = super.getValues();
            const rect = new Fabric.Ellipse();
            let opt = {...this.ellipseOptions};
            opt.left = left;
            opt.top = top;
            opt.rx = width / 2;
            opt.ry = height / 2;
            super.moveEnd(rect, opt, "render");
        }
    }
}

export {Ellipse};