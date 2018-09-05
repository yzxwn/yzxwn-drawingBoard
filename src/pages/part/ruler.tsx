import * as React from "react";
import {  } from "antd";

interface RulerProps {

}

interface RulerStates {

}

class Ruler extends React.Component<RulerProps, RulerStates> {
    private line: any;
    constructor(props:any){
        super(props);
        this.state={
            start: null,
            end: null,
        }
    }
    public mouseDown = (point:any) =>{
        this.setState({start: point});
    }
    public mouseMove = (point:any) =>{
        // console.log(point);
        this.setState({end: point});
        if (this.line) {
            this.line.style.left = point.x + 20 + "px";
            this.line.style.top = point.y - 30 + "px";
        }
    }
    public mouseUp = () =>{
        this.setState({
            start: null,
            end: null,
        });
    }
    public render(): JSX.Element {
        return (
            <div className="test-part-ruler">
                {
                    this.state.start&&this.state.end&&(this.state.end.x - this.state.start.x||this.state.end.y - this.state.start.y) ?
                        <div className="test-part-ruler-line" ref={(r: any) => this.line = r}>
                            {`X：${this.state.end.x - this.state.start.x}，Y：${this.state.end.y - this.state.start.y}`}
                        </div>
                        : null
                }
            </div>
        );
    }
}

export {Ruler};