const express = require("express");
const bodyParser = require("body-parser");
const MetaApi = require("metaapi.cloud-sdk").default;

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

const token = process.env.TOKEN || "your-token-here";
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
