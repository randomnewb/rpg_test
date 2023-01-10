const statReducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_USER_STAT":
      return action.payload;
    default:
      return state;
  }
};

export default statReducer;
