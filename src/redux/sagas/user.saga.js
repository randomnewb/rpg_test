import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";

function* userSaga() {
  yield takeLatest("FETCH_USER", fetchUser);
  yield takeLatest("UPDATE_CURRENT_USER_ZONE", setCurrentUserZone);
  yield takeLatest("UPDATE_USER_STATE", setUserState);
}
// worker Saga: will be fired on "FETCH_USER" actions
function* fetchUser() {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
    const response = yield axios.get("/api/user", config);

    // now that the session has given us a user object
    // with an id and username set the client-side user object to let
    // the client-side code know the user is logged in
    yield put({ type: "SET_USER", payload: response.data });
  } catch (error) {
    console.log("User get request failed", error);
  }
}

function* setCurrentUserZone(action) {
  try {
    yield axios.put(`/api/user/zone/${action.payload}`);
    yield put({ type: "FETCH_USER" });
  } catch (e) {
    console.log("Failed to set current zone", e);
    alert("Couldn't update current zone");
  }
}

function* setUserState(action) {
  try {
    const userState = yield axios.put("/api/user/state/", action.payload);
    yield put({ type: "SET_USER_STATE", payload: userState.data });
  } catch (e) {
    console.log("Failed to update user state", e);
    alert("Couldn't update user state");
  }
}

export default userSaga;
