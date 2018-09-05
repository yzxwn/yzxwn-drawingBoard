/**
 * @disc:等边三角形
 */

import {fabric as Fabric} from "fabric";
import {CreateShape} from "../extends/CreateShape";

class EquilateralTriangle extends CreateShape{
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
            const {radius, x1, y1} = super.getValues();
            const angle = super.calcAngle(this.start, event.pointer);
            const points = this.calcPointsByTriangle(this.start,radius,angle);
            const rect = new Fabric.Polygon(points);
            let opt = {...this.triangleOptions};
            opt.points = points;
            opt.left = x1;
            opt.top = y1;
            opt.width = radius * 2;
            opt.height = radius * 2;
            opt.originX = "center";
            opt.originY = "center";
            super.moveEnd(rect, opt, "render");
        }
    }
    protected calcPointsByTriangle = (center:{x: number; y: number},radius:number,offsetAngle:number) => {
        // angle相对于正位置的偏角   72°间隔
        const angles=[offsetAngle,offsetAngle+120,offsetAngle+240];
        // cos sin 计算优化
        const sinOffsetAngle=Math.sin(offsetAngle/180 * Math.PI);
        const cosOffsetAngle=Math.cos(offsetAngle/180 * Math.PI);
        // 相差 180 °都是取反，此处只用到绝对值，不需要取反
        const sinObject=[sinOffsetAngle,sinOffsetAngle* this.cos120 + cosOffsetAngle * this.sin120,sinOffsetAngle* this.cos240 + cosOffsetAngle * this.sin240];// 一半值

        const cosObject=[cosOffsetAngle,cosOffsetAngle* this.cos120 - sinOffsetAngle * this.sin120,cosOffsetAngle* this.cos240 - sinOffsetAngle * this.sin240];// 一半值

        return angles.map((angle:number,index:number)=>{
            const _angle = angle%360;
            const cosAngle = Math.abs(cosObject[index]);// 通过已知角进行优化
            const sinAngle = Math.abs(sinObject[index]);
            if(_angle>0 && _angle<=90){
                return new Fabric.Point(center.x + radius*cosAngle,center.y + radius*sinAngle);
            }else if(_angle>90 && _angle<=180){
                return new Fabric.Point(center.x - radius*cosAngle,center.y + radius*sinAngle);
            }else if(_angle>180 && _angle<=270){
                return new Fabric.Point(center.x - radius*cosAngle,center.y - radius*sinAngle);
            }else{
                return new Fabric.Point(center.x + radius*cosAngle,center.y - radius*sinAngle);
            }
        });
    }
}

export {EquilateralTriangle};