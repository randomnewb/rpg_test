const entityReducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_ENTITY":
      return action.payload;
    case "CLEAR_ENTITY":
      return state;
    case "SET_ENTITY_HEALTH":
      state.health = state.health - action.payload;
      return { ...state, health: state.health };
    default:
      return state;
  }
};

export default entityReducer;
