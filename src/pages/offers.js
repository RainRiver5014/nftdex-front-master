import React from "react";
import {setMenu, setPageTitle} from "../store/actions/app.action";
import styled from "styled-components";
import {getTable, signTransaction} from "../services/chainControllers";
import {
    NFTDEX_NAME,
    OFFER_TABBLE,
    OFFERSDELETE_ACTION,
    OFFERSRENEW_ACTION,
    SASSETS_TABLE,
    SIMPLEASSET_NAME
} from "../ContractAbi";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {formatDataAsset} from "../../utils/helps";
import ReactImageFallback from "react-image-fallback";
import OfferItem from "../components/Item/offer";
import _ from "lodash";
import {Dialog, DialogActions, DialogTitle, Skeleton, Slide} from "@material-ui/core";
import Modal from "../components/libs/modal";
import NFTCalendar from "../components/NFTCalendar";
import NFTButton from "../components/NFTButton";
import NotificationManager from "../components/NFTNotifications/NotificationManager";

const Wrapper = styled.div`{
  .title {
    font-size: 16px;
    margin-top: 10px;
    margin-bottom: 10px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.87);
  }
}`

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class Offers extends React.Component {
    state = {
        assets: [],
        loading: false,
        offers: [],
        assetSelect: {},
        assetLoading: true,
        offerLoading: true,
        filterOffers: [],
        allChecked: false,
        new_expires_at: new Date(),
        offer_id: "",
        success: false,
        error: false,
        warning: false,
        confirm: false,
        next_key: ""
    }

    componentDidMount() {
        this.props.setMenu("offers")
        this.props.setPageTitle("Trade Offer Sent")
        if (this.props?.ual?.activeUser?.accountName) {
            setTimeout(() => {
                this.getData();
                this.getUserAsset();
            }, 500)
        }
    }

    componentDidUpdate(prevProps, pprevStates) {
        // Typical usage (don't forget to compare props):
        if (this.props?.ual?.activeUser?.accountName !== prevProps?.ual?.activeUser?.accountName && !!this.props?.ual?.activeUser?.accountName) {
            this.getData();
            this.getUserAsset();
        }
    }

    getData = (sasset_id) => {
        const {ual} = this.props;
        // const {offers, filterOffers} = this.state;
        if (Object.keys(ual.activeUser || {}).length > 0) {
            this.setState({offerLoading: true})
            const {accountName} = ual.activeUser
            getTable(NFTDEX_NAME, NFTDEX_NAME, OFFER_TABBLE, 100, sasset_id ? sasset_id : accountName, sasset_id ? sasset_id : accountName, sasset_id ? 2 : 4, "i64").then(res => {
                // const newOffers = res.rows.map(offer => ({...offer, checked: false}))
                const filterbyID = res.rows.filter((e) => e.supply_id === sasset_id)
                if (sasset_id) {
                    this.setState({filterOffers: filterbyID, offers: [], next_key: res.next_key})
                } else {
                    this.setState({filterOffers: res.rows, offers: res.rows, next_key: res.next_key})
                }
            }).catch(e => {
                console.log("e", e)
            }).finally(fn => {
                this.setState({offerLoading: false})
            })

        }
    }

    getUserAsset = () => {
        const {ual} = this.props;

        const {assets} = this.state;
        if (Object.keys(ual.activeUser || {}).length > 0) {
            this.setState({assetLoading: true})
            const {accountName} = ual.activeUser
            getTable(NFTDEX_NAME, SIMPLEASSET_NAME, SASSETS_TABLE, 100, accountName, accountName, 3).then(res => {
                let newAssets = res.rows.map((item) => {
                    return {...item, data: formatDataAsset(item), nextKey: res.next_key}
                })
                newAssets = newAssets.filter(asset => asset.status === "active")
                this.setState({assets: assets.concat(newAssets)})

            }).catch(e => {
                console.log("e", e)
            }).finally(fn => {
                this.setState({assetLoading: false})
            })

        }
    }
    onCheck = (offer_id) => {
        const offers = Object.keys(this.state.assetSelect).length > 0 ? this.state.filterOffers : this.state.offers;
        const newOffers = offers.map(offer => ({
            ...offer,
            checked: offer.offer_id === offer_id ? !offer.checked : offer.checked
        }))
        const allChecked = newOffers.filter(offer => offer.checked).length === newOffers.length;
        if (Object.keys(this.state.assetSelect).length > 0) {
            this.setState({filterOffers: newOffers, allChecked})
        } else {
            this.setState({offers: newOffers, allChecked})
        }

    }

    onSelectAsset = (userAsset) => {
        const assetSelect = userAsset.sasset_id === this.state.assetSelect.sasset_id ? {} : userAsset
        this.setState({assetSelect, allChecked: false})
        if (Object.keys(assetSelect).length > 0) {
            this.getData(userAsset?.sasset_id)
        } else {
            this.getData()
        }
    }
    onCheckAll = (e) => {
        const offers = Object.keys(this.state.assetSelect).length > 0 ? this.state.filterOffers : this.state.offers;
        const newOffers = offers.map(offer => ({
            ...offer,
            checked: e.target.checked
        }))
        if (Object.keys(this.state.assetSelect).length > 0) {
            this.setState({filterOffers: newOffers, allChecked: e.target.checked})
        } else {
            this.setState({offers: newOffers, allChecked: e.target.checked})
        }
    }
    onCancelOffer = (offer_id) => {
        this.setState({confirm: true, offer_id,})
    }
    cancelOffer = () => {
        const {
            ual: {activeUser},
        } = this.props;
        const {offer_id} = this.state;
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
                account: NFTDEX_NAME,
                name: OFFERSDELETE_ACTION,
                authorization: [
                    {
                        actor,
                        permission,
                    },
                ],
                data: {
                    creator: actor,
                    offer_id: offer_id
                },
            },
        ];
        signTransaction(actions, activeUser).then(r => {
            const offers = Object.keys(this.state.assetSelect).length > 0 ? this.state.filterOffers : this.state.offers;
            const newOffers = offers.filter(offer => offer.offer_id !== offer_id)
            if (Object.keys(this.state.assetSelect).length > 0) {
                this.setState({confirm: false, filterOffers: newOffers});

            } else {
                this.setState({confirm: false, offers: newOffers});

            }
            NotificationManager.success({
                message: <a
                    target="_blank"
                    href={"https://wax.bloks.io/transaction/" + r.transactionId}>ViewTx</a>
            })

        }).catch(e => {
            NotificationManager.error({message: e.message})
        })
    }
    onRenewOffer = (offer_id, expires_at) => {
        this.setState({modalCalendarVisible: true, offer_id, new_expires_at: expires_at})
    }

    renewOffer = () => {
        const {
            ual: {activeUser},
        } = this.props;
        const {new_expires_at, offer_id} = this.state;
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
                account: NFTDEX_NAME,
                name: OFFERSRENEW_ACTION,
                authorization: [
                    {
                        actor,
                        permission,
                    },
                ],
                data: {
                    creator: actor,
                    offer_id,
                    new_expires_at,
                },
            },
        ];
        signTransaction(actions, activeUser).then(r => {
            const offers = Object.keys(this.state.assetSelect).length > 0 ? this.state.filterOffers : this.state.offers;
            const newOffers = offers.map(offer => ({
                ...offer,
                expires_at: new_expires_at
            }))
            if (Object.keys(this.state.assetSelect).length > 0) {
                this.setState({
                    modalCalendarVisible: false,
                    filterOffers: newOffers
                });

            } else {
                this.setState({
                    modalCalendarVisible: false,
                    offers: newOffers
                });

            }
            NotificationManager.success({
                message: <a
                    target="_blank"
                    href={"https://wax.bloks.io/transaction/" + r.transactionId}>ViewTx</a>
            })

        }).catch(e => {
            NotificationManager.error({message: e.message})
        })
    }
    renderAssetLoading = () => {
        const array = _.range(1, 10);
        return _.map(array, (item, index) => <Skeleton key={"Skeleton" + index} variant="rect" width={150} height={150}
                                                       className={"mx-1"}
                                                       style={{borderRadius: 5}}/>)
    }
    renderOfferLoading = () => {
        const array = _.range(1, 10);
        return _.map(array, (item, index) => <OfferItem key={"index-" + index + "-" + "order"} loading={true}/>)
    }


    render() {
        const {
            assets,
            assetSelect,
            assetLoading,
            offerLoading,
            offers,
            filterOffers,
            allChecked,
            modalCalendarVisible,
            new_expires_at,
            success,
            error,
            warning,
            confirm
        } = this.state;
        const {ual} = this.props;
        if (Object.keys(ual.activeUser || {}).length === 0) {
            return <div className={"flex text-center justify-center"}>Please login to continue</div>
        }
        return <Wrapper>
            <div className={"title flex text-center justify-center my-2"}>
                Filter By Offer Supply
            </div>
            {assets.length === 0 && !assetLoading && <div className={"flex text-center justify-center"}>No Assets</div>}
            <div className={"flex overflow-x-scroll hide-scroll-bar"}>
                <div className={"flex flex-nowrap"}>
                    {
                        assets.map(userAsset =>
                            <div className={"mx-1"} key={userAsset?.data?.name + "-" + userAsset.sasset_id} style={{
                                width: 150,
                                height: 150,
                                backgroundColor: "#fff",
                                marginBottom: 10,
                                borderRadius: assetSelect.sasset_id === userAsset.sasset_id ? 10 : 5,
                            }}>
                                <ReactImageFallback
                                    key={userAsset.sasset_id}
                                    src={userAsset?.data?.img}
                                    fallbackImage="https://i.stack.imgur.com/y9DpT.jpg"
                                    initialImage="https://i.stack.imgur.com/y9DpT.jpg"
                                    // initialImage="https://i.pinimg.com/originals/a2/dc/96/a2dc9668f2cf170fe3efeb263128b0e7.gif"
                                    alt={userAsset?.data?.name}
                                    className={"w-full h-full"}
                                    style={{
                                        borderRadius: assetSelect.sasset_id === userAsset.sasset_id ? 10 : 5,
                                        borderColor: assetSelect.sasset_id === userAsset.sasset_id ? "#B52929" : "#fff",
                                        borderWidth: assetSelect.sasset_id === userAsset.sasset_id ? 2 : 0
                                    }}
                                    onClick={this.onSelectAsset.bind(this, userAsset)}
                                />
                            </div>
                        )
                    }
                    {assetLoading && this.renderAssetLoading()}
                </div>
            </div>
            {/*<FilterOffer onCheck={this.onCheckAll} checked={allChecked}/>*/}
            {filterOffers.length === 0 && offers.length === 0 && !offerLoading &&
                <div className={"flex text-center justify-center w-full mt-6"}>No offers</div>}
            <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-12  md:mr-5 mt-6"}>
                {(Object.keys(assetSelect).length > 0 ? filterOffers : offers).map((offer, index) =>
                    <div className={"col-span-2 md:col-span-1"} key={"offer-" + index + "-" + offer.offer_id}>
                        <OfferItem data={offer}
                                   onCancel={this.onCancelOffer}
                                   onRenew={this.onRenewOffer}
                                   onCheck={this.onCheck} dataSupply={assets}/>
                    </div>
                )}
                {offerLoading && this.renderOfferLoading()}
            </div>
            <Modal visible={modalCalendarVisible} onOk={this.renewOffer}
                   onClose={() => this.setState({modalCalendarVisible: false})}
                   title={"New expires at"}
                   okText={"Renew Offer"}
            >
                <div className={"py-10"}>
                    <NFTCalendar
                        minDate={new Date()}
                        value={new Date(new_expires_at)}
                        onChange={(value) => {
                            this.setState({new_expires_at: value})
                        }}/>
                </div>
            </Modal>
            <Dialog
                open={confirm}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => this.setState({confirm: false})}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{"Do you want to cancel this offer?"}</DialogTitle>
                <DialogActions>
                    <NFTButton type={"cancel"} onClick={() => this.setState({confirm: false})} title={"Cancel"}/>
                    <NFTButton onClick={this.cancelOffer} title={"Ok"}/>
                </DialogActions>
            </Dialog>
        </Wrapper>
    }
}

const mapStateToProps = (state) => ({
    app: state.app,
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators({setMenu, setPageTitle}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Offers);