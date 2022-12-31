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

import LandingPage from "../LandingPage/LandingPage";
import LoginPage from "../LoginPage/LoginPage";
import RegisterPage from "../RegisterPage/RegisterPage";
import World from "../World/World";
import Inventory from "../Inventory/Inventory";
import Main from "../Main/Main";

import "./App.css";

import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ead4aa",
    },
    secondary: {
      main: "#ead4aa",
    },
    normal: {
      main: "#ead4aa",
    },
    woodcutting: {
      main: "#b86f50",
    },
    mining: {
      main: "#c0cbdc",
    },
    attacking: {
      main: "#e43b44",
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained",
        style: {
          "&:hover": {
            color: "#181425",
            backgroundColor: "#e4a672",
          },
        },
      },
      variants: [
        {
          props: { variant: "blue" },
          style: {
            textTransform: "none",
            border: `2px dashed blue`,
            "&:hover": {
              color: "#181425",
              backgroundColor: "#00ff00",
            },
          },
        },
        {
          props: { variant: "red" },
          style: {
            border: `4px dashed red`,
            "&:hover": {
              color: "#181425",
              backgroundColor: "#00bb00",
            },
          },
        },
      ],
    },
  },
});

// components: {
//     MuiButton: {
//         defaultProps: {
//             variant: "test",
//             sx: {
//                 "&:hover": {
//                     color: "#181425",
//                     backgroundColor: "#00ff00",
//                 },
//             },
//         },
//     },
// },

// [
//   {
//     '&:hover': {
//       color: 'red',
//       backgroundColor: 'white',
//     },
//   },
//   foo && {
//     '&:hover': { backgroundColor: 'grey' },
//   },
//   bar && {
//     '&:hover': { backgroundColor: 'yellow' },
//   },
// ]

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
          <Switch>
            {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
            <Redirect exact from="/" to="/world" />

            {/* Visiting localhost:3000/about will show the about page. */}

            {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:3000/user will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the LoginPage (component).
            Even though it seems like they are different pages, the user is always on localhost:3000/user */}
            <ProtectedRoute exact path="/world">
              <World />
            </ProtectedRoute>

            <ProtectedRoute exact path="/zone">
              <Main />
            </ProtectedRoute>

            <ProtectedRoute exact path="/inventory">
              <Inventory />
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

            <Route exact path="/world">
              {user.id ? (
                // If the user is already logged in,
                // redirect them to the /user page
                <Redirect to="/world" />
              ) : (
                // Otherwise, show the Landing page
                <LandingPage />
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
