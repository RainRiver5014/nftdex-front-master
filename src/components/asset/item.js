import ReactImageFallback from "react-image-fallback";
import React from "react";
import styled from "styled-components";

const Text = styled.div`{
  color: rgba(0, 0, 0, 0.87);
  font-size: 12px;
  line-height: 14px;
  text-overflow: ellipsis;
  overflow: hidden;
  display: inline-block;
  width: 180px;
  white-space: nowrap;
  @media (max-width: 768px) {
    max-width: 120px;
  }
}`
const ItemAsset = ({asset, type}) => {
    return <div className={"rounded flex flex-row py-4 px-4"} style={{backgroundColor: "rgba(217, 217, 217, 0.37)"}}>
        {/*<div className={""} >*/}
        <ReactImageFallback
            src={asset?.data?.img}
            fallbackImage="https://i.stack.imgur.com/y9DpT.jpg"
            initialImage="https://i.stack.imgur.com/y9DpT.jpg"
            // initialImage="https://i.pinimg.com/originals/a2/dc/96/a2dc9668f2cf170fe3efeb263128b0e7.gif"
            alt={asset?.data?.name}
            style={{width: 100, height: 100}}
            className={"h-full w-full rounded bg-white rounded"}
        />
        {/*</div>*/}
        <div className={"ml-4"}>
            <Text>
                Offer {type}
            </Text>
            <div className={"grid grid-cols-4 gap-16"}>
                <Text>
                    NFT ID:
                </Text>
                <Text className={"col-span-3"}>
                    {asset.sasset_id}
                </Text>
            </div>
            <div className={"grid grid-cols-4 gap-16"}>
                <Text>
                    Name:
                </Text>
                <Text className={"col-span-3"}>
                    {asset?.data?.name}
                </Text>
            </div>
            <div className={"grid grid-cols-4 gap-16"}>
                <Text>
                    Category:
                </Text>
                <Text className={"col-span-3"}>
                    {asset.category || "--"}
                </Text>
            </div>
            <div className={"grid grid-cols-4 gap-16"}>
                <Text>
                    Author:
                </Text>
                <Text className={"col-span-3"}>
                    {asset.author || "--"}
                </Text>
            </div>
            <div className={"grid grid-cols-4 gap-16"}>
                <Text>
                    Owner:
                </Text>
                <Text className={"col-span-3"}>
                    {asset.owner || "--"}
                </Text>
            </div>
        </div>
    </div>
}
export default ItemAsset