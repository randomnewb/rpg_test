import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const Main = () => {
    const dispatch = useDispatch();

    // Enemy stats, used when instantiating a new entity
    const entityStats = [
        { id: 0, value: "mob", minHealth: 2, maxHealth: 5 },
        { id: 1, value: "tree", minHealth: 2, maxHealth: 3 },
        { id: 2, value: "thing", minHealth: 2, maxHealth: 3 },
    ];

    const [showEntities, setShowEntities] = useState(true);
    const [showInteraction, setShowinteraction] = useState(false);
    const [currentEntity, setCurrentEntity] = useState(null);
    const [entityHealth, setEntityHealth] = useState(null);
    const [spawnEntities, setSpawnEntities] = useState([
        entityStats[0],
        entityStats[1],
    ]);
    const zone = useSelector((state) => state.zone);
    const entity = useSelector((state) => state.entity);

    // Generate a random number within a given range
    const randomNumRange = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const zoneEntities = [entityStats[0], entityStats[1]];

    const createEntity = () => {
        const thing = entityStats[2];
        console.log("Thing is", thing);
        setSpawnEntities((spawnEntitites) => [...spawnEntitites, thing]);

        console.log("Entities spawned are now", spawnEntities);
    };

    const removeEntity = (entityToDelete) => {
        console.log("entityToDelete", entityToDelete);
        console.log("Spawned entitites are", spawnEntities);
        setSpawnEntities((spawnEntities) =>
            spawnEntities.filter((e) => e.id !== parseInt(entityToDelete))
        );
    };

    const instanceEntity = (entity) => {
        switch (entity) {
            case "mob":
                setEntityHealth(
                    randomNumRange(
                        entityStats[0].minHealth,
                        entityStats[0].maxHealth
                    )
                );
            case "tree":
                setEntityHealth(
                    randomNumRange(
                        entityStats[1].minHealth,
                        entityStats[1].maxHealth
                    )
                );
            case "thing":
                setEntityHealth(
                    randomNumRange(
                        entityStats[2].minHealth,
                        entityStats[2].maxHealth
                    )
                );
            default:
                return null;
        }
    };

    useEffect(() => {
        console.log("Current zone reducer is", entity);
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
        console.log("Interaction is", e.target.value);
        setEntity(e.target.value);
        instanceEntity(e.target.value);
        removeEntity(e.target.id);
        changeVisiblity();
    };

    // Reduce entityHealth by 1 on click, if the health is below 0 or at 1,
    // switch back to the view that shows all entities
    const performAction = (act) => {
        console.log(act.target.id);
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
                    {/* <button
                        id="mob"
                        onClick={interactEntity}>
                        Monster entity
                    </button>
                    <button
                        id="tree"
                        onClick={interactEntity}>
                        Tree entity
                    </button> */}
                    {spawnEntities.map((entity) => (
                        <button
                            onClick={interactEntity}
                            key={entity.id}
                            id={entity.id}
                            value={entity.value}>
                            {" "}
                            {entity.value} Entity
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
            <button onClick={createEntity}> Create entity</button>
        </div>
    );
};

export default Main;
