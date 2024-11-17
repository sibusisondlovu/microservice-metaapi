const express = require('express');
const bodyParser = require('body-parser');
const MetaApi = require('metaapi.cloud-sdk').default;

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const token = process.env.TOKEN || 'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJhZGM4MjEzZWEyNmVhNDk2OTYyZDMwNDNkNzNkNGQwMyIsInBlcm1pc3Npb25zIjpbXSwiYWNjZXNzUnVsZXMiOlt7ImlkIjoidHJhZGluZy1hY2NvdW50LW1hbmFnZW1lbnQtYXBpIiwibWV0aG9kcyI6WyJ0cmFkaW5nLWFjY291bnQtbWFuYWdlbWVudC1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciJdLCJyZXNvdXJjZXMiOlsiYWNjb3VudDokVVNFUl9JRCQ6MzcxYTNlYjctYmZlNS00ZjkwLThmY2ItYjBlZTNkYmYwNjM3Il19LHsiaWQiOiJtZXRhYXBpLXJlc3QtYXBpIiwibWV0aG9kcyI6WyJtZXRhYXBpLWFwaTpyZXN0OnB1YmxpYzoqOioiXSwicm9sZXMiOlsicmVhZGVyIiwid3JpdGVyIl0sInJlc291cmNlcyI6WyJhY2NvdW50OiRVU0VSX0lEJDozNzFhM2ViNy1iZmU1LTRmOTAtOGZjYi1iMGVlM2RiZjA2MzciXX0seyJpZCI6Im1ldGFhcGktcnBjLWFwaSIsIm1ldGhvZHMiOlsibWV0YWFwaS1hcGk6d3M6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbImFjY291bnQ6JFVTRVJfSUQkOjM3MWEzZWI3LWJmZTUtNGY5MC04ZmNiLWIwZWUzZGJmMDYzNyJdfSx7ImlkIjoibWV0YWFwaS1yZWFsLXRpbWUtc3RyZWFtaW5nLWFwaSIsIm1ldGhvZHMiOlsibWV0YWFwaS1hcGk6d3M6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbImFjY291bnQ6JFVTRVJfSUQkOjM3MWEzZWI3LWJmZTUtNGY5MC04ZmNiLWIwZWUzZGJmMDYzNyJdfSx7ImlkIjoibWV0YXN0YXRzLWFwaSIsIm1ldGhvZHMiOlsibWV0YXN0YXRzLWFwaTpyZXN0OnB1YmxpYzoqOioiXSwicm9sZXMiOlsicmVhZGVyIl0sInJlc291cmNlcyI6WyJhY2NvdW50OiRVU0VSX0lEJDozNzFhM2ViNy1iZmU1LTRmOTAtOGZjYi1iMGVlM2RiZjA2MzciXX0seyJpZCI6InJpc2stbWFuYWdlbWVudC1hcGkiLCJtZXRob2RzIjpbInJpc2stbWFuYWdlbWVudC1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciJdLCJyZXNvdXJjZXMiOlsiYWNjb3VudDokVVNFUl9JRCQ6MzcxYTNlYjctYmZlNS00ZjkwLThmY2ItYjBlZTNkYmYwNjM3Il19XSwidG9rZW5JZCI6IjIwMjEwMjEzIiwiaW1wZXJzb25hdGVkIjpmYWxzZSwicmVhbFVzZXJJZCI6ImFkYzgyMTNlYTI2ZWE0OTY5NjJkMzA0M2Q3M2Q0ZDAzIiwiaWF0IjoxNzMxNjU3MTgzLCJleHAiOjE3Mzk0MzMxODN9.Wkj8OcPwv7ARHI8WTtVaosDGnfZTcwf1dGXPXut4x-7UknGydM-EjEMlffKOiqQQiSkPEzBzbtF-XSliajy87rbKbelICVm5LXB7yDfF6c25U5xyy0siHxcaFkn68vWDbn3w69HGJm0spy1zE9mu-xGsY0gZWRemLimY2kwW9tGQyZumSzhTuqkuLQlKZp5SNSHo-J8LalCjHEDLN4pVM2q8Q_0PTKlz9NLzRqz_ZPvPz6sliRtRFmV25eqJmZbf2-C_Ygr0qaBqpnTT2kkqt1XoqqDgCQ0s0pPCGL6EzjD-HS_tTU6a3sWISV_1asCGcSbglJ0amMnAT1LRP_jM22tJWj4pn2AybsbyARhsYhe3RIGQWsANrBzijpGODUuI9GaKeBMhklUMyT8A1oLAuD2OP2gLJ7UYSVngJFzyEJ9SfBDp2tP0ZSZ4O31i5ZIOfe7uus5dT3KPQm7NhYm_ijGC3y9WkxfiBqFWwuBvQk8MZ6UYqxb8PiWRWsaQlMoOm9LgTkdBWh6pgL6_c2Wa4FPbqH9LPIon7ZPWoXzJsRutSW0Ze3Wpxm7hb8T3_3R1pmes53QwfsEyinxYdKq_OVfItWFZI1JDpYzz9eo4H33hGPNRMQYM8BvKDMVWeBzEJJO5W32tTWNMyOAZ4nfGpklsS9GMnezd_CCf6ALDRBI';
const api = new MetaApi(token);

app.post('/trade', async (req, res) => {
  try {
    console.log('Received trade request:', req.body);

    const {
      accountId,
      symbol,
      tradeType,
      volume,
      openPrice,
      stopLoss,
      takeProfit,
      comment,
      clientId
    } = req.body;

    if (!accountId || !symbol || !tradeType || !volume) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const account = await api.metatraderAccountApi.getAccount(accountId);
    console.log('Fetched account:', account.id);

    const initialState = account.state;
    const deployedStates = ['DEPLOYING', 'DEPLOYED'];

    if (!deployedStates.includes(initialState)) {
      console.log('Deploying account');
      await account.deploy();
    }

    console.log('Waiting for API server to connect to broker');
    await account.waitConnected();

    const connection = account.getRPCConnection();
    await connection.connect();

    console.log('Waiting for SDK to synchronize with terminal state');
    await connection.waitSynchronized();

    let result;
    if (tradeType === 'ORDER_TYPE_BUY') {
      result = await connection.createLimitBuyOrder(symbol, volume, openPrice, stopLoss, takeProfit, {
        comment,
        clientId
      });
    } else if (tradeType === 'ORDER_TYPE_SELL') {
      result = await connection.createLimitSellOrder(symbol, volume, openPrice, stopLoss, takeProfit, {
        comment,
        clientId
      });
    } else {
      return res.status(400).json({ error: 'Invalid tradeType' });
    }

    console.log('Trade result:', result);
    res.json({
      message: 'Trade successful',
      result: result.stringCode,
      tradeDetails: result
    });

    if (!deployedStates.includes(initialState)) {
      console.log('Undeploying account');
      await connection.close();
      await account.undeploy();
    }
  } catch (err) {
    console.error('Error occurred:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`MetaApi server running on http://localhost:${PORT}`);
});
