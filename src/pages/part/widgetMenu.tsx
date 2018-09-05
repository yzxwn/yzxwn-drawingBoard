import * as React from "react";
import { InputNumber, Select } from "antd";
import Scrollbars from 'react-custom-scrollbars';
import {ColorModal} from "../../components/tool/components/colorModal";

const {Option} = Select;
const className = "test-part-widgetMenu";

interface WidgetMenuProps {
    canvas: any;
    getStates: any;
    changeStates: any;
}

interface WidgetMenuStates {

}

class WidgetMenu extends React.Component<WidgetMenuProps, WidgetMenuStates> {
    private __setModalMenu = (modalMenu: any, changeStates: any) => {
        changeStates({
            actives: modalMenu,
            color: modalMenu,
        });
    }
    private __getOptions = (modalMenu: any, getStates: any, canvasEngine: any) => {
        const {selects} = getStates;
        const options = canvasEngine.getActivePlugin() ? canvasEngine.getActivePlugin().getOptions() : {};
        let option: any = null;
        if (selects) {
            option = selects.selected[0][modalMenu];
            selects.selected.map((item: any) => {
                if (item[modalMenu] !== option) {
                    option = null;
                }
            });
        } else {
            option = options[modalMenu];
        }
        return option;
    }
    private __changeOptions = (opt: any, changeStates: any, getStates:any, canvasEngine:any, canvas:any, modalMenu: any, color?: any) => {
        const {selects} = getStates;
        if(selects) {
            selects.selected.map((item: any) => {
                item.set({
                    [modalMenu]: opt,
                }).setCoords();
            });
            canvasEngine.changeCanvas();
            canvas.renderAll();
        } else {
            const ops = {};
            ops[modalMenu] = opt;
            canvasEngine.getActivePlugin().setOptions(ops);
        }
        changeStates({
            actives: modalMenu,
            color: color ? modalMenu : false,
        });
    }
    private __closeModal = (changeStates: any) => {
        changeStates({
            color: "",
        });
    }
    public render(): JSX.Element {
        const {changeStates, getStates, canvas} = this.props;
        let options = canvas.getActivePlugin() ? canvas.getActivePlugin().getOptions() : {};
        if (getStates.selects) {
            let option = {...getStates.selects.selected[0]};
            getStates.selects.selected.map((item: any) => {
                Object.keys(option).map((it: any) => {
                    if (!item.hasOwnProperty(it)) {
                        delete option[it];
                    }
                });
            });
            options = option;
        }
        return (
            <div className={className}>
                <Scrollbars autoHide>
                    <div className={`${className}-allMenu`}>
                        {
                            options.hasOwnProperty("fill") ?
                                <div className={`${className}-item`}>
                                    <span className={`${className}-item-text`}>填充色: </span>
                                    <span
                                        className={`${className}-item-color`}
                                        style={{backgroundColor: this.__getOptions("fill", getStates, canvas)}}
                                        onClick={() => {this.__setModalMenu("fill", changeStates)}}
                                    >
                                    </span>
                                </div> : null
                        }
                        {
                            options.hasOwnProperty("stroke") ?
                                <div className={`${className}-item`}>
                                    <span className={`${className}-item-text`}>边框色: </span>
                                        <span
                                            className={`${className}-item-color`}
                                            style={{backgroundColor: this.__getOptions("stroke", getStates, canvas)}}
                                            onClick={() => {this.__setModalMenu("stroke", changeStates)}}
                                        >
                                    </span>
                                </div> : null
                        }
                        {
                            options.hasOwnProperty("strokeWidth") ?
                                <div className={`${className}-item`}>
                                    <span className={`${className}-item-text`}>边框宽: </span>
                                    <span className={`${className}-item-strokeWidth`}>
                                        <InputNumber
                                            min={0}
                                            max={100}
                                            size="small"
                                            value={this.__getOptions("strokeWidth", getStates, canvas)}
                                            onChange={(value: any) => {
                                                !isNaN(Number(value))&&this.__changeOptions(Number(value), changeStates, getStates, canvas, canvas.getCanvas(), "strokeWidth");
                                            }}
                                        />
                                    </span>
                                </div> : null
                        }
                        {
                            options.hasOwnProperty("radius") ?
                                <div className={`${className}-item`}>
                                    <span className={`${className}-item-text`}>半径: </span>
                                    <span className={`${className}-item-radius`}>
                                        <InputNumber
                                            min={0}
                                            max={9999}
                                            size="small"
                                            value={this.__getOptions("radius", getStates, canvas)}
                                            onChange={(value: any) => {
                                                !isNaN(Number(value))&&this.__changeOptions(Number(value), changeStates, getStates, canvas, canvas.getCanvas(), "radius");
                                            }}
                                        />
                                    </span>
                                </div> : null
                        }
                        {
                            options.hasOwnProperty("height") ?
                                <div className={`${className}-item`}>
                                    <span className={`${className}-item-text`}>长度: </span>
                                    <span className={`${className}-item-height`}>
                                        <InputNumber
                                            min={0}
                                            max={9999}
                                            size="small"
                                            value={this.__getOptions("height", getStates, canvas)}
                                            onChange={(value: any) => {
                                                !isNaN(Number(value))&&this.__changeOptions(Number(value), changeStates, getStates, canvas, canvas.getCanvas(), "height");
                                            }}
                                        />
                                    </span>
                                </div> : null
                        }
                        {
                            options.hasOwnProperty("width") ?
                                <div className={`${className}-item`}>
                                    <span className={`${className}-item-text`}>宽度: </span>
                                    <span className={`${className}-item-width`}>
                                        <InputNumber
                                            min={0}
                                            max={9999}
                                            size="small"
                                            value={this.__getOptions("width", getStates, canvas)}
                                            onChange={(value: any) => {
                                                !isNaN(Number(value))&&this.__changeOptions(Number(value), changeStates, getStates, canvas, canvas.getCanvas(), "width");
                                            }}
                                        />
                                    </span>
                                </div> : null
                        }
                        {
                            options.hasOwnProperty("rx") ?
                                <div className={`${className}-item`}>
                                    <span className={`${className}-item-text`}>椭圆X半径: </span>
                                    <span className={`${className}-item-rx`}>
                                        <InputNumber
                                            min={0}
                                            max={9999}
                                            size="small"
                                            value={this.__getOptions("rx", getStates, canvas)}
                                            onChange={(value: any) => {
                                                !isNaN(Number(value))&&this.__changeOptions(Number(value), changeStates, getStates, canvas, canvas.getCanvas(), "rx");
                                            }}
                                        />
                                    </span>
                                </div> : null
                        }
                        {
                            options.hasOwnProperty("ry") ?
                                <div className={`${className}-item`}>
                                    <span className={`${className}-item-text`}>椭圆Y半径: </span>
                                    <span className={`${className}-item-ry`}>
                                        <InputNumber
                                            min={0}
                                            max={9999}
                                            size="small"
                                            value={this.__getOptions("ry", getStates, canvas)}
                                            onChange={(value: any) => {
                                                !isNaN(Number(value))&&this.__changeOptions(Number(value), changeStates, getStates, canvas, canvas.getCanvas(), "ry");
                                            }}
                                        />
                                    </span>
                                </div> : null
                        }
                        {
                            options.hasOwnProperty("fontFamily") ?
                                <div className={`${className}-item`}>
                                    <span className={`${className}-item-text`}>字体: </span>
                                    <span className={`${className}-item-fontFamily`}>
                                        <Select
                                            size="small"
                                            value={this.__getOptions("fontFamily", getStates, canvas)}
                                            onChange={(value: any) => {
                                                this.__changeOptions(value, changeStates, getStates, canvas, canvas.getCanvas(), "fontFamily");
                                            }}
                                        >
                                            <Option value="SimSun">宋体</Option>
                                            <Option value="SimHei">黑体</Option>
                                            <Option value="Microsoft Yahei">微软雅黑</Option>
                                            <Option value="KaiTi">楷体</Option>
                                            <Option value="NSimSun">新宋体</Option>
                                            <Option value="FangSong">仿宋</Option>
                                        </Select>
                                    </span>
                                </div> : null
                        }
                        {
                            options.hasOwnProperty("fontSize") ?
                                <div className={`${className}-item`}>
                                    <span className={`${className}-item-text`}>字体大小: </span>
                                    <span className={`${className}-item-fontSize`}>
                                        <InputNumber
                                            min={0}
                                            max={100}
                                            size="small"
                                            value={this.__getOptions("fontSize", getStates, canvas)}
                                            onChange={(value: any) => {
                                                !isNaN(Number(value))&&this.__changeOptions(Number(value), changeStates, getStates, canvas, canvas.getCanvas(), "fontSize");
                                            }}
                                        />
                                    </span>
                                </div> : null
                        }
                        {/*{*/}
                            {/*options.hasOwnProperty("color") ?*/}
                                {/*<div className={`${className}-item`}>*/}
                                    {/*<span className={`${className}-item-text`}>线条颜色: </span>*/}
                                    {/*<span*/}
                                        {/*className={`${className}-item-color`}*/}
                                        {/*style={{backgroundColor: this.__getOptions("color", getStates, canvas)}}*/}
                                        {/*onClick={() => {this.__setModalMenu("color", changeStates)}}*/}
                                    {/*/>*/}
                                {/*</div> : null*/}
                        {/*}*/}
                        {/*{*/}
                            {/*options.hasOwnProperty("width") ?*/}
                                {/*<div className={`${className}-item`}>*/}
                                    {/*<span className={`${className}-item-text`}>线宽: </span>*/}
                                    {/*<span className={`${className}-item-width`}>*/}
                                        {/*<InputNumber*/}
                                            {/*min={0}*/}
                                            {/*max={100}*/}
                                            {/*size="small"*/}
                                            {/*value={this.__getOptions("width", getStates, canvas)}*/}
                                            {/*onChange={(value: any) => {*/}
                                                {/*!isNaN(Number(value))&&this.__changeOptions(Number(value), changeStates, getStates, canvas, canvas.getCanvas(), "width");*/}
                                            {/*}}*/}
                                        {/*/>*/}
                                    {/*</span>*/}
                                {/*</div> : null*/}
                        {/*}*/}
                        {
                            options.hasOwnProperty("opacity") ?
                                <div className={`${className}-item`}>
                                    <span className={`${className}-item-text`}>透明度: </span>
                                    <span className={`${className}-item-opacity`}>
                                        <InputNumber
                                            min={0}
                                            max={1}
                                            step={0.1}
                                            size="small"
                                            value={this.__getOptions("opacity", getStates, canvas)}
                                            onChange={(value: any) => {
                                                !isNaN(Number(value))&&this.__changeOptions(Number(value), changeStates, getStates, canvas, canvas.getCanvas(), "opacity");
                                            }}
                                        />
                                    </span>
                                </div> : null
                        }
                        {
                            options.hasOwnProperty("angle") ?
                                <div className={`${className}-item`}>
                                    <span className={`${className}-item-text`}>旋转角度: </span>
                                    <span className={`${className}-item-angle`}>
                                        <InputNumber
                                            min={-180}
                                            max={180}
                                            size="small"
                                            value={this.__getOptions("angle", getStates, canvas)}
                                            onChange={(value: any) => {
                                                !isNaN(Number(value))&&this.__changeOptions(Number(value), changeStates, getStates, canvas, canvas.getCanvas(), "angle");
                                            }}
                                        />
                                    </span>
                                </div> : null
                        }
                        {
                            options.hasOwnProperty("scaleX") ?
                                <div className={`${className}-item`}>
                                    <span className={`${className}-item-text`}>X轴缩放: </span>
                                    <span className={`${className}-item-scaleX`}>
                                        <InputNumber
                                            min={0}
                                            max={1000}
                                            step={0.1}
                                            size="small"
                                            value={this.__getOptions("scaleX", getStates, canvas)}
                                            onChange={(value: any) => {
                                                !isNaN(Number(value))&&this.__changeOptions(Number(value), changeStates, getStates, canvas, canvas.getCanvas(), "scaleX");
                                            }}
                                        />
                                    </span>
                                </div> : null
                        }
                        {
                            options.hasOwnProperty("scaleY") ?
                                <div className={`${className}-item`}>
                                    <span className={`${className}-item-text`}>Y轴缩放: </span>
                                    <span className={`${className}-item-scaleY`}>
                                        <InputNumber
                                            min={0}
                                            max={1000}
                                            step={0.1}
                                            size="small"
                                            value={this.__getOptions("scaleY", getStates, canvas)}
                                            onChange={(value: any) => {
                                                !isNaN(Number(value))&&this.__changeOptions(Number(value), changeStates, getStates, canvas, canvas.getCanvas(), "scaleY");
                                            }}
                                        />
                                    </span>
                                </div> : null
                        }
                    </div>
                </Scrollbars>
                <div className={`${className}-colorModal`}>
                    {
                        getStates.color ?
                            <ColorModal
                                color = {this.__getOptions(getStates.color, getStates, canvas) || "rgba(0, 0, 0, 0)"}
                                changeColor = {(value:any) => this.__changeOptions(value, changeStates, getStates, canvas, canvas.getCanvas(), getStates.color, true)}
                                closeModal = {() => this.__closeModal(changeStates)}
                            /> : null
                    }
                </div>
            </div>
        );
    }
}

export {WidgetMenu};