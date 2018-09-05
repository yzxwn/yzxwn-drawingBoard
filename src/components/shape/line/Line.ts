/**
 * @disc:直线
 */

import {CreateShape} from "../extends/CreateShape";
import {ArrowLine} from "./ArrowLine";

class Line extends CreateShape{
    protected arrowType:any = "none"|"default"|"hollow";
    protected arrowMode:any = "none"|"prev"|"next"|"all";
    protected lineOptions:any = {
        stroke: "#ff0000",
        strokeWidth: 1,
    };
    constructor(canvas:any, arrowType?: any, arrowMode?: any){
        super(canvas);
        this.lineOptions = {...super.getAllOptions(), ...this.lineOptions};
        this.arrowType = arrowType || "none";
        this.arrowMode = arrowMode || "none";
    }
    public setOptions(options: any){
        this.lineOptions = {...this.lineOptions, ...options}
    }
    public getOptions(){
        return this.lineOptions;
    }
    protected onMouseMove(event:any){
        if (super.isMove(event)) {
            super.onMouseMove(event);
            const {x1, y1, x2, y2} = super.getValues();
            const rect = new ArrowLine([x1, y1, x2, y2], this.arrowType, this.arrowMode);
            let opt = {...this.lineOptions};
            opt.x2 = x2;
            opt.y2 = y2;
            super.moveEnd(rect, opt, "render");
        }
    }
}

export {Line};