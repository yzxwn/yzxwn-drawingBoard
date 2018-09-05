/**
 * @disc:文本
 */

import {fabric as Fabric} from "fabric";
import {CreateShape} from "../extends/CreateShape";

class Text extends CreateShape{
    protected textOptions:any = {
        stroke: "#ff0000",
        strokeWidth: 1,
        fill: "#eeb324",
        fontFamily: "SimSun",
        fontSize: 30,
        editingBorderColor: "#f66a35",
    };
    constructor(canvas:any){
        super(canvas);
        this.textOptions = {...super.getAllOptions(), ...this.textOptions}
    }
    protected onMouseDown(event:any){
        super.onMouseDown(event);
        this.end = "";
    }
    public setOptions(options: any){
        this.textOptions = {...this.textOptions, ...options}
    }
    public getOptions(){
        return this.textOptions;
    }
    protected onMouseUp(event:any){
        if (!this.end) {
            const {x, y} = this.start;
            const rect = new Fabric.IText("");
            let opt = {...this.textOptions};
            opt.left = x;
            opt.top = y;
            rect.set(opt);
            rect.enterEditing();
            this.instance = rect;
            this.canvas.add(this.instance);
        }
        super.onMouseUp();
    }
    public setEnable(enable:boolean){
        super.setEnable(enable);
        if(enable) {
            this.canvas.defaultCursor = 'text';
        }else {
            this.canvas.defaultCursor = 'default';
        }
        return this;
    }
}

export {Text};