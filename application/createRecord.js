'use strict'

const { Wallets, Gateway } = require('fabric-network');
const fs = require('fs');
const yaml = require('js-yaml');

async function createRecord(username) {
    try {
        const wallet = await Wallets.newFileSystemWallet(
            `../identity/user/${username}/wallet`
        )
        const gateway = new Gateway()
        const connectionProfile = yaml.safeLoad(
            fs.readFileSync('../connectionProfile.yaml', 'utf8')
        )
        const gatewayOptions = {
            identity: username,
            wallet: wallet,
            discovery: { enabled: true, asLocalhost: true },
        }
        console.log('Connecting to Fabric gateway...')
        await gateway.connect(connectionProfile, gatewayOptions)
        console.log('Getting network channel "mychannel"...')
        const network = await gateway.getNetwork('mychannel')
        console.log('Getting contract "medicalrecordcontract"...')
        const contract = await network.getContract('medicalrecordcontract')
        console.log('Submitting create medical record transaction...')
        const response = await contract.submitTransaction(
            'createRecord',
            'Lin',
            'Tyler',
            '13d2c4e8-cab1-4fa2-b924-2c26527f5ac7'
        )
        console.log(`Transaction response: ${response}`)
    } catch (error) {
        console.log(`There was an error processing the transaction: ${error}`)
        console.log(error.stack)
    } finally {
        console.log('Disconnecting from Fabric gateway.')
        gateway.disconnect()
    }
}

createRecord(process.argv[2]).then(() => {
    console.log('Finished creating record!');
}).catch((e) => {
    console.log('Failed to create record.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
})