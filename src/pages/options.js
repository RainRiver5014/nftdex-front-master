import React from "react";
import {setMenu, setPageTitle} from "../store/actions/app.action";
import styled from "styled-components";
import {getTable, signTransaction} from "../services/chainControllers";
import {NFTDEX_NAME, OPTION_ACCEPT, SASSETS_TABLE, SIMPLEASSET_NAME} from "../ContractAbi";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {formatDataAsset} from "../../utils/helps";
import ReactImageFallback from "react-image-fallback";
import _ from "lodash";
import {Dialog, DialogActions, DialogTitle, Skeleton, Slide} from "@material-ui/core";
import Modal from "../components/libs/modal";
import NFTCalendar from "../components/NFTCalendar";
import NFTButton from "../components/NFTButton";
import {getRequestWithoutToken} from "../../utils/apiClient";
import OptionItem from "../components/Item/option";
import Router from "next/router";
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

class Options extends React.Component {
    state = {
        assets: [],
        loading: false,
        options: [],
        assetSelect: {},
        assetLoading: true,
        optionLoading: true,
        filterOptions: [],
        allChecked: false,
        new_expires_at: new Date(),
        option_id: "",
        success: false,
        error: false,
        warning: false,
        confirm: false,
        optionAccept: {}
    }

    componentDidMount() {
        this.props.setMenu("options")
        this.props.setPageTitle("Trade Options Received")
        setTimeout(() => {
            this.getData();
            this.getUserAsset();
        }, 500)
    }

    componentDidUpdate(prevProps, pprevStates) {
        // Typical usage (don't forget to compare props):
        if (this.props?.ual?.activeUser?.accountName !== prevProps?.ual?.activeUser?.accountName && !!this.props?.ual?.activeUser?.accountName) {
            this.setState({filterOptions: [], options: []})
            this.getData();
            this.getUserAsset();
        }
    }

    getData = () => {
        const {ual} = this.props;
        const {options} = this.state;
        if (Object.keys(ual.activeUser || {}).length > 0) {
            this.setState({optionLoading: true})
            const {accountName} = ual.activeUser
            getRequestWithoutToken("/options/" + accountName).then(res => {
                const newOptions = res?.data?.options.map(option => ({...option, checked: false}))
                this.setState({options: options.concat(newOptions), filterOptions: []})

            }).catch(e => {
                NotificationManager.error({message: e.message})
            }).finally(fn => {
                this.setState({optionLoading: false})
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
                NotificationManager.error({message: e.message})
            }).finally(fn => {
                this.setState({assetLoading: false})
            })

        }
    }
    onCheck = (option_id) => {
        const options = Object.keys(this.state.assetSelect).length > 0 ? this.state.filterOptions : this.state.options;
        const newOptions = options.map(option => ({
            ...option,
            checked: option.option_id === option_id ? !option.checked : option.checked
        }))
        const allChecked = newOptions.filter(option => option.checked).length === newOptions.length;
        if (Object.keys(this.state.assetSelect).length > 0) {
            this.setState({filterOptions: newOptions, allChecked})
        } else {
            this.setState({options: newOptions, allChecked})
        }

    }

    onSelectAsset = (userAsset) => {
        const assetSelect = userAsset.sasset_id === this.state.assetSelect.sasset_id ? {} : userAsset
        const {options} = this.state;
        this.setState({assetSelect, allChecked: false})
        if (Object.keys(assetSelect).length > 0) {
            const newOptions = options.filter(option => option?.supply?.sasset_id === userAsset.sasset_id)
            this.setState({filterOptions: newOptions.map(option => ({...option, checked: false})), options: []})
        } else {
            this.getData();
        }
    }
    onCheckAll = (e) => {
        const options = Object.keys(this.state.assetSelect).length > 0 ? this.state.filterOptions : this.state.options;
        const newOptions = options.map(option => ({
            ...option,
            checked: e.target.checked
        }))
        if (Object.keys(this.state.assetSelect).length > 0) {
            this.setState({filterOptions: newOptions, allChecked: e.target.checked})
        } else {
            this.setState({options: newOptions, allChecked: e.target.checked})
        }
    }
    onAcceptTrade = (optionAccept) => {
        this.setState({confirm: true, optionAccept})
    }

    acceptTrade = () => {
        console.log("hello")
        const {
            ual: {activeUser},
        } = this.props;
        const {optionAccept} = this.state;
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
        const supply_id = optionAccept.supply.sasset_id;
        const demand_id = optionAccept.demand.sasset_id;
        const creator = optionAccept.supply_owner;
        const demandant = optionAccept.demand_owner;

        getRequestWithoutToken("selectedPath/" + supply_id + "/" + demand_id).then(res => {
            const selectedPath = res.data.selectedPath;

            let actions = [
                {
                    account: NFTDEX_NAME,
                    name: OPTION_ACCEPT,
                    authorization: [
                        {
                            actor,
                            permission,
                        },
                    ],
                    data: {
                        supply_id,
                        demand_id,
                        creator,
                        demandant,
                        selectedPath

                    },
                },
            ];
            console.log("actions", actions)
            signTransaction(actions, activeUser).then(r => {
                const options = Object.keys(this.state.assetSelect).length > 0 ? this.state.filterOptions : this.state.options;
                const newOptions = options.filter(option => option.supply.sasset_id !== optionAccept.supply.sasset_id && option.demand.sasset_id !== optionAccept.demand.sasset_id)
                if (Object.keys(this.state.assetSelect).length > 0) {
                    this.setState({
                        confirm: false,
                        filterOptions: newOptions
                    });
                } else {
                    this.setState({confirm: false, options: newOptions});
                }
                NotificationManager.success({
                    message: <a
                        target="_blank"
                        href={"https://wax.bloks.io/transaction/" + r.transactionId}>ViewTx</a>
                })
                Router.push("/trades")
            }).catch(e => {
                NotificationManager.error({message: e.message})
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
    renderOptionLoading = () => {
        const array = _.range(1, 10);
        return _.map(array, (item, index) => <OptionItem key={"index-" + index + "-" + "order"} loading={true}/>)
    }


    render() {
        const {
            assets,
            assetSelect,
            assetLoading,
            optionLoading,
            options,
            filterOptions,
            allChecked,
            modalCalendarVisible,
            new_expires_at,
            confirm
        } = this.state;
        const {ual} = this.props;
        if (Object.keys(ual.activeUser || {}).length === 0) {
            return <div className={"flex text-center justify-center"}>Please login to continue</div>
        }
        return <Wrapper>
            <div className={"title flex text-center justify-center my-2"}>
                Filter By Option Supply
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
            {/*<FilterOption onCheck={this.onCheckAll} checked={allChecked}/>*/}
            {filterOptions.length === 0 && options.length === 0 && !optionLoading &&
            <div className={"flex text-center justify-center w-full mt-6"}>No options</div>}
            <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-12  md:mr-5 mt-6"}>
                {(Object.keys(assetSelect).length > 0 ? filterOptions : options).map((option, index) =>
                    <div className={"col-span-2 md:col-span-1"} key={"option-" + index + "-" + option.option_id}>
                        <OptionItem data={option}
                                    onAcceptTrade={this.onAcceptTrade}
                                    onCheck={this.onCheck} dataSupply={assets}/>
                    </div>
                )}
                {optionLoading && this.renderOptionLoading()}
            </div>
            <Modal visible={modalCalendarVisible} onOk={this.acceptTrade}
                   onClose={() => this.setState({modalCalendarVisible: false})}
                   title={"New expires at"}
                   okText={"Renew option"}
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
                <DialogTitle id="alert-dialog-slide-title">{"Do you want to accept trade?"}</DialogTitle>
                <DialogActions>
                    <NFTButton type={"cancel"} onClick={() => this.setState({confirm: false})} title={"Cancel"}/>
                    <NFTButton onClick={this.acceptTrade} title={"Ok"}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Options);