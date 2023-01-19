import React from "react";
import { Typography, Button, Container } from "@mui/material";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

const Defeated = () => {
    const history = useHistory();

    const dispatch = useDispatch();

    const returnToTheWorld = () => {
        dispatch({
            type: "UPDATE_USER_STATE",
            payload: { userState: "reset" },
        });

        history.push("/world");
    };

    return (
        <Container>
            <Typography>You were defeated...</Typography>
            <br />
            <br />
            <Button onClick={returnToTheWorld}> Return to the World! </Button>
        </Container>
    );
};

export default Defeated;
