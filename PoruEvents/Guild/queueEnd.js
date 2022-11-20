module.exports = {
    name: "queueEnd",
    async execute(client, player) {
         player.destroy();
    }
};