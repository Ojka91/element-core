[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

| Current version | Status       |
| ------- | ------------------ |
| Beta  | Works with known bugs 🪲 |


This is a non profit project we've built inspired by [Element Silver Edition board game](https://ratherdashinggames.com/games/element-silver.html)

This is not an official game and we have no relation with the owners of the board game [Element Silver Edition](https://ratherdashinggames.com/games/element-silver.html)

# Element - backend

Backend service for non official element board game online 

Frontend project can be found [here](https://github.com/Arkk92/element-front)

If you want to play with your friends visit [here](https://element-online.netlify.app/)

## Setup Instructions

### Prerequisites

* [NodeJS version 16 or later](https://nodejs.org/en/download/) - or use [nvm](https://github.com/nvm-sh/nvm)
* [Docker](https://docs.docker.com/install)

### Running for first time

If you just want to run the whole game for first time execute:
```
make local-up-build
```

If you don't want to build the container again just execute:
```
make local-up
```

You can run the project using 
```
make run
or
npm run start
```
But keep in mind redis won't be up and that may cause some issues

