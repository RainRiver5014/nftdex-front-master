import styled from "styled-components";
import SearchIc from '@material-ui/icons/Search';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import tw from "twin.macro";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {Checkbox} from "@material-ui/core";
import {NotificationManager} from "../NFTNotifications";
import React from "react";

const LeftContent = styled.div`${tw`mx-4`}`
const RightContent = styled.div`${tw`md:mx-4 flex flex-row justify-between md:col-span-2`}`
const SearchIcon = styled(SearchIc)`${tw`ml-4 text-sub-title text-lg cursor-pointer`}`
const Container = styled.div`${tw`bg-gradient-to-r from-offer-left to-offer-right rounded-b justify-between py-4 md:px-2 mb-8 md:grid md:grid-cols-3 w-full `}`
const Row = styled.div`${tw`flex flex-row content-center items-center cursor-pointer`}`
const Text = styled.p`${tw`font-medium xl:text-base text-sm`}`
const FilterOffer = ({checked, onCheck}) => {
    return <Container>
        <LeftContent>
            {/*<SearchIcon style={{fontSize: 20}} onClick={() => enqueueSnackbar("hello")}/>*/}
        </LeftContent>
        <RightContent>
            <Row>
                <Text className={"hidden md:block"}>Select All</Text>
                <Checkbox checked={checked} onChange={onCheck}/>
            </Row>
            {/*<Row>*/}
            {/*    <Text>Collection:All</Text>*/}
            {/*    <ArrowDropDownIcon/>*/}
            {/*</Row>*/}
            <Row>
                <Text>Category:All</Text>
                <ArrowDropDownIcon/>
            </Row>
            <Row>
                <SearchIcon style={{fontSize: 20}}/>
            </Row>
            <Row>
                <MoreVertIcon className={"cursor-pointer"}/>
            </Row>
        </RightContent>
    </Container>
}

export default FilterOffer