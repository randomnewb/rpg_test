import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { ReactComponent as Forest } from "../../svg/forest.svg";
import { ReactComponent as Mountain } from "../../svg/mountain.svg";

const World = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const user = useSelector((store) => store.user);

  // const zoneIdToName = ["None", "Forest", "Mountain"];

  const changeZone = (e) => {
    if (e.target.id !== "") {
      dispatch({ type: "UPDATE_CURRENT_USER_ZONE", payload: e.target.id });
      history.push(`/zone/`);
    } else if (e.target.id === "") {
      history.go(0);
    }
  };

  // useEffect(() => {
  //   dispatch({ type: "FETCH_USER_STAT" });
  // }, []);

  return (
    <div>
      <div>
        <Typography>Name: {user.stat.name}</Typography>
        <Typography>Level: {user.stat.level}</Typography>
        <Typography>Health: {user.stat.health}</Typography>
        <Typography>Damage: {user.stat.damage}</Typography>
        <br />
        <Typography>
          {/* Zone is: {zoneIdToName[user.current_zone]} */}
          Choose a Zone to travel to:
        </Typography>
      </div>

      <div>
        <Button id="1" onClick={changeZone}>
          Forest <Forest />
        </Button>
        <br />
        <Button id="2" onClick={changeZone}>
          Mountain <Mountain />
        </Button>
      </div>
    </div>
  );
};

export default World;
