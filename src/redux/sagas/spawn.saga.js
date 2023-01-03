import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";

// When player first accesses a zone, POST_SPAWN to create entities for that zone
// FETCH_SPAWN will return the spawned entities in a zone and show the player
// So may need to create a table that is the zone and the entitites in that zone
// FETCH_SPAWN also runs when the player interacts with an entity, it removes that entity
// We will have EntitySaga hold the current entity the player is interacting with

function* spawnSaga() {
  yield takeLatest("POST_SPAWN", postSpawn);
  yield takeLatest("FETCH_SPAWN", fetchSpawn);
}

function* postSpawn(action) {
  try {
    yield axios.post(`/api/spawn/${action.payload}`);
  } catch (e) {
    console.log(e);
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
