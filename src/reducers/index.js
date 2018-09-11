export default (state, action) => {
    switch (action.type) {
        case "SAVE_USERS":
            return {
                ...state,
                users: action.users
            };
        case "SAVE_USER":
            return {
                ...state,
                users: action.users
            };
        case "UPDATE_ACTUAL_DATE":
            return {
                ...state,
                actualDate: action.date
            };
        case "UPDATE_ACTUAL_USER":
            return {
                ...state,
                actualUser: action.user
            };
        default:
            return state;
    }

}