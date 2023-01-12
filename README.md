## Prerequisites

Before you get started, make sure you have the following software installed on your computer:

- [Node.js](https://nodejs.org/en/)
- [PostrgeSQL](https://www.postgresql.org/)
- [Nodemon](https://nodemon.io/)

- Database table is 'rpg_app'

## Development Setup Instructions

- Run `npm install`
- Create a `.env` file at the root of the project and paste this line into the file:
  ```
  SERVER_SESSION_SECRET=superDuperSecret
  ```
- Start postgres if not running already by using `brew services start postgresql`
- Run `npm run server`
- Run `npm run client`
- Navigate to `localhost:3000`

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

- Start postgres if not running already by using `brew services start postgresql`
- Run `npm start`
- Navigate to `localhost:5000`

## Lay of the Land

Directory Structure:

- `src/` contains the React application
- `public/` contains static assets for the client-side
- `build/` after you build the project, contains the transpiled code from `src/` and `public/` that will be viewed on the production site
- `server/` contains the Express App

## Deployment

1. Create a new Heroku project
1. Link the Heroku project to the project GitHub Repo
1. Create an Heroku Postgres database
1. Connect to the Heroku Postgres database from Postico
1. Create the necessary tables
1. Add an environment variable for `SERVER_SESSION_SECRET` with a nice random string for security
1. In the deploy section, select manual deploy

## To-Do's

    [ ] Database has been changed, bit.io and other databases need to be updated accordingly
    [ ] Setup a log/narrator
    [ ] Setup HP/MP/Stamina System
    [ ] Also, spawn 2-5 entities if there are less than 0 entities
    [ ] Zones that players have access to needs to be programatically provided and mapped in World component
    That is, only zones that have been unlocked will have players be shown access to
    And in future, zones that could be accessed will be 'disabled', but will have helper text (sometimes)
    to show how they can be unlocked
    [ ] Programatically map buttons for interaction (more important when there are more possible actions later) - Could feed them to client via an array of actions
    [ ] Inform on Button hover (for world/zone selection)
    https://stackoverflow.com/questions/61204955/material-ui-display-sub-element-on-hover-of-parent
    https://codesandbox.io/s/mui-theme-css-hover-example-n8ou5?file=/demo.js
    [ ] Update to configureStore method of the @reduxjs/toolkit package, which replaces createStore (https://redux.js.org/introduction/why-rtk-is-redux-today)

## Bugs

## Possible solutions

## Upcoming Features/Requests

    - Redo the Theme - 90's apocalyptic punk
    - Implement dice/card system
    - A log/narrator - Keeps a record of what happens during an interaction
        i.e., "Boulder took 2 damage from you", "Zombie took a bite out of you for 1 damage"
    - Setup a stamina system - Interacting utilizes stamina, players will have to figure out how to balance this resource along with their health and
        items to be successful
    - Setup a health system for the player - Some entities bite back, if a player reaches 0 or less health, the event is automatically abandoned
    - Set up a player stats system and view - Check out one's own stats, so fast, so smart, so strong! You're close to leveling up!
    - Setup an inventory system - One more reason to "Wander" and chip away at this Boulder! It might drop something useful
    - Add polish to the pig - How about some images? How about some more color?
    - Implement information on hover - Find out more about what's going on by hovering over an entity or component in the view
    - Add more content to the few existing systems (more types of entities, zones, etc.)
    - Add a player profile (choose from some set avatars as your display image, add a bit about yourself)
    - Add a way to see other players who are online or visit other player's profiles and see their stats

## Working on

    [x] Player now has stats_id tied to their user.id
    [x] Show the player's health to them (on Zone and during Interaction)
    [x] Show the player's stats to them (on a Character Component)

    [ ] Integrate player taking damage from enemies
        -   Set this up on the user router?
        -   Going to try and set this up on the entity router as well
    [ ] Player's health changes when taking damage from enemies
        -   This information will be updated as usual when the player info is fetched
    [ ] Need to update database tables (player max_health and max_stamina)
    [ ] When player's health is equal to or below 0, reset them back to the Zone view
        -   Make a separate component/view showing that the player lost their health
        -   Bonus would be adding the information of the entity to this view
        -   Button to reset the player's health, stamina back to part of their max_health/max_stamina

    -   Potential Issues/Solutions
    -   How do we ensure that the player information is updated in line with the entity data?
    -   Making sure that there is a screen of information shown when the player completes an encounter or has failed an encounter
    -   Integrate player state ('success', 'failed', 'exhausted', etc.)
