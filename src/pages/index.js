import React from "react";
import {bindActionCreators} from "redux";
import {setMenu, setPageTitle} from "../store/actions/app.action";
import {connect} from "react-redux";
import Banner from "../components/banner";
import Filter from "../components/filters/market";
import {formatDataAsset} from "../../utils/helps";
import {getTable, signTransaction} from "../services/chainControllers";
import {NFTDEX_NAME, OFFERCREATE_ACTION, SASSETS_TABLE, SIMPLEASSET_NAME} from "../ContractAbi";
import VerticalLayout from "../components/layouts/vertical";
import styled from "styled-components";
import {NoSsr} from "@material-ui/core";
import ModalCreateOffer from "../components/ModalCreateOffer";
import {NotificationManager} from "../components/NFTNotifications";

const Title = styled.div`
{
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 10px;
}
`;

class MarketPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            assets: [],
            loading: false,
            hasMore: false,
            nextKey: "",
            filter: false,
            assetSelect: {}
        };
    }

    componentDidMount() {
        this.props.setMenu("market");
        this.props.setPageTitle("NFT Trade Market");
        this.getDataAssets();
    }

    onLoad = (item) => {
        const {assets} = this.state;
        const newAsset = assets.map((d) => {
            return {
                ...d,
                loading: d.loading ? true : d.sasset_id === item.sasset_id,
            };
        });

        this.setState({
            assets: newAsset,
        });
    };
    getDataAssets = (next = null) => {
        this.setState({loading: true});
        getTable(NFTDEX_NAME, SIMPLEASSET_NAME, SASSETS_TABLE, 20, next, null).then(
            (res) => {
                let assets = res.rows.map((item) => {
                    return {
                        ...item,
                        data: formatDataAsset(item),
                        nextKey: res.next_key,
                    };
                });
                assets = assets.filter(asset => asset.status === "active")

                if (this.props.ual?.activeUser?.accountName) {
                    assets = assets.filter(asset => asset.owner !== this.props.ual?.activeUser?.accountName)
                }
                const newAssets = this.state.assets.concat(assets);
                this.setState({
                    assets: newAssets,
                    loading: false,
                    filter: false,
                    hasMore: res.more,
                    nextKey: res.next_key,
                });
            }
        );
    };
    getDataFilterAssets = (text = null, key) => {
        this.setState({loading: true});
        getTable(NFTDEX_NAME, SIMPLEASSET_NAME, SASSETS_TABLE, 100, text, text, key).then(
            (res) => {
                let assets = res.rows.map((item) => {
                    return {
                        ...item,
                        data: formatDataAsset(item),
                        nextKey: res.next_key,
                    };
                });
                assets = assets.filter(asset => asset.status === "active")
                if (this.props.ual?.activeUser?.accountName) {
                    assets = assets.filter(asset => asset.owner !== this.props.ual?.activeUser?.accountName)
                }
                const newAssets = assets;
                this.setState({
                    assets: newAssets,
                    loading: false,
                    filter: true,
                    hasMore: res.more,
                    nextKey: res.next_key,
                });
            }
        );
    };

    showCreateOffer = (asset) => {
        const {ual} = this.props;
        if (Object.keys(ual.activeUser || {}).length === 0) {
            NotificationManager.warning({message: "Must login before using the feature."})

        } else {
            if (ual.activeUser?.accountName === asset.owner) {
                NotificationManager.warning({message: "Can’t create offer to your asset which you’ve owned."})
            } else {
                // console.log("asset", asset)
                this.setState({visibleModalCreateOffer: true, assetSelect: asset})

            }
        }
    }

    onCloseModalCreateOffer = () => {
        this.setState({visibleModalCreateOffer: false, assetSelect: {}})
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

        let demandant = this.state.assetSelect.owner;

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
            NotificationManager.success({
                message: <a
                    target="_blank"
                    href={"https://wax.bloks.io/transaction/" + r.transactionId}>Success : ViewTx</a>
            })

        }).catch(e => {
            NotificationManager.error({message: e.message})
        })


    };

    render() {
        const {assets, loading, hasMore, nextKey, success, warning, error, assetSelect} = this.state;
        const {ual} = this.props;
        // console.log("ual",ual)
        return (
            <div>
                <NoSsr>
                    <Title className={"block md:hidden flex text-center justify-center"}>
                        NFT Trade market
                    </Title>
                </NoSsr>
                <Banner/>
                <Filter filter={this.state.filter} onFilter={this.getDataFilterAssets} onReset={this.getDataAssets}/>
                <VerticalLayout
                    data={assets}
                    onLoad={this.onLoad}
                    loading={loading}
                    hasMore={hasMore}
                    nextKey={nextKey}
                    getData={this.getDataAssets}
                    onCreateOffer={this.showCreateOffer}
                />
                {
                    Object.keys(ual.activeUser || {}).length > 0 &&
                    <ModalCreateOffer asset={assetSelect} activeUser={ual.activeUser}
                                      visible={this.state.visibleModalCreateOffer}
                                      createOffer={this.createOffer}
                                      onClose={this.onCloseModalCreateOffer}/>
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    app: state.app,
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators({setMenu, setPageTitle}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MarketPage);
