const express = require("express");
const cors = require("cors");
const {createProxyMiddleware} = require("http-proxy-middleware");

const app = express();
const PORT = 3000;

app.use(cors());
app.use("/", createProxyMiddleware({
    target: "http://127.0.0.1:7545",
    changeOrigin: true,
})
);

app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
  });