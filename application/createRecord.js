'use strict'

import { Wallets, Gateway } from 'fabric-network'
import fs from 'fs'
import yaml from 'js-yaml'

async function createRecord(username, orgNum) {
    const gateway = new Gateway()
    const wallet = await Wallets.newFileSystemWallet(
        `../identity/user/${username}/wallet`
    )
    const gatewayOptions = {
        identity: username,
        wallet: wallet,
        discovery: { enabled: true, asLocalhost: true },
    }
    try {
        const connectionProfile = yaml.safeLoad(
            fs.readFileSync(`../profiles/connection-org${orgNum}.yaml`, 'utf8')
        )
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

const givenUsername = process.argv[2] || 'username'
const givenOrgNum = Number.isInteger(process.argv[3]) ? process.argv[3] : 1
createRecord(givenUsername, givenOrgNum).then(() => {
    console.log('Finished creating record!')
}).catch((e) => {
    console.log('Failed to create record.')
    console.log(e)
    console.log(e.stack)
    process.exit(-1)
})