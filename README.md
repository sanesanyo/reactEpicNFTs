# Mint Your Own NFT Collection

### **Welcome 👋**

1. Run `npm install` at the root of your directory
2. Run `npm run start` to start the project locally
3. Run `npm run build` to create build file for the project
4. In order to deploy it on Google Cloud run `gcloud app deploy` (before you deploy please make sure to check the instructions below)


Remember when you deployed your contract to the Rinkeby Testnet (epic btw)? The output from that deployment included your smart contract address which should look something like this:

Deploying contracts with the account: 0xF79A3bb8d5b93686c4068E2A97eAeC5fE4843E7D
Account balance: 3198297774605223721
WavePortal address: 0xd5f08a0ae197482FA808cE84E00E97d940dBD26E

Add the address like you see for Waveportal address above i.e. 0xd5f08a0ae197482FA808cE84E00E97d940dBD26E to line 87 in src\App.js i.e. const CONTRACT_ADDRESS = "YOUR CONTRACT ADDRESS HERE";

Also make sure to your own ABI file for your smart contract in \src\utils. The contents of the ABI file can be found in a fancy JSON file in your hardhat project, something similar to shown below:

artifacts/contracts/WavePortal.sol/WavePortal.json


