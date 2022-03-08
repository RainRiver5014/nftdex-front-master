import {APP_CONSTANTS} from "../constans/app.constant";

export const initState = {
    isLoggedIn: false,
    menu: "",
    pageTitle: ""
};

function reducer(state = initState, action) {
    switch (action.type) {
        case APP_CONSTANTS.SET_MENU:
            return {
                ...state,
                menu: action.payload.menu
            }
        case APP_CONSTANTS.SET_PAGE_TITLE:
            return {
                ...state,
                pageTitle: action.payload.title
            }
        case "LOGIN_SUCCESS":
            return {
                ...state,
                ...{isLoggedIn: true},
            };
        default:
            return state;
    }
}

export default reducer;
