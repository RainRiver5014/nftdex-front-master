import styled from "styled-components";
import SearchIc from '@material-ui/icons/Search';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import tw from "twin.macro";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const RightContent = styled.div`${tw`flex flex-row justify-between md:col-span-2 mx-4`}`
const SearchIcon = styled(SearchIc)`${tw`ml-4 text-sub-title text-lg cursor-pointer`}`
const Container = styled.div`${tw`bg-gradient-to-r from-primary-left to-primary-right rounded-b py-4 md:px-2 mb-8 md:grid md:grid-cols-1 w-full `}`
const Row = styled.div`${tw`flex flex-row content-center items-center cursor-pointer`}`
const Text = styled.p`${tw`font-medium xl:text-base text-sm`}`
const FilterTrades = () => {
    return <Container>
        <RightContent>
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

export default FilterTrades