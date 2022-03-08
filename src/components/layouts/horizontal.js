import HorizontalMasonry from "../libs/masonry/horizontal";
import AssetItem from "../Item/asset";
import Link from "next/link";
import styled from "styled-components";

const initData = ["", "", ""];

const Item = styled.div`{
  :nth-child(2n+0) {
    margin-top: 40px;
  }

  margin-left: 20px;
}`
const HorizontalLayout = ({data, loading}) => {
    return <HorizontalMasonry>
        {data.map((item, index) =>
            <Item key={index + item.data.name}>
                <Link key={index}
                      href={"/assets/" + item.sasset_id}>
                    <a>
                        <AssetItem name={item.data.name} author={item.author} img={item.data.img}/>
                    </a>
                </Link>
            </Item>
        )}
        {loading && initData.map((item, index) => <div className="masonry-item" key={index}>
            <AssetItem name={""} author={""} img={""} loading={true}/>
        </div>)}

    </HorizontalMasonry>
}

export default HorizontalLayout