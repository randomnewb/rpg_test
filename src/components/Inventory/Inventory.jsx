import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Typography } from "@mui/material";

const Inventory = () => {
    const dispatch = useDispatch();

    const stat = useSelector((store) => store.stat);
    const inventory = useSelector((store) => store.inventory);

    useEffect(() => {
        dispatch({ type: "FETCH_USER_STAT" });
        dispatch({ type: "FETCH_USER_INVENTORY" });
    }, []);

    return (
        <div>
            <Typography> Inventory View</Typography>
            <Typography> {JSON.stringify(inventory)}</Typography>
            <Typography> {JSON.stringify(stat)}</Typography>
        </div>
    );
};

export default Inventory;
