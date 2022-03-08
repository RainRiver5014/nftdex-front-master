import {SwipeableDrawer} from "@material-ui/core";
import React from "react";
import CloseIcon from '@material-ui/icons/Close';
import Link from "next/link";
import {useSelector} from "react-redux";

const Drawer = ({isOpen, onClose, onOpen}) => {
    const app = useSelector(store => store.app)
    return <SwipeableDrawer
        open={isOpen}
        onClose={() => onClose()}
        onOpen={() => onOpen()}
    >
        <div className={"w-64 bg-drawer min-h-screen"}>
            <div className={"flex flex-row mt-3"}>
                <div className={"px-3 mt-1 cursor-pointer"}>
                    <CloseIcon onClick={() => onClose()}/>
                </div>
                <div>
                    <h2 className={"text-select font-medium text-3xl ml-1"}>NFTDex</h2>
                    <Link href={"/"}>
                        <a className={"flex flex-row content-center pb-3 pt-10"}>
                            <img style={{width: 32, height: 32}}
                                 src={"/img/" + (app.menu === "market" ? "market-red.png" : "market-blk.png")}
                                 alt="market"/>
                            <p className={"self-center ml-4 " + (app.menu === "market" ? "text-select" : "")}>Market</p>
                        </a>
                    </Link>
                    <Link href={"/options"}>
                        <a className={"flex flex-row content-center py-3"}>
                            <img style={{width: 32, height: 32}}
                                 src={"/img/" + (app.menu === "options" ? "options-red.png" : "options-blk.png")}
                                 alt="options"/>
                            <p className={"self-center ml-4 " + (app.menu === "options" ? "text-select" : "")}>Options</p>
                        </a>
                    </Link>
                    <Link href={"/offers"}>
                        <a className={"flex flex-row content-center py-3"}>
                            <img style={{width: 32, height: 32}}
                                 src={"/img/" + (app.menu === "offers" ? "offers-red.png" : "offers-blk.png")}
                                 alt="offers"/>
                            <p className={"self-center ml-4 " + (app.menu === "offers" ? "text-select" : "")}>Offers</p>
                        </a>
                    </Link>
                    <Link href={"/trades"}>
                        <a className={"flex flex-row content-center py-3"}>
                            <img style={{width: 32, height: 32}}
                                 src={"/img/" + (app.menu === "trades" ? "trades-red.png" : "trades-blk.png")}
                                 alt="trades"/>
                            <p className={"self-center ml-4 " + (app.menu === "trades" ? "text-select" : "")}>Trades</p>
                        </a>
                    </Link>
                    <Link href={"/nfts"}>
                        <a className={"flex flex-row content-center py-3"}>
                            <img style={{width: 32, height: 32}}
                                 src={"/img/" + (app.menu === "nfts" ? "nfts-red.png" : "nfts-blk.png")} alt="nfts"/>
                            <p className={"self-center ml-4 " + (app.menu === "nfts" ? "text-select" : "")}>NFTs</p>
                        </a>
                    </Link>
                    <Link href={"#"}>
                        <a className={"flex flex-row content-center py-3 pt-6"}>
                            <p className={"self-center " + (app.menu === "hiw" ? "text-select" : "")}>How It Works</p>
                        </a>
                    </Link>
                    <Link href={"#"}>
                        <a className={"flex flex-row content-center py-3"}>
                            <p className={"self-center " + (app.menu === "about" ? "text-select" : "")}>About</p>
                        </a>
                    </Link>
                    <Link href={"#"}>
                        <a className={"flex flex-row content-center py-3"}>
                            <p className={"self-center " + (app.menu === "sp" ? "text-select" : "")}>Support</p>
                        </a>
                    </Link>
                    <Link href={"#"}>
                        <a className={"flex flex-row content-center py-3"}>
                            <p className={"self-center " + (app.menu === "tou" ? "text-select" : "")}>Terms of Use</p>
                        </a>
                    </Link>
                    <Link href={"#"}>
                        <a className={"flex flex-row content-center py-3"}>
                            <p className={"self-center " + (app.menu === "pp" ? "text-select" : "")}>Privacy Policy</p>
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    </SwipeableDrawer>
}
export default Drawer