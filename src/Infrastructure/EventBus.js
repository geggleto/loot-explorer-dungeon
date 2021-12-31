let bus = {
    listeners: {},
    addEventListener(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }

        this.listeners[event].push(callback);
    },
    dispatch(event) {
        let listeners = this.listeners[event.name] ?? [];
        listeners.forEach(async (c) => {
            await c(event);
        })
    }
}


module.exports = bus;