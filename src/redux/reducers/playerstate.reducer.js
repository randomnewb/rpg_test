const playerStateReducer = (state = { interaction: "observing" }, action) => {
  switch (action.type) {
    case "SET_PLAYER_STATE":
      return { ...state, interaction: action.payload };
    default:
      return state;
  }
};

export default playerStateReducer;
