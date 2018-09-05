import * as React from "react";
import {fabric} from "fabric";
import { Icon, Tooltip, Menu, Dropdown, InputNumber, Select, Switch } from "antd";
import {Polygon} from "../../components/shape/polygon/Polygon";
import {ArrowLine} from "../../components/shape/line/ArrowLine";
import {Ellipse} from "../../components/shape/circle/Ellipse";
import {Selection} from "../../components/shape/selection/Selection";
import {Pencil} from "../../components/shape/pencil/Pencil";
import {Text} from "../../components/shape/text/Text";
import {Line} from "../../components/shape/line/Line";
import {Triangle} from "../../components/shape/triangle/Triangle";
import {Circle} from "../../components/shape/circle/Circle";
import {Rect} from "../../components/shape/quadrangle/Rect";
import {Square} from "../../components/shape/quadrangle/Square";
import {Star} from "../../components/shape/polygon/Star";
import {Pentagon} from "../../components/shape/polygon/Pentagon";
import {Hexagon} from "../../components/shape/polygon/Hexagon";
import {Rhomboid} from "../../components/shape/quadrangle/Rhomboid";
import {Trapezoid} from "../../components/shape/quadrangle/Trapezoid";
import {EquilateralTriangle} from "../../components/shape/triangle/EquilateralTriangle";
import {OrthogonalTriangle} from "../../components/shape/triangle/OrthogonalTriangle";


const {Option} = Select;

interface UserMenuProps {
    getStates: any;
    canvas: any;
    canvasBrush: any;
    changeStates: any;
}

interface UserMenuStates {

}

class UserMenu extends React.Component<UserMenuProps, UserMenuStates> {
    private userMenus: any;
    private start: any;
    private end: any;
    private instance: any;
    private sin120:number=Math.sin(120/180 * Math.PI);
    private sin240:number=Math.sin(240/180 * Math.PI);
    private cos120:number=Math.cos(120/180 * Math.PI);
    private cos240:number=Math.cos(240/180 * Math.PI);
    private sin18:number=Math.abs(Math.sin(18/180 * Math.PI));
    private sin36:number=Math.sin(36/180 * Math.PI);
    private sin72:number=Math.sin(72/180 * Math.PI);
    private sin108:number=Math.sin(108/180 * Math.PI);
    private sin144:number=Math.sin(144/180 * Math.PI);
    private cos36:number=Math.cos(36/180 * Math.PI);
    private cos72:number=Math.cos(72/180 * Math.PI);
    private cos108:number=Math.cos(108/180 * Math.PI);
    private cos144:number=Math.cos(144/180 * Math.PI);
    private sin216:number=Math.sin(216/180 * Math.PI);
    private sin288:number=Math.sin(288/180 * Math.PI);
    private cos216:number=Math.cos(216/180 * Math.PI);
    private cos288:number=Math.cos(288/180 * Math.PI);
    private sin60:number=Math.sin(60/180 * Math.PI);
    private cos60:number=Math.cos(60/180 * Math.PI);
    constructor(props: any) {
        super(props);
        this.userMenus = [
            {type: "like", text: "选择"},
            {type: "edit", text: "画笔", children: [{type: "edit", text: "实线"}, {type: "dot-chart", text: "虚线"}]},
            {type: "minus", text: "线", children: [{type: "minus", text: "直线"}, {type: "arrow-left", text: "起始箭头线"}, {type: "arrow-right", text: "结束箭头线"}, {type: "arrows-alt", text: "双向箭头线"}]},
            {type: "minus-circle-o", text: "圆形", children: [{type: "minus-circle-o", text: "圆形"}, {type: "info-circle-o", text: "椭圆"}]},
            {type: "warning", text: "三角形", children: [{type: "up-circle-o", text: "等边三角形"}, {type: "warning", text: "等腰三角形"}, {type: "caret-left", text: "直角三角形"}]},
            {type: "minus-square-o", text: "四边形", children: [{type: "minus-square-o", text: "矩形"}, {type: "double-left", text: "棱形"}, {type: "up-square-o", text: "梯形"}, {type: "menu-fold", text: "平行四边形"}]},
            {type: "appstore-o", text: "多边形", children: [{type: "star-o", text: "五角星"}, {type: "home", text: "五边形"}, {type: "setting", text: "六边形"}, {type: "swap", text: "自定义形状"}]},
            {type: "form", text: "文本"},
            {type: "tag-o", text: "橡皮擦"},
        ];
    }
    private __calcAngle = (start: any, end: any) => {
        let angle = 0;
        const x1 = start.x, y1 = start.y, x2 = end.x, y2 = end.y;
        if (x1 - x2 !== 0 || y1 - y2 !== 0) {
            angle = Math.atan((y2- y1) / (x2 - x1))/Math.PI * 180;
            if(x2>=x1){
                // 右侧
                if(y2>=y1){

                }else{
                    angle += 360;
                }
            }else{
                // 左侧
                if(y2>=y1){
                    angle += 180;
                }else{
                    angle += 180;
                }
            }
        }
        return angle;
    };
    private __calcPointsByTriangle = (center:{x: number; y: number},radius:number,offsetAngle:number) => {
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
    private __calcPointsByStar = (center:{x: number; y: number},radius:number,offsetAngle:number) => {
        const innerRadius = radius / (3-4*Math.pow(this.sin18,2));
        // angle相对于正位置的偏角   72°间隔
        const angles=[offsetAngle,offsetAngle+36,offsetAngle+72,offsetAngle+108,offsetAngle+144,offsetAngle+180,offsetAngle+216,offsetAngle+252,offsetAngle+288,offsetAngle+324];
        // cos sin 计算优化
        const sinOffsetAngle=Math.sin(offsetAngle/180 * Math.PI);
        const cosOffsetAngle=Math.cos(offsetAngle/180 * Math.PI);
        // 相差 180 °都是取反，此处只用到绝对值，不需要取反
        const sinObject=[sinOffsetAngle,sinOffsetAngle* this.cos36 + cosOffsetAngle * this.sin36,
            sinOffsetAngle* this.cos72 + cosOffsetAngle * this.sin72,sinOffsetAngle* this.cos108 + cosOffsetAngle * this.sin108,
            sinOffsetAngle* this.cos144 + cosOffsetAngle * this.sin144];// 一半值

        const cosObject=[cosOffsetAngle,cosOffsetAngle* this.cos36 - sinOffsetAngle * this.sin36,
            cosOffsetAngle* this.cos72 - sinOffsetAngle * this.sin72,cosOffsetAngle* this.cos108 - sinOffsetAngle * this.sin108,
            cosOffsetAngle* this.cos144 - sinOffsetAngle * this.sin144];// 一半值

        return angles.map((angle:number,index:number)=>{
            const _angle = angle%360;
            const cosAngle = Math.abs(cosObject[index%5]);// 通过已知角进行优化
            const sinAngle = Math.abs(sinObject[index%5])
            // const cosAngle = Math.abs(Math.cos(_angle/180 * Math.PI));// 通过已知角进行优化
            // const sinAngle = Math.abs(Math.sin(_angle/180 * Math.PI));
            if(index%2===0){
                // 外角
                if(_angle>0 && _angle<=90){
                    return new fabric.Point(center.x + radius*cosAngle,center.y + radius*sinAngle);
                }else if(_angle>90 && _angle<=180){
                    return new fabric.Point(center.x - radius*cosAngle,center.y + radius*sinAngle);
                }else if(_angle>180 && _angle<=270){
                    return new fabric.Point(center.x - radius*cosAngle,center.y - radius*sinAngle);
                }else{
                    return new fabric.Point(center.x + radius*cosAngle,center.y - radius*sinAngle);
                }
            }else{
                // 内角
                if(_angle>0 && _angle<=90){
                    return new fabric.Point(center.x + innerRadius*cosAngle,center.y + innerRadius*sinAngle);
                }else if(_angle>90 && _angle<=180){
                    return new fabric.Point(center.x - innerRadius*cosAngle,center.y + innerRadius*sinAngle);
                }else if(_angle>180 && _angle<=270){
                    return new fabric.Point(center.x - innerRadius*cosAngle,center.y - innerRadius*sinAngle);
                }else{
                    return new fabric.Point(center.x + innerRadius*cosAngle,center.y - innerRadius*sinAngle);
                }
            }
        });
    }
    public __calcPointsByPentagon(center:{x: number; y: number},radius:number,offsetAngle:number){
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
    public __calcPointsByHexagon(center:{x: number; y: number},radius:number,offsetAngle:number){
        // angle相对于正位置的偏角   72°间隔
        const angles=[offsetAngle,offsetAngle+60,offsetAngle+120,offsetAngle+180,offsetAngle+240,offsetAngle+300];
        // cos sin 计算优化
        const sinOffsetAngle=Math.sin(offsetAngle/180 * Math.PI);
        const cosOffsetAngle=Math.cos(offsetAngle/180 * Math.PI);
        // 相差 180 °都是取反，此处只用到绝对值，不需要取反
        const sinObject=[sinOffsetAngle,sinOffsetAngle* this.cos60 + cosOffsetAngle * this.sin60,sinOffsetAngle* this.cos120 + cosOffsetAngle * this.sin120];// 一半值

        const cosObject=[cosOffsetAngle,cosOffsetAngle* this.cos60 - sinOffsetAngle * this.sin60,cosOffsetAngle* this.cos120 - sinOffsetAngle * this.sin120];// 一半值

        return angles.map((angle:number,index:number)=>{
            const _angle = angle%360;
            const cosAngle = Math.abs(cosObject[index%3]);// 通过已知角进行优化
            const sinAngle = Math.abs(sinObject[index%3]);
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
    public mouseDown = (activeMenu: any, event: any, canvas: any, widgetMenu: any) => {
        const {options} = widgetMenu;
        switch (activeMenu) {
            case "minus":
                //直线
                this.start = event.pointer;
                break;
            case "arrow-left":
                //起始箭头线
                this.start = event.pointer;
                break;
            case "arrow-right":
                //结束箭头线
                this.start = event.pointer;
                break;
            case "arrows-alt":
                //双向箭头线
                this.start = event.pointer;
                break;
            case "minus-square-o":
                //矩形
                this.start = event.pointer;
                break;
            case "double-left":
                //棱形
                this.start = event.pointer;
                break;
            case "menu-fold":
                //平行四边形
                this.start = event.pointer;
                break;
            case "up-square-o":
                //梯形
                this.start = event.pointer;
                break;
            case "minus-circle-o":
                //圆
                this.start = event.pointer;
                break;
            case "info-circle-o":
                //椭圆
                this.start = event.pointer;
                break;
            case "up-circle-o":
                //等边三角形
                this.start = event.pointer;
                break;
            case "warning":
                //等腰三角形
                this.start = event.pointer;
                break;
            case "caret-left":
                //直角三角形
                this.start = event.pointer;
                break;
            case "star-o":
                //五角星
                this.start = event.pointer;
                break;
            case "home":
                //五边形
                this.start = event.pointer;
                break;
            case "setting":
                //六边形
                this.start = event.pointer;
                break;
            case "swap":
                //自定义形状
                // this.polygon.onMouseDown(event.pointer, canvas, options);
                break;
            case "form":
                //文本
                this.start = event.pointer;
                break;
            case "tag-o":
                //橡皮擦
                break;
            default:
                break;
        }
    }
    public mouseMove = (activeMenu: any, event: any, canvas: any, widgetMenu: any) => {
        const {options, circleOptions} = widgetMenu;
        if (this.start&&(event.pointer.x-this.start.x||event.pointer.y-this.start.y)) {
            const x1 = this.start.x, y1 = this.start.y, x2 = event.pointer.x, y2 = event.pointer.y;
            let rect = "", opt = {}, create = true, points = [], angle = 0;
            const radius = Math.sqrt(Math.pow(x1 - x2,2)+Math.pow(y1 - y2,2));
            const width=Math.abs(x2-x1);
            const height=Math.abs(y2-y1);
            const length = Math.sqrt(2) * Math.sqrt(Math.pow(width,2)+Math.pow(height,2));
            switch (activeMenu) {
                case "minus":
                    //直线
                    rect = new fabric.Line([x1, y1, x2, y2]);
                    opt = {...options};
                    opt.x2 = x2;
                    opt.y2 = y2;
                    break;
                case "arrow-left":
                    //起始箭头线
                    rect = new ArrowLine([x1,y1,x2,y2]);
                    opt = {...options,
                        arrowMode:"prev",
                    };
                    opt.x2 = x2;
                    opt.y2 = y2;
                    break;
                case "arrow-right":
                    //结束箭头线
                    rect = new ArrowLine([x1,y1,x2,y2]);
                    opt = {...options,
                        arrowMode:"next",
                    };
                    opt.x2 = x2;
                    opt.y2 = y2;
                    break;
                case "arrows-alt":
                    //双向箭头线
                    rect = new ArrowLine([x1,y1,x2,y2]);
                    opt = {...options,
                        arrowMode:"all",
                    };
                    opt.x2 = x2;
                    opt.y2 = y2;
                    break;
                case "minus-square-o":
                    //矩形
                    rect = new fabric.Rect();
                    opt = {...options};
                    opt.left = Math.min(x2, x1);
                    opt.top = Math.min(y2, y1);
                    opt.width = width;
                    opt.height = height;
                    break;
                case "double-left":
                    //棱形
                    rect = new fabric.Rect();
                    opt = {...options};
                    opt.left = x1;
                    opt.top = y1;
                    opt.width = length;
                    opt.height = length;
                    opt.angle = this.__calcAngle(this.start, event.pointer) - 45;
                    opt.originX = "center";
                    opt.originY = "center";
                    break;
                case "menu-fold":
                    //平行四边形
                    points = [{x: x1, y: y1}, {x: x1 + height, y: y2}, {x: x2, y: y2}, {x: x2 - height, y: y1}];
                    rect = new fabric.Polygon(points);
                    opt = {...options};
                    opt.points = points;
                    create = 1;
                    break;
                case "up-square-o":
                    //梯形
                    points = [{x: x1, y: y1}, {x: x1 - height, y: y2}, {x: x2, y: y2}, {x: x2 - height, y: y1}];
                    rect = new fabric.Polygon(points);
                    opt = {...options};
                    opt.points = points;
                    create = 1;
                    break;
                case "minus-circle-o":
                    //圆
                    rect = new fabric.Circle();
                    opt = {...options, ...circleOptions};
                    opt.left = x1;
                    opt.top = y1;
                    opt.radius = radius;
                    opt.originX = "center";
                    opt.originY = "center";
                    break;
                case "info-circle-o":
                    //椭圆
                    // rect = new fabric.Ellipse();
                    // opt = {...options, ...circleOptions};
                    // opt.left = Math.min(x2, x1);
                    // opt.top = Math.min(y2, y1);
                    // opt.rx = width / 2;
                    // opt.ry = height / 2;
                    break;
                case "up-circle-o":
                    //等边三角形
                    angle = this.__calcAngle(this.start, event.pointer);
                    points = this.__calcPointsByTriangle(this.start,radius,angle);
                    rect = new fabric.Polygon(points);
                    opt = {...options};
                    opt.points = points;
                    opt.left = x1;
                    opt.top = y1;
                    opt.width = radius * 2;
                    opt.height = radius * 2;
                    opt.originX = "center";
                    opt.originY = "center";
                    break;
                case "warning":
                    //等腰三角形
                    rect = new fabric.Triangle();
                    opt = {...options};
                    opt.left = Math.min(x2, x1);
                    opt.top = Math.min(y2, y1);
                    opt.width = width;
                    opt.height = height;
                    opt.flipY = y1 > y2;
                    opt.flipX = x1 > x2;
                    break;
                case "caret-left":
                    //直角三角形
                    points = [{x: x1, y: y1}, {x: x1, y: y2}, {x: x2, y: y2}];
                    rect = new fabric.Polygon(points);
                    opt = {...options};
                    opt.points = points;
                    create = 1;
                    break;
                case "star-o":
                    //五角星
                    angle = this.__calcAngle(this.start, event.pointer);
                    points = this.__calcPointsByStar(this.start,radius,angle);
                    rect = new fabric.Polygon(points);
                    opt = {...options};
                    opt.points = points;
                    opt.left = x1;
                    opt.top = y1;
                    opt.width = radius * 2;
                    opt.height = radius * 2;
                    opt.originX = "center";
                    opt.originY = "center";
                    break;
                case "home":
                    //五边形
                    angle = this.__calcAngle(this.start, event.pointer);
                    points = this.__calcPointsByPentagon(this.start,radius,angle);
                    rect = new fabric.Polygon(points);
                    opt = {...options};
                    opt.points = points;
                    opt.left = x1;
                    opt.top = y1;
                    opt.width = radius * 2;
                    opt.height = radius * 2;
                    opt.originX = "center";
                    opt.originY = "center";
                    break;
                case "setting":
                    //六边形
                    angle = this.__calcAngle(this.start, event.pointer);
                    points = this.__calcPointsByHexagon(this.start,radius,angle);
                    rect = new fabric.Polygon(points);
                    opt = {...options};
                    opt.points = points;
                    opt.left = x1;
                    opt.top = y1;
                    opt.width = radius * 2;
                    opt.height = radius * 2;
                    opt.originX = "center";
                    opt.originY = "center";
                    break;
                case "form":
                    //文本
                    create = false;
                    break;
                case "tag-o":
                    //橡皮擦
                    break;
                default:
                    break;
            }
            if (create) {
                if (create === 1) {
                    this.instance && canvas.remove(this.instance);
                    this.instance = rect;
                    this.instance.set(opt);
                    canvas.add(this.instance);
                } else {
                    if (this.instance) {
                        this.instance.set({...opt}).setCoords();
                        canvas.renderAll();
                    } else {
                        this.instance = rect;
                        this.instance.set({...opt});
                        canvas.add(this.instance);
                    }
                }
            }
            this.end = event.pointer;
        } else if (activeMenu === "swap") {
            //自定义形状
            // this.polygon.onMouseMove(event.pointer, canvas, options);
        }
    }
    public mouseUp = (activeMenu: any, changeCanvas: any, canvas: any, widgetMenu: any) => {
        if (this.start) {
            const {options, fontOptions} = widgetMenu;
            const x1 = this.start.x, y1 = this.start.y;
            let rect = null, opt = {};
            switch (activeMenu) {
                case "minus":
                    //直线
                    changeCanvas();
                    break;
                case "arrow-left":
                    //起始箭头线
                    changeCanvas();
                    break;
                case "arrow-right":
                    //结束箭头线
                    changeCanvas();
                    break;
                case "arrows-alt":
                    //双向箭头线
                    changeCanvas();
                    break;
                case "minus-square-o":
                    //矩形
                    changeCanvas();
                    break;
                case "double-left":
                    //棱形
                    changeCanvas();
                    break;
                case "menu-fold":
                    //平行四边形
                    changeCanvas();
                    break;
                case "up-square-o":
                    //梯形
                    changeCanvas();
                    break;
                case "minus-circle-o":
                    //圆
                    changeCanvas();
                    break;
                case "info-circle-o":
                    //椭圆
                    // changeCanvas();
                    break;
                case "up-circle-o":
                    //等边三角形
                    changeCanvas();
                    break;
                case "warning":
                    //等腰三角形
                    changeCanvas();
                    break;
                case "caret-left":
                    //直角三角形
                    changeCanvas();
                    break;
                case "star-o":
                    //五角星
                    changeCanvas();
                    break;
                case "home":
                    //五边形
                    changeCanvas();
                    break;
                case "setting":
                    //六边形
                    changeCanvas();
                    break;
                case "form":
                    //文本
                    if (!this.end) {
                        rect = new fabric.IText("");
                        opt = {...options, ...fontOptions};
                        opt.left = x1;
                        opt.top = y1;
                        rect.set(opt);
                        rect.enterEditing();
                        canvas.add(rect);
                        changeCanvas();
                    }
                    break;
                case "swap":
                    //自定义形状
                    break;
                case "tag-o":
                    //橡皮擦
                    break;
                default:
                    break;
            }
            // this.instance&&canvas.setActiveObject(this.instance);
            // this.start = "";
            // this.end = "";
            // this.instance = "";
        } else if (activeMenu === "swap") {
            //自定义形状
            // if (this.polygon.onMouseUp()) {
            //     changeCanvas();
            // }
        }
    }
    private __changeActiveMenu = (activeMenu: string, getStates: any, canvas: any, canvasAll: any, canvasBrush: any, changeStates: any) => {
        const {lineOptions} = getStates;
        canvas.discardActiveObject();
        canvas._objects.map((obj: any) => {
            if (obj.isType("i-text")) {
                obj.exitEditing();
            }
        });
        canvas.requestRenderAll();
        switch (activeMenu) {
            case "like":
                // canvas.isDrawingMode = false;
                // canvas.selection = true;
                // canvas.skipTargetFind = false;
                // canvas.defaultCursor = "default";
                new Selection(canvasAll).setEnable(true);
                break;
            case "edit":
                // canvas.isDrawingMode = true;
                // canvas.selection = false;
                // canvas.skipTargetFind = true;
                // canvas.freeDrawingBrush = canvasBrush;
                // canvas.freeDrawingBrush.color = lineOptions.color;
                // canvas.freeDrawingBrush.width = lineOptions.width;
                new Pencil(canvasAll).setEnable(true);
                break;
            case "dot-chart":
                // canvas.isDrawingMode = true;
                // canvas.selection = false;
                // canvas.skipTargetFind = true;
                // canvas.freeDrawingBrush = new fabric.PatternBrush(canvas);
                // canvas.freeDrawingBrush.color = lineOptions.color;
                // canvas.freeDrawingBrush.width = lineOptions.width;
                new Pencil(canvasAll).setEnable(true);
                break;
            case "minus":
                // canvas.isDrawingMode = false;
                // canvas.selection = false;
                // canvas.skipTargetFind = true;
                // canvas.defaultCursor = "default";
                new Line(canvasAll).setEnable(true);
                break;
            case "arrow-left":
                //起始箭头线
                // canvas.isDrawingMode = false;
                // canvas.selection = false;
                // canvas.skipTargetFind = true;
                // canvas.defaultCursor = "default";
                new Line(canvasAll, "default", "prev").setEnable(true);
                break;
            case "arrow-right":
                //结束箭头线
                // canvas.isDrawingMode = false;
                // canvas.selection = false;
                // canvas.skipTargetFind = true;
                // canvas.defaultCursor = "default";
                new Line(canvasAll, "default", "next").setEnable(true);
                break;
            case "arrows-alt":
                //双向箭头线
                // canvas.isDrawingMode = false;
                // canvas.selection = false;
                // canvas.skipTargetFind = true;
                // canvas.defaultCursor = "default";
                new Line(canvasAll, "default", "all").setEnable(true);
                break;
            case "minus-square-o":
                //矩形
                // canvas.isDrawingMode = false;
                // canvas.selection = false;
                // canvas.skipTargetFind = true;
                // canvas.defaultCursor = "default";
                new Rect(canvasAll).setEnable(true);
                break;
            case "double-left":
                //棱形
                // canvas.isDrawingMode = false;
                // canvas.selection = false;
                // canvas.skipTargetFind = true;
                // canvas.defaultCursor = "default";
                new Square(canvasAll).setEnable(true);
                break;
            case "menu-fold":
                //平行四边形
                // canvas.isDrawingMode = false;
                // canvas.selection = false;
                // canvas.skipTargetFind = true;
                // canvas.defaultCursor = "default";
                new Rhomboid(canvasAll).setEnable(true);
                break;
            case "up-square-o":
                //梯形
                // canvas.isDrawingMode = false;
                // canvas.selection = false;
                // canvas.skipTargetFind = true;
                // canvas.defaultCursor = "default";
                new Trapezoid(canvasAll).setEnable(true);
                break;
            case "minus-circle-o":
                //圆形
                // canvas.isDrawingMode = false;
                // canvas.selection = false;
                // canvas.skipTargetFind = true;
                // canvas.defaultCursor = "default";
                new Circle(canvasAll).setEnable(true);
                break;
            case "info-circle-o":
                //椭圆
                // canvas.isDrawingMode = false;
                // canvas.selection = false;
                // canvas.skipTargetFind = true;
                // canvas.defaultCursor = "default";
                new Ellipse(canvasAll).setEnable(true);
                break;
            case "up-circle-o":
                //等边三角形
                // canvas.isDrawingMode = false;
                // canvas.selection = false;
                // canvas.skipTargetFind = true;
                // canvas.defaultCursor = "default";
                new EquilateralTriangle(canvasAll).setEnable(true);
                break;
            case "warning":
                //等腰三角形
                // canvas.isDrawingMode = false;
                // canvas.selection = false;
                // canvas.skipTargetFind = true;
                // canvas.defaultCursor = "default";
                new Triangle(canvasAll).setEnable(true);
                break;
            case "caret-left":
                //直角三角形
                // canvas.isDrawingMode = false;
                // canvas.selection = false;
                // canvas.skipTargetFind = true;
                // canvas.defaultCursor = "default";
                new OrthogonalTriangle(canvasAll).setEnable(true);
                break;
            case "star-o":
                //五角星
                // canvas.isDrawingMode = false;
                // canvas.selection = false;
                // canvas.skipTargetFind = true;
                // canvas.defaultCursor = "default";
                new Star(canvasAll).setEnable(true);
                break;
            case "home":
                //五边形
                // canvas.isDrawingMode = false;
                // canvas.selection = false;
                // canvas.skipTargetFind = true;
                // canvas.defaultCursor =
                new Pentagon(canvasAll).setEnable(true);
                break;
            case "setting":
                //六边形
                // canvas.isDrawingMode = false;
                // canvas.selection = false;
                // canvas.skipTargetFind = true;
                // canvas.defaultCursor = "default";
                new Hexagon(canvasAll).setEnable(true);
                break;
            case "swap":
                //自定义形状
                // canvas.isDrawingMode = false;
                // canvas.selection = false;
                // canvas.skipTargetFind = true;
                // canvas.defaultCursor = "default";
                // this.polygon = new Polygon();
                new Polygon(canvasAll).setEnable(true);
                break;
            case "form":
                // canvas.isDrawingMode = false;
                // canvas.selection = false;
                // canvas.skipTargetFind = true;
                // canvas.defaultCursor = "text";
                new Text(canvasAll).setEnable(true);
                break;
            case "tag-o":
                // canvas.isDrawingMode = false;
                // canvas.selection = false;
                // canvas.skipTargetFind = true;
                // canvas.defaultCursor = "default";
                break;
            default:
                break;
        }
        changeStates({activeMenu});
    }
    private __isActive = (activeMenu: string, children: any) => {
        let active = false;
        children.map((item: any) => {
            if (item.type === activeMenu) {
                active = true;
            }
        })
        return active;
    }
    private __changeRuler = (value: any, userMenu: any, changeStates: any) => {
        changeStates({userMenu: {...userMenu, ruler: value}});
    }
    private __changeZoom = (zoom: any, canvas: any, userMenu: any, changeStates: any) => {
        const center = canvas.getCenter();
        // canvas.setZoom(zoom / 100);
        canvas.zoomToPoint(new fabric.Point(center.left,center.top), zoom / 100);
        changeStates({userMenu: {...userMenu, zoom: zoom / 100}});
    }
    private __changePage = (value: any, type: any, changeStates: any, tabPages: any) => {
        let tabs = {...tabPages};
        tabs[type] = value;
        changeStates({tabPages: tabs});
    }
    public render(): JSX.Element {
        const {getStates, canvas, canvasBrush, changeStates} = this.props;
        const {activeMenu, tabPages, userMenu} = getStates;
        const {transitionTab, transitionCurrent} = tabPages;
        return (
            <div className="test-part-userMenu">
                {
                    this.userMenus.map((item: any) => {
                        return (
                            <span key={item.type}>
                                {
                                    item.children ?
                                        <Dropdown overlay={
                                            <Menu>
                                                {
                                                    item.children.map((menu: any) => {
                                                        return (
                                                            <Menu.Item
                                                                className={`test-part-userMenu-menu ${activeMenu === menu.type ?
                                                                    "test-part-userMenu-menu-active" : ""}`}
                                                                key={menu.type}
                                                                onClick={() => this.__changeActiveMenu(menu.type, getStates, canvas.getCanvas(), canvas, canvasBrush, changeStates)}
                                                            >
                                                                <Icon
                                                                    type={menu.type}
                                                                />
                                                                <span className="test-part-userMenu-menu-text">
                                                                    {menu.text}
                                                                </span>
                                                            </Menu.Item>
                                                        )
                                                    })
                                                }
                                            </Menu>
                                        }>
                                            <Icon
                                                className={`test-part-userMenu-item ${this.__isActive(activeMenu, item.children) ?
                                                    "test-part-userMenu-item-active" : ""}`}
                                                type={item.type}
                                            />
                                        </Dropdown>
                                        :
                                        <Icon
                                            className={`test-part-userMenu-item ${activeMenu === item.type ?
                                                "test-part-userMenu-item-active" : ""}`}
                                            type={item.type}
                                            onClick={() => this.__changeActiveMenu(item.type, getStates, canvas.getCanvas(), canvas, canvasBrush, changeStates)}
                                        />
                                }
                            </span>
                        )
                    })
                }
                <div className="test-part-userMenu-select">
                    <div className="test-part-userMenu-select-ruler">
                        <span className="test-part-userMenu-select-text">坐标显示：</span>
                        <Switch
                            size="small"
                            checkedChildren="开"
                            unCheckedChildren="关"
                            checked={userMenu.ruler}
                            onChange={(value: any) => this.__changeRuler(value, userMenu, changeStates)}
                        />
                    </div>
                    <div className="test-part-userMenu-select-tab">
                        <span className="test-part-userMenu-select-text">标签切换：</span>
                        <Select
                            size="small"
                            value={transitionTab}
                            onChange={(value: any) => this.__changePage(value, "transitionTab", changeStates, tabPages)}
                        >
                            <Option value="autoMargin">推动</Option>
                            <Option value="leftMargin">左推</Option>
                            <Option value="rightMargin">右推</Option>
                            <Option value="scale">缩放</Option>
                            <Option value="opacity">淡出</Option>
                        </Select>
                    </div>
                    <div className="test-part-userMenu-select-current">
                        <span className="test-part-userMenu-select-text">分页切换：</span>
                        <Select
                            size="small"
                            value={transitionCurrent}
                            onChange={(value: any) => this.__changePage(value, "transitionCurrent", changeStates, tabPages)}
                        >
                            <Option value="autoMargin">推动</Option>
                            <Option value="leftMargin">左推</Option>
                            <Option value="rightMargin">右推</Option>
                            <Option value="scale">缩放</Option>
                            <Option value="opacity">淡出</Option>
                        </Select>
                    </div>
                    <div className="test-part-userMenu-select-zoom">
                        <span className="test-part-userMenu-select-text">缩放比例：</span>
                        <InputNumber
                            value={userMenu.zoom*100}
                            min={0}
                            max={1000}
                            size="small"
                            precision={0}
                            formatter={(value: any) => `${value}%`}
                            parser={(value: any) => value.replace("%", "")}
                            onChange={(value: any) => {
                                !isNaN(Number(value))&&this.__changeZoom(Number(value), canvas, userMenu, changeStates)
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export {UserMenu};