import {APP_CONSTANTS} from "../constans/app.constant";

export function hiddenNo(title) {
    return {
        type: APP_CONSTANTS.SET_PAGE_TITLE,
        payload: {
            title
        }
    }
}

export function notification(menu) {
    return {
        type: APP_CONSTANTS.SET_MENU,
        payload: {
            menu
        }
    }
}