import * as React from "react";
import { Icon } from "antd";
import { SketchPicker as ColorPicker} from "react-color";

const className = "test-components-tool-components-colorModal";

interface ColorModalProps {
    color: any;
    changeColor: any;
    closeModal: any;
}

interface ColorModalStates {

}

class ColorModal extends React.Component<ColorModalProps, ColorModalStates> {
    public render(): JSX.Element {
        const {color, changeColor, closeModal} = this.props;
        return (
            <div className={className}>
                <Icon
                    className={`${className}-close`}
                    type="close"
                    onClick={closeModal}
                />
                <ColorPicker
                    color={color}
                    onChangeComplete={ (color: any) => {
                        const value = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
                        changeColor(value);
                    }}
                />
            </div>
        );
    }
}

export {ColorModal};