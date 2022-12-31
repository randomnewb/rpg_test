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
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";

const Main = () => {
  const dispatch = useDispatch();

  // Enemy list, used when instantiating a new entity
  const entityList = [
    {
      id: 0,
      value: 0,
      name: "zombie",
      type: "mob",
      minHealth: 2,
      maxHealth: 5,
    },
    {
      id: 1,
      value: 1,
      name: "oak tree",
      type: "tree",
      minHealth: 2,
      maxHealth: 3,
    },
    {
      id: 2,
      value: 2,
      name: "boulder",
      type: "rock",
      minHealth: 3,
      maxHealth: 6,
    },
  ];

  // For showing certain user interaction areas
  const [showEntities, setShowEntities] = useState(true);
  const [showInteraction, setShowInteraction] = useState(false);

  // Holds the currently spawned entities
  // const [spawnEntities, setSpawnEntities] = useState(spawn);

  // Holds current information
  // const [currentEntity, setCurrentEntity] = useState(entity);
  const [currentZone, setCurrentZone] = useState(zone);
  const [currentPlayerState, setCurrentPlayerState] = useState(playerState);

  // For holding the entities we have instantiated
  // const [entityProperties, setEntityProperties] = useState("");
  const [entityHealth, setEntityHealth] = useState(null);
  const [entityCreated, setEntityCreated] = useState(false);

  // Store
  const zone = useSelector((store) => store.zone);
  const entity = useSelector((store) => store.entity);
  const spawn = useSelector((store) => store.spawn);
  const playerState = useSelector((store) => store.playerState);
  const user = useSelector((store) => store.user);

  // Generate a random number within a given range
  // const randomNumRange = (min, max) => {
  //   return Math.floor(Math.random() * (max - min + 1)) + min;
  // };

  // Current unused list of entities that can spawn by zone
  // const zoneEntities = [entityList[0], entityList[1], entityList[2]];

  // Updates the user's current zone on page refresh

  useEffect(() => {
    dispatch({ type: "FETCH_ZONE", payload: user.current_zone });
    dispatch({ type: "FETCH_SPAWN", payload: user.current_zone });
  }, []);

  // useEffect(() => {
  //   console.log("current spawn", spawn);
  //   setSpawnEntities(spawn);
  // }, []);

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

  useEffect(() => {
    setCurrentPlayerState(playerState);
  }, [playerState]);

  // Sets the player's state
  useEffect(() => {
    switch (playerState.interaction) {
      case "observing":
        setShowInteraction(false);
        setShowEntities(true);
        break;

      case "engaged":
        setShowInteraction(true);
        setShowEntities(false);
        break;

      default:
        break;
    }
  }, [playerState]);

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

  return (
    <div>
      <div>
        <span>The current zone is: {JSON.stringify(user.current_zone)}</span>
        <br />
        <br />
        <span>
          Current Player State is: {JSON.stringify(currentPlayerState)}
        </span>
        {/* <span>{JSON.stringify(spawnEntities)}</span> */}
      </div>
      {showEntities && (
        <div id="showEntities">
          {JSON.stringify(spawn)}

          {spawn.map((entity) => (
            <Button
              // onClick={interactEntity}
              key={entity.id}
              id={entity.id}
              value={entity.current_health}
              // variant="blue"
            >
              {entity.name}
            </Button>
          ))}
        </div>
      )}
      {showInteraction && (
        <div id="showInteraction">
          {/* {entityProperties.type === "mob" && (
            <Button id="attack" onClick={performAction}>
              Attack
            </Button>
          )}
          {entityProperties.type === "tree" && (
            <Button id="chop" onClick={performAction}>
              Chop
            </Button>
          )}
          {entityProperties.type === "rock" && (
            <Button id="mine" onClick={performAction}>
              Mine
            </Button>
          )} */}
          <span>
            {/* Currently interacting with {JSON.stringify(entity.properties.name)} */}
            <br />
            <br />
            {/* Entity Health: {JSON.stringify(entity.health)} */}
            <br />
            <br />
            {/* Current entity is: {JSON.stringify(entity)} */}
            {/* {JSON.stringify(playerState)} */}
          </span>
        </div>
      )}
    </div>
  );
};

export default Main;
