const express = require("express");
const bodyParser = require("body-parser");
const MetaApi = require("metaapi.cloud-sdk").default;

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

const token =
  process.env.TOKEN ||
  "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJhZGM4MjEzZWEyNmVhNDk2OTYyZDMwNDNkNzNkNGQwMyIsInBlcm1pc3Npb25zIjpbXSwiYWNjZXNzUnVsZXMiOlt7ImlkIjoidHJhZGluZy1hY2NvdW50LW1hbmFnZW1lbnQtYXBpIiwibWV0aG9kcyI6WyJ0cmFkaW5nLWFjY291bnQtbWFuYWdlbWVudC1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciIsIndyaXRlciJdLCJyZXNvdXJjZXMiOlsiKjokVVNFUl9JRCQ6KiJdfSx7ImlkIjoibWV0YWFwaS1yZXN0LWFwaSIsIm1ldGhvZHMiOlsibWV0YWFwaS1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciIsIndyaXRlciJdLCJyZXNvdXJjZXMiOlsiKjokVVNFUl9JRCQ6KiJdfSx7ImlkIjoibWV0YWFwaS1ycGMtYXBpIiwibWV0aG9kcyI6WyJtZXRhYXBpLWFwaTp3czpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciIsIndyaXRlciJdLCJyZXNvdXJjZXMiOlsiKjokVVNFUl9JRCQ6KiJdfSx7ImlkIjoibWV0YWFwaS1yZWFsLXRpbWUtc3RyZWFtaW5nLWFwaSIsIm1ldGhvZHMiOlsibWV0YWFwaS1hcGk6d3M6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbIio6JFVTRVJfSUQkOioiXX0seyJpZCI6Im1ldGFzdGF0cy1hcGkiLCJtZXRob2RzIjpbIm1ldGFzdGF0cy1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciIsIndyaXRlciJdLCJyZXNvdXJjZXMiOlsiKjokVVNFUl9JRCQ6KiJdfSx7ImlkIjoicmlzay1tYW5hZ2VtZW50LWFwaSIsIm1ldGhvZHMiOlsicmlzay1tYW5hZ2VtZW50LWFwaTpyZXN0OnB1YmxpYzoqOioiXSwicm9sZXMiOlsicmVhZGVyIiwid3JpdGVyIl0sInJlc291cmNlcyI6WyIqOiRVU0VSX0lEJDoqIl19LHsiaWQiOiJjb3B5ZmFjdG9yeS1hcGkiLCJtZXRob2RzIjpbImNvcHlmYWN0b3J5LWFwaTpyZXN0OnB1YmxpYzoqOioiXSwicm9sZXMiOlsicmVhZGVyIiwid3JpdGVyIl0sInJlc291cmNlcyI6WyIqOiRVU0VSX0lEJDoqIl19LHsiaWQiOiJtdC1tYW5hZ2VyLWFwaSIsIm1ldGhvZHMiOlsibXQtbWFuYWdlci1hcGk6cmVzdDpkZWFsaW5nOio6KiIsIm10LW1hbmFnZXItYXBpOnJlc3Q6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbIio6JFVTRVJfSUQkOioiXX0seyJpZCI6ImJpbGxpbmctYXBpIiwibWV0aG9kcyI6WyJiaWxsaW5nLWFwaTpyZXN0OnB1YmxpYzoqOioiXSwicm9sZXMiOlsicmVhZGVyIl0sInJlc291cmNlcyI6WyIqOiRVU0VSX0lEJDoqIl19XSwidG9rZW5JZCI6IjIwMjEwMjEzIiwiaW1wZXJzb25hdGVkIjpmYWxzZSwicmVhbFVzZXJJZCI6ImFkYzgyMTNlYTI2ZWE0OTY5NjJkMzA0M2Q3M2Q0ZDAzIiwiaWF0IjoxNzMxODI4MDE5LCJleHAiOjE3Mzk2MDQwMTl9.CBdP6RXRKkKwCP32s15tzz_R-IU7pT7_MH7IW8YYPdfuiQh3Kq1HZOHclvW7nAfA6YH6HEfd2jEnL49NZ4FOWvan3ISXfVnq8QpI0-RYQ9AFy-jT0n8V2Za2j2NJ_JXUnE3izy1bFWTava7-90mueNXZSKjuWMzPrxPiuMQ-z4gX8FVvrv3C1j1yJl8mxKxnNXxhRNIzvjSitgkCndV3HqDDf0gzdt6Iw_DQVw_VoFZYcaeCSzR6CYezeJAUJrYeDzimnxGTHaCSl6MOde9HJikUWmNWGMv56vayj7OtsN2P2_bstJDKduFzx1ghLNP2lX8o2663x3RUNkB5odAE53u20kKbkA9gPOwxEmSj9ODGP83QyjYbJeOWpROE0QVdOnc0JJgypU5VspfI17ZXBX0vp8OAr-iRM_RwPPoJJqD0JgIpvYg-N8sLZgUzC-P0kStCc50AwiCfCRgMXWIyZJUItdFxaFgBmNOyFYkpk1tB-N3k7TojG6iLK6KgIO2G5YhjhtX0iaFjciAdXSztIWEBHFq8leuxwDhKZUPQuNkHrPB-yDa4fvmqTICbNR9EfYMDwzC0zNLV3-rLykkMD0M5Z1RROWUcgekZ5XhMtDd2IpNc11l80WuAstrFhPFxkjutCro83U8qpsQLpQNTXeMAFOY_azWYQW84TvbPi3A";
const api = new MetaApi(token);

// Root route
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Welcome to MetaAPI Microservice",
    developer: "Sibusiso 'TheCodeChef' Ndlovu",
    personal: "www.sbundlovu.co.za",
    business: "www.jaspa.co.za",
    last_updated: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Trade route
app.post("/trade", async (req, res) => {
  try {
    console.log("Received trade request:", req.body);

    const {
      accountId,
      symbol,
      tradeType,
      volume,
      openPrice,
      stopLoss,
      takeProfit,
      comment,
      clientId,
    } = req.body;

    if (!accountId || !symbol || !tradeType || !volume) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const account = await api.metatraderAccountApi.getAccount(accountId);
    console.log("Fetched account:", account.id);

    const initialState = account.state;
    const deployedStates = ["DEPLOYING", "DEPLOYED"];

    if (!deployedStates.includes(initialState)) {
      console.log("Deploying account");
      await account.deploy();
    }

    console.log("Waiting for API server to connect to broker");
    await account.waitConnected();

    const connection = account.getRPCConnection();
    await connection.connect();

    console.log("Waiting for SDK to synchronize with terminal state");
    await connection.waitSynchronized();

    let result;
    if (tradeType === "ORDER_TYPE_BUY") {
      result = await connection.createLimitBuyOrder(
        symbol,
        volume,
        openPrice,
        stopLoss,
        takeProfit,
        {
          comment,
          clientId,
        }
      );
    } else if (tradeType === "ORDER_TYPE_SELL") {
      result = await connection.createLimitSellOrder(
        symbol,
        volume,
        openPrice,
        stopLoss,
        takeProfit,
        {
          comment,
          clientId,
        }
      );
    } else {
      return res.status(400).json({ error: "Invalid tradeType" });
    }

    console.log("Trade result:", result);
    res.json({
      message: "Trade successful",
      result: result.stringCode,
      tradeDetails: result,
    });

    if (!deployedStates.includes(initialState)) {
      console.log("Undeploying account");
      await connection.close();
      await account.undeploy();
    }
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`MetaApi server running on http://localhost:${PORT}`);
});
