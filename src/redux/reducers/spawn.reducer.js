const spawnReducer = (state = [], action) => {
    switch (action.type) {
        case "SET_SPAWN":
            return action.payload;
        default:
            return state;
    }
};

export default spawnReducer;
