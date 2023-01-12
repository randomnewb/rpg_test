import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { ReactComponent as Forest } from "../../svg/forest.svg";
import { ReactComponent as Mountain } from "../../svg/mountain.svg";

const World = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const user = useSelector((store) => store.user);
  const stat = useSelector((store) => store.stat);

  const zoneIdToName = ["None", "Forest", "Mountain"];

  useEffect(() => {
    dispatch({ type: "FETCH_USER_STAT" });
  }, []);

  const changeZone = (e) => {
    dispatch({
      type: "UPDATE_CURRENT_USER_ZONE",
      payload: e.currentTarget.id,
    });
    history.push("/zone");
  };

  return (
    <div>
      {/* <Typography> {JSON.stringify(user)}</Typography> */}
      <Typography>Name: {stat.name}</Typography>
      <Typography>Level: {stat.level}</Typography>
      <Typography>Health: {stat.health}</Typography>
      <Typography>Damage: {stat.damage}</Typography>
      <br />
      <Typography>Currently in: {zoneIdToName[user.current_zone]}</Typography>
      <br />
      <Typography>Choose a Zone to travel to:</Typography>

      <div>
        <Button id="1" onClick={changeZone}>
          Forest
          <Forest />
        </Button>
        <br />
        <Button id="2" onClick={changeZone}>
          Mountain
          <Mountain />
        </Button>
      </div>
    </div>
  );
};

export default World;
