import { dfuseClient } from "./chainConnect";
import {NFTDEX_NAME, TRADELOG_ACTION} from "../ContractAbi";
import {InboundMessageType} from "@dfuse/client";
import {useEffect} from "react";
// Init it when loggined
export const SCListener = () => {
     dfuseClient
         .streamActionTraces(
             {
                 accounts: NFTDEX_NAME,
                 action_names: TRADELOG_ACTION,
             },
             async (message) => {
                 if (message.type === InboundMessageType.ACTION_TRACE) {
                     const data = message.data.trace.act.data;
                     console.log("data tradelog: ", data);
                     const { demand_id, demand_owner, supply_id, supply_owner, traded } =
                         data;
                     // Call notify here by current user
                 }
             }
         )
         .catch((error) => {
             console.log("An error occurred.", error);
         });
};
