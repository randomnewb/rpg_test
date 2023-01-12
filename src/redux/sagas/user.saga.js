import axios from "axios";
import { put, takeEvery, takeLatest } from "redux-saga/effects";

function* userSaga() {
  yield takeLatest("FETCH_USER", fetchUser);
  yield takeLatest("UPDATE_CURRENT_USER_ZONE", updateCurrentUserZone);
  yield takeLatest("UPDATE_USER_STATE", updateUserState);
  yield takeLatest("FETCH_USER_STAT", fetchUserStat);
  yield takeLatest("INITIALIZE_USER", initializeUser);
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

function* updateCurrentUserZone(action) {
  try {
    const userZone = yield axios.put(`/api/user/zone/${action.payload}`);
    yield put({ type: "SET_USER_ZONE", payload: userZone.data });
    yield put({ type: "FETCH_USER" });
    yield put({ type: "FETCH_SPAWN_BY_ZONE", payload: action.payload });
  } catch (e) {
    console.log("Failed to set current zone", e);
    alert("Couldn't update current zone");
  }
}

function* updateUserState(action) {
  try {
    if (action.payload === "observing" || undefined) {
      yield put({ type: "SET_USER_STATE", payload: userState.data });
      yield put({ type: "FETCH_USER" });
    } else {
      const userState = yield axios.put("/api/user/state", action.payload);
      yield put({ type: "SET_USER_STATE", payload: userState.data });
      yield put({ type: "FETCH_USER" });
    }
  } catch (e) {
    console.log("Failed to update user state", e);
    alert("Couldn't update user state");
  }
}

function* fetchUserStat() {
  try {
    const userStat = yield axios.get("/api/stat");
    yield put({ type: "SET_USER_STAT", payload: userStat.data });
  } catch (e) {
    console.log("Failed to fetch user stats", e);
    alert("Couldn't fetch user stats");
  }
}

function* initializeUser(action) {
  try {
    yield axios.put("/api/user/initialize", action.payload);
    yield put({
      type: "SET_USER_STAT",
      payload: { current_state: "observing" },
    });
    yield put({ type: "FETCH_USER_STAT" });
  } catch (e) {
    console.log("Failed to initialize user", e);
    alert("Couldn't finish initializing user");
  }
}

export default userSaga;
