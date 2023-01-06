import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";

function* entitySaga() {
  yield takeLatest("FETCH_ENTITY_DETAIL", fetchEntityDetail);
}

function* fetchEntityDetail(action) {
  console.log("entity detail is", action.payload);
  try {
    const entity = yield axios.get(`/api/entity/${action.payload}`);
    yield put({ type: "SET_ENTITY", payload: entity.data });
  } catch (e) {
    console.log("Error fetching entity detail", e);
    alert("Error fetching specific entity");
  }
}

export default entitySaga;
