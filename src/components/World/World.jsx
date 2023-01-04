import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

const World = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const zone = useSelector((store) => store.zone);
  const user = useSelector((store) => store.user);
  const [currentZone, setCurrentZone] = useState(zone);

  useEffect(() => {
    setCurrentZone(user.current_zone);
  }, [zone]);

  const setZone = (zone) => {
    dispatch({ type: "UPDATE_CURRENT_USER_ZONE", payload: zone });
    // dispatch({ type: "POST_SPAWN", payload: zone });
    dispatch({ type: "FETCH_SPAWN", payload: zone });
  };

  const changeZone = (e) => {
    setZone(e.target.id);
    history.push(`/zone/`);
  };

  return (
    <div>
      <div>
        <span>Zone is: {JSON.stringify(currentZone)}</span>
      </div>

      <div>
        <button id="1" onClick={changeZone}>
          Zone 1
        </button>
        <button id="2" onClick={changeZone}>
          Zone 2
        </button>
      </div>
    </div>
  );
};

export default World;
