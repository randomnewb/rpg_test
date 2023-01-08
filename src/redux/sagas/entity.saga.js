import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";

function* entitySaga() {
  yield takeLatest("FETCH_ENTITY_DETAIL", fetchEntityDetail);
  yield takeLatest("INTERACT_WITH_ENTITY", interactWithEntity);
}

function* fetchEntityDetail(action) {
  if (action.payload === null) {
    yield put({
      type: "UPDATE_USER_STATE",
      payload: { userState: "observing" },
    });
  } else {
    try {
      const entity = yield axios.get(`/api/entity/${action.payload}`);
      if (entity.data === 0) {
        yield put({
          type: "UPDATE_USER_STATE",
          payload: { userState: "observing" },
        });
      } else {
        yield put({ type: "SET_ENTITY", payload: entity.data });
      }
    } catch (e) {
      console.log("Error fetching entity detail", e);
      alert("Error fetching specific entity");
    }
  }
}

function* interactWithEntity(action) {
  try {
    const entity = yield axios.put(`/api/entity/${action.payload}`);
    console.log("what comes back from entity interact", entity.data);
    if (entity.data.current_state === "observing" || undefined) {
      console.log("entity.data.current_state is", entity.data.current_state);
      yield put({
        type: "UPDATE_USER_STATE",
        payload: { userState: "observing" },
      });
    } else {
      console.log("current returning state is", entity.data.current_state);
      console.log("this should not run");
      yield put({ type: "FETCH_ENTITY_DETAIL", payload: action.payload });
    }
  } catch (e) {
    console.log("Error interacting with entity", e);
    alert("Error interacting with entity");
  }
}

export default entitySaga;
