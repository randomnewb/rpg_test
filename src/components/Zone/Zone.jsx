import React from "react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, Typography, Container } from "@mui/material";
import Interaction from "../Interaction/Interaction";

const Main = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const zoneIdToName = ["None", "Forest", "Mountain"];

    const returnToWorld = (e) => {
        history.push("/world");
    };

    const interactEntity = (e) => {
        dispatch({
            type: "UPDATE_USER_STATE",
            payload: { userState: "interacting", entityId: e.target.id },
        });

        dispatch({
            type: "FETCH_ENTITY_DETAIL",
            payload: e.target.id,
        });
    };

    // Store
    const spawn = useSelector((store) => store.spawn);
    const user = useSelector((store) => store.user);

    const searchForEntities = () => {
        dispatch({ type: "POST_SPAWN_BY_ZONE", payload: user.current_zone });
    };

    useEffect(() => {
        dispatch({ type: "FETCH_SPAWN_BY_ZONE", payload: user.current_zone });
    }, []);

    // Spawns 2 to 5 entities on load
    // useEffect(() => {
    //   spawnRandomEntities(2, 5);
    // }, []);

    // if (loading) {
    //   return (
    //     <div>
    //       <Typography>Loading...</Typography>
    //     </div>
    //   );
    // }

    return (
        <Container>
            <div>
                <Button onClick={returnToWorld}>
                    {" "}
                    Travel to a Different Zone{" "}
                </Button>
                <br />
                <br />
                <Typography>
                    Current Zone: {zoneIdToName[user.current_zone]}
                </Typography>
                {/* <Typography>{JSON.stringify(user)}</Typography> */}
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
        </Container>
    );
};

export default Main;
