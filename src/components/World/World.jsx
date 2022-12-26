import React from "react";
import { useState } from "react";

const World = () => {
    const [zone, setZone] = useState(1);

    const changeZone = (e) => {
        console.log("Zone id is", e.target.id);
        setZone(e.target.id);
    };

    return (
        <div>
            <span>Your current zone is {zone}</span>
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
