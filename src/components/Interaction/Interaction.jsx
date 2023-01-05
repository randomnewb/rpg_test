import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Typography, Button } from "@mui/material";

const Interaction = () => {
  const user = useSelector((store) => store.user);

  const performAction = (e) => {
    console.log(e.target.id);
  };

  return (
    <div>
      <Typography> Hello world</Typography>
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
      <span>
        {/* Currently interacting with {JSON.stringify(entity.properties.name)}
        <br />
        <br />
        Entity Health: {JSON.stringify(entity.health)}
        <br />
        <br />
        Current entity is: {JSON.stringify(entity)} */}
        {JSON.stringify(user.state)}
      </span>
    </div>
  );
};

export default Interaction;
