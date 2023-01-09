import React from "react";
import { Typography, Button } from "@mui/material";
import { useDispatch } from "react-redux";

const SetupCharacter = () => {
  const dispatch = useDispatch();

  const completeSetup = () => {
    dispatch({
      type: "UPDATE_USER_STATE",
      payload: { userState: "initialize" },
    });
  };

  return (
    <div>
      <Typography>Setup Character</Typography>
      <Button onClick={completeSetup}> Enter the World! </Button>
    </div>
  );
};

export default SetupCharacter;
