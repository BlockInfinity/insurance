
# Travel Insurance

# Execute with docker

## Clone and update submodules
Do not change anything in any submodule. Changes in submodules must be made in the responding repo of the submodule.



```javascript
git clone https://github.com/BlockInfinity/insurance.git
```
For the first "pull":
```
git submodule update --init --recursive
```

To update the submodules:
```
git submodule update --remote --recursive --merge
```
Run the whole thing (depending on the installation, a sudo might be necessary):
```
docker-compose up 
```
Run all container in different processes:
```
docker-compose up testrpc
docker-compose up contractdeployer
docker-compose up oracle
docker-compose up app
```


Open browser and go to http://localhost:3002


# Execute without docker

## Prerequisites

```javascript
git clone https://github.com/BlockInfinity/insurance.git
git submodule update --remote --merge

npm install -g testrpc
cd insurance_app && npm install 
cd insurance_oracle && npm install 
cd insurance_testrpc && npm install 

```

Open 3 terminals

### Start TestRPC (Local lightweight Blockchain)

```
testrpc --accounts 50

```

### Deploy smart contracts to TESTRPC

```

cd insurance_contractDeployer && nodeUrl=http://localhost:8545 gulp run
```

### Start Oracle Serivce

```
cd insurance_oracle && nodeUrl=http://localhost:8545 gulp run
```

### Start Browser App

```
cd insurance_app && nodeUrl=http://localhost:8545 gulp run
```


Open browser and go to http://localhost:3002



### Create new insurance

![](/images/1.png)
*Home-Screen*

![](/images/2.png)
*Insurant: Create new insurance*

![](/images/3.png)
*Insurant: New insurance created*

![](/images/4.png)
*Insurer: Suggest price and accept insurance contract*

![](/images/5.png)
*Insurer: Insurance accepted*

![](/images/6.png)
*Insurant: Confirm price*

![](/images/7.png)
*Insurant: Manually claiming insurance*

### Opt-out: Close insurance by insurer

![](/images/8.png)
*Insurer: Close insurance before insurant has confirmed a price*

![](/images/9.png)
*Insurer: Insurance closed*

![](/images/10.png)
*Insurant: Unable to confirm an insurance which has been closed by the insurer*


