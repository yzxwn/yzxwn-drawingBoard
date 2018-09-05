/**
 * @disc:空心箭头
 */
import {DefaultArrow} from "./DefaultArrow";

class HollowArrow extends DefaultArrow{
    protected drawPrev(){
        const p5={
            x:this.linePoints.x1 - this.calcData.topX,
            y: this.linePoints.y1 - this.calcData.topY
        };
        const p6={
            x:this.linePoints.x1 - this.calcData.botX,
            y:this.linePoints.y1 - this.calcData.botY
        };
        this.ctx.moveTo(p5.x, p5.y);
        this.ctx.lineTo(this.linePoints.x1, this.linePoints.y1);
        this.ctx.lineTo(p6.x,p6.y);
        this.ctx.stroke();
    }
    protected drawNext(){
        const p3={
            x:this.linePoints.x2 + this.calcData.topX,
            y: this.linePoints.y2 + this.calcData.topY
        };
        const p4={
            x:this.linePoints.x2 + this.calcData.botX,
            y:this.linePoints.y2 + this.calcData.botY
        };
        this.ctx.moveTo(p3.x, p3.y);
        this.ctx.lineTo(this.linePoints.x2, this.linePoints.y2);
        this.ctx.lineTo(p4.x,p4.y);
        this.ctx.stroke();
    }
}

export {HollowArrow};