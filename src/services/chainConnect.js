import {
  createDfuseClient,
  waitFor,
  dynamicMessageDispatcher,
  OnStreamMessage,
  InboundMessageType,
} from "@dfuse/client";
import { JsonRpc } from "eosjs";
global.fetch = require("node-fetch");
global.WebSocket = require("websocket");

const dfuseConfig = {
  apiKey: process.env.NEXT_PUBLIC_DFUSE_API_KEY,
  network: process.env.NEXT_PUBLIC_DFUSE_NETWORK,
};

export const dfuseClient = createDfuseClient(dfuseConfig);

export class Eosio {
  constructor() {
    this.rpc = new JsonRpc(
      process.env.NEXT_PUBLIC_WAX_ENDPOINTS.split(" ")[0],
      {
        fetch,
      }
    );
  }

  async setWorkingEndpoint() {
    for (let endpoint of process.env.WAX_ENDPOINTS.split(" ")) {
      this.rpc = new JsonRpc(endpoint, { fetch });
      let isWork = await this.rpc
        .get_info()
        .then((res) => {
          return true;
        })
        .catch((err) => {
          console.log("err", err);
          return false;
        });

      if (isWork) {
        break;
      }
    }
  }
}
