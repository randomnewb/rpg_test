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
    [ ] Implement zone unlocking
        - possible methods
        1. Zones are gated by an unlock_level parameter
            -  Players have an unlock_level as well, if the player's unlock level
            matches any of the unlocked zones or lower, they will have access to the area
        1. Many-to-many table where users have access to zones and zones have a linked user_id
        1. Players are given explicit access to zones and this is stored in something like an array
    [ ] Postman/route tester - people are still able to make requests rapidly via this method

    [ ] Add image to stat table and to item table which will be the svg/image of the entry?
    [ ] Optionally add a victorious current_state where
            user can see and confirm reward after successful interaction with entity
    [ ] Setup a log/narrator
    [ ] MP/Stamina System
    [ ] Also, spawn 2-5 entities if there are less than 0 entities
    [ ] Zones that players have access to needs to be programatically provided and mapped in World component
    That is, only zones that have been unlocked will have players be shown access to
    And in future, zones that could be accessed will be 'disabled', but will have helper text (sometimes)
    to show how they can be unlocked
    [ ] Programatically map buttons for interaction (more important when there are more possible actions later) - Could feed them to client via an array of actions
    [ ] Inform on Button hover (for world/zone selection) - https://github.com/jcoreio/material-ui-popup-state#examples-with-react-hooks
    https://stackoverflow.com/questions/61204955/material-ui-display-sub-element-on-hover-of-parent
    https://codesandbox.io/s/mui-theme-css-hover-example-n8ou5?file=/demo.js
    [ ] Update to configureStore method of the @reduxjs/toolkit package, which replaces createStore (https://redux.js.org/introduction/why-rtk-is-redux-today)

## Bugs

    [ ] Duping bug?
            - Moving items from equipped can cause the item in equipped to become a negative value
            - The items in the inventory could then be moved back (or in the future duped some other way)
            - Items being moved from inventory to equipped are not subtracting their quantity
    [ ] Moving items from inventory to equipped and vice versa work, however, the local state of the reducers should be updated properly
        regardless of needing to refresh/update the page, currently using history.go(0) to refresh in a jank manner

    [ ] Player can still spam interaction, production build doesn't seem to prevent this (500ms timeout)

    [ ] "Not really a bug" - Querying the database for an entry that doesn't exist
    throws an error in express and from the database
        - Is there a way to query for entries or check if an entry 'does not exist'
        and therefore return a non-error message with an empty result?
    [ ] While the player is engaged in combat, they should not be able to switch zones
    [ ] Might not be necessary to initialize inventory for player,
        but could be funny still to include the pocket lint

## Possible solutions

## Upcoming Features/Requests

    - Redo the Theme - 90's apocalyptic punk
    - Implement dice/card system
    - Equipment system (weapon, armor, accessory)
    - Pog/Milkcap System
        -   Completing interactions grants pogs
        -   Pog tubes hold pogs
        -   Players start with a small pog tube (holds 10 pogs)
        -   Pogs grant different bonuses
    - A log/narrator - Keeps a record of what happens during an interaction
        i.e., "Boulder took 2 damage from you", "Zombie took a bite out of you for 1 damage"
    - Setup a stamina system - Interacting utilizes stamina, players will have to figure out how to balance this resource along with their health and items to be successful
    - Set up a player stats system and view - Check out one's own stats, so fast, so smart, so strong! You're close to leveling up!
    - Setup an inventory system - One more reason to "Wander" and chip away at this Boulder! It might drop something useful
    - Add polish to the pig - How about some images? How about some more color?
    - Implement information on hover - Find out more about what's going on by hovering over an entity or component in the view
    - Add more content to the few existing systems (more types of entities, zones, etc.)
    - Add a player profile (choose from some set avatars as your display image, add a bit about yourself)
    - Add a way to see other players who are online or visit other player's profiles and see their stats

## Working on

    [x] GET player's stats, which include damage, during interaction step
    [x] Use this variable damage for the damage calculation
     -  Implement items in inventory granting bonuses or changes to player's stats
     -  Using equipped table information (GET), apply item bonuses where relevant
    [x] Implement health items applying their bonus when the player is revived after losing
    [x] Update Character sheet with potential combined stats
        - Health coming from base max_health, equipped items, Strength (1 HP/3 STR)

    [ ] Implement different types of damage (add to stat table)
        - min_ and max_damage for entities
        - damage_type (array of types for entities)
        - for players, items can provide
            - min_ and max_damage
                - comes from equipped weapon
                - also from items (but must have an equipped item)
                - also from stats
            - single or multiple types
                - melee, ranged, physical, digital, fire, ice, nature, thunder, dark, holy

    [ ] Provide starter gear depending on class
        -   Brute
            -   Wooden Bat
            -   PHYSICAL
            -   MELEE
            -   1 - 3 DAMAGE

        -   Sureshot
            -   Slingshot
            -   PHYSICAL
            -   RANGED
            -   1 - 3 DAMAGE

        -   Arcanist
            -   Calculator
            -   DIGITAL
            -   RANGED
            -   1 - 3 DAMAGE

    Strength implementations
    [ ] Implement Strength increasing flat MELEE damage (1 min & max damage/5 STR)
        - During damage calculation
        - No difference between MELEE and RANGED damage yet
    [ ] Implement Strength increasing max_stamina (1 Stamina/3 STR)
        - During entity interaction
    [ ] Implement Strength increasing armor (1 armor/5 STR)
        - During damage calculation
    [ ] Update character sheet with appropriate strength bonuses

    Dexterity implementations
    [ ] Implement Dexterity increasing dodge chance (2% dodge chance/4 DEX)
        - DODGE not yet implemented
    [ ] Implement Dexterity increasing flat RANGED damage (1 min & max damage/5 DEX)
        - RANGED damage not yet implemented
        - No difference between MELEE and RANGED damage yet
    [ ] Implement Dexterity increasing CRITICAL damage chance (1% for 1.5x damage/5 DEX)
        - CRITICAL DAMAGE and CHANCE not yet implemented
    [ ] Implement Dexterity decreasing stamina use (1% decrease/5 DEX)
        - Stamina system not yet implemented
        - Stamina decrease can not be lower than 1
    [ ] Update character sheet with appropriate dexterity bonuses

    Wisdom implementations
    [ ] Implement Wisdom increasing max Mana (1 mana/3 WIS)
        - Mana not yet implemented
    [ ] Implement Wisdom increasing flat DIGITAL damage (1 min & max/5 WIS)
        - DIGITAL damage not yet implemented
    [ ] Implement Wisdom increasing resistance (1% increase/5 WIS)
        - Resistance not yet implemented

    [ ] Implement New Action: Focus
        - Generates mana on use
        - Amount of mana generated is based on WIS (such as 1 mana/5 WIS) and other parameters

    [ ] Implement other stats and items applying their bonus where relevant

    [ ] Implement enemies with armor
    [ ] Implement enemies with types of resistances (and weaknesses)

## Possible Problems
