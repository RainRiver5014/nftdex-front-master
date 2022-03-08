import styled from "styled-components";
import {Checkbox, List, ListItem, ListItemText, Popover, Skeleton} from "@material-ui/core";
import ReactImageFallback from "react-image-fallback";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import lodash from "lodash";
import moment from "moment";
import React, {useEffect, useState} from "react";
import {getTable} from "../../services/chainControllers";
import {NFTDEX_NAME, SASSETS_TABLE, SIMPLEASSET_NAME} from "../../ContractAbi";
import {formatDataAsset} from "../../../utils/helps";

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
  @media (max-width: 768px) {
    max-width: 140px;
  }
}`
const TextKey = styled.div`{
  color: rgba(0, 0, 0, 0.87);
  font-size: 12px;
  line-height: 14px;
  text-overflow: ellipsis;
  overflow: hidden;
  display: inline-block;
  margin-right: 10px;
}`
const OfferItem = ({data, onCheck, index, dataSupply, onRenew, onCancel, loading}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [demand, setDemand] = useState({});
    const [demandLoading, setDemandLoading] = useState(false);
    useEffect(() => {
        if (!!data && !loading) {
            setDemandLoading(true)
            getTable(NFTDEX_NAME, SIMPLEASSET_NAME, SASSETS_TABLE, 1, data.demand_id, null).then(r => {
                setDemand({...r.rows[0], data: formatDataAsset(r.rows[0])})
            }).catch(e => {
                console.log("E", e)
            }).finally(fn => {
                setDemandLoading(false)
            })
        }
    }, [])
    // const [supply, setSupply] = useState({})
    const open = Boolean(anchorEl);
    const supply = lodash.find(dataSupply || [], s => data.supply_id === s.sasset_id)
    const img = demand?.data?.img || "https://i.stack.imgur.com/y9DpT.jpg"
    return <Wrapper className={"flex flex-row justify-between"}>
        <div className={"flex flex-row"}>
            <div className={"flex flex-col justify-center"}>
                <Checkbox
                    checked={data?.checked}
                    disabled={loading}
                    onChange={() => onCheck(data.offer_id)}
                />
            </div>
            <div className={"rounded bg-white rounded w-20 h-20 md:h-20 md:w-24 mr-3 md:mr-5 md:ml-2"}>
                {loading || demandLoading ?
                    <Skeleton variant="rect" className={"w-20 h-20 md:h-20 md:w-24 h-full w-full"}/> :
                    <ReactImageFallback
                        src={img}
                        fallbackImage="https://i.stack.imgur.com/y9DpT.jpg"
                        initialImage="https://i.stack.imgur.com/y9DpT.jpg"
                        // initialImage="https://i.pinimg.com/originals/a2/dc/96/a2dc9668f2cf170fe3efeb263128b0e7.gif"
                        className={"h-full w-full rounded"}
                    />}

            </div>
            <div className={"grid grid-rows-4 grid-flow-col"}>
                <TextKey>demand:</TextKey>
                <TextKey>supply:</TextKey>
                <TextKey>created:</TextKey>
                <TextKey>expires:</TextKey>
                <Text>{loading || demandLoading ? <Skeleton/> : demand?.data?.name || "--"}</Text>
                <Text>{loading ? <Skeleton/> : supply?.data?.name || "--"}</Text>
                <Text>{loading ? <Skeleton/> : moment(data.created_at).format("YYYY-MM-DDTHH:mm:ss")}</Text>
                <Text>{loading ? <Skeleton/> : moment(data.expires_at).format("YYYY-MM-DDTHH:mm:ss")}</Text>
            </div>
        </div>
        <div className={"flex flex-col justify-center"}>
            {!loading && <MoreVertIcon className={"cursor-pointer"} onClick={(e) => setAnchorEl(e.currentTarget)}/>}
        </div>
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "center",
            }}
        >
            <List className={"min-w-full"}>
                <ListItem className={"cursor-pointer"}>
                    <ListItemText primary="Renew" onClick={() => {
                        onRenew(data.offer_id, data.expires_at)
                        setAnchorEl(null)
                    }}/>
                </ListItem>
                <ListItem className={"cursor-pointer"} onClick={() => {
                    onCancel(data.offer_id)
                    setAnchorEl(null)
                }}>
                    <ListItemText primary="Cancel"/>
                </ListItem>
            </List>
        </Popover>
    </Wrapper>
}
export default OfferItem