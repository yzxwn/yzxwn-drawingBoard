import {fabric as Fabric} from "fabric";

class Canvas{
    private canvas: any;
    private canvasArr: any;
    private canvasBrush: any;
    private doArr: any;
    private undo: any[];
    private redo: any[];
    private activePlugin: any;
    private activeObject: any;
    private rule: any;
    private widget: any;
    constructor(selects:any, ruleDown:any, ruleMove:any, ruleUp:any){
        this.activeObject = selects;
        this.rule = {ruleDown, ruleMove, ruleUp}
    }

    public getCanvas(){
        return this.canvas;
    }

    public getCanvasBrush(){
        return this.canvasBrush;
    }

    public getActivePlugin(){
        return this.activePlugin;
    }
    public setActivePlugin(plugin: any){
        this.activePlugin = plugin;
    }

    private setNewCanvas = () => {
        this.canvas = new Fabric.Canvas("test-widget");
        this.canvas.setWidth(this.widget.clientWidth);
        this.canvas.setHeight(this.widget.clientHeight);
        this.canvasBrush = this.canvas.freeDrawingBrush;
        // this.canvas.on("path:created", (event: any) => {
        //     this.canvas.setActiveObject(event.path);//结束后选中
        //     this.canvas.renderAll();
        //     this.changeCanvas();
        // });
        this.canvas.on("object:modified", () => {
            this.changeCanvas();
        });
        this.canvas.on("selection:created", (event: any) => {
            console.log(event);
            this.activeObject(event);
        });
        this.canvas.on("selection:updated", (event: any) => {
            this.activeObject(event);
        });
        this.canvas.on("selection:cleared", () => {
            this.activeObject("");
        });
        this.canvas.on("mouse:down", (event: any) => {
            // this.userMenuDom.mouseDown(this.state.activeMenu, event, this.canvas, this.state.widgetMenu);
            // this.state.userMenu.ruler&&this.ruler.mouseDown(event.pointer);
            this.rule.ruleDown(event);
        });
        this.canvas.on("mouse:move", (event: any) => {
            // this.userMenuDom.mouseMove(this.state.activeMenu, event, this.canvas, this.state.widgetMenu);
            // this.state.userMenu.ruler&&this.ruler.mouseMove(event.pointer);
            this.rule.ruleMove(event);
        });
        this.canvas.on("mouse:up", () => {
            // this.userMenuDom.mouseUp(this.state.activeMenu, this.__changeCanvas, this.canvas, this.state.widgetMenu);
            // this.state.userMenu.ruler&&this.ruler.mouseUp();
            this.rule.ruleUp();
        });
    }

    public createCanvas = (pages: any, widget: any) => {
        this.widget = widget;
        this.setNewCanvas();
        this.redo = [];
        this.undo = [JSON.stringify(this.canvas)];
        this.canvasArr = [];
        this.doArr = [];
        pages.map((item:any) => {
            let arr = [], dos = [];
            for (let i=0;i<item.total;i++) {
                arr.push(JSON.stringify(this.canvas));
                dos.push({
                    redo: [...this.redo],
                    undo: [...this.undo],
                });
            }
            this.canvasArr.push(arr);
            this.doArr.push(dos);
        });
    }

    public updateCanvas = (newCanvas: any, widget: any) => {
        this.widget = widget;
        this.setNewCanvas();
        this.canvas.loadFromJSON(newCanvas);
    }

    public changeCanvas = () => {
        this.redo = [];
        this.undo.push(JSON.stringify(this.canvas));
    }
    public changeCanvasUndo = () => {
        if(this.undo.length > 1) {
            const action = this.undo.pop();
            this.redo.push(action);
            this.canvas.loadFromJSON(this.undo[this.undo.length - 1]);
        }
    }
    public changeCanvasRedo = () => {
        if(this.redo.length > 0) {
            const action = this.redo.pop();
            this.undo.push(action);
            this.canvas.loadFromJSON(action);
        }
    }

    public createNewCanvas = (p1: any, current1:any, p2: any, current2:any) => {
        this.canvasArr[p2][current2 - 1] = JSON.stringify(this.canvas);
        this.doArr[p2][current2 - 1] = {
            redo: this.redo,
            undo: this.undo,
        };
        this.redo = this.doArr[p1][current1 - 1].redo;
        this.undo = this.doArr[p1][current1 - 1].undo;
        return this.canvasArr[p1][current1 - 1];
    }
}

export {Canvas}