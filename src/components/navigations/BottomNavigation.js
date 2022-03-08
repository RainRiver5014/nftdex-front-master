import {useSelector} from "react-redux";
import Link from 'next/link';
import styled from "styled-components";
import tw from "twin.macro";

const Wrapper = styled.section`${tw`w-full md:hidden block`}`
const Image = styled.img`{
  width: 28px;
  height: 28px;
  align-self: center;
}`
const BottomNav = ({}) => {
    const app = useSelector(store => store.app)
    return <Wrapper id="bottom-navigation" className="fixed inset-x-0 bottom-0 z-10 bg-secondary shadow">
        <div id="tabs" className="flex justify-between">
            <Link href={"/"}>
                <a href="#"
                   className={"w-full cursor-pointer flex flex-col justify-center content-center inline-block text-center py-2 "
                   + (app.menu === "market" ? "text-select font-bold" : "")}>
                    <Image
                        src={process.env.NEXT_PUBLIC_HREF + "/img/" + (app.menu === "market" ? "market-red.png" : "market-blk.png")}
                        alt="market"/>
                    <span className="tab tab-home block text-xs uppercase">Market</span>
                </a>
            </Link>
            <Link href={"/offers"}>
                <a href="#"
                   className={"w-full cursor-pointer flex flex-col justify-center inline-block text-center py-2 "
                   + (app.menu === "offers" ? "text-select font-bold" : "")}>
                    <Image
                        src={process.env.NEXT_PUBLIC_HREF + "/img/" + (app.menu === "offers" ? "offers-red.png" : "offers-blk.png")}
                        alt="offers"/>
                    <span className="tab tab-explore block text-xs uppercase">Offers</span>
                </a>
            </Link>
            <Link href={"/options"}>
                <a href="#"
                   className={"w-full cursor-pointer flex flex-col justify-center inline-block text-center py-2 "
                   + (app.menu === "options" ? "text-select font-bold" : "")}>
                    <Image
                        src={process.env.NEXT_PUBLIC_HREF + "/img/" + (app.menu === "options" ? "options-red.png" : "options-blk.png")}
                        alt="options"/>
                    <span className="tab tab-kategori block text-xs uppercase">Options</span>
                </a>
            </Link>

            <Link href={"/trades"}>
                <a href="#"
                   className={"w-full cursor-pointer flex flex-col justify-center inline-block text-center py-2 "
                   + (app.menu === "trades" ? "text-select font-bold" : "")}>
                    <Image
                        src={process.env.NEXT_PUBLIC_HREF + "/img/" + (app.menu === "trades" ? "trades-red.png" : "trades-blk.png")}
                        alt="trades"/>
                    <span className="tab tab-whishlist block text-xs uppercase">Trades</span>
                </a>
            </Link>
            <Link href={"/nfts"}>
                <a href="#"
                   className={"w-full cursor-pointer flex flex-col justify-center inline-block text-center py-2  "
                   + (app.menu === "nfts" ? "text-select font-bold" : "")}>
                    <Image
                        src={process.env.NEXT_PUBLIC_HREF + "/img/" + (app.menu === "nfts" ? "nfts-red.png" : "nfts-blk.png")}
                        alt="nfts"/>
                    <span className="tab tab-account block text-xs uppercase">NFTs</span>
                </a>
            </Link>
        </div>
    </Wrapper>
}

export default BottomNav