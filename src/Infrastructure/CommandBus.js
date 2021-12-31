// Commands
// const PingPong = require('../../Commands/PingPong');

const PingPong = require('../Commands/PingPong');

let bus = {
    handlers: {},
    addCommand(command, callback) {
        this.handlers[command] = callback;
    },
    handle(message, command, eventBus, args) {
        let thing = this.handlers[command];

        try {
            if (thing) {
                thing.handle(message, args);
            } else {
                message.channel.send("unknown command");
            }
        } catch (e) {
            message.channel.send("error executing command");
            console.error(e);
        }
    }
}

bus.addCommand("!ping", PingPong);

module.exports = bus;