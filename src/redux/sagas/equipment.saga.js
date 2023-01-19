import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";

function* equipmentSaga() {
  yield takeLatest("FETCH_USER_EQUIPMENT", fetchUserEquipment);
  yield takeLatest("UPDATE_USER_EQUIPMENT", updateUserEquipment);
}

function* fetchUserEquipment() {
  try {
    const equipment = yield axios.get("/api/equipment/");
    yield put({ type: "SET_EQUIPMENT", payload: equipment.data });
  } catch (e) {
    console.log("Error fetching equipped items", e);
    alert("Problem fetching equipped items");
  }
}

function* updateUserEquipment(action) {
  try {
    yield axios.put(`/api/equipment/${action.payload}`);
    yield put({ type: "FETCH_USER_EQUIPMENT" });
  } catch (e) {
    console.log("Error equipping item", e);
    alert("Problem equipping item");
  }
}

export default equipmentSaga;
