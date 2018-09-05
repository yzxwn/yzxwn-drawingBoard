import * as React from "react";
import Scrollbars from 'react-custom-scrollbars';
import {TransitionGroup, CSSTransition} from "react-transition-group";
import {Test01Page} from "./Test01Page";
import {DocumentMenu} from "./part/documentMenu";
import {UserMenu} from "./part/userMenu";
import {WidgetMenu} from "./part/widgetMenu";
import {WinsMenu} from "./part/winsMenu";
import {Ruler} from "./part/ruler";
import {Canvas} from "../components/canvas";
import {Selection} from "../components/shape/selection/Selection";
import "../style/TestPage.less";
import "../style/transition.less";
import "../style/Test01Page.less";
import "../style/components/tool.less";

interface Test01PageStates {
    activeMenu: string;
    selects: boolean;
    userMenu: object;
    widgetMenu: object;
    tabPages: object;
}

class TestPage extends React.Component<{}, Test01PageStates> {
    private widget: any;
    private ruler: any;
    private con1: any;
    private canvas: any;
    private newCanvas: any;
    private userMenuDom: any;
    constructor(props: any) {
        super(props);
        this.state = {
            activeMenu: "",
            selects: "",
            userMenu: {
                ruler: true,
                zoom: 1,
            },
            widgetMenu: {
                actives: "",//modalMenu
                color: "",
                options: {
                    fill: "#eeb324",
                    stroke: "red",
                    strokeWidth: 1,
                    opacity: 1,
                    angle: 0,
                    scaleX: 1,
                    scaleY: 1,
                },
                circleOptions: {
                    radius: 50,
                    rx:100,
                    ry:50,
                },
                rectOptions: {
                    angle: 45,
                },
                fontOptions: {
                    fontFamily: "SimSun",
                    fontSize: 30,
                    editingBorderColor: "#f66a35",
                },
                lineOptions: {
                    color: "red",
                    width: 1,
                },
            },
            tabPages: {
                activeKey: "0",
                pages: [
                    { text: '白板', key: '0', current: 1, total: 1 },
                    { text: 'Tab 1', key: '1', current: 1, total: 6, contend: ["01.jpg","02.jpg","03.jpg","04.jpg","05.png","02.jpg"], close: true },
                    { text: 'Tab 2', key: '2', current: 3, total: 5, contend: ["03.jpg","01.jpg","02.jpg","05.png","01.jpg"], close: true },
                    { text: 'Tab 3', key: '3', current: 2, total: 4, contend: ["04.jpg","01.jpg","03.jpg","02.jpg"], close: true },
                ],
                activeChange: "Tab",
                transitionTab: "scale",
                transitionCurrent: "autoMargin",
                transitionDirection: "left",
                transitionTimeout: 400,
            },
        }
    }
    // private __setNewCanvas = () => {
    //     this.canvas = new fabric.Canvas("test-widget");
    //     this.canvas.setWidth(this.widget.clientWidth);
    //     this.canvas.setHeight(this.widget.clientHeight);
    //     this.canvasBrush = this.canvas.freeDrawingBrush;
    //     this.canvas.on("path:created", (event: any) => {
    //         this.canvas.setActiveObject(event.path);//结束后选中
    //         this.canvas.renderAll();
    //         this.__changeCanvas();
    //     });
    //     this.canvas.on("object:modified", () => {
    //         this.__changeCanvas();
    //     });
    //     this.canvas.on("selection:created", (event: any) => {
    //         console.log(event);
    //         this.__changeStates({selects: event});
    //     });
    //     this.canvas.on("selection:updated", (event: any) => {
    //         this.__changeStates({selects: event});
    //     });
    //     this.canvas.on("selection:cleared", () => {
    //         this.__changeStates({selects: ""});
    //     });
    //     this.canvas.on("mouse:down", (event: any) => {
    //         this.userMenuDom.mouseDown(this.state.activeMenu, event, this.canvas, this.state.widgetMenu);
    //         this.state.userMenu.ruler&&this.ruler.mouseDown(event.pointer);
    //     });
    //     this.canvas.on("mouse:move", (event: any) => {
    //         this.userMenuDom.mouseMove(this.state.activeMenu, event, this.canvas, this.state.widgetMenu);
    //         this.state.userMenu.ruler&&this.ruler.mouseMove(event.pointer);
    //     });
    //     this.canvas.on("mouse:up", () => {
    //         this.userMenuDom.mouseUp(this.state.activeMenu, this.__changeCanvas, this.canvas, this.state.widgetMenu);
    //         this.state.userMenu.ruler&&this.ruler.mouseUp();
    //     });
    // }
    public componentDidMount() {
        // this.__setNewCanvas();
        // this.redo = [];
        // this.undo = [JSON.stringify(this.canvas)];
        // this.canvasArr = [];
        // this.doArr = [];
        // this.state.tabPages.pages.map((item:any) => {
        //     let arr = [], dos = [];
        //     for (let i=0;i<item.total;i++) {
        //         arr.push(JSON.stringify(this.canvas));
        //         dos.push({
        //             redo: [...this.redo],
        //             undo: [...this.undo],
        //         });
        //     }
        //     this.canvasArr.push(arr);
        //     this.doArr.push(dos);
        // });
        const selects = (events: any)=>this.setState({selects: events});
        const ruleDown = (event: any)=>this.state.userMenu.ruler&&this.ruler.mouseDown(event.pointer);
        const ruleMove = (event: any)=>this.state.userMenu.ruler&&this.ruler.mouseMove(event.pointer);
        const ruleUp = ()=>this.state.userMenu.ruler&&this.ruler.mouseUp();
        this.canvas = new Canvas(selects, ruleDown, ruleMove, ruleUp);
        this.canvas.createCanvas(this.state.tabPages.pages, this.widget);
        this.setState({});
    }
    public componentDidUpdate() {
        if (this.newCanvas) {
            // this.__setNewCanvas();
            // this.canvas.loadFromJSON(this.newCanvas);
            this.canvas.updateCanvas(this.newCanvas, this.widget);
            const arr = this.con1.getElementsByTagName("img").length;
            let current = 0;
            for (let i=0;i<arr;i++) {
                this.con1.getElementsByTagName("img")[i].addEventListener('load',() => {
                    current += 1;
                    if (current === arr) {
                        this.canvas.getCanvas().setHeight(this.con1.offsetHeight);
                    }
                },false);
            }
            this.newCanvas = "";
            let widgetMenu = {...this.state.widgetMenu};
            widgetMenu.actives = "";
            //初始化选择
            new Selection(this.canvas).setEnable(true);
            this.setState({
                activeMenu: "like",
                widgetMenu
            });
        } else if (!this.state.activeMenu) {
            new Selection(this.canvas).setEnable(true);
            this.setState({
                activeMenu: "like",
            });
        }
    }
    // private __changeCanvas = () => {
    //     this.redo = [];
    //     this.undo.push(JSON.stringify(this.canvas));
    // }
    // private __changeCanvasUndo = () => {
    //     if(this.undo.length > 1) {
    //         const action = this.undo.pop();
    //         this.redo.push(action);
    //         this.canvas.loadFromJSON(this.undo[this.undo.length - 1]);
    //     }
    // }
    // private __changeCanvasRedo = () => {
    //     if(this.redo.length > 0) {
    //         const action = this.redo.pop();
    //         this.undo.push(action);
    //         this.canvas.loadFromJSON(action);
    //     }
    // }
    private __changeStates = (states: any) => {
        if(states.tabPages) {
            let p1 = 0, current1 = 1;
            states.tabPages.pages.map((page: any, index: any) => {
                if(states.tabPages.activeKey === page.key) {
                    p1 = index;
                    current1 = page.current;
                }
            });
            let p2 = 0, current2 = 1;
            this.state.tabPages.pages.map((page: any, index: any) => {
                if(this.state.tabPages.activeKey === page.key) {
                    p2 = index;
                    current2 = page.current;
                }
            });
            // this.canvasArr[p2][current2 - 1] = JSON.stringify(this.canvas);
            // this.doArr[p2][current2 - 1] = {
            //     redo: this.redo,
            //     undo: this.undo,
            // };
            // this.redo = this.doArr[p1][current1 - 1].redo;
            // this.undo = this.doArr[p1][current1 - 1].undo;
            // this.newCanvas = this.canvasArr[p1][current1 - 1];
            this.newCanvas = this.canvas.createNewCanvas(p1, current1, p2, current2);
        }
        this.setState({
            ...states,
        })
    }
    public render(): JSX.Element {
        let current = 1, transition = this.state.tabPages[`transition${this.state.tabPages.activeChange}`];
        this.state.tabPages.pages.map((page: any) => {
            if(this.state.tabPages.activeKey === page.key) {
                if(page.current) {
                    if (page.contend) {
                        current = page.current;
                    }
                }
            }
        });
        if (transition === "autoMargin") {
            transition = this.state.tabPages.transitionDirection + "Margin";
        }
        // this.canvas&&console.log(this.canvas.getCanvas())
        return (
            <div className="test-contend">
                <div className="test-contend-head">
                    <div className="test-contend-head-userMenu">
                        {/*<UserMenu*/}
                            {/*ref={(r: any) => this.userMenuDom = r}*/}
                            {/*getStates={{tabPages: this.state.tabPages, activeMenu: this.state.activeMenu, userMenu: this.state.userMenu, ...this.state.widgetMenu}}*/}
                            {/*canvas={this.canvas}*/}
                            {/*canvasBrush={this.canvasBrush}*/}
                            {/*changeStates={this.__changeStates}*/}
                        {/*/>*/}
                        {this.canvas ?
                        <UserMenu
                            ref={(r: any) => this.userMenuDom = r}
                            getStates={{tabPages: this.state.tabPages, activeMenu: this.state.activeMenu, userMenu: this.state.userMenu, ...this.state.widgetMenu}}
                            canvas={this.canvas}
                            canvasBrush={this.canvas.getCanvasBrush()}
                            changeStates={this.__changeStates}
                        /> : null}
                    </div>
                    <div className="test-contend-head-widgetMenu">
                        {/*<WidgetMenu*/}
                            {/*canvas={this.canvas}*/}
                            {/*getStates={{selects: this.state.selects, ...this.state.widgetMenu}}*/}
                            {/*changeStates={(value: any) => this.__changeStates({widgetMenu: {...this.state.widgetMenu, ...value}})}*/}
                            {/*changeCanvas={this.__changeCanvas}*/}
                        {/*/>*/}
                        {this.canvas ?
                        <WidgetMenu
                            canvas={this.canvas}
                            getStates={{selects: this.state.selects, ...this.state.widgetMenu}}
                            changeStates={(value: any) => this.__changeStates({widgetMenu: {...this.state.widgetMenu, ...value}})}
                        /> : null}
                    </div>
                </div>
                <div className="test-contend-con">
                    <div className="test-contend-con-ruler">
                        <Ruler ref={(r: any) => this.ruler = r}/>
                    </div>
                    <Scrollbars autoHide>
                        <TransitionGroup>
                            <CSSTransition
                                key={this.state.tabPages.activeKey + current}
                                classNames={`transition-${transition}`}
                                timeout={{ enter: this.state.tabPages.transitionTimeout, exit: this.state.tabPages.transitionTimeout }}
                            >
                                <div className="test-contend-con-transition">
                                    <div className="test-contend-con-con1" ref={(r: any) => this.con1 = r}>
                                        <Test01Page
                                            tabPages={this.state.tabPages}
                                        />
                                    </div>
                                    <div className="test-contend-con-widget" ref={(r: any) => this.widget = r}>
                                        <canvas id="test-widget">

                                        </canvas>
                                    </div>
                                </div>
                            </CSSTransition>
                        </TransitionGroup>
                        {/*<CSSTransition*/}
                        {/*transitionName={`transition-${transition}`}*/}
                        {/*transitionEnterTimeout={this.state.tabPages.transitionTimeout}*/}
                        {/*transitionLeaveTimeout={this.state.tabPages.transitionTimeout}*/}
                        {/*>*/}
                            {/*<div key={this.state.tabPages.activeKey + current} className="test-contend-con-transition">*/}
                                {/*<div className="test-contend-con-con1" ref={(r: any) => this.con1 = r}>*/}
                                    {/*<Test01Page*/}
                                        {/*tabPages={this.state.tabPages}*/}
                                    {/*/>*/}
                                {/*</div>*/}
                                {/*<div className="test-contend-con-widget" ref={(r: any) => this.widget = r}>*/}
                                    {/*<canvas id="test-widget">*/}

                                    {/*</canvas>*/}
                                {/*</div>*/}
                            {/*</div>*/}
                        {/*</CSSTransition>*/}
                    </Scrollbars>
                </div>
                <div className="test-contend-right">
                    {/*<WinsMenu*/}
                        {/*canvas={this.canvas}*/}
                        {/*getStates={{selects: this.state.selects}}*/}
                        {/*changeCanvas={this.__changeCanvas}*/}
                        {/*changeCanvasUndo={this.__changeCanvasUndo}*/}
                        {/*changeCanvasRedo={this.__changeCanvasRedo}*/}
                    {/*/>*/}
                    {this.canvas ?
                    <WinsMenu
                        canvas={this.canvas.getCanvas()}
                        getStates={{selects: this.state.selects}}
                        changeCanvas={this.canvas.changeCanvas}
                        changeCanvasUndo={this.canvas.changeCanvasUndo}
                        changeCanvasRedo={this.canvas.changeCanvasRedo}
                    /> : null}
                </div>
                <div className="test-contend-bottom">
                    <DocumentMenu
                        changeStates={(value: any) => this.__changeStates({tabPages: {...this.state.tabPages, ...value}})}
                        getTabPages={this.state.tabPages}
                    />
                </div>
            </div>
        );
    }
}

export {TestPage}