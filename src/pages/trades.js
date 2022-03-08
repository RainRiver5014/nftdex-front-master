import React from "react";
import {bindActionCreators} from "redux";
import {setMenu, setPageTitle} from "../store/actions/app.action";
import {connect} from "react-redux";
import {getTradeHistoryByAccount} from "../services/chainControllers";
import lodash from "lodash";
import NFTTrades from "../components/Item/trades";

class Trades extends React.Component {

    state = {
        loading: false,
        tradeHistory: [],
        simpleAssets: []
    }

    componentDidMount() {
        this.props.setMenu("trades")
        this.props.setPageTitle("Trade History")
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
                const tradeHistory = await getTradeHistoryByAccount(accountName)
                const results = tradeHistory?.data?.searchTransactionsBackward?.results;
                console.log("results", results)
                const data = results.map(result => {
                    const matchingActions = result?.trace?.matchingActions || [];
                    const supplyAction = lodash.find(matchingActions, action => action?.json?.supply_owner === ual.activeUser.accountName)
                    console.log("supplyAction", supplyAction)
                    const actionData = {
                        ...supplyAction,
                    }

                    return {
                        ...actionData,
                        cursor: result.cursor
                    }
                })
                console.log("data", data)

                this.setState({
                    tradeHistory: data || [],
                    // simpleAssets
                })
            } catch (e) {
                console.log("ee", e)
            }
            this.setState({loading: false})
        }

    }

    renderLoading = () => {
        const array = lodash.range(1, 10);
        return lodash.map(array, (item, index) => <NFTTrades key={"loading-index-" + index} loading={true}/>)
    }

    render() {
        const {tradeHistory, loading} = this.state;
        const {ual} = this.props;
        if (Object.keys(ual.activeUser || {}).length === 0) {
            return <div className={"flex text-center justify-center"}>Please login to continue</div>
        }
        const {accountName} = ual.activeUser
        return <div>
            {/*<FilterTrades/>*/}
            <div className={"mt-4"}>
                {tradeHistory.length === 0 && !loading &&
                <div className={"flex text-center justify-center w-full"}>No trade</div>}
                <div className={"grid grid-cols-1 lg:grid-cols-2 md:gap-12 md:mr-5 ml-4"}>
                    {tradeHistory.map((asset, index) =>
                        <div className={"col-span-2 sm:col-span-1"} key={"asset-" + index}>
                            <NFTTrades data={asset} supply={accountName}/>
                        </div>
                    )}
                    {loading && this.renderLoading()}
                </div>
            </div>
        </div>
    }
}

const mapStateToProps = state => ({
    app: state.app
});

const mapDispatchToProps = dispatch =>
    bindActionCreators({setMenu, setPageTitle}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Trades);