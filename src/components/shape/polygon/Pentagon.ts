/**
 * @disc:五边形
 */

import {fabric as Fabric} from "fabric";
import {CreateShape} from "../extends/CreateShape";

class Pentagon extends CreateShape{
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
            const {radius, x1, y1} = super.getValues();
            const angle = super.calcAngle(this.start, event.pointer);
            const points = this.calcPointsByPentagon(this.start,radius,angle);
            const rect = new Fabric.Polygon(points);
            let opt = {...this.rectOptions};
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
    protected calcPointsByPentagon(center:{x: number; y: number},radius:number,offsetAngle:number){
        // angle相对于正位置的偏角   72°间隔
        const angles=[offsetAngle,offsetAngle+72,offsetAngle+144,offsetAngle+216,offsetAngle+288];
        // cos sin 计算优化
        const sinOffsetAngle=Math.sin(offsetAngle/180 * Math.PI);
        const cosOffsetAngle=Math.cos(offsetAngle/180 * Math.PI);
        // 相差 180 °都是取反，此处只用到绝对值，不需要取反
        const sinObject=[sinOffsetAngle,sinOffsetAngle* this.cos72 + cosOffsetAngle * this.sin72,sinOffsetAngle* this.cos144 + cosOffsetAngle * this.sin144,
            sinOffsetAngle* this.cos216 + cosOffsetAngle * this.sin216,
            sinOffsetAngle* this.cos288 + cosOffsetAngle * this.sin288];// 一半值

        const cosObject=[cosOffsetAngle,cosOffsetAngle* this.cos72 - sinOffsetAngle * this.sin72,cosOffsetAngle* this.cos144 - sinOffsetAngle * this.sin144,
            cosOffsetAngle* this.cos216 - sinOffsetAngle * this.sin216,
            cosOffsetAngle* this.cos288 - sinOffsetAngle * this.sin288];// 一半值

        return angles.map((angle:number,index:number)=>{
            const _angle = angle%360;
            const cosAngle = Math.abs(cosObject[index]);// 通过已知角进行优化
            const sinAngle = Math.abs(sinObject[index]);
            // const cosAngle = Math.abs(Math.cos(_angle/180 * Math.PI));// 通过已知角进行优化
            // const sinAngle = Math.abs(Math.sin(_angle/180 * Math.PI));
            if(_angle>0 && _angle<=90){
                return new fabric.Point(center.x + radius*cosAngle,center.y + radius*sinAngle);
            }else if(_angle>90 && _angle<=180){
                return new fabric.Point(center.x - radius*cosAngle,center.y + radius*sinAngle);
            }else if(_angle>180 && _angle<=270){
                return new fabric.Point(center.x - radius*cosAngle,center.y - radius*sinAngle);
            }else{
                return new fabric.Point(center.x + radius*cosAngle,center.y - radius*sinAngle);
            }
        });
    }
}

export {Pentagon};