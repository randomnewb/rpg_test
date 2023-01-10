import React, { useEffect } from "react";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";

import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";

import LoginPage from "../LoginPage/LoginPage";
import RegisterPage from "../RegisterPage/RegisterPage";
import World from "../World/World";
import Inventory from "../Inventory/Inventory";
import Zone from "../Zone/Zone";

import "./App.css";

import { createTheme, ThemeProvider } from "@mui/material";
import defaultTheme from "./defaultTheme";
import SetupCharacter from "../SetupCharacter/SetupCharacter";

let theme = createTheme(defaultTheme);

function App() {
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user);

  useEffect(() => {
    dispatch({ type: "FETCH_USER" });
    dispatch({ type: "FETCH_USER_STAT" });
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div>
          <Nav />
          <Switch>
            {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
            <Redirect exact from="/" to="/world" />

            {/* Visiting localhost:3000/about will show the about page. */}

            {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:3000/user will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the LoginPage (component).
            Even though it seems like they are different pages, the user is always on localhost:3000/user */}

            <ProtectedRoute exact path="/initialize">
              <SetupCharacter />
            </ProtectedRoute>

            <ProtectedRoute exact path="/world">
              {user.current_state === "initialize" ? (
                <SetupCharacter />
              ) : (
                <World />
              )}
            </ProtectedRoute>

            <ProtectedRoute exact path="/zone">
              {user.current_state === "initialize" ? (
                <SetupCharacter />
              ) : (
                <Zone />
              )}
            </ProtectedRoute>

            <ProtectedRoute exact path="/inventory">
              {user.current_state === "initialize" ? (
                <SetupCharacter />
              ) : (
                <Inventory />
              )}
            </ProtectedRoute>

            <Route exact path="/login">
              {user.id ? (
                // If the user is already logged in,
                // redirect to the /user page
                <Redirect to="/world" />
              ) : (
                // Otherwise, show the login page
                <LoginPage />
              )}
            </Route>

            <Route exact path="/registration">
              {user.id ? (
                // If the user is already logged in,
                // redirect them to the /user page
                <Redirect to="/world" />
              ) : (
                // Otherwise, show the registration page
                <RegisterPage />
              )}
            </Route>

            {/* If none of the other routes matched, we will show a 404. */}
            <Route>
              <h1>404</h1>
            </Route>
          </Switch>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
