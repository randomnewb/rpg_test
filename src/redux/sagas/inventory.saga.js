import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";

function* inventorySaga() {
  yield takeLatest("FETCH_USER_INVENTORY", fetchUserInventory);
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

export default inventorySaga;
