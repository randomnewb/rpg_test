import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

const World = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const zone = useSelector((state) => state.zone);
  const [currentZone, setCurrentZone] = useState(zone);

  useEffect(() => {
    setCurrentZone(zone);
  }, [zone]);

  const setZone = (zone) => {
    dispatch({
      type: "SET_ZONE",
      payload: zone,
    });
  };

  const changeZone = (e) => {
    setZone(e.target.id);
    history.push(`/world/${e.target.id}`);
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
