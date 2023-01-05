import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Typography } from "@mui/material";

const World = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const zoneIdToName = ["None", "Forest", "Mountain"];

  // const zone = useSelector((store) => store.zone);
  const user = useSelector((store) => store.user);
  // const [currentZone, setCurrentZone] = useState(zone);

  const setZone = (zone) => {
    dispatch({ type: "UPDATE_CURRENT_USER_ZONE", payload: zone });
  };

  const changeZone = (e) => {
    setZone(e.target.id);
    history.push(`/zone/`);
  };

  return (
    <div>
      <div>
        <Typography>Zone is: {zoneIdToName[user.current_zone]}</Typography>
      </div>

      <div>
        <Button id="1" onClick={changeZone}>
          Forest
        </Button>
        <Button id="2" onClick={changeZone}>
          Mountain
        </Button>
      </div>
    </div>
  );
};

export default World;
