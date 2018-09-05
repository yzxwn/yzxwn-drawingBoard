/**
 * @disc:直角三角形
 */

import {fabric as Fabric} from "fabric";
import {CreateShape} from "../extends/CreateShape";

class OrthogonalTriangle extends CreateShape{
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
            const {x1, y1, x2, y2} = super.getValues();
            const points = [{x: x1, y: y1}, {x: x1, y: y2}, {x: x2, y: y2}];
            const rect = new Fabric.Polygon(points);
            let opt = {...this.triangleOptions};
            opt.points = points;
            super.moveEnd(rect, opt, "remove");
        }
    }
}

export {OrthogonalTriangle};