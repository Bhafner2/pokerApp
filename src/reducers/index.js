import firebase from '../config/firebase';

export default (state, action) => {
    const db = firebase.database().ref('users');
    switch (action.type) {
        case "SAVE_USERS":
            db.update(action.users);
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