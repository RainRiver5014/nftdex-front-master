import React from "react";


const NFTTab = ({children}) => {
    return <div>{children}</div>
}
const NFTTabs = ({children, value, onChange}) => {
    const Tabs = (children || []).map(tab => <nav key={tab.key}
    >
        <button
            onClick={() => onChange(tab.key)}
            className={"text-primary text-14px py-4 md:px-6 block hover:text-select focus:outline-none " + (value.toString() === tab.key && "border-b-2 border-secondary")}>
            {tab.props.label}
        </button>
    </nav>)
    return <div>
        <nav className="flex flex-row px-10 md:px-0 justify-around md:justify-start">
            {Tabs}
        </nav>
        <div className={"mt-4"}>
            {children[value - 1]}
        </div>
    </div>
}
export {
    NFTTabs,
    NFTTab,
}