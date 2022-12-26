const entityReducer = (state = {}, action) => {
    switch (action.type) {
        case "SET_ENTITY":
            return action.payload;
        default:
            return state;
    }
};

export default entityReducer;
