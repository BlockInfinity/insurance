
# Flight Delay Insurance

## Create new insurance

![](/images/1.png)
*Home-Screen*

![](/images/2.png)
*Insurant: Create new insurance*

![](/images/3.png)
*Insurant: New insurance created*

![](/images/4.png)
*Insurr: Suggest price and accept insurance contract*

![](/images/5.png)
*Insurr: Insurance accepted*

![](/images/6.png)
*Insurant: Confirm price*

![](/images/7.png)
*Insurant: Manually claiming insurance*

## Opt-out: Close insurance by insurer

![](/images/8.png)
*Insurer: Close insurance before insurant has confirmed a price*

![](/images/9.png)
*Insurer: Insurance closed*

![](/images/10.png)
*Insurant: Unable to confir an insurance which has been closed by the insurer*

# Prerequisites

```javascript
npm install
cd app
npm install
```

Open 3 terminals

# Execute

## Start TestRPC (Local lightweight Blockchain)

```javascript
// Terminal 1 (in any folder):
testrpc --accounts 100
```

## Deploy smart contracts to TESTRPC

```javascript
// Terminal 2 (relative to project root):
cd ./truffle
truffle deploy --network local
cd ..
node ./app/oracle/oracle.js
mocha tests/app.test.js // optional
```

## Start Browser App

```javascript
// Terminal 3 (relative to project root):
cd app
node app.js
```

Open browser and go to http://localhost:3000
