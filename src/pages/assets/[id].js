import React from "react";
import {getHistoryByAssetId, getTable, signTransaction} from "../../services/chainControllers";
import {NFTDEX_NAME, OFFERCREATE_ACTION, SASSETS_TABLE, SIMPLEASSET_NAME} from "../../ContractAbi";
import {formatDataAsset} from "../../../utils/helps";
import {bindActionCreators} from "redux";
import {setMenu, setPageTitle} from "../../store/actions/app.action";
import {connect} from "react-redux";
import styled from "styled-components";
import tw from "twin.macro";
import History from "../../components/history";
import ReactImageFallback from "react-image-fallback";
import HorizontalLayout from "../../components/layouts/horizontal";
import ModalCreateOffer from "../../components/ModalCreateOffer";
import {Alert, Snackbar} from "@material-ui/core";
import {NotificationManager} from "../../components/NFTNotifications";

const Wrapper = styled.div`{
  margin-right: 50px;
  margin-left: 20px;

  .text-high {
    color: #B52929
  }

  .img-wrapper {
    height: 380px;
    align-content: center;
    //background-color: red;
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;

    .image {
      max-height: 100%;
      max-width: 100%;
    }
  }


  @media (max-width: 768px) {
    margin: 0;
  }
}`
const Text = styled.p`{
  line-height: 14px;
  font-size: 12px;
  font-weight: 300;
  word-wrap: break-word;
  max-width: 300px;
  @media (max-width: 768px) {
    max-width: 200px;
  }
  @media (max-width: 768px) {
    margin: 0;
  }
}`
const TextTitle = styled.p`{
  line-height: 14px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 15px;
}`
const Button = styled.button`{
  padding: 12px 14px;
  color: #BE2525;
  border-radius: 6px;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 600;
  background-color: #EDEDED;
  --tw-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.5);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  margin-bottom: 22px;
  @media (max-width: 768px) {
    margin-top: 20px;
    align-self: center;
  }
}

  &${tw`focus:outline-none focus:ring-0 focus:ring-transparent `}`
const BoxHeader = styled.p`{
  padding: 14px 15px;
  background-color: #D9D9D9;
  border-radius: 4px;
  font-size: 12px;
  line-height: 14px;
  color: rgba(0, 0, 0, 0, 87);
}`
const WrapperOwnerAsset = styled.div`{
  padding-top: 20px;
  background-color: #fff;
  padding-left: 5px;
  padding-right: 5px;
  @media (max-width: 768px) {
    padding-left: 0;
    padding-right: 0;
  }
}`

class DetailAsset extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loadingAsset: false,
            hasMoreAsset: props.hasMoreAsset || true,
            nextKeyAsset: props.nextKeyAsset || null,
            ownerAssets: [],
            loadingHistory: false,
            hasMoreHistory: props.hasMoreHistory || true,
            nextKeyHistory: props.nextKeyHistory || null,
            history: [],
            visibleModalCreateOffer: false,
            success: false,
            error: false,
            transaction: "",
            textWarning: "",
            textError: ""
        }
    }

    componentDidMount() {
        this.props.setMenu("market");
        this.props.setPageTitle("");
        this.getDataAssets(this.props.asset.owner);
        this.getHistory();
    }

    onLoadOwnerAssets = (item) => {
        const {ownerAssets} = this.state;
        const newAsset = ownerAssets.map(d => {
            return {...d, loading: d.loading ? true : d.sasset_id === item.sasset_id}
        })


        this.setState({
            ownerAssets: newAsset,
        })
    }

    getHistory = () => {
        this.setState({loadingHistory: true})
        getHistoryByAssetId(this.props.asset.sasset_id).then(res => {
            const history = res?.data?.searchTransactionsBackward?.results
            const newHistory = this.state.history.concat(history)
            this.setState({
                history: newHistory,
                hasMoreHistory: res.more,
                nextKeyHistory: res.next_key,
            })
        }).catch(e => {
            console.log("eee", e)
        }).finally(() => {
            this.setState({loadingHistory: false})
        })

    }

    getDataAssets = (owner) => {
        this.setState({loadingAsset: true})
        getTable(NFTDEX_NAME, SIMPLEASSET_NAME, SASSETS_TABLE, 20, owner, owner, 3).then(
            (res) => {
                let assets = res.rows.map((item) => {
                    return {...item, data: formatDataAsset(item), nextKey: res.next_key}
                })
                assets = assets.filter(asset => asset.status === "active")
                const newAssets = this.state.ownerAssets.concat(assets)
                this.setState({
                    ownerAssets: newAssets,
                    hasMoreAsset: res.more,
                    nextKeyAsset: res.next_key,
                })
            }
        ).catch(e => {
            console.log("e", e)
        }).finally(() => {
            this.setState({loadingAsset: false,})
        })
    }

    showCreateOffer = () => {
        const {ual} = this.props;
        if (Object.keys(ual.activeUser || {}).length === 0) {
            NotificationManager.warning({message : "Must login before using the feature."})
        } else {
            if (ual.activeUser?.accountName === this.props.asset.owner) {
                NotificationManager.warning({message: "Can’t create offer to your asset which you’ve owned."})
            } else {
                this.setState({visibleModalCreateOffer: true})

            }
        }
    }

    onCloseModalCreateOffer = () => {
        this.setState({visibleModalCreateOffer: false})
    }

    createOffer = async (supply_id, demand_id, expires_at) => {
        const {
            ual: {activeUser},
        } = this.props;
        let actor;
        let permission;
        if (activeUser.scatter) {
            const [current] = activeUser.scatter.identity.accounts;
            actor = current.name;
            permission = current.authority;
        }
        if (activeUser.session) {
            actor = activeUser.accountName;
            permission = activeUser.requestPermission;
        }

        let demandant = this.props.asset.owner;

        let actions = [
            {
                account: NFTDEX_NAME,
                name: OFFERCREATE_ACTION,
                authorization: [
                    {
                        actor,
                        permission,
                    },
                ],
                data: {
                    supply_id,
                    demand_id,
                    creator: actor,
                    demandant,
                    expires_at,
                },
            },
        ];

        signTransaction(actions, activeUser).then(r => {
            this.setState({visibleModalCreateOffer: false});
            NotificationManager.success({message : <a
                    target="_blank"
                    href={"https://wax.bloks.io/transaction/" + r.transactionId}>Success : ViewTx</a>})
        }).catch(e => {
            NotificationManager.error({message : e.message})
        })


    };

    render() {
        const {asset, ual} = this.props;
        const {
            loadingAsset,
            hasMoreAsset,
            nextKeyAsset,
            loadingHistory,
            hasMoreHistory,
            nextKeyHistory,
            ownerAssets,
            history,
            visibleModalCreateOffer,
            success,
            error,
            warning
        } = this.state;
        return (
            <Wrapper
                // className={visibleModalCreateOffer ? "overflow-hidden fixed " : ""}
            >
                <div className={"grid grid-cols-1 md:grid-cols-5 md:gap-12"}>
                    <div className={"img-wrapper grid-cols-5 md:col-span-2"}>
                        {/*<img src={"https://i.stack.imgur.com/y9DpT.jpg"} alt={""} className={"h-full w-full"}/>*/}
                        <ReactImageFallback
                            src={asset.data.img}
                            fallbackImage="https://i.stack.imgur.com/y9DpT.jpg"
                            initialImage="https://i.stack.imgur.com/y9DpT.jpg"
                            // initialImage="https://i.pinimg.com/originals/a2/dc/96/a2dc9668f2cf170fe3efeb263128b0e7.gif"
                            alt={asset.data.name}
                            className={"image"}
                            // onLoad={() => {
                            //     onLoad(item)
                            // }}
                        />
                    </div>
                    <div className={"img grid-cols-5 md:col-span-3 pb-2 "} style={{height: "100%"}}>
                        {

                            <div className={"flex flex-row justify-center md:justify-start"}>
                                <Button onClick={this.showCreateOffer}>
                                    Create offer
                                </Button>
                            </div>
                        }
                        <div className={"grid grid-cols-2 gap-4 px-5 md:px-0"}>
                            <div className={"col-span-2 md:col-span-1"}>
                                <TextTitle>Asset Identification Data </TextTitle>
                                <div className={"grid grid-cols-2 gap-4 mt-3"}>
                                    <Text>NFT ID: </Text>
                                    <Text>{asset.sasset_id}</Text>
                                </div>
                                <div className={"grid grid-cols-2 gap-4 mt-3"}>
                                    <Text>Category: </Text>
                                    <Text className={"text-high"}>{asset.category}</Text>
                                </div>
                                <div className={"grid grid-cols-2 gap-4 mt-3"}>
                                    <Text>Author: </Text>
                                    <Text className={"text-high"}>{asset.author}</Text>
                                </div>
                                <div className={"grid grid-cols-2 gap-4 mt-3"}>
                                    <Text>Owner: </Text>
                                    <Text className={"text-high"}>{asset.owner}</Text>
                                </div>

                            </div>
                            <div className={"col-span-2 md:col-span-1"}>
                                {
                                    Object.keys(asset.idata).length > 0 && <div>
                                        <TextTitle>Immutable Asset Data </TextTitle>
                                        {Object.keys(asset.idata).map((i, index) => (
                                            <div key={asset.idata[i] + index} className={"grid grid-cols-2 gap-4 mt-3"}>
                                                <Text>{i}: </Text>
                                                <Text>{asset.idata[i] || ""}</Text>
                                            </div>))}
                                    </div>
                                }
                                {
                                    Object.keys(asset.mdata).length > 0 && <div className={"mt-5"}>
                                        <TextTitle>Mutable Meta Data</TextTitle>
                                        {Object.keys(asset.mdata).map(m => (
                                            <div className={"grid grid-cols-2 gap-4 mt-3"}>
                                                <Text>{m}: </Text>
                                                <Text>{asset.mdata[m] || "--"}</Text>
                                            </div>))}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className={"grid-cols-5 md:col-span-2 "}>
                        <BoxHeader>
                            Other NFs for trade by <span className={"text-high"}>{asset.owner}</span>
                        </BoxHeader>
                        <WrapperOwnerAsset>
                            <HorizontalLayout data={ownerAssets} loading={loadingAsset}/>
                        </WrapperOwnerAsset>
                    </div>
                    <div className={"grid-cols-5 md:col-span-3 "}>
                        <BoxHeader>
                            Action history for NFT ID {asset.sasset_id}
                        </BoxHeader>
                        <div className={" px-5 md:px-0"}>
                            <History data={history} getData={this.getHistory} loading={loadingHistory}
                                     hasMore={hasMoreHistory} nextKey={nextKeyHistory}
                                     asset={asset}
                            />
                        </div>
                    </div>
                </div>
                {
                    Object.keys(ual.activeUser || {}).length > 0 &&
                    <ModalCreateOffer asset={asset} activeUser={ual.activeUser}
                                      visible={visibleModalCreateOffer}
                                      createOffer={this.createOffer}
                                      onClose={this.onCloseModalCreateOffer}/>
                }
            </Wrapper>
        );
    }

}

export const getServerSideProps = async ({query}) => {
    try {
        const dataAsset = await getTable(NFTDEX_NAME, SIMPLEASSET_NAME, SASSETS_TABLE, 1, query.id, null)
        const asset = dataAsset.rows.map((item) => {
            const idata = JSON.parse(item.idata || "");
            const mdata = JSON.parse(item.mdata || "");
            // delete idata.name;
            // delete mdata.name;
            delete mdata.img;
            delete idata.img;
            delete idata.backimg;
            delete idata.fontimg;
            delete mdata.fontimg;
            delete mdata.backimg;
            return {
                ...item,
                data: formatDataAsset(item),
                idata,
                mdata
            }
        })[0]
        return {
            props: {
                asset,
            }
        }
    } catch (e) {
        console.log("e", e)
        return {
            props: {
                // error: e
            }
        }
    }
}
const mapStateToProps = (state) => ({
    app: state.app,
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators({setMenu, setPageTitle}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DetailAsset);


