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

  // const zoneIdToName = ["None", "Forest", "Mountain"];

  // useEffect(() => {
  //   dispatch({ type: "FETCH_USER_STAT" });
  // }, []);

  const changeZone = (e) => {
    if (e.target.id !== "") {
      dispatch({ type: "UPDATE_CURRENT_USER_ZONE", payload: e.target.id });
      history.push("/zone");
    } else if (e.target.id === "") {
      history.go(0);
    }
  };

  return (
    <div>
      {/* <Typography> {JSON.stringify(user)}</Typography> */}
      {/* <Typography>Name: {stat.name}</Typography>
        <Typography>Level: {stat.level}</Typography>
        <Typography>Health: {stat.health}</Typography>
        <Typography>Damage: {stat.damage}</Typography> */}
      <br />
      <Typography>
        {/* Zone is: {zoneIdToName[user.current_zone]} */}
        Choose a Zone to travel to:
      </Typography>

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
