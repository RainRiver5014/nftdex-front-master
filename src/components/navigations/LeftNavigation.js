import Link from 'next/link';
import {useSelector} from "react-redux";
import styled from "styled-components";
import tw from "twin.macro";

const Wrapper = styled.div`${tw`md:block hidden md:fixed w-48`}`
const Col = styled.div`${tw`flex flex-col`}`
const Item = styled.a`${tw`flex flex-col items-center py-5 cursor-pointer uppercase`}& {
  font-size: 14px;
  font-weight: 500
}`
const LeftNavigation = ({}) => {
    const app = useSelector(store => store.app)

    return <Wrapper>
        <Col>
            <Link href={"/"}>
                <Item className={app.menu === "market" ? "text-select" : ""}>
                    <img style={{width: 32, height: 32}}
                         src={process.env.NEXT_PUBLIC_HREF + "/img/" + (app.menu === "market" ? "market-red.png" : "market-blk.png")}
                         alt="market"/>
                    Market
                </Item>
            </Link>
            <Link href={"/offers"}>
                <Item className={app.menu === "offers" ? "text-select" : ""}>
                    <img style={{width: 32, height: 32}}
                         src={process.env.NEXT_PUBLIC_HREF + "/img/" + (app.menu === "offers" ? "offers-red.png" : "offers-blk.png")}
                         alt="offers"/>
                    Offers
                </Item>
            </Link>
            <Link href={"/options"}>
                <Item className={app.menu === "options" ? "text-select" : ""}>
                    <img style={{width: 32, height: 32}}
                         src={process.env.NEXT_PUBLIC_HREF + "/img/" + (app.menu === "options" ? "options-red.png" : "options-blk.png")}
                         alt="options"/>
                    Options
                </Item>
            </Link>

            <Link href={"/trades"}>
                <Item className={app.menu === "trades" ? "text-select" : ""}>
                    <img style={{width: 32, height: 32}}
                         src={process.env.NEXT_PUBLIC_HREF + "/img/" + (app.menu === "trades" ? "trades-red.png" : "trades-blk.png")}
                         alt="trades"/>
                    Trades
                </Item>
            </Link>
            <Link href={"/nfts"}>
                <Item className={app.menu === "nfts" ? "text-select" : ""}>
                    <img style={{width: 32, height: 32}}
                         src={process.env.NEXT_PUBLIC_HREF + "/img/" + (app.menu === "nfts" ? "nfts-red.png" : "nfts-blk.png")}
                         alt="nfts"/>
                    NFTS
                </Item>
            </Link>
        </Col>
    </Wrapper>
}

export default LeftNavigation