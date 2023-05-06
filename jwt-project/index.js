const http = require("http");
const app = require("./app");
const server = http.createServer(app);

const { API_PORT } = process.env;
// specified port 3200 if nothing else can be found
const port = process.env.PORT || API_PORT || 3200;

// server listening 
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});