import React, {useEffect} from "react";
import Head from "next/head";
import Header from "../header";
import BottomNav from "../navigations/BottomNavigation";
import LeftNavigation from "../navigations/LeftNavigation";
import styled from "styled-components";
import tw from "twin.macro";
import io from "socket.io-client";
import {NotificationManager} from "../NFTNotifications";
const socket = io("ws://18.206.16.196:3001", { transports: ["websocket"] });
const StyleContainer = styled.div`
  ${tw`flex flex-row`}& {
    @media (min-width: 768px) {
      margin-right: 64px;
    }
  }
`;
const StyleCol = styled.div`
  ${tw`flex flex-col md:ml-48 w-full`}
`;
const Container = styled.div`${tw`min-h-screen py-14 bg-gradient-to-b from-primary-top to-primary-bottom`}`
// const socket = io("ws://18.206.16.196:3001");
const MainLayout = ({...props}) => {
    useEffect(() => {
        if(props?.ual?.activeUser){
            socket.on(props?.ual?.activeUser?.accountName, data => {
                NotificationManager.success({message : "Trade success with ID :" + data.supply_id})
            })
        }

    },[props.ual.activeUser])
    return (
        <div className="">
            <Head>
                <link rel="shortcut icon" href="/img/favicon.ico"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <title>NFT Trade Market</title>
                <meta name="description" content="description"/>
                <meta name="generator" content="generator"/>
                <meta name="copyright" content="© 2021 nftdex"/>
                <meta name="keywords" content=""/>
                <meta name="news_keywords" content=""/>
                <meta name="robots" content="index,follow"/>
                <meta name="author" content="OkLabel"/>
                <meta property="og:type" content="article"/>
                <meta property="fb:app_id" content=""/>
                <meta property="og:url" content=""/>
                <meta property="og:title" content=""/>
                <meta property="og:description" content=""/>
                <meta property="og:image" content=""/>
                <meta property="og:image:type" content="image/jpeg"/>
                <meta property="og:image:width" content="600"/>
                <meta property="og:image:height" content="315"/>
                <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1.0"/>
                <meta name="apple-mobile-web-app-capable" content="yes"/>
                <link rel="stylesheet"
                      href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"/>
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
                <link rel="canonical" href=""/>
            </Head>
            <Container>
                <Header {...props} />
                <StyleContainer>
                    <LeftNavigation/>
                    <StyleCol>
                        {props.children}
                    </StyleCol>
                </StyleContainer>
                <BottomNav/>
            </Container>
        </div>
    );
};

export default MainLayout;
