import {APP_CONSTANTS} from "../constans/app.constant";

export function setPageTitle(title) {
    return {
        type: APP_CONSTANTS.SET_PAGE_TITLE,
        payload: {
            title
        }
    }
}

export function setMenu(menu) {
    return {
        type: APP_CONSTANTS.SET_MENU,
        payload: {
            menu
        }
    }
}