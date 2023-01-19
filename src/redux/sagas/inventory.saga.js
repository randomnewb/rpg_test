import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";

function* inventorySaga() {
  yield takeLatest("FETCH_USER_INVENTORY", fetchUserInventory);
  yield takeLatest("UPDATE_USER_INVENTORY", updateUserInventory);
}

function* fetchUserInventory() {
  try {
    const inventory = yield axios.get("/api/inventory/");
    yield put({ type: "SET_INVENTORY", payload: inventory.data });
  } catch (e) {
    console.log("Error fetching user's inventory", e);
    alert("Problem fetching user's inventory");
  }
}

function* updateUserInventory(action) {
  console.log(action.payload);
  try {
    yield axios.put(`/api/inventory/${action.payload}`);
    yield put({ type: "FETCH_USER_INVENTORY" });
  } catch (e) {
    console.log("Error unequipping item", e);
    alert("Problem unequipping item");
  }
}

export default inventorySaga;
