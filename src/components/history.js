import styled from "styled-components";
import React, {useCallback, useRef, useState} from "react";
import {Skeleton, Table, TableBody, TableCell, TableContainer, TableRow} from "@material-ui/core";
import {Search} from "@material-ui/icons";
import {makeStyles} from "@material-ui/styles";
import Modal from "./libs/modal";
import moment from "moment";

const Wrapper = styled.div`{
  .link {
    font-weight: 300;
    font-size: 12px;
    line-height: 3;
  }
}`
const Text = styled.div`{
  font-weight: 300;
  font-size: 12px;
  color: rgba(0, 0, 0, 0, 9);
  line-height: 3;
  word-wrap: break-word;
  max-width: 400px;
  @media (max-width: 768px) {
    max-width: 200px;
  }
}`
const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: "#fff",
    },
}));

const History = ({data, asset, loading, nextKey, hasMore}) => {
    const [visible, setVisible] = useState(false);
    const [actionData, setActionData] = useState({});
    const observer = useRef();
    const classes = useStyles();
    const renderActionData = (action) => {
        switch (action.name) {
            case "transfer" :
                return <div>from : {action.json.from}, to: {action.json.to}, memo: <Search
                    onClick={() => {
                        setVisible(true)
                        setActionData(action.json)
                    }}
                    style={{fontSize: 18, color: "rgba(0, 0, 0, 0, 9)"}}/></div>
            case "createlog" :
                return <div>owner : {action.json.owner}, data: <Search
                    onClick={() => {
                        console.log("action.json", action.json)
                        setVisible(true)
                        setActionData(action.json)
                    }}
                    style={{fontSize: 18, color: "rgba(0, 0, 0, 0, 9)"}}/></div>
            case "offer" :
                return <div>owner : {action.json.owner},newowner : {action.json.newowner}, data: <Search
                    onClick={() => {
                        setVisible(true)
                        setActionData(action.json)
                    }}
                    style={{fontSize: 18, color: "rgba(0, 0, 0, 0, 9)"}}/></div>
            case "canceloffer" :
                return <div>owner : {action.json.owner},newowner : {action.json.newowner}, data: <Search
                    onClick={() => {
                        setVisible(true)
                        setActionData(action.json)
                    }}
                    style={{fontSize: 18, color: "rgba(0, 0, 0, 0, 9)"}}/></div>
            case "claim":
                return <div>claimer: {action.json.claimer}</div>
            case "delegate":
                return <div>to: {action.json.to}</div>
            default :
                return ""
        }
    }

    const renderActionName = (action) => {
        switch (action.name) {
            case "createlog":
                return "create"
            case "canceloffer":
                return "cancel"
            default :
                return action.name
        }
    }
    const lastHistoryElementRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    // getData(nextKey)
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading]
    );
    if (loading) {
        return <div className={"grid grid-cols-7 gap-4"}>
            <Skeleton className={"col-span-1"}/>
            <Skeleton className={"col-span-3"}/>
            <Skeleton className={"col-span-2"}/>
            <Skeleton className={"col-span-1"}/>

        </div>
    }

    const columns = [
        {
            minWidth: 50,
            id: 'action',
            label: 'action',
            render: (value, record) => {
                const action = record?.trace?.matchingActions[0] || {}
                return renderActionName(action)
            }
        }, {
            minWidth: 300,
            id: 'data',
            label: 'data',
            render: (value, record) => {
                const action = record?.trace?.matchingActions[0] || {}
                return renderActionData(action)
            }
        }, {
            minWidth: 250,
            id: 'timestamp',
            label: 'timestamp',
            render: (value, record) => {
                const timestamp = record?.trace?.block?.timestamp || "";

                return moment(timestamp).format("MMMM Do YYYY, h:mm:ss a")
            }
        }, {
            minWidth: 50,
            id: 'link',
            label: 'link',
            render: (value, record) => {
                return <a href={"https://wax.bloks.io/transaction/" + record?.trace?.id} target="_blank"
                          className={"link"}
                          style={{color: "#BE2525"}}>
                    View TX
                </a>
            }
        },

    ]
    return <Wrapper>
        <TableContainer>
            <Table>
                <TableBody>
                    {data.map((row, index) => {
                        return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={index + row.cursor}>
                                {columns.map((column) => {
                                    const value = row[column?.id];
                                    return (
                                        <TableCell key={column.id} align={column.align}
                                                   style={{minWidth: column.minWidth}}>
                                            {column.render ? column.render(value, row) : value}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
        {/*{data.map((history, index) => {*/}
        {/*    const action = history?.trace?.matchingActions[0] || {}*/}
        {/*    const timestamp = history?.trace?.block?.timestamp || ""*/}
        {/*    return <div key={index} className={"grid grid-cols-7 gap-4"} ref={lastHistoryElementRef}>*/}
        {/*        <Text>*/}
        {/*            {renderActionName(action)}*/}
        {/*        </Text>*/}
        {/*        <Text className={"col-span-3"}>*/}
        {/*            {renderActionData(action)}*/}
        {/*        </Text>*/}
        {/*        <Text className={"col-span-2"}>*/}
        {/*            {moment(timestamp).format("MMMM Do YYYY, h:mm:ss a")}*/}
        {/*        </Text>*/}
        {/*    </div>*/}
        {/*})}*/}

        <Modal visible={visible} width={600} footer={false} onClose={() => {
            setVisible(false)

            setActionData({})
        }} title={"Action Data"}>
            {Object.keys(actionData).map((i, index) => (
                <div key={actionData[i] + index} className={"flex flex-row mt-2 w-full"}>
                    <Text className={"mr-2"}>{i}: </Text>
                    <Text style={{color: "#BE2525",}}>{actionData[i].toString() || "--"}</Text>
                </div>))}

        </Modal>
    </Wrapper>
}

export default History