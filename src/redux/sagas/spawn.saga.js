import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";

// We will have EntitySaga hold the current entity the player is interacting with

function* spawnSaga() {
  yield takeLatest("POST_SPAWN", postSpawn);
  yield takeLatest("FETCH_SPAWN", fetchSpawn);
}

function* postSpawn(action) {
  try {
    yield axios.post(`/api/spawn/${action.payload}`);
    yield put({ type: "FETCH_SPAWN", payload: action.payload });
  } catch (e) {
    console.log("Error creating entities", e);
    alert("Problem spawning entities");
  }
}

function* fetchSpawn(action) {
  try {
    const spawn = yield axios.get(`/api/spawn/${action.payload}`);
    yield put({ type: "SET_SPAWN", payload: spawn.data });
  } catch (e) {
    console.log("Error fetching entities from a zone", e);
    alert("Problem fetching entities from a zone");
  }
}
export default spawnSaga;
