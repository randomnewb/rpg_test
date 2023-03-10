const inventoryReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_INVENTORY":
      return action.payload;
    case "REMOVE_INVENTORY":
      return [
        ...state.slice(0, action.payload),
        ...state.slice(action.payload + 1),
      ];
    default:
      return state;
  }
};

export default inventoryReducer;
