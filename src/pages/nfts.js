import React from "react";
import {bindActionCreators} from "redux";
import {setMenu, setPageTitle} from "../store/actions/app.action";
import {connect} from "react-redux";
import {NFTTab, NFTTabs} from "../components/NFTTabs";
import {getTable, signTransaction} from "../services/chainControllers";
import {CANCELOFFER_SA_ACTION, NFTDEX_NAME, SASSETS_TABLE, SIMPLEASSET_NAME} from "../ContractAbi";
import lodash from "lodash";
import NFTPageItem from "../components/Item/nftPage";
import NFTButton from "../components/NFTButton";
import NotificationManager from "../components/NFTNotifications/NotificationManager";

class NftPage extends React.Component {

    state = {
        tab: "1",
        listForTrade: [],
        listNotTrade: [],
        loading: false,
        allChecked: false
    }

    componentDidMount() {
        this.props.setMenu("nfts")
        this.props.setPageTitle("NFTs")
        setTimeout(() => {
            this.getData()
        }, 500)
    }

    componentDidUpdate(prevProps, pprevStates) {
        // Typical usage (don't forget to compare props):
        if (this.props?.ual?.activeUser?.accountName !== prevProps?.ual?.activeUser?.accountName && !!this.props?.ual?.activeUser?.accountName) {
            this.getData();
        }
    }

    getData = async () => {
        const {ual} = this.props;
        if (Object.keys(ual.activeUser || {}).length > 0) {
            this.setState({loading: true})
            try {
                const {accountName} = ual.activeUser
                const getNftAssets = await getTable(NFTDEX_NAME, SIMPLEASSET_NAME, SASSETS_TABLE, 100, accountName, accountName, 3)
                const getSimpleAssets = await getTable(SIMPLEASSET_NAME, accountName, SASSETS_TABLE, 100)
                const nftAssets = getNftAssets?.rows || [];
                const simpleAssets = getSimpleAssets?.rows || [];
                let listForTrade = [];
                let listNotTrade = [];
                lodash.each(simpleAssets, asset => {
                    const check = lodash.find(nftAssets, nftAsset => nftAsset.sasset_id === asset.id)
                    if (Object.keys(check || {}).length > 0) {
                        listForTrade.push({...asset, checked: false})
                    } else {
                        listNotTrade.push({...asset, checked: false})
                    }
                })
                this.setState({listForTrade, listNotTrade})
            } catch (e) {
                console.log("ee", e)
            }
            this.setState({loading: false})
        }

    }

    onChangeTab = (tab) => {
        const newListForTrade = this.state.listForTrade.map(asset => ({...asset, checked: false}))
        const newListNotTrade = this.state.listNotTrade.map(asset => ({...asset, checked: false}))
        this.setState({tab, allChecked: false, listForTrade: newListForTrade, listNotTrade: newListNotTrade})
    }

    unListedTrade = (data) => {
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
        let actions = [
            {
                account: SIMPLEASSET_NAME,
                name: CANCELOFFER_SA_ACTION,
                authorization: [
                    {
                        actor,
                        permission,
                    },
                ],
                data: {
                    owner: data.owner,
                    assetids: [data.id]
                },
            },
        ];
        signTransaction(actions, activeUser).then(r => {
            const newListForTrade = this.state.listForTrade.filter(asset => asset.id !== data.id)
            const newListNotTrade = [data].concat(this.state.listNotTrade)
            NotificationManager.success({
                message: <a
                    target="_blank"
                    href={"https://wax.bloks.io/transaction/" + r.transactionId}>ViewTx</a>
            })
            this.setState({
                listForTrade: newListForTrade,
                listNotTrade: newListNotTrade
            });
        }).catch(e => {
            NotificationManager.error({message: e.message})
        })
    }
    listedForTrade = (data) => {
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
        let actions = [
            {
                account: SIMPLEASSET_NAME,
                name: "offer",
                authorization: [
                    {
                        actor,
                        permission,
                    },
                ],
                data: {
                    owner: data.owner,
                    newowner: NFTDEX_NAME,
                    assetids: [data.id],
                    memo: ""
                },
            },
        ];
        signTransaction(actions, activeUser).then(r => {
            const newListNotTrade = this.state.listNotTrade.filter(asset => asset.id !== data.id)
            const newListForTrade = [data].concat(this.state.listForTrade)
            NotificationManager.success({
                message: <a
                    target="_blank"
                    href={"https://wax.bloks.io/transaction/" + r.transactionId}>ViewTx</a>
            })
            this.setState({
                listNotTrade: newListNotTrade,
                listForTrade: newListForTrade
            });
        }).catch(e => {
            NotificationManager.error({message: e.message})
        })
    }

    renderLoading = () => {
        const array = lodash.range(1, 10);
        return lodash.map(array, (item, index) => <NFTPageItem key={"loading-index-" + index} loading={true}/>)
    }

    onCheck = (id) => {
        const data = this.state.tab === "1" ? this.state.listForTrade : this.state.listNotTrade;
        const newData = data.map(asset => ({
            ...asset,
            checked: asset.id === id ? !asset.checked : asset.checked
        }))

        const allChecked = newData.filter(asset => asset.checked).length === newData.length;
        if (this.state.tab === "1") {
            this.setState({listForTrade: newData, allChecked})
        } else {
            this.setState({listNotTrade: newData, allChecked})
        }
    }

    onCheckAll = (e) => {
        const data = this.state.tab === "1" ? this.state.listForTrade : this.state.listNotTrade;
        const newData = data.map(asset => ({
            ...asset,
            checked: e.target.checked
        }))
        if (this.state.tab === "1") {
            this.setState({listForTrade: newData, allChecked: e.target.checked})
        } else {
            this.setState({listNotTrade: newData, allChecked: e.target.checked})
        }
    }
    unListedAllTrade = () => {
        const listForTradeChecked = this.state.listForTrade.filter(obj => obj.checked)
        const data = listForTradeChecked.map(obj => obj.id)
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
        let actions = [
            {
                account: SIMPLEASSET_NAME,
                name: CANCELOFFER_SA_ACTION,
                authorization: [
                    {
                        actor,
                        permission,
                    },
                ],
                data: {
                    owner: activeUser.accountName,
                    assetids: data
                },
            },
        ];
        signTransaction(actions, activeUser).then(r => {
            const newListForTrade = lodash.differenceWith(this.state.listForTrade, data, lodash.isEqual);
            const newListNotTrade = listForTradeChecked.concat(this.state.listNotTrade)
            NotificationManager.success({
                message: <a
                    target="_blank"
                    href={"https://wax.bloks.io/transaction/" + r.transactionId}>ViewTx</a>
            })
            this.setState({
                listForTrade: newListForTrade,
                listNotTrade: newListNotTrade
            });
        }).catch(e => {
            NotificationManager.error({message: e.message})
        })
    }

    listedForAllTrade = () => {
        const listNotTradeChecked = this.state.listNotTrade.filter(obj => obj.checked)
        const data = listNotTradeChecked.map(obj => obj.id)
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
        let actions = [
            {
                account: SIMPLEASSET_NAME,
                name: "offer",
                authorization: [
                    {
                        actor,
                        permission,
                    },
                ],
                data: {
                    owner: activeUser.accountName,
                    newowner: NFTDEX_NAME,
                    assetids: data,
                    memo: ""
                },
            },
        ];
        signTransaction(actions, activeUser).then(r => {
            const newListNotTrade = lodash.differenceWith(this.state.listNotTrade, data, lodash.isEqual);
            const newListForTrade = listNotTradeChecked.concat(this.state.listForTrade)
            NotificationManager.success({
                message: <a
                    target="_blank"
                    href={"https://wax.bloks.io/transaction/" + r.transactionId}>ViewTx</a>
            })
            this.setState({
                listNotTrade: newListNotTrade,
                listForTrade: newListForTrade
            });
        }).catch(e => {
            NotificationManager.error({message: e.message})
        })
    }

    render() {
        const {tab, listForTrade, listNotTrade, loading, success, error, allChecked} = this.state;
        const {ual} = this.props;
        if (Object.keys(ual.activeUser || {}).length === 0) {
            return <div className={"flex text-center justify-center"}>Please login to continue</div>
        }

        const unListedAllTrade = listForTrade.filter(obj => obj.checked).length < 2;
        const listedForAllTrade = listNotTrade.filter(obj => obj.checked).length < 2;
        return <div>
            {/*<FilterNftPage onCheck={this.onCheckAll} checked={allChecked}/>*/}
            <div className={"mt-4"}>
                <NFTTabs value={tab} onChange={this.onChangeTab}>
                    <NFTTab key={1} label={"LISTED FOR TRADE"}>
                        <NFTButton title={"Delist all"} onClick={this.unListedAllTrade} disabled={unListedAllTrade}/>
                        {listForTrade.length === 0 && !loading &&
                            <div className={"flex text-center justify-center w-full"}>No assets</div>}
                        <div className={"flex flex-wrap"}>
                            {listForTrade.map((asset, index) =>
                                <div className={"px-4"} key={"asset-" + index}>
                                    <NFTPageItem data={asset}
                                                 type={"trade"}
                                                 onCheck={this.onCheck}
                                                 onAction={this.unListedTrade}/>
                                </div>
                            )}
                            {loading && this.renderLoading()}
                        </div>
                    </NFTTab>
                    <NFTTab key={2} label={"NOT FOR TRADE"}>
                        <NFTButton title={"List for trade"} onClick={this.listedForAllTrade}
                                   disabled={listedForAllTrade}/>
                        {listNotTrade.length === 0 && !loading &&
                            <div className={"flex text-center justify-center w-full"}>No asset</div>}
                        <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-12  md:mr-5"}>
                            {listNotTrade.map((asset, index) =>
                                <div className={"col-span-2 md:col-span-1"} key={"asset-" + index}>
                                    <NFTPageItem data={asset}
                                                 onCheck={this.onCheck}
                                                 onAction={this.listedForTrade}/>
                                </div>
                            )}
                            {loading && this.renderLoading()}
                        </div>
                    </NFTTab>

                </NFTTabs>
            </div>
        </div>
    }
}

const mapStateToProps = state => ({
    app: state.app
});

const mapDispatchToProps = dispatch =>
    bindActionCreators({setMenu, setPageTitle}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(NftPage);