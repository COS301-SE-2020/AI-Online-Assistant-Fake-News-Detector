const http = require("http");

const app = require("./app");

const port = process.env.PORT || 3000;

const server = http.createServer(app);

let listener = server.listen(port, () => {
  console.log("DB_Server listening on port " + listener.address().port);
});

module.exports = server;