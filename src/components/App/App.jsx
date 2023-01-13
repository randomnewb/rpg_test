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
import SetupCharacter from "../SetupCharacter/SetupCharacter";
import Defeated from "../Defeated/Defeated";

import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material";
import defaultTheme from "./defaultTheme";

let theme = createTheme(defaultTheme);

function App() {
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user);

  useEffect(() => {
    dispatch({ type: "FETCH_USER" });
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div>
          <Nav />

          {user.current_state === "initialize" && (
            <Switch>
              <ProtectedRoute exact path="/initialize">
                <SetupCharacter />
              </ProtectedRoute>

              <ProtectedRoute exact path="/world">
                <SetupCharacter />
              </ProtectedRoute>

              <ProtectedRoute exact path="/zone">
                <SetupCharacter />
              </ProtectedRoute>

              <ProtectedRoute exact path="/inventory">
                <SetupCharacter />
              </ProtectedRoute>
            </Switch>
          )}
          <Switch>
            {user.current_state === "defeated" && (
              <Switch>
                <ProtectedRoute exact path="/defeated">
                  <Defeated />
                </ProtectedRoute>

                <ProtectedRoute exact path="/world">
                  <Defeated />
                </ProtectedRoute>

                <ProtectedRoute exact path="/zone">
                  <Defeated />
                </ProtectedRoute>

                <ProtectedRoute exact path="/inventory">
                  <Defeated />
                </ProtectedRoute>
              </Switch>
            )}
            {(user.current_state === "observing" ||
              user.current_state === "interacting") && (
              <Switch>
                <ProtectedRoute exact path="/world">
                  <World />
                </ProtectedRoute>

                <ProtectedRoute exact path="/zone">
                  <Zone />
                </ProtectedRoute>

                <ProtectedRoute exact path="/inventory">
                  <Inventory />
                </ProtectedRoute>
              </Switch>
            )}

            {/* {user.current_state === "interacting" && (
              <Switch>
                <ProtectedRoute exact path="/world">
                  <World />
                </ProtectedRoute>

                <ProtectedRoute exact path="/zone">
                  <Zone />
                </ProtectedRoute>

                <ProtectedRoute exact path="/inventory">
                  <Inventory />
                </ProtectedRoute>
              </Switch>
            )} */}

            {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:3000/user will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the LoginPage (component).
            Even though it seems like they are different pages, the user is always on localhost:3000/user */}

            <Route exact path="/">
              {user.id ? (
                // If the user is already logged in,
                // redirect to the /user page
                <Redirect to="/world" />
              ) : (
                // Otherwise, show the login page
                <LoginPage />
              )}
            </Route>

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

            <Route exact path="/world">
              {user.id ? (
                // If the user is already logged in,
                // redirect them to the /user page
                <Redirect to="/world" />
              ) : (
                // Otherwise, show the registration page
                <RegisterPage />
              )}
            </Route>

            <Route exact path="/inventory">
              {user.id ? (
                // If the user is already logged in,
                // redirect them to the /user page
                <Redirect to="/inventory" />
              ) : (
                // Otherwise, show the registration page
                <RegisterPage />
              )}
            </Route>

            <Route exact path="/zone">
              {user.id ? (
                // If the user is already logged in,
                // redirect them to the /user page
                <Redirect to="/zone" />
              ) : (
                // Otherwise, show the registration page
                <RegisterPage />
              )}
            </Route>

            <Route exact path="/defeated">
              {user.id && user.current_state === "initialize" ? (
                // If the user is already logged in,
                // redirect them to the /user page
                <Redirect to="/world" />
              ) : (
                // Otherwise, show the registration page
                <RegisterPage />
              )}
            </Route>

            {/* <Route exact path="/world">
              {!user.id ? <Redirect to="/login" /> : <Redirect to="/world" />}
            </Route> */}

            <Route exact path="/">
              {!user.id && user.current_state === "" && (
                <Redirect to="/login" />
              )}
            </Route>

            <Route exact path="/world">
              {!user.id && user.current_state === "" && (
                <Redirect to="/login" />
              )}
            </Route>

            <Route exact path="/zone">
              {!user.id && user.current_state === "" && (
                <Redirect to="/login" />
              )}
            </Route>

            <Route exact path="/inventory">
              {!user.id && user.current_state === "" && (
                <Redirect to="/login" />
              )}
            </Route>

            {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
            <Redirect exact from="/" to="/world" />

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
