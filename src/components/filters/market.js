import styled from "styled-components";
import SearchIc from '@material-ui/icons/Search';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import tw from "twin.macro";
import TuneIcon from '@material-ui/icons/Tune';
import {List, ListItem, ListItemText, Popover} from "@material-ui/core";
import React from "react";

const SearchInput = styled.input`${tw`bg-white border-t-2 border-l-2 border-primary rounded-md p-1 outline-none hidden md:block`}`
const SearchIcon = styled(SearchIc)`${tw`ml-4 text-sub-title text-lg cursor-pointer`}`
const Container = styled.div`${tw`bg-gradient-to-r from-primary-left to-primary-right rounded-b flex flex-row justify-end md:pl-14 py-4 px-4 mb-8 w-full `}`
const Row = styled.div`${tw`flex flex-row content-center items-center cursor-pointer`}`
const Text = styled.p`${tw`font-semibold xl:text-base text-sm`}`
const CheckBox = styled.input`${tw`ml-2 w-4 h-4 checked:border-t-2 border-l-2`}`
const listFilter = [
    {
        key: 0,
        name: "None"
    }, {
        key: 1,
        name: "Id"
    }, {
        key: 2,
        name: "Author"
    }, {
        key: 3,
        name: "Owner"
    }, {
        key: 4,
        name: "Category"
    },
]
const Market = ({onFilter, onReset, filter}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [filterBy, setSelectFilterBy] = React.useState(listFilter[0]);
    const [searchText, setSearchText] = React.useState("");
    const open = Boolean(anchorEl);
    const onBeforeFilter = () => {
        if (searchText.length > 0) {
            onFilter(searchText, filterBy.key)
        } else if (filter) {
            onReset()
        }
    }
    const onPressEnter = (e) => {
        if (!e) e = window.event;
        const keyCode = e.code || e.key;
        if (keyCode === 'Enter') {
            // Enter pressed
            onBeforeFilter()
            return false;
        }
    }
    return <Container>
        {/*<Row>*/}
        {/*    <Text>Collections:All</Text>*/}
        {/*    <ArrowDropDownIcon/>*/}
        {/*</Row>*/}
        {/*<Row>*/}
        {/*    <Text>Categories:All</Text>*/}
        {/*    <ArrowDropDownIcon/>*/}
        {/*</Row>*/}
        {/*<div className={"hidden md:block"}>*/}
        {/*    <Row>*/}
        {/*        <Text>Whilelisted Only</Text>*/}
        {/*        <CheckBox type={"checkbox"}/>*/}
        {/*    </Row>*/}
        {/*</div>*/}
        <div>
            <Row onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Text>Filter by: {filterBy.name}</Text>
                <ArrowDropDownIcon/>
            </Row>
        </div>
        <Row>
            <SearchInput onBlur={onBeforeFilter} onKeyPress={onPressEnter} value={searchText}
                         disabled={filterBy.key === 0} onChange={e => setSearchText(e?.target?.value)}/>
            <SearchIcon style={{fontSize: 20}} onClick={onBeforeFilter}/>
        </Row>
        <Row>
            <TuneIcon/>
        </Row>
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "center",
            }}
        >
            <List className={"min-w-full"}>
                {listFilter.map(fil => <ListItem className={"cursor-pointer"} onClick={() => {
                    if (fil.key === 0) {
                        setSearchText("")
                        onReset()
                    }
                    setAnchorEl(null)
                    setSelectFilterBy(fil)


                }}>
                    <ListItemText primary={fil.name}/>
                </ListItem>)}

            </List>
        </Popover>
    </Container>
}

export default Market