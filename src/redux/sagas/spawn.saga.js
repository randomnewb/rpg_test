import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";

function* spawnSaga() {
  yield takeLatest("POST_SPAWN_BY_ZONE", postSpawnByZone);
  yield takeLatest("FETCH_SPAWN_BY_ZONE", fetchSpawnByZone);
}

function* postSpawnByZone(action) {
  try {
    yield axios.post(`/api/spawn/zone/${action.payload}`);
    yield put({ type: "FETCH_SPAWN_BY_ZONE", payload: action.payload });
  } catch (e) {
    console.log("Error creating entities", e);
    alert("Problem spawning entities");
  }
}

function* fetchSpawnByZone(action) {
  try {
    const spawn = yield axios.get(`/api/spawn/zone/${action.payload}`);
    yield put({ type: "SET_SPAWN", payload: spawn.data });
  } catch (e) {
    console.log("Error fetching entities from a zone", e);
    alert("Problem fetching entities from a zone");
  }
}

export default spawnSaga;
