import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const World = () => {
    const dispatch = useDispatch();

    const zone = useSelector((state) => state.zone);
    const [currentZone, setCurrentZone] = useState(zone);

    useEffect(() => {
        console.log("Current zone reducer is", zone);
        setCurrentZone(zone);
    }, [zone]);

    const setZone = (zone) => {
        dispatch({
            type: "SET_ZONE",
            payload: zone,
        });
    };

    const changeZone = (e) => {
        console.log("Zone id is", e.target.id);

        setZone(e.target.id);
    };

    return (
        <div>
            <span>{JSON.stringify(currentZone)}</span>
            <button
                id="1"
                onClick={changeZone}>
                Zone 1
            </button>
            <button
                id="2"
                onClick={changeZone}>
                Zone 2
            </button>
        </div>
    );
};

export default World;
