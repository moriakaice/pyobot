Pyobot
======

This is a Node.js implementation of a Pokemon GO Discord notification bot created by Pyorot. The original source is available [on Pastebin](https://pastebin.com/nKdyRSty).

How it works
------------
The bot is based on an external configuration. In the original implementation, this was obtained from the [JSONBlob.com service](https://jsonblob.com/), but it was swapped for the local configuration file in this implementation.

At the beginning, the query is made to the mapping service, then the response is being scanned for the Pokemon that pass the notification thresholds. When those are selected, more details over the location are scrapped from external sources (Postcodes.io, OpenStreetMap, Google Maps) and the final package is then posted on selected Discord server and channels.

It was created originally to use [LondonPogoMap](https://londonpogomap.com/), but can be adjusted to other similar sites with some effort.

Installation
------------
After standard `npm install` on the project, copy the `configuration.example.json` file to `configuration.json` and customise the values to fit your details.

Run the bot with `npm start` command.

License
-------
The code is licensed under the ISC.