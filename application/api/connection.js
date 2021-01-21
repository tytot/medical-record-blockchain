'use strict'

const { Wallets, Gateway } = require('fabric-network')
const fs = require('fs')
const yaml = require('js-yaml')

const gateway = new Gateway()

exports.connect = function connect(orgNum, channelName, contractName) {
    return new Promise(async function (resolve, reject) {
        const wallet = await Wallets.newFileSystemWallet(
            `../../wallets/org${orgNum}`
        )
        const gatewayOptions = {
            identity: 'admin',
            wallet: wallet,
            discovery: { enabled: true, asLocalhost: true },
        }
        try {
            const connectionProfile = yaml.safeLoad(
                fs.readFileSync(`../../profiles/connection-org${orgNum}.yaml`, 'utf8')
            )
            console.log('Connecting to Fabric gateway...')
            await gateway.connect(connectionProfile, gatewayOptions)
            console.log(`Getting network channel "${channelName}"...`)
            const network = await gateway.getNetwork('mychannel')
            console.log(`Getting contract "${contractName}"...`)
            const contract = await network.getContract('medicalrecordcontract')
            resolve(contract)
        } catch (e) {
            console.log(`An error occurred while connecting to the Fabric gateway:`)
            console.log(e)
            reject(e)
        }
    })
}

exports.disconnect = function disconnect() {
    console.log('Disconnecting from Fabric gateway.')
    gateway.disconnect()
}