import * as React from "react";
import {  } from "antd";

interface Test02PageProps {
    tabPages: any;
}

interface Test02PageStates {

}

class Test01Page extends React.Component<Test02PageProps, Test02PageStates> {
    render(): JSX.Element {
        const {tabPages} = this.props;
        let con = "";
        tabPages.pages.map((page: any) => {
            if(tabPages.activeKey === page.key) {
                if(page.current) {
                    if (page.contend) {
                        con = page.contend[page.current - 1];
                    }
                }
            }
        });
        return (
            <div className="test02">
                <div className="test02-con">
                    {
                        con ?
                            <img src={require(`../img/${con}`)} />
                            : null
                    }
                </div>
            </div>
        );
    }
}

export {Test01Page};