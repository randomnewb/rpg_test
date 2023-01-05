## Prerequisites

Before you get started, make sure you have the following software installed on your computer:

-   [Node.js](https://nodejs.org/en/)
-   [PostrgeSQL](https://www.postgresql.org/)
-   [Nodemon](https://nodemon.io/)

-   Database table is 'rpg_app'

## Development Setup Instructions

-   Run `npm install`
-   Create a `.env` file at the root of the project and paste this line into the file:
    ```
    SERVER_SESSION_SECRET=superDuperSecret
    ```
-   Start postgres if not running already by using `brew services start postgresql`
-   Run `npm run server`
-   Run `npm run client`
-   Navigate to `localhost:3000`

## Debugging

To debug, you will need to run the client-side separately from the server. Start the client by running the command `npm run client`. Start the debugging server by selecting the Debug button.

![VSCode Toolbar](documentation/images/vscode-toolbar.png)

Then make sure `Launch Program` is selected from the dropdown, then click the green play arrow.

![VSCode Debug Bar](documentation/images/vscode-debug-bar.png)

## Testing Routes with Postman

To use Postman with this repo, you will need to set up requests in Postman to register a user and login a user at a minimum.

Keep in mind that once you using the login route, Postman will manage your session cookie for you just like a browser, ensuring it is sent with each subsequent request. If you delete the `localhost` cookie in Postman, it will effectively log you out.

1. Start the server - `npm run server`
2. Import the sample routes JSON file [v2](./PostmanPrimeSoloRoutesv2.json) by clicking `Import` in Postman. Select the file.
3. Click `Collections` and `Send` the following three calls in order:
    1. `POST /api/user/register` registers a new user, see body to change username/password
    2. `POST /api/user/login` will login a user, see body to change username/password
    3. `GET /api/user` will get user information, by default it's not very much

After running the login route above, you can try any other route you've created that requires a logged in user!

## Production Build

Before pushing to Heroku, run `npm run build` in terminal. This will create a build folder that contains the code Heroku will be pointed at. You can test this build by typing `npm start`. Keep in mind that `npm start` will let you preview the production build but will **not** auto update.

-   Start postgres if not running already by using `brew services start postgresql`
-   Run `npm start`
-   Navigate to `localhost:5000`

## Lay of the Land

Directory Structure:

-   `src/` contains the React application
-   `public/` contains static assets for the client-side
-   `build/` after you build the project, contains the transpiled code from `src/` and `public/` that will be viewed on the production site
-   `server/` contains the Express App

## Deployment

1. Create a new Heroku project
1. Link the Heroku project to the project GitHub Repo
1. Create an Heroku Postgres database
1. Connect to the Heroku Postgres database from Postico
1. Create the necessary tables
1. Add an environment variable for `SERVER_SESSION_SECRET` with a nice random string for security
1. In the deploy section, select manual deploy

## To-Do's

[ ] Setup a log/narrator
[ ] Setup HP/MP/Stamina System
[ ] Interaction feature
[ ] Also, spawn 2-5 entities if there are less than 0 entities
[ ] Zones that players have access to needs to be programatically provided and mapped in World component
That is, only zones that have been unlocked will have players be shown access to
And in future, zones that could be accessed will be 'disabled', but will have helper text (sometimes)
to show how they can be unlocked
[ ] Inform on Button hover (for world/zone selection)
https://stackoverflow.com/questions/61204955/material-ui-display-sub-element-on-hover-of-parent
https://codesandbox.io/s/mui-theme-css-hover-example-n8ou5?file=/demo.js
[ ] Update to configureStore method of the @reduxjs/toolkit package, which replaces createStore (https://redux.js.org/introduction/why-rtk-is-redux-today)

## Bugs

    [ ] None at this time

## Feature: Begin Interaction

Players can interact with one entity at a time (one-to-many table)
So the user table should have a reference to the spawn table and a spawn.id
In this way, multiple players can be interacting with one entity at a time
And this is an easy to way to implement playing 'together'

Client-side:

    [ ] Clicking an entity runs the interactWithEntity() function
    [ ] Pass in the spawn.id of the entity
    [ ] User Saga sends an INITIATE_ENGAGEMENT to the server (this is the initial engagement step, so the server/player both know an entity is being interacted with)

Server-side:

    [ ] app.put route
    [ ] UPDATE the user's spawn_id from the user table

    OPTIONALLY? but also check if the user is in that zone that matches where the spawn is
    (will there be an issue if the spawn no longer exists either?
    or will this be resolved later naturally because a player
    who goes to act upon an entity that no longer exists
    will receive such a message when that code is implemented?)
    [ ] send back updated information to the client probably

Client-side:

    [ ] Fetch the user information and set it to the reducer
    [ ] If a player has a spawn_id (something they're interacting with), their view and state will change - Change this in Nav?

## Feature: Interaction Options

Once players are engaged with an entity
Particular actions are available based on entity type
Actions chosen are sent to the server where calculations are completed
The result is returned
If the entity is still available (health or it hasn't yet been abandoned)
then the loop continues

Client-side:

    [ ] Clicking an action runs the entityAction() function dispatches it with a matching payload
