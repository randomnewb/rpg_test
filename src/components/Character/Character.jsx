import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Typography, Container } from "@mui/material";

const Character = () => {
    const dispatch = useDispatch();

    const user = useSelector((store) => store.user);
    const stat = useSelector((store) => store.stat);

    useEffect(() => {
        dispatch({ type: "FETCH_USER_STAT" });
    }, []);

    return (
        <Container>
            <Typography>Name: {stat.name}</Typography>
            <Typography>Class: {stat.class} </Typography>
            <Typography>Level: {stat.level}</Typography>
            <Typography>Experience: {stat.experience} </Typography>
            <Typography>Health: {stat.max_health}</Typography>
            <Typography>Mana: {stat.max_mana}</Typography>
            <Typography>Stamina: {stat.max_stamina}</Typography>
            <Typography>Armor: {stat.armor} </Typography>
            <Typography>
                Damage: {stat.min_damage} - {stat.max_damage}
            </Typography>
            <Typography>Strength: {stat.strength} </Typography>
            <Typography>Dexterity: {stat.dexterity} </Typography>
            <Typography>Wisdom: {stat.wisdom} </Typography>
        </Container>
    );
};

export default Character;
