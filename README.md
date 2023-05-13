# Zoom Team Chat 
## Installation

In terminal, run the following command to clone the repo:

`$ git clone https://github.com/muzammal-ikram/zoom-chatbot.git`
## Setup

1. In terminal, cd into the cloned repo:

   `$ cd zoom-chatbot`

1. Then install the dependencies:

   `$ npm install`

1. Create an environment file to store your credentials:

   `$ cp .env.example .env`

2. Create a PosgreSql database

1. Back in the `.env` file, add the following details.

   ```
    PORT=3000
    UNSPLASH_ACCESS_KEY=
    ZOOM_CLIENT_ID=
    ZOOM_CLIENT_SECRET=
    ZOOM_BOT_JID=
    ZOOM_VERIFICATION_TOKEN=
    DB_PORT=
    DB_HOST=
    DB_USER=
    DB_PASS=
    DB_NAME=
   ```

1. Save and close `.env`.

1. Then start the server:

   `$ npm run start`

1. If you want to format the code in the prettier format:

   `$ npm run format`

1. If you want to lint the code:

   `$ npm run lint`

1. Once run the locally, install ngrok and open a new terminal tab and run:

   `$ ngrok http 3000`

   > NOTE: [3000 is default port, set in .env]
