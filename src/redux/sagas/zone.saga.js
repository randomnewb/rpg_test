import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";

function* zoneSaga() {
  yield takeLatest("FETCH_ZONE", fetchZone);
}

function* fetchZone(action) {
  try {
    const zone = yield axios.get(`/api/zone/${action.payload}`);
    yield put({ type: "SET_ZONE", payload: zone.data });
  } catch (e) {
    console.log("Error fetching zone", e);
    alert("Problem fetching zone");
  }
}
export default zoneSaga;
