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

  let loadTime = randomNumRange(500, 700);

  const interactEntity = (e) => {
    console.log(e.target.id);

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
  // const entity = useSelector((store) => store.entity);
  const spawn = useSelector((store) => store.spawn);
  const user = useSelector((store) => store.user);

  // For holding the entities we have instantiated
  // const [entityProperties, setEntityProperties] = useState("");
  // const [entityHealth, setEntityHealth] = useState(null);
  // const [entityCreated, setEntityCreated] = useState(false);

  // Updates the user's current zone on page refresh

  const searchForEntities = () => {
    dispatch({ type: "POST_SPAWN_BY_ZONE", payload: user.current_zone });
  };

  useEffect(() => {
    setTimeout(() => setLoading(false), loadTime);
    dispatch({ type: "FETCH_SPAWN_BY_ZONE", payload: user.current_zone });
  }, []);

  // const spawnRandomEntities = (minSpawn, maxSpawn) => {
  //   let numberOfEntities = randomNumRange(minSpawn, maxSpawn);
  //   while (numberOfEntities > 0) {
  //     numberOfEntities--;
  //     let id = numberOfEntities + 1;
  //     let entity = entityList[randomNumRange(0, 2)];

  //     setSpawnEntities((spawnEntitites) => [...spawnEntitites, { entity, id }]);
  //   }
  //   dispatchSpawn();
  // };

  // const interactEntity = (e) => {
  //   parseEnemy(e);

  //   // Removes the entity based on their unique id
  //   // We can do so as the entity is "saved" as the current entity
  //   removeEntity(e.target.id);

  //   // Switch to interacting with entities
  //   changeVisiblity();

  //   // Notifies useEffect to run and dispatches an action to save the entity
  //   setEntityCreated(true);
  // };

  // const parseEnemy = (e) => {
  //   // Entity's properties
  //   instanceEntityProperties(e.target.value);

  //   // Sets the entity's health
  //   instanceEntityHealth(e.target.value);
  // };

  // This removes the entity from list of spawned entities
  // const removeEntity = (entityToDelete) => {
  //   setSpawnEntities((spawnEntities) =>
  //     spawnEntities.filter((e) => e.id !== parseInt(entityToDelete))
  //   );
  // };

  // This matches the entity the user selects with one from the hard-coded array of entities
  // const instanceEntityProperties = (entity) => {
  //   for (let i = 0; i < entityList.length; i++) {
  //     if (entityList[i].value === parseInt(entity)) {
  //       setEntityProperties(entityList[i]);
  //     }
  //   }
  // };

  // Sets the entity's health to a random amount based on their hard-coded min/max health values
  // const instanceEntityHealth = (entity) => {
  //   for (let i = 0; i < entityList.length; i++) {
  //     if (parseInt(entityList[i].value) === parseInt(entity)) {
  //       setEntityHealth(
  //         randomNumRange(entityList[i].minHealth, entityList[i].maxHealth)
  //       );
  //     }
  //   }
  // };

  // useEffect(() => {
  //   setCurrentZone(zone);
  // }, [zone]);

  // useEffect(() => {
  //   setCurrentEntity(entity);
  // }, [entity]);

  // useEffect(() => {
  //     setCurrentPlayerState(playerState);
  // }, [playerState]);

  // Sets the player's state
  // useEffect(() => {
  //     switch (playerState.interaction) {
  //         case "observing":
  //             setShowInteraction(false);
  //             setShowEntities(true);
  //             break;

  //         case "engaged":
  //             setShowInteraction(true);
  //             setShowEntities(false);
  //             break;

  //         default:
  //             break;
  //     }
  // }, [playerState]);

  // Spawns 2 to 5 entities on load
  // useEffect(() => {
  //   spawnRandomEntities(2, 5);
  // }, []);

  // const dispatchEntity = () => {
  //   dispatch({
  //     type: "SET_ENTITY",
  //     payload: { properties: entityProperties, health: entityHealth },
  //   });

  //   setEntityCreated(false);
  // };

  // useEffect(() => {
  //   dispatchEntity();
  // }, [entityCreated]);

  // const dispatchSpawn = () => {
  //   dispatch({
  //     type: "SET_SPAWN",
  //     payload: spawnEntities,
  //   });
  // };

  // Hide entities while engaged in interaction
  // const changeEntitiesVisiblity = () => {
  //   setShowEntities(!showEntities);
  // };

  // const changeInteractionVisiblity = () => {
  //   setShowInteraction(!showInteraction);
  // };

  // const changeVisiblity = () => {
  //   changeEntitiesVisiblity();
  //   changeInteractionVisiblity();
  // };

  // Reduce entityHealth by 1 on click, if the health is below 0 or at 1,
  // switch back to the view that shows all entities
  // const performAction = (act) => {
  //   let damage = 1;

  //   if (playerState.interaction !== "engaged") {
  //     dispatch({
  //       type: "SET_PLAYER_STATE",
  //       payload: "engaged",
  //     });
  //   }
  //   dispatch({
  //     type: "SET_ENTITY_HEALTH",
  //     payload: damage,
  //   });

  //   if (entity.health <= 0) {
  //     dispatch({
  //       type: "CLEAR_ENTITY",
  //     });

  //     dispatch({
  //       type: "SET_PLAYER_STATE",
  //       payload: "observing",
  //     });
  //   }

  //   // if (spawnEntities <= 0) {
  //   //   spawnRandomEntities(2, 5);
  //   // }
  // };

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
        <Typography>
          <Typography>
            The current zone is: {zoneIdToName[user.current_zone]}
          </Typography>
        </Typography>
        <br />
        <br />
        <Typography>
          Current Player State: {JSON.stringify(user.current_state)}
        </Typography>
        <br />
        <br />

        {/* <span>{JSON.stringify(spawnEntities)}</span> */}
      </div>
      {user.current_state === "observing" && (
        <div id="showEntities">
          <Button onClick={searchForEntities}> Wander</Button>
          <br />
          <br />
          {/* <Typography>{JSON.stringify(spawn)}</Typography> */}
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
