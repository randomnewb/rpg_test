import { combineReducers } from "redux";
import errors from "./errors.reducer";
import user from "./user.reducer";
import entity from "./entity.reducer";
import spawn from "./spawn.reducer";
import stat from "./stat.reducer";
import inventory from "./inventory.reducer";
import equipped from "./equipped.reducer";

// rootReducer is the primary reducer for our entire project
// It bundles up all of the other reducers so our project can use them.
// This is imported in index.js as rootSaga

// Lets make a bigger object for our store, with the objects from our reducers.
// This is what we get when we use 'state' inside of 'mapStateToProps'
const rootReducer = combineReducers({
  errors, // contains registrationMessage and loginMessage
  user, // will have an id and username if someone is logged in
  entity, // stores entity information
  spawn, // stores spawned entities
  stat, // stores stat information
  inventory, // stores inventory information
  equipped, // stores equipped items
});

export default rootReducer;
