/*

- [DONE] Entities data needs to come from the database/server
- Entitites need to be created on the server side and fed to the client
- Currently spawned entities need to come from the server and be updated back and forth between the client and the server
- playerState needs to come from the server
- [DONE] Zone needs to come from the server

*/

import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Typography } from "@mui/material";
import Interaction from "../Interaction/Interaction";

const Main = () => {
  const dispatch = useDispatch();

  const zoneIdToName = ["None", "Forest", "Mountain"];

  // Psuedo-loading so that there is no flashing when components re-render/grabbed from the server
  const [loading, setLoading] = useState(true);

  const randomNumRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  let loadTime = randomNumRange(550, 700);

  const interactEntity = (e) => {
    dispatch({
      type: "UPDATE_USER_STATE",
      payload: { userState: "interacting", entityId: e.target.id },
    });

    dispatch({
      type: "FETCH_ENTITY_DETAIL",
      payload: e.target.id,
    });

    dispatch({
      type: "FETCH_USER",
    });
  };

  // Store
  const spawn = useSelector((store) => store.spawn);
  const user = useSelector((store) => store.user);

  const searchForEntities = () => {
    dispatch({ type: "POST_SPAWN_BY_ZONE", payload: user.current_zone });
  };

  useEffect(() => {
    setTimeout(() => setLoading(false), loadTime);
    dispatch({ type: "FETCH_SPAWN_BY_ZONE", payload: user.current_zone });
  }, []);

  // Spawns 2 to 5 entities on load
  // useEffect(() => {
  //   spawnRandomEntities(2, 5);
  // }, []);

  if (loading) {
    return (
      <div>
        <Typography>Loading...</Typography>
      </div>
    );
  }

  return (
    <div>
      <div>
        <Typography>Current Zone: {zoneIdToName[user.current_zone]}</Typography>
      </div>

      {user.current_state === "observing" && (
        <div id="showEntities">
          <br />
          <Typography>Choose an Action:</Typography>
          <Button onClick={searchForEntities}> Wander</Button>
          <br />
          <br />
          {/* <Typography>{JSON.stringify(spawn)}</Typography> */}
          <br />
          <Typography>Current Entities:</Typography>
          {spawn.map((entity) => (
            <Button
              onClick={interactEntity}
              key={entity.spawn_id}
              id={entity.spawn_id}
              value={entity.current_health}
              // variant="blue"
            >
              {entity.name}
            </Button>
          ))}
        </div>
      )}

      {user.current_state === "interacting" && <Interaction />}
    </div>
  );
};

export default Main;
