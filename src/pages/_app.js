import "../styles/globals.css";
import "../styles/calendar.css";
// import "react-notifications/lib/notifications.css";

import "tailwindcss/tailwind.css";
import "../styles/app.scss";
import React from "react";
import { Provider, useStore } from "react-redux";
import { wrapper } from "../store";
import { ThemeProvider } from "styled-components";
import MainLayout from "../components/layouts/main";
// The required ual-reactjs-renderer with ual-anchor, ual-scatter, and ual-ledger
import { UALProvider, withUAL } from "ual-reactjs-renderer";
import { Anchor } from "ual-anchor";
import { Ledger } from "ual-ledger";
import { Lynx } from "ual-lynx";
// import { Scatter } from "ual-scatter";
import blockchains from "../assets/blockchains.json";
import { getResponsive } from "../../utils/helps";
import { CssBaseline } from "@material-ui/core";
import { NotificationContainer } from "../components/NFTNotifications";
import { io } from "socket.io-client";
// const socket = io("ws://18.206.16.196:3001");
// Define the app name for UAL
const appName = "eoslab-nft-dex";
const runningChain = blockchains[0];
const anchor = new Anchor([runningChain], { appName });
// const scatter = new Scatter([runningChain], { appName });
const lynx = new Lynx([runningChain]);
const ledger = new Ledger([runningChain], { appName });
const theme = {
  colors: {
    primary: "#0070f3",
    main: "#ededed",
    select: "#b52929",
  },
};

const App = ({ Component, pageProps }) => {
  const Layout = withUAL(Component.Layout || MainLayout);
  const UALComponent = withUAL(Component);
  const screenWidth = getResponsive();
  const store = useStore();
  const [state, setState] = React.useState({
    proofKey: undefined,
    proofValid: undefined,
    response: undefined,
    session: undefined,
    sessions: [],
    transacting: false,
  });
  React.useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
    if (typeof window !== "undefined") {
      // SCListener()
    }
  }, []);

  return (
    <UALProvider
      appName={appName}
      authenticators={[anchor, lynx, ledger]}
      chains={blockchains}
      key={runningChain.chainId}
    >
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Layout
            appName={appName}
            authenticators={[anchor, lynx, ledger]}
            chain={runningChain}
            key={runningChain.chainId}
          >
            {" "}
            <CssBaseline />
            <UALComponent {...pageProps} screenWidth={screenWidth} />
            <NotificationContainer />
          </Layout>
        </ThemeProvider>
      </Provider>
    </UALProvider>
  );
};
export default wrapper.withRedux(App);
