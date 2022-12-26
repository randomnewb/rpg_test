const zoneReducer = (state = {}, action) => {
    switch (action.type) {
        case "SET_ZONE":
            return action.payload;
        default:
            return state;
    }
};

export default zoneReducer;
