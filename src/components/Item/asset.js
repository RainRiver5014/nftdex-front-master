import AddIcon from '@material-ui/icons/Add';
import styled from "styled-components";
import {Box, NoSsr, Skeleton} from "@material-ui/core";
import ReactImageFallback from "react-image-fallback";
import Router from "next/router";

const Wrapper = styled.div`{
  cursor: pointer;

  :hover {
    filter: drop-shadow(0px 5px 5px rgba(0, 0, 0, .3));
  }

  .item-content {
    margin-left: 5px;
    margin-right: 5px;

  }

  .title {
    font-weight: 400;
    font-size: 14px;
    margin-top: 8px;
    line-height: 20px;
    opacity: 87%;
  }

  .author {
    margin-top: 15px;
    margin-bottom: 1.5rem;
    font-size: 12px;
    opacity: 50%;
    align-self: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 150px;
  }

  .image {
    background-color: #ffffff;
    width: 100%;
  }

  @media (max-width: 768px) {
    .author {
      max-width: 60px;
    }
  }
}`

const AssetItem = ({img, name, author, loading, asset, onCreateOffer}) => {

    return <Wrapper>
        {
            loading ? <Skeleton variant="rect" width={"100%"} className={" h-20 md:h-40  "}/> : <ReactImageFallback
                src={img}
                fallbackImage="https://i.stack.imgur.com/y9DpT.jpg"
                initialImage="https://i.stack.imgur.com/y9DpT.jpg"
                // initialImage="https://i.pinimg.com/originals/a2/dc/96/a2dc9668f2cf170fe3efeb263128b0e7.gif"
                alt={name}
                onClick={() => Router.push("/assets/" + asset.sasset_id)}
                className={"image rounded-t-md "}
            />
        }
        {loading ? <Box pt={0.5}>
                <Skeleton/>
                <Skeleton width="60%"/>
            </Box> :
            <div className={"item-content"}>
                <div className={"title"} onClick={() => Router.push("/assets/" + asset.sasset_id)}>
                    {name}
                </div>
                <div className={"flex flex-row justify-between text-center items-center"}>
                    <div className={"author"}>
                        {author}
                    </div>
                    <NoSsr>
                        <div
                            onClick={() => onCreateOffer(asset)}
                            className={"rounded-full h-8 w-8 flex items-center justify-center shadow bg-white focus:outline-none focus:ring-0 focus:ring-transparent"}>
                            <AddIcon style={{color: "#9b3135"}}/>
                        </div>
                    </NoSsr>
                </div>
            </div>
        }
    </Wrapper>
}

export default AssetItem