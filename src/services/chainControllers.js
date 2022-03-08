import {dfuseClient, Eosio} from "./chainConnect";
import {SIMPLEASSET_NAME} from "../ContractAbi";

export const getTable = async (
    code,
    scope,
    tableName,
    limit = -1,
    upper_bound = undefined,
    lower_bound = undefined,
    index_position = 1,
    key_type = "i64"
) => {
    try {
        let eosio = new Eosio();
        return await eosio.rpc.get_table_rows({
            json: true, // Get the response as json
            code: code, // Contract that we target
            scope: scope, // Account that owns the data
            table: tableName, // Table name
            index_position,
            key_type,
            limit, // Maximum number of rows that we want to get
            reverse: true, // Optional: Get reversed data
            show_payer: false, // Optional: Show ram payer
            upper_bound,
            lower_bound,
        });
    } catch (err) {
        return {error: err};
    }
};

const queryTransactionnBackward = `query ($query: String!, $cursor: String, $limit: Int64, $low: Int64, $high: Int64) {
    searchTransactionsBackward(query: $query, lowBlockNum: $low, highBlockNum: $high, limit: $limit, cursor: $cursor) {
      results {
        cursor
        trace {
          block {
            num
            confirmed
            timestamp
          }
          id
          matchingActions {
            account
            name
            json
            receiver
          }
        }
      }
    }
  }`;

export const getHistoryByAssetId = async (id, cursor = "", limit = 150) => {
    try {
        return await dfuseClient.graphql(queryTransactionnBackward, {
            variables: {
                query: `receiver:${SIMPLEASSET_NAME} (data.assetid:${id} OR data.assetids:${id}) -action:saecreate -action:saetransfer`,
                cursor,
                limit,
            },
        });
    } catch (err) {
        return {error: err};
    }
};

export const getTradeHistoryByAccount = async (
    account,
    cursor = "",
    limit = 150
) => {
    try {
        return await dfuseClient.graphql(queryTransactionnBackward, {
            variables: {
                query: `receiver:${account} action:tradelog`,
                cursor,
                limit,
            },
        });
    } catch (err) {
        throw err
    }
};

export const signTransaction = async (actions, activeUser) => {
    try {
        // Call transact on the session
        return await activeUser.signTransaction(
            {
                actions,
            },
            {
                // Optional: Whether anchor-link should broadcast this transaction
                //    For this demo, anchor-link will not broadcast the transaction after receiving it
                broadcast: true,
                // Optional: Force using the last irreversible block for tapos
                useLastIrreversible: true,
                // Optional: TAPOS values
                // blocksBehind: 3,
                // expireSeconds: 120,
            }
        );
    } catch (e) {
        console.log(e);
        throw e;
    }
};
