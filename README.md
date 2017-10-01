
# Prerequisites

npm install
cd app
npm install

Open 3 terminals

# Execute

## Start TestRPC (Local lightweight Blockchain)

// Terminal 1 (in any folder):
testrpc --accounts 100

## Deploy smart contracts to TESTRPC

// Terminal 2 (relative to project root):
cd ./truffle
truffle deploy --network local
cd ..
node ./app/oracle/oracle.js
mocha tests/app.test.js // optional

## Start Browser App

// Terminal 3 (relative to project root):
cd app
node app.js

Open browser and go to http://localhost:3000
