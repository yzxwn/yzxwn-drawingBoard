/**
 * @disc:选择
 */

import {CreateShape} from "../extends/CreateShape";

class Selection extends CreateShape{
    constructor(canvas:any){
        super(canvas);
    }
    public setOptions(options: any){
        // this.allOptions = {...this.allOptions, ...options}
    }
    public getOptions(){
        return {};
    }
    public setEnable(enable:boolean){
        super.setEnable(enable);
        if(enable){
            this.canvas.selection=true;
            this.canvas.skipTargetFind=false;
        }else{
            this.canvas.selection=false;
            this.canvas.skipTargetFind=true;
        }
        return this;
    }
}

export {Selection};