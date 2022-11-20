module.exports = {
    name: "trackError",
    async execute(client, player, track, payload) { 
        console.log(payload);
        console.log("<<< Player >>>", player);
        console.log("<<< Track >>>", track.info.title);
    }
};