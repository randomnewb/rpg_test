const equippedReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_EQUIPMENT":
      return action.payload;
    case "REMOVE_EQUIPMENT":
      return [
        ...state.slice(0, action.payload),
        ...state.slice(action.payload + 1),
      ];
    default:
      return state;
  }
};

export default equippedReducer;
