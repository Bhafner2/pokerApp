export const saveUsers = users => ({ type: "SAVE_USERS", users });
export const addUser = user => ({ type: "ADD_USER", user });
export const updateActualUser = user => ({ type: "UPDATE_ACTUAL_USER", user });
export const getUsers = () => ({ type: "GET_USERS"});
export const getUsersSuccess = () => ({ type: "GET_USERS_SUCCESS"});
