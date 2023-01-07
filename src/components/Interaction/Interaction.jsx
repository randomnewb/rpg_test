import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Typography, Button } from "@mui/material";

const Interaction = () => {
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user);
  const entity = useSelector((store) => store.entity);

  const performAction = (e) => {
    dispatch({ type: "INTERACT_WITH_ENTITY", payload: user.spawn_id });

    // if (user.current_state === "observing") {
    //   setTimeout(() => forceUpdate(), 500);
    // }
  };

  const abandonEvent = () => {
    dispatch({
      type: "UPDATE_USER_STATE",
      payload: { userState: "observing" },
    });

    dispatch({ type: "FETCH_SPAWN_BY_ZONE", payload: user.current_zone });
  };

  useEffect(() => {
    dispatch({ type: "FETCH_ENTITY_DETAIL", payload: user.spawn_id });
  }, []);

  // useEffect(() => {
  //   dispatch({ type: "FETCH_USER" });
  // }, []);

  return (
    <div>
      <Typography>Name: {entity.name}</Typography>
      <Typography>Health: {entity.current_health}</Typography>
      <br />
      <br />
      {entity.type === "mob" && (
        <Button id="attack" onClick={performAction}>
          Attack
        </Button>
      )}
      {entity.type === "woodcutting" && (
        <Button id="chop" onClick={performAction}>
          Chop
        </Button>
      )}
      {entity.type === "mining" && (
        <Button id="mine" onClick={performAction}>
          Mine
        </Button>
      )}
      <Button id="abandon" onClick={abandonEvent}>
        Abandon Event
      </Button>
      {/* )} */}
      {/* 
        <br />
        <br />
        Entity Health: {JSON.stringify(entity.health)}
        <br />
        <br />
        Current entity is: {JSON.stringify(entity)} */}
      {/* {JSON.stringify(user.current_state)} */}
    </div>
  );
};

export default Interaction;
