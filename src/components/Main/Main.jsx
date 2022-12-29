/*

We have the entity saved to the entity reducer now
See JSON.stringify(entity)
We want to use the entity's information from its reducer
Any user interactions should also dispatch to the entity reducer
Later on, we will implement sagas

*/

import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
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

    const [showEntities, setShowEntities] = useState(true);
    const [showInteraction, setShowinteraction] = useState(false);
    const [spawnEntities, setSpawnEntities] = useState([]);
    const [entityProperties, setEntityProperties] = useState("");
    const [entityHealth, setEntityHealth] = useState(null);
    const [entityCreated, setEntityCreated] = useState(false);
    const zone = useSelector((state) => state.zone);
    const entity = useSelector((state) => state.entity);

    // Generate a random number within a given range
    const randomNumRange = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // Current unused list of entities that can spawn by zone
    // const zoneEntities = [entityList[0], entityList[1], entityList[2]];

    const spawnRandomEntities = (minSpawn, maxSpawn) => {
        let numberOfEntities = randomNumRange(minSpawn, maxSpawn);
        while (numberOfEntities > 0) {
            numberOfEntities--;
            let id = numberOfEntities + 1;
            let entity = entityList[randomNumRange(0, 2)];

            setSpawnEntities((spawnEntitites) => [
                ...spawnEntitites,
                { entity, id },
            ]);
        }
    };

    const interactEntity = (e) => {
        parseEnemy(e);

        // Removes the entity based on their unique id
        // We can do so as the entity is "saved" as the current entity
        removeEntity(e.target.id);

        // Switch to interacting with entities
        changeVisiblity();

        // Notifies useEffect to run and dispatches an action to save the entity
        setEntityCreated(true);
    };

    const parseEnemy = (e) => {
        // Entity's properties
        instanceEntityProperties(e.target.value);

        // Sets the entity's health
        instanceEntityHealth(e.target.value);
    };

    // This removes the entity from list of spawned entities
    const removeEntity = (entityToDelete) => {
        setSpawnEntities((spawnEntities) =>
            spawnEntities.filter((e) => e.id !== parseInt(entityToDelete))
        );
    };

    // This matches the entity the user selects with one from the hard-coded array of entities
    const instanceEntityProperties = (entity) => {
        for (let i = 0; i < entityList.length; i++) {
            if (entityList[i].value === parseInt(entity)) {
                setEntityProperties(entityList[i]);
            }
        }
    };

    // Sets the entity's health to a random amount based on their hard-coded min/max health values
    const instanceEntityHealth = (entity) => {
        for (let i = 0; i < entityList.length; i++) {
            if (parseInt(entityList[i].value) === parseInt(entity)) {
                setEntityHealth(
                    randomNumRange(
                        entityList[i].minHealth,
                        entityList[i].maxHealth
                    )
                );
            }
        }
    };

    // Spawns 2 to 5 entities on load
    useEffect(() => {
        spawnRandomEntities(2, 5);
    }, []);

    useEffect(() => {
        dispatchEntity();
    }, [entityCreated]);

    const dispatchEntity = () => {
        dispatch({
            type: "SET_ENTITY",
            payload: { entity: entityProperties, health: entityHealth },
        });

        setEntityCreated(false);
    };

    // Hide entities while engaged in interaction
    const changeEntitiesVisiblity = () => {
        setShowEntities(!showEntities);
    };

    const changeInteractionVisiblity = () => {
        setShowinteraction(!showInteraction);
    };

    const changeVisiblity = () => {
        changeEntitiesVisiblity();
        changeInteractionVisiblity();
    };

    // Reduce entityHealth by 1 on click, if the health is below 0 or at 1,
    // switch back to the view that shows all entities
    const performAction = (act) => {
        setEntityHealth(entityHealth - 1);

        if (entityHealth <= 0 || entityHealth === 1) {
            changeVisiblity();
        }

        if (spawnEntities <= 0) {
            spawnRandomEntities(2, 5);
        }
    };

    return (
        <div>
            <div>
                <span>Zone is: {JSON.stringify(zone)}</span>
                {/* <span>{JSON.stringify(spawnEntities)}</span> */}
            </div>
            {showEntities && (
                <div id="showEntities">
                    {spawnEntities.map((entity) => (
                        <Button
                            onClick={interactEntity}
                            key={entity.id}
                            id={entity.id}
                            value={entity.entity.value}
                            // variant="blue"
                        >
                            {entity.entity.name}
                        </Button>
                    ))}
                </div>
            )}
            {showInteraction && (
                <div id="showInteraction">
                    <span>
                        Currently interacting with{" "}
                        {JSON.stringify(entityProperties.name)}
                        <br />
                        <br />
                        Entity Health: {JSON.stringify(entityHealth)}
                        <br />
                        <br />
                        {/* Current entity is: {JSON.stringify(entity)} */}
                    </span>
                    {entityProperties.type === "mob" && (
                        <Button
                            id="attack"
                            onClick={performAction}>
                            Attack
                        </Button>
                    )}
                    {entityProperties.type === "tree" && (
                        <Button
                            id="chop"
                            onClick={performAction}>
                            Chop
                        </Button>
                    )}
                    {entityProperties.type === "rock" && (
                        <Button
                            id="mine"
                            onClick={performAction}>
                            Mine
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Main;
