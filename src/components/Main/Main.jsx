import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const Main = () => {
    const dispatch = useDispatch();

    // Enemy list, used when instantiating a new entity
    const entityList = [
        { id: 0, value: 0, name: "mob", minHealth: 2, maxHealth: 5 },
        { id: 1, value: 1, name: "tree", minHealth: 2, maxHealth: 3 },
        { id: 2, value: 2, name: "rock", minHealth: 3, maxHealth: 6 },
    ];

    const [showEntities, setShowEntities] = useState(true);
    const [showInteraction, setShowinteraction] = useState(false);
    const [currentEntity, setCurrentEntity] = useState(null);
    const [entityHealth, setEntityHealth] = useState(null);
    const [spawnEntities, setSpawnEntities] = useState([]);
    const zone = useSelector((state) => state.zone);
    const entity = useSelector((state) => state.entity);

    // Generate a random number within a given range
    const randomNumRange = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const zoneEntities = [entityList[0], entityList[1], entityList[2]];

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

    const parseEnemy = (e) => {
        // Entity's name
        instanceEntityName(e.target.value);

        // This is the entity's entity_id
        instanceEntityHealth(e.target.value);
    };

    const removeEntity = (entityToDelete) => {
        setSpawnEntities((spawnEntities) =>
            spawnEntities.filter((e) => e.id !== parseInt(entityToDelete))
        );
    };

    const instanceEntityName = (entity) => {
        for (let i = 0; i < entityList.length; i++) {
            if (entityList[i].value === parseInt(entity)) {
                setEntity(entityList[i].name);
            }
        }
    };

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

    useEffect(() => {
        spawnRandomEntities(2, 5);
    }, []);

    useEffect(() => {
        setCurrentEntity(entity);
    }, [entity]);

    const setEntity = (entity) => {
        dispatch({
            type: "SET_ENTITY",
            payload: entity,
        });
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

    const interactEntity = (e) => {
        parseEnemy(e);

        // This is the unique id of the entity
        removeEntity(e.target.id);

        // Switch to interacting with entities
        changeVisiblity();
    };

    // Reduce entityHealth by 1 on click, if the health is below 0 or at 1,
    // switch back to the view that shows all entities
    const performAction = (act) => {
        setEntityHealth(entityHealth - 1);

        if (entityHealth <= 0 || entityHealth === 1) {
            changeVisiblity();
        }
    };

    return (
        <div>
            <div>
                <span>Zone is: {JSON.stringify(zone)}</span>
            </div>
            {showEntities && (
                <div id="showEntities">
                    {spawnEntities.map((entity) => (
                        <button
                            onClick={interactEntity}
                            key={entity.id}
                            id={entity.id}
                            value={entity.entity.value}>
                            {entity.entity.name}
                        </button>
                    ))}
                </div>
            )}
            {showInteraction && (
                <div id="showInteraction">
                    <span>
                        Currently interacting with{" "}
                        {JSON.stringify(currentEntity)}
                        <br />
                        <br />
                        Entity Health: {JSON.stringify(entityHealth)}
                    </span>
                    <button
                        id="attack"
                        onClick={performAction}>
                        Attack
                    </button>
                </div>
            )}
            {/* <button onClick={createEntity}> Create entity</button> */}
        </div>
    );
};

export default Main;
