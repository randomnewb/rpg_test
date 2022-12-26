import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const Main = () => {
    const dispatch = useDispatch();

    const [showEntities, setShowEntities] = useState(true);
    const [showInteraction, setShowinteraction] = useState(false);
    const zone = useSelector((state) => state.zone);

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
        changeVisiblity();
    };

    const performAction = (act) => {
        console.log(act.target.id);
        changeVisiblity();
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
                    <span> Currently interacting with ENTITY</span>
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
