import styled from "styled-components";
import {Checkbox, List, ListItem, ListItemText, Popover, Skeleton} from "@material-ui/core";
import ReactImageFallback from "react-image-fallback";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import React from "react";
import {formatDataAsset} from "../../../utils/helps";

const Wrapper = styled.div`{
  margin-bottom: 40px;
}`
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
    max-width: 140px;
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
const NFTPageItem = ({data, onCheck, onAction, loading, type}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const img = Object.keys(data || {}).length > 0 ? formatDataAsset(data || {}).img : ""
    const name = Object.keys(data || {}).length > 0 ? formatDataAsset(data || {}).name : "--"
    return <Wrapper className={"flex flex-row justify-between"}>
        <div className={"flex flex-row"}>
            <div className={"flex flex-col justify-center"}>
                <Checkbox
                    checked={data?.checked}
                    disabled={loading}
                    onChange={() => onCheck(data.id)}
                />
            </div>
            <div className={"rounded bg-white rounded w-20 h-20 md:h-20 md:w-24 mr-3 md:mr-5 md:ml-2"}>
                {loading ? <Skeleton variant="rect" className={"w-20 h-20 md:h-20 md:w-24 h-full w-full"}/> :
                    <ReactImageFallback
                        src={img}
                        fallbackImage="https://i.stack.imgur.com/y9DpT.jpg"
                        initialImage="https://i.stack.imgur.com/y9DpT.jpg"
                        // initialImage="https://i.pinimg.com/originals/a2/dc/96/a2dc9668f2cf170fe3efeb263128b0e7.gif"
                        className={"h-full w-full rounded"}
                    />}

            </div>
            <div className={"grid grid-rows-3 grid-flow-col"}>
                <TextKey>name:</TextKey>
                <TextKey>author:</TextKey>
                <TextKey>category:</TextKey>
                <Text>{loading ? <Skeleton/> : name || "--"}</Text>
                <Text>{loading ? <Skeleton/> : data.author || "--"}</Text>
                <Text>{loading ? <Skeleton/> : data.category || "--"}</Text>
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
                {
                    type === "trade" ? <ListItem className={"cursor-pointer"} onClick={() => {
                            onAction(data)
                            setAnchorEl(null)
                        }}>
                            <ListItemText primary="Delist"/>
                        </ListItem> :
                        <ListItem className={"cursor-pointer"} onClick={() => {
                            onAction(data)
                            setAnchorEl(null)
                        }}>
                            <ListItemText primary="List for trade"/>
                        </ListItem>
                }

            </List>
        </Popover>
    </Wrapper>
}
export default NFTPageItem