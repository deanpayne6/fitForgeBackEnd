// const http = require("http");
// const app = require("./app");
// const server = http.createServer(app);

// const { API_PORT } = process.env;
// // specified port 3200 if nothing else can be found
// //const port = process.env.PORT || API_PORT || 3200;
// const port = 3200;
// // server listening 
// server.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });


const http = require("http");
const app = require("./app");
const server = http.createServer(app);

const allowedOrigins = ["http://localhost:4200"]; 

server.on("request", (req, res) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");


  app(req, res);
});

const port = 3200;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});