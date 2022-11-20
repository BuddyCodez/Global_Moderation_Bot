module.exports = {
  name: "nodeConnect",
  execute(client, node) {
    console.log(`${node.name} is connected!`);
  },
};