import * as React from "react";
import {fabric} from "fabric";
import { Icon, Tooltip, Upload, message } from "antd";

interface WinsMenuProps {
    canvas: any;
    changeCanvas: any;
    getStates: any;
    changeCanvasUndo: any;
    changeCanvasRedo: any;
}

interface WinsMenuStates {

}

class WinsMenu extends React.Component<WinsMenuProps, WinsMenuStates> {
    private winsMenus: any;
    private clipboard: any;
    constructor(props: any) {
        super(props);
        this.winsMenus = [
            {type: "camera-o", text: "添加图片"},
            {type: "check-circle-o", text: "全选"},
            {type: "plus-circle-o", text: "组合"},
            {type: "minus-circle-o", text: "取消组合"},
            {type: "star-o", text: "复制"},
            {type: "star", text: "粘贴"},
            {type: "delete", text: "删除"},
            {type: "arrow-left", text: "后退"},
            {type: "arrow-right", text: "前进"},
            {type: "close", text: "清空"},
            {type: "download", text: "导出图片"},
        ];
    }
    private __setWinsMenu = (winsMenu: string, canvas: any, changeCanvas: any, getStates: any, changeCanvasUndo: any, changeCanvasRedo: any) => {
        const {selects} = getStates;
        switch (winsMenu) {
            case "check-circle-o":
                canvas.discardActiveObject();
                const sel = new fabric.ActiveSelection(canvas.getObjects(), {
                    canvas: canvas,
                });
                canvas.getObjects().length&&canvas.setActiveObject(sel);
                canvas.requestRenderAll();
                break;
            case "plus-circle-o":
                if (!canvas.getActiveObject()) {
                    return;
                }
                if (canvas.getActiveObject().type !== "activeSelection") {
                    return;
                }
                canvas.getActiveObject().toGroup();
                canvas.requestRenderAll();
                break;
            case "minus-circle-o":
                if (!canvas.getActiveObject()) {
                    return;
                }
                if (canvas.getActiveObject().type !== "group") {
                    return;
                }
                canvas.getActiveObject().toActiveSelection();
                canvas.requestRenderAll();
                break;
            case "star-o":
                canvas.getActiveObject()&&canvas.getActiveObject().clone((cloned: any) => {
                    this.clipboard = cloned;
                });
                break;
            case "star":
                this.clipboard&&this.clipboard.clone((clonedObj: any) => {
                    canvas.discardActiveObject();
                    clonedObj.set({
                        left: clonedObj.left + 10,
                        top: clonedObj.top + 10,
                        evented: true,
                    });
                    if (clonedObj.type === "activeSelection") {
                        clonedObj.canvas = canvas;
                        clonedObj.forEachObject((obj: any) => {
                            canvas.add(obj);
                        });
                        clonedObj.setCoords();
                    } else {
                        canvas.add(clonedObj);
                    }
                    this.clipboard.top += 10;
                    this.clipboard.left += 10;
                    canvas.setActiveObject(clonedObj);
                    canvas.requestRenderAll();
                    changeCanvas();
                });
                break;
            case "delete":
                if(selects) {
                    selects.selected.map((item: any) => {
                        canvas.remove(item);
                        // canvas.fxRemove(item);
                    });
                    changeCanvas();
                }
                break;
            case "arrow-left":
                changeCanvasUndo();
                break;
            case "arrow-right":
                changeCanvasRedo();
                break;
            case "close":
                canvas.clear();
                changeCanvas();
                break;
            case "download":
                const imgURL = canvas.toDataURL("image/png");
                const a = document.createElement("a");
                // 创建一个单击事件
                const event = new MouseEvent("click");
                // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
                a.download = "kxt-fabric-" + new Date().getTime();
                // 将生成的URL设置为a.href属性
                a.href = imgURL;
                // 触发a的单击事件
                a.dispatchEvent(event);
                break;
            default:
                break;
        }
    }
    private __beforeUpload = (file: any, canvas: any, changeCanvas: any) => {
        const isJPG = file.type === 'image/jpeg';
        if (!isJPG) {
            message.warning('只支持上传jpg格式图片!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.warning('图片大小不能超过2MB!');
        }
        fabric.Image.fromURL(window.URL.createObjectURL(file), (oImg: any) => {
            canvas.centerObject(oImg);
            // canvas.fxCenterObjectH(oImg);
            // canvas.fxCenterObjectV(oImg);
            canvas.add(oImg);
        });
        changeCanvas();
        return false;
    }
    public render(): JSX.Element {
        const {getStates, canvas, changeCanvas, changeCanvasUndo, changeCanvasRedo} = this.props;
        return (
            <div className="test-part-winsMenu">
                <div className="test-part-winsMenu-menu">
                    {
                        this.winsMenus.map((item: any) => {
                            return (
                                item.type === "camera-o" ?
                                <Upload key={item.type}
                                    showUploadList={false}
                                    beforeUpload={(file: any) => this.__beforeUpload(file, canvas, changeCanvas)}
                                >
                                    <Tooltip title={item.text} placement="left">
                                        <Icon
                                            className={`test-part-winsMenu-menu-item`}
                                            type={item.type}
                                            onClick={() => {this.__setWinsMenu(item.type, canvas, changeCanvas, getStates, changeCanvasUndo, changeCanvasRedo)}}
                                        />
                                    </Tooltip>
                                </Upload>
                                :
                                <Tooltip title={item.text} key={item.type} placement="left">
                                    <Icon
                                        className={`test-part-winsMenu-menu-item`}
                                        type={item.type}
                                        onClick={() => {this.__setWinsMenu(item.type, canvas, changeCanvas, getStates, changeCanvasUndo, changeCanvasRedo)}}
                                    />
                                </Tooltip>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}

export {WinsMenu};