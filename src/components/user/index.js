import MoreVertIcon from "@material-ui/icons/MoreVert";
import React, {useRef} from "react";
import styled from "styled-components";
import tw from "twin.macro";
import {List, ListItem, ListItemText, NoSsr, Popover,} from "@material-ui/core";

const WrapperButton = styled.button`
  ${tw`items-center flex flex-row shadow rounded-bl-md rounded-br-md bg-gray-200 py-2 px-1 md:px-4 h-auto absolute top-0 focus:outline-none focus:ring-0 focus:ring-transparent `}
  & {
    right: 24px;
    @media (max-width: 768px) {
      right: 12px;
    }
  }`;
const Button = styled(WrapperButton)`
{
  img {
    ${tw`h-4 w-4 mr-2`}
  }
}
`;
const Text = styled.p`{
  text-overflow: ellipsis;
  overflow: hidden;
  display: inline-block;
  //width: 220px;
  max-width: 300px;
  white-space: nowrap;
  @media (max-width: 768px) {
    max-width: 120px;
  }
}`

class ImageIcon extends React.Component {
    render() {
        return null;
    }
}

const UserPanel = ({...props}) => {
    const {activeUser, chain, users} = props.ual;
    const button = useRef(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    let addAccount = () => {
        props.ual.showModal();
    };
    let logout = () => {
        props.ual.logout();
        setAnchorEl(null)
    };
    const open = Boolean(anchorEl);
    if (users.length > 0) {
        return (
            <NoSsr>
                <Button ref={button} onClick={(e) => setAnchorEl(e.currentTarget)}>
                    <img
                        src={process.env.NEXT_PUBLIC_HREF + "/img/wax.png"}
                        alt={"avatar"}
                    />
                    <Text>{users[0].accountName}</Text>
                    <MoreVertIcon/>
                </Button>
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
                        <ListItem className={"cursor-pointer"}>
                            <ListItemText onClick={logout} primary="Logout"/>
                        </ListItem>
                    </List>
                </Popover>
            </NoSsr>
        );
    }
    return (
        <NoSsr>
            <Button onClick={addAccount}>
                <img
                    src={process.env.NEXT_PUBLIC_HREF + "/img/wax.png"}
                    alt={"avatar"}
                />
                <p>Login</p>
            </Button>
        </NoSsr>
    );
};

export default UserPanel;
