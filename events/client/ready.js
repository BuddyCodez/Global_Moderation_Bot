module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log(`${client.user.tag} is ready!`);
    client.poru.init(client);
    console.log(`Music system Intializing`);
  },
};
