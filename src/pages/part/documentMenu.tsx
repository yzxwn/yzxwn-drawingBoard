import * as React from "react";
import { Icon, Pagination } from "antd";

interface DocumentMenuProps {
    getTabPages: any;
    changeStates: any;
}

interface DocumentMenuStates {

}

class DocumentMenu extends React.Component<DocumentMenuProps, DocumentMenuStates> {
    private __changePages = (key: any, getTabPages: any, changeStates: any) => {
        let {activeKey, pages} = getTabPages;
        let tc = "left", a1 = 0, a2 = 0;
        pages.map((p: any, index: any) => {
            if(p.key === activeKey) {
                a1 = index;
            } else if(p.key === key) {
                a2 = index;
            }
        });
        if(a1 > a2) {
            tc = "right";
        }
        changeStates({
            transitionDirection: tc,
            activeKey: key,
            activeChange: "Tab",
        });
    }
    private __closePages = (targetKey: any, getTabPages: any, changeStates: any) => {
        let {activeKey, pages} = getTabPages;
        let lastIndex = 0;
        let key = "";
        pages.forEach((pane: any, i: any) => {
            if (pane.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const panes = pages.filter((pane: any) => pane.key !== targetKey);
        if (lastIndex >= 0 && activeKey === targetKey) {
            key = panes[lastIndex].key;
        }
        changeStates({
                activeKey: key,
                pages: panes,
            });
    }
    private __changePage = (page: any, changeStates: any, getTabPages: any) => {
        let {activeKey, pages} = getTabPages;
        let tc = "left";
        let ps = [];
        pages.map((p: any) => {
            if(p.key === activeKey) {
                let p1 = {...p};
                if(p.current > page) {
                    tc = "right";
                }
                p1.current = page;
                ps.push(p1);
            } else {
                ps.push(p);
            }
        });
        changeStates({
            pages: ps,
            transitionDirection: tc,
            activeChange: "Current",
        });
    }
    public render(): JSX.Element {
        const {getTabPages, changeStates} = this.props;
        let {activeKey, pages} = getTabPages;
        let activePage: any = {current: 1, total: 1};
        pages.map((page: any) => {
            if(page.key === activeKey) {
                activePage = page;
            }
        });
        return (
            <div className="test-part-documentMenu">
                {
                    pages.map((pane: any) =>
                        <div
                            className={`test-part-documentMenu-item ${activeKey === pane.key ? "test-part-documentMenu-item-active" : ""}`}
                            key={pane.key}
                        >
                                    <span
                                        className="test-part-documentMenu-item-text"
                                        onClick={() => this.__changePages(pane.key, getTabPages, changeStates)}
                                    >
                                        {pane.text}
                                    </span>
                            {
                                pane.close ?
                                    <Icon
                                        className="test-part-documentMenu-item-close"
                                        type="close"
                                        onClick={() => this.__closePages(pane.key, getTabPages, changeStates)}
                                    />
                                    : null
                            }
                        </div>
                    )
                }
                <div className="test-part-documentMenu-document">
                    {
                        activePage.total > 1 ?
                            <Pagination
                                simple
                                pageSize={1}
                                current={activePage.current}
                                total={activePage.total}
                                onChange={(page: any) => {
                                    this.__changePage(page, changeStates, getTabPages)
                                }}
                            />
                            : null
                    }
                </div>
            </div>
        );
    }
}

export {DocumentMenu};