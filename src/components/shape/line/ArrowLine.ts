/**
 * @disc:直线箭头扩展
 */

import {fabric as Fabric} from "fabric";
import {DefaultArrow} from "./extends/DefaultArrow";
import {HollowArrow} from "./extends/HollowArrow";

class ArrowLine extends Fabric.Line{
    private arrowType:any;
    private arrowMode:any;
    constructor(points: number[], arrowType: any, arrowMode: any){
        super(points);
        this.arrowType = arrowType;
        this.arrowMode = arrowMode;
    }
    protected _render(ctx:CanvasRenderingContext2D){
        super["_render"](ctx);// 私有方法
        // 自定义箭头类
        if("none"!==this.arrowType){
            try{
                let arrowInstance = null;
                switch (this.arrowType) {
                    case "default":
                        arrowInstance = new DefaultArrow(ctx,this);
                        break;
                    case "hollow":
                        arrowInstance = new HollowArrow(ctx,this);
                        break;
                    default:
                        break;
                }
                arrowInstance.draw(this.arrowMode);
            }catch(e){
                throw "未找到箭头类实例";
            }
        }
    }
}

export {ArrowLine};