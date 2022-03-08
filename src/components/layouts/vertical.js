import VerticalMasonry from '../libs/masonry/vertical'
import {useCallback, useRef, useState} from "react";
import AssetItem from "../Item/asset";
import _ from "lodash";

const VerticalLayout = ({data, onLoad, loading, getData, hasMore, nextKey, breakpointCols, onCreateOffer}) => {
    const [columnCount, setColumnCount] = useState(0);
    const observer = useRef();
    const breakpointColumnsObj = {
        default: 6,
        1280: 5,
        1024: 4,
        942: 3,
        768: 3,
        640: 3,
        320: 2
    };
    const lastAssetsElementRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {

                    getData(nextKey)
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading]
    );

    const renderLoading = () => {
        const array = _.range(0, columnCount);
        return _.map(array, (item, index) => <AssetItem loading={true} key={index}/>)
    }
    return <VerticalMasonry
        breakpointCols={breakpointCols || breakpointColumnsObj}
        className="masonry-grid w-screen"
        columnCount={setColumnCount}
        columnClassName="masonry-grid-column">

        {data.map((item, index) => {
            return <div key={index} ref={lastAssetsElementRef} className="masonry-item cursor-pointer">
                <AssetItem asset={item} name={item.data.name} author={item.author} img={item.data.img}
                           onCreateOffer={onCreateOffer}/>

            </div>
        })}
        {loading && renderLoading()}
    </VerticalMasonry>

}

export default VerticalLayout