import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Typography, Button } from "@mui/material";

const Interaction = () => {
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user);
  const entity = useSelector((store) => store.entity);

  const performAction = (e) => {
    console.log(e.target.id);
  };

  const abandonEvent = () => {
    console.log("Abandoning event...");
    dispatch({
      type: "UPDATE_USER_STATE",
      payload: { userState: "observing" },
    });

    dispatch({ type: "FETCH_SPAWN_BY_ZONE", payload: user.current_zone });

    dispatch({
      type: "FETCH_USER",
    });
  };

  return (
    <div>
      <Typography>Name: {entity.name}</Typography>
      <Typography>Health: {entity.current_health}</Typography>
      {/* {entityProperties.type === "mob" && ( */}
      <Button id="attack" onClick={performAction}>
        Attack
      </Button>
      {/* )} */}
      {/* {entityProperties.type === "tree" && ( */}
      <Button id="chop" onClick={performAction}>
        Chop
      </Button>
      {/* )} */}
      {/* {entityProperties.type === "rock" && ( */}
      <Button id="mine" onClick={performAction}>
        Mine
      </Button>
      {/* )} */}
      <Button id="abandon" onClick={abandonEvent}>
        Abandon Event
      </Button>
      {/* )} */}
      <span>
        {/* 
        <br />
        <br />
        Entity Health: {JSON.stringify(entity.health)}
        <br />
        <br />
        Current entity is: {JSON.stringify(entity)} */}
        {/* {JSON.stringify(user.current_state)} */}
      </span>
    </div>
  );
};

export default Interaction;
