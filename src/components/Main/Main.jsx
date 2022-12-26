import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const Main = () => {
    const dispatch = useDispatch();

    const [showEntities, setShowEntities] = useState(true);
    const [showInteraction, setShowinteraction] = useState(false);
    const [currentEntity, setCurrentEntity] = useState(null);
    const [entityHealth, setEntityHealth] = useState(null);
    const zone = useSelector((state) => state.zone);
    const entity = useSelector((state) => state.entity);

    // Generate a random number within a given range

    const randomNumRange = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // Enemy stats, used when instantiating a new entity
    const entityStats = [
        { name: "mob", minHealth: 2, maxHealth: 5 },
        { name: "tree", minHealth: 2, maxHealth: 3 },
    ];

    const instanceEnemy = (entity) => {
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
        console.log("Interaction is", e.target.id);
        setEntity(e.target.id);
        instanceEnemy(e.target.id);
        changeVisiblity();
    };

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
                    <button
                        id="mob"
                        onClick={interactEntity}>
                        Monster entity
                    </button>
                    <button
                        id="tree"
                        onClick={interactEntity}>
                        Tree entity
                    </button>
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
        </div>
    );
};

export default Main;
