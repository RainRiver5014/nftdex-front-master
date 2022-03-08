import React from "react";
import ReorderIcon from "@material-ui/icons/Reorder";
import Drawer from "./drawer";
import {useSelector} from "react-redux";
import styled from "styled-components";
import tw from "twin.macro";
import UserPanel from "./user";

const StyleRow = styled.div`
  ${tw`flex flex-row items-center`}
`;
const StyleHeader = styled.header`
  ${tw`flex flex-row h-14 top-0 right-8 inset-x-0 bg-primary fixed z-10`}& {
    padding-left: 24px;
    @media (max-width: 768px) {
      padding-left: 12px;
    }
  }
`;
const StyleImage = styled.img`
  ${tw`h-8`}
`;
const ShowMobile = styled.div`
  ${tw`md:hidden block`}
`;
const HiddenMobile = styled.div`
  ${tw` `}
`;
const StyleLeftHeader = styled(StyleRow)`
  a {
    ${tw`block md:mr-8 mr-4`}
    & > span {
      ${tw`text-select font-medium text-3xl ml-1 md:ml-5`}
    }

    & > p {
      ${tw`font-bold md:hidden `}
    }
  }

  p {
    ${tw`font-bold hidden md:block `}
  }
`;
// const StyleHeader = tw.header`flex flex-row justify-between bg-red-500 py-6 px-6 w-full`
const Header = ({...props}) => {
    const [isShow, setShowDrawer] = React.useState(false);
    const {pageTitle} = useSelector((store) => store.app);
    const onClose = () => {
        setShowDrawer(false)
    }
    const onOpen = () => {
        setShowDrawer(true)
    }
    return (
        <StyleHeader>
            <StyleLeftHeader>
                <ReorderIcon
                    className={"mr-2 cursor-pointer"}
                    onClick={() => setShowDrawer(true)}
                />
                <a href="/">
                    <span>NFTDEX</span>
                    <p>{pageTitle}</p>
                </a>
                <p>{pageTitle}</p>
            </StyleLeftHeader>
            {/*<ShowMobile className={"md:hidden block"}>*/}
            {/*  <MoreVertIcon />*/}
            {/*</ShowMobile>*/}
            <HiddenMobile className={""}>
                <UserPanel {...props} />
            </HiddenMobile>
            <Drawer isOpen={isShow} onClose={onClose} onOpen={onOpen}/>
        </StyleHeader>
    );
};

export default Header;
