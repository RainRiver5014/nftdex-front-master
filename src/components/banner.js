
import React from "react";
import {Grid} from "@material-ui/core";
import tw from "twin.macro";
import styled from "styled-components";
const GridList = styled.div`${tw`grid grid-cols-2 md:gap-4`}`
const Image = styled.img`${tw`w-full h-28 mb-2 md:mb-0`}`

const Banner = () => {
    return <div>
        <GridList>
            <a href={"#"}><Image className={"md:rounded-l"} src={process.env.NEXT_PUBLIC_HREF + "/img/slide-2.jpg"}  alt={"slide -2"}/></a>
            <a href={"#"}><Image className={"md:rounded-r"} src={process.env.NEXT_PUBLIC_HREF + "/img/slide-1.jpg"} alt={"slide -1"}/></a>
        </GridList>
    </div>
}

export default Banner



