import Modal from "./libs/modal";
import React, {useEffect, useState} from "react";
import {getTable} from "../services/chainControllers";
import {NFTDEX_NAME, SASSETS_TABLE, SIMPLEASSET_NAME} from "../ContractAbi";
import {formatDataAsset} from "../../utils/helps";
import ReactImageFallback from "react-image-fallback";
import ItemAsset from "./asset/item";
import NFTCalendar from "./NFTCalendar";
import moment from "moment";

const ModalCreateOffer = ({visible, onClose, createOffer, asset, activeUser}) => {
    const [loading, setLoading] = useState(false);
    const [activeUseAssets, setActiveUseAssets] = useState([]);
    const [assetSelect, setAssetSelect] = useState({});
    const [expires_at, onChangeCalendar] = useState(new Date());

    useEffect(() => {
        if (visible) {
            setLoading(true)
            getTable(NFTDEX_NAME, SIMPLEASSET_NAME, SASSETS_TABLE, 20, activeUser.accountName, activeUser.accountName, 3).then(
                (res) => {
                    let assets = res.rows.map((item) => {
                        return {...item, data: formatDataAsset(item), nextKey: res.next_key}
                    })
                    assets = assets.filter(asset => asset.status === "active")
                    const newAssets = activeUseAssets.concat(assets)
                    setActiveUseAssets(newAssets)
                    const currentDate=new Date();
                    const futureDate=new Date(currentDate);
                    futureDate.setDate(futureDate.getDate() + 3);
                    onChangeCalendar(futureDate);
                    if (newAssets.length > 0) {
                        setAssetSelect(newAssets[0])
                    }
                }
            ).catch(e => {
                console.log("e", e)
            }).finally(() => {
                setLoading(false)
            })
        }
    }, [visible]);
    const handleOk = () => {

        createOffer(assetSelect.sasset_id, asset.sasset_id, moment(expires_at).format("YYYY-MM-DDTHH:mm:ss"))
    }
    return <Modal visible={visible}
                  onClose={onClose}
                  fullX={true}
                  fullY={true}
                  backgroundColor="#D9D9D9"
                  okText={"Create Offer"}
                  onOk={handleOk}>
        <div className={"flex flex-row justify-center mb-4 font-semibold"} style={{fontSize: 20}}>
            Create New Trade Offer
        </div>
        <div className={"flex flex-col md:flex-row md:justify-center px-1 md:px-10"}>
            <div>
                <ItemAsset asset={asset} type={"Demand"}/>
            </div>
            <div className={"md:mx-4 my-2 md:my-0 flex justify-center items-center"}>
                <img style={{width: 32, height: 32}}
                     src={process.env.NEXT_PUBLIC_HREF + "/img/trades-blk.png"}
                     alt="trades"/>
            </div>
            <div>
                <ItemAsset asset={assetSelect} type={"Supply"}/>
            </div>
        </div>
        <div>
            <div className={"flex flex-row justify-center my-4"}>
                Select Supply
            </div>
            <div className={"flex overflow-x-scroll hide-scroll-bar"}>
                <div className={"flex flex-nowrap"}>
                    {
                        activeUseAssets.map(userAsset => <ReactImageFallback
                                key={userAsset.sasset_id}
                                src={userAsset?.data?.img}
                                fallbackImage="https://i.stack.imgur.com/y9DpT.jpg"
                                initialImage="https://i.stack.imgur.com/y9DpT.jpg"
                                // initialImage="https://i.pinimg.com/originals/a2/dc/96/a2dc9668f2cf170fe3efeb263128b0e7.gif"
                                alt={userAsset?.data?.name}
                                className={"mx-1"}
                                onClick={() => setAssetSelect(userAsset)}
                                style={{
                                    backgroundColor: "#fff",
                                    width: 150,
                                    height: 150,
                                    marginBottom: 10,
                                    borderRadius: assetSelect.sasset_id === userAsset.sasset_id ? 10 : 5,
                                    borderColor: assetSelect.sasset_id === userAsset.sasset_id ? "#B52929" : "#fff",
                                    borderWidth: assetSelect.sasset_id === userAsset.sasset_id ? 2 : 0
                                }}
                                // onLoad={() => {
                                //     onLoad(item)
                                // }}
                            />
                        )
                    }
                </div>
            </div>
        </div>
        <div>
            <div className={"flex flex-row justify-center my-4"}>
                Offer Expiration Date
            </div>
            <NFTCalendar onChange={onChangeCalendar} value={expires_at} minDate={new Date()}/>
        </div>


    </Modal>
}

export default ModalCreateOffer