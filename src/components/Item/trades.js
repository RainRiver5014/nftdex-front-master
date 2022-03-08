import styled from "styled-components";
import {Skeleton} from "@material-ui/core";
import React, {useState,useEffect} from "react";
import ReactImageFallback from "react-image-fallback";

const Wrapper = styled.div`{
  margin-bottom: 10px;
}`
const Text = styled.div`{
  color: rgba(0, 0, 0, 0.87);
  font-size: 12px;
  line-height: 14px;
  text-overflow: ellipsis;
  overflow: hidden;
  display: inline-block;
  max-width: 180px;
  white-space: nowrap;
  @media only screen and (max-width: 435px) {
    max-width: 85px;
  }
  //@media only screen and (min-width: 640px) and (max-width: 767px) {
  //  width: 200px;
  //}
  @media only screen and (min-width: 436px) and (max-width: 767px) {
    width: 200px;
  }
}`
const TextKey = styled.div`{
  color: rgba(0, 0, 0, 0.87);
  font-size: 12px;
  line-height: 14px;
  //text-overflow: ellipsis;
  //overflow: hidden;
  //display: inline-block;
  margin-right: 10px;
}`
const NFTTrades = ({loading, supply, data}) => {
    const [demandLoading, setDemandLoading] = useState(false);
    const [supplyLoading, setSupplyLoading] = useState(false);
    const [imageSupply,setimageSupply] = useState('');
    const [imageDemand,setimageDemand] = useState('');

    useEffect(()=>{
        isValidUrlSupply();
        isValidUrlDemand();
    },[])

    const isValidUrlSupply = () => {
        try {
            new URL(data?.json?.supply_img);
            return  setimageSupply(data?.json?.supply_img);
        }
        catch(err) {
            return setimageSupply(`https://ipfs.io/ipfs/${data?.json?.supply_img}`);
        }
    }

    const isValidUrlDemand = () => {
        try {
            new URL(data?.json?.demand_img);
            return  setimageDemand(data?.json?.demand_img);
        }
        catch(err) {
            return setimageDemand(`https://ipfs.io/ipfs/${data?.json?.demand_img}`);
        }
    }


    return <Wrapper className={"flex flex-row justify-between"}>
        <div className={"flex flex-row"}>
            <div className={"flex flex-row justify-between mr-3 md:mr-5 md:ml-2"}>
                <div className={"rounded bg-white rounded w-16 h-16 md:h-20 md:w-24"}>
                    {loading ? <Skeleton variant="rect" className={"h-full w-full"}/> :
                        <ReactImageFallback
                            src={imageSupply}
                            fallbackImage="https://i.stack.imgur.com/y9DpT.jpg"
                            initialImage="https://i.stack.imgur.com/y9DpT.jpg"
                            // initialImage="https://i.pinimg.com/originals/a2/dc/96/a2dc9668f2cf170fe3efeb263128b0e7.gif"
                            className={"h-full w-full rounded"}
                        />}

                </div>
                <img src={process.env.NEXT_PUBLIC_HREF + "/img/" + "trades-blk.png"} alt={"trade"}
                     className={"w-6 h-6 self-center mx-2 md:mx-4"}/>
                <div className={"rounded bg-white rounded w-16 h-16 md:h-20 md:w-24 "}>
                    {loading ? <Skeleton variant="rect" className={"h-full w-full"}/> :
                        <ReactImageFallback
                            src={imageDemand}
                            fallbackImage="https://i.stack.imgur.com/y9DpT.jpg"
                            initialImage="https://i.stack.imgur.com/y9DpT.jpg"
                            // initialImage="https://i.pinimg.com/originals/a2/dc/96/a2dc9668f2cf170fe3efeb263128b0e7.gif"
                            className={"h-full w-full rounded"}
                        />}

                </div>
            </div>
            <div className={"grid grid-rows-3 grid-flow-col"}>
                <TextKey>demand:</TextKey>
                <TextKey>supply:</TextKey>
                <TextKey>traded:</TextKey>
                <Text>{loading ?
                    <Skeleton width={"80%"}/> : data?.json?.demand_name || data?.json?.demand_id || "--"}</Text>
                <Text>{loading ?
                    <Skeleton width={"80%"}/> : data?.json?.supply_name || data?.json?.supply_id || "--"}</Text>
                <Text>{loading ?
                    <Skeleton width={"80%"}/> : data?.json.traded || "--"}</Text>
            </div>
        </div>
    </Wrapper>
}
export default NFTTrades