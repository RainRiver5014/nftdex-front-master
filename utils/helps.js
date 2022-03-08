
import useMediaQuery from '@material-ui/core/useMediaQuery';
export const getResponsive = () => {
    const screenTwoExtraLarge = useMediaQuery("(min-width: 1536px)");
    const screenExtraLarge = useMediaQuery("(min-width: 1280px)");
    const screenLarge = useMediaQuery("(min-width: 1024px)");
    const screenMedium = useMediaQuery("(min-width: 768px)");
    const screenSmall = useMediaQuery("(min-width: 640px)");
    const screenNarrow = useMediaQuery('(max-width:640px)');
    if (screenExtraLarge) {
        return "xl";
    } else if (screenLarge) {
        return "lg";
    } else if (screenMedium) {
        return "md";
    } else if(screenSmall || screenNarrow){
        return "sm";
    }else {
        return ""
    }
}

export const getGridListCols = (currentWidth) => {

    if (currentWidth === "xl") {
        return 6;
    }

    if (currentWidth === "lg") {
        return 4;
    }

    if (currentWidth === "md") {
        return 2;
    }

    if (currentWidth === "sm") {
        return 1;
    }

    return 6;
}


export const formatDataAsset = (data) => {
    const idata = JSON.parse(data.idata || "");
    const mdata = JSON.parse(data.mdata || "");
    const name = idata.name || mdata.name;
    let img = idata.img || mdata.img;
    if(!img.includes("http")){
        img = "https://ipfs.io/ipfs/" + img
        // console.log("img - ",name, "-----", img )
    }
    return {img, name}
}
