import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Typography, Container } from "@mui/material";

const Character = () => {
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user);
  const stat = useSelector((store) => store.stat);
  const equip = useSelector((store) => store.equipped);

  /**
   * Max Health Calculation
   */

  let item = equip;
  let healthResult = 0;
  let min_damage = 0;
  let max_damage = 0;

  for (let i = 0; i < item.length; i++) {
    if (item[i].attribute === "health") {
      healthResult += item[i].quantity * item[i].value;
    }

    if (item[i].type === "weapon") {
      min_damage = item[i].min_damage;
      max_damage = item[i].max_damage;
    }
  }
  let baseMaxHealth = stat.max_health;
  let baseStrength = stat.strength;

  let combinedHealth =
    baseMaxHealth + Math.floor(baseStrength / 3) + healthResult;

  useEffect(() => {
    dispatch({ type: "FETCH_USER_STAT" });
    dispatch({ type: "FETCH_USER_EQUIPMENT" });
  }, []);

  return (
    <Container>
      {/* <Typography>{JSON.stringify(equip)}</Typography> */}
      <Typography>Name: {stat.name}</Typography>
      <Typography>Class: {stat.class} </Typography>
      <Typography>Level: {stat.level}</Typography>
      <Typography>Experience: {stat.experience} </Typography>
      <Typography>Health: {combinedHealth}</Typography>
      <Typography>Mana: {stat.max_mana}</Typography>
      <Typography>Stamina: {stat.max_stamina}</Typography>
      <Typography>Armor: {stat.armor} </Typography>
      <Typography>
        Damage: {min_damage} - {max_damage}
      </Typography>
      <Typography>Strength: {stat.strength} </Typography>
      <Typography>Dexterity: {stat.dexterity} </Typography>
      <Typography>Wisdom: {stat.wisdom} </Typography>
    </Container>
  );
};

export default Character;
