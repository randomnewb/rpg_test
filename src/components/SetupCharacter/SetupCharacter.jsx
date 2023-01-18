import React from "react";
import { useState } from "react";
import { Typography, Button, TextField } from "@mui/material";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

const SetupCharacter = () => {
    const history = useHistory();
    const [characterName, setCharacterName] = useState("");
    const [characterClass, setCharacterClass] = useState("None");

    const dispatch = useDispatch();

    const completeSetup = () => {
        if (characterClass != "None" && characterName != "") {
            dispatch({
                type: "INITIALIZE_USER",
                payload: {
                    userState: "initialize",
                    name: characterName,
                    class: characterClass,
                },
            });

            history.go(0);
        } else if (characterClass === "None" && characterName === "") {
            alert("Please choose a class and enter a character name");
        } else if (characterClass !== "None" && characterName === "") {
            alert("Please enter a character name");
        } else if (characterClass === "None" && characterName !== "") {
            alert("Please choose a character class");
        }
    };

    return (
        <div>
            <Typography>Setup Character</Typography>
            <br />
            <TextField
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                label="Input a character name..."></TextField>
            <br />
            <Typography> Choose a Class</Typography>
            <Typography> Chosen Class: {characterClass}</Typography>
            <Button
                id="Brute"
                onClick={() => setCharacterClass("Brute")}>
                Brute
            </Button>
            <Button
                id="Sureshot"
                onClick={() => setCharacterClass("Sureshot")}>
                Sureshot
            </Button>
            <Button
                id="Arcanist"
                onClick={() => setCharacterClass("Arcanist")}>
                Arcanist
            </Button>
            <Button onClick={completeSetup}> Enter the World! </Button>
        </div>
    );
};

export default SetupCharacter;
