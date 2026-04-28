import { Client } from "./archipelago.js";

// Create a new instance of the Client class.
const client = new Client();

// Set up an event listener for whenever a message arrives and print the plain-text content to the console.
client.messages.on("message", (content) => {
    console.log(content);
});

// Login to the server. Replace `archipelago.gg:XXXXX` and `Phar` with the address/url and slot name for your room.
// If no game is provided, client will connect in "TextOnly" mode, which is fine for this example.
client.login("archipelago.gg:64805", "JerryDice")
    .then(() => console.log("Connected to the Archipelago server!"))
    .catch(console.error);