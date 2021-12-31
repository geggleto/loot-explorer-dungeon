module.exports = {
    handle(message, args) {

        message.channel.send("pong");
    },
    middleware() {
        return [];
    }
}