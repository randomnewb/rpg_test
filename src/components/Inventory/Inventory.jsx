import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
    Typography,
    Button,
    List,
    ListItem,
    IconButton,
    Container,
} from "@mui/material";
import { ReactComponent as AddItem } from "../../svg/add_item.svg";
import { ReactComponent as RemoveItem } from "../../svg/remove_item.svg";

const Inventory = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const stat = useSelector((store) => store.stat);
    const inventory = useSelector((store) => store.inventory);
    const equipment = useSelector((store) => store.equipped);

    useEffect(() => {
        dispatch({ type: "FETCH_USER_STAT" });
        dispatch({ type: "FETCH_USER_INVENTORY" });
        dispatch({ type: "FETCH_USER_EQUIPMENT" });
    }, [dispatch]);

    const equipPog = (e) => {
        dispatch({
            type: "UPDATE_USER_EQUIPMENT",
            payload: e.currentTarget.id,
        });
        // dispatch({ type: "REMOVE_EQUIPMENT", payload: e.currentTarget.id });
        // dispatch({ type: "SET_INVENTORY", payload: e.currentTarget.id });
        history.go(0);
    };

    const unequipPog = (e) => {
        dispatch({
            type: "UPDATE_USER_INVENTORY",
            payload: e.currentTarget.id,
        });
        // dispatch({ type: "REMOVE_INVENTORY", payload: e.currentTarget.id });
        // dispatch({ type: "SET_EQUIPMENT", payload: e.currentTarget.id });
        history.go(0);
    };

    return (
        <Container>
            <Typography> Inventory</Typography>
            {/* <Typography> {JSON.stringify(inventory)}</Typography> */}
            <br />
            <List>
                {inventory.map((item) => {
                    return (
                        <>
                            <ListItem key={item.item_id}>
                                {item.equippable && (
                                    <IconButton
                                        id={item.item_id}
                                        onClick={equipPog}>
                                        <AddItem />
                                    </IconButton>
                                )}

                                <Typography>{item.quantity}x&nbsp;</Typography>
                                <Typography> {item.name} </Typography>
                            </ListItem>
                        </>
                    );
                })}
            </List>
            <br />
            <Typography> Currently Equipped: </Typography>
            {/* <Typography> {JSON.stringify(equipment)}</Typography> */}
            <br />
            <List>
                {equipment.map((item) => {
                    return (
                        <>
                            <ListItem key={item.id}>
                                {item.equippable && (
                                    <IconButton
                                        id={item.id}
                                        onClick={unequipPog}>
                                        <RemoveItem />
                                    </IconButton>
                                )}

                                <Typography>{item.quantity}x&nbsp;</Typography>
                                <Typography> {item.name} </Typography>
                            </ListItem>
                        </>
                    );
                })}
            </List>
            <br />
        </Container>
    );
};

export default Inventory;
