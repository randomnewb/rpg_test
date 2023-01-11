import React from "react";
import { useState } from "react";
import { Typography, Button, TextField } from "@mui/material";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

const SetupCharacter = () => {
  const history = useHistory();
  const [characterName, setCharacterName] = useState("");

  const dispatch = useDispatch();

  const completeSetup = () => {
    dispatch({
      type: "INITIALIZE_USER",
      payload: {
        userState: "initialize",
        name: characterName,
        health: 10,
        strength: 10,
        dexterity: 10,
        wisdom: 10,
      },
    });

    history.go(0);
  };

  return (
    <div>
      <Typography>Setup Character</Typography>
      <br />
      <TextField
        value={characterName}
        onChange={(e) => setCharacterName(e.target.value)}
        label="Input a character name..."
      ></TextField>
      <br />
      <Button onClick={completeSetup}> Enter the World! </Button>
    </div>
  );
};

export default SetupCharacter;
