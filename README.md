# medical-record-blockchain
A distributed ledger for medical records implemented with Hyperledger Fabric

## Installation
1. `. start.sh`: brings up the network (2 peer nodes, 1 orderer node, 3 certificate authorities), creates a channel, deploys chaincode
2. `cd application && npm run api`: starts the RESTful API for manipulating the blockchain
3. `num run server`: runs web application accessed at http://localhost:3000
