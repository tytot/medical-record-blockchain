'use strict'

const FabricCAServices = require('fabric-ca-client')
const { Wallets } = require('fabric-network')
const fs = require('fs')
const yaml = require('js-yaml')
const path = require('path')

async function enrollUser(username, orgNum) {
    try {
        const connectionProfile = yaml.safeLoad(
            fs.readFileSync('../connectionProfile.yaml', 'utf8')
        )
        const caInfo =
            connectionProfile.certificateAuthorities[
                `ca.org${orgNum}.example.com`
            ]
        const ca = new FabricCAServices(
            caInfo.url,
            { trustedRoots: caInfo.tlsCACerts.pem, verify: false },
            caInfo.caName
        )
        const walletPath = path.join(
            process.cwd(),
            `../identity/user/${username}/wallet`
        )
        const wallet = await Wallets.newFileSystemWallet(walletPath)
        console.log(`Wallet path: ${walletPath}`)
        const userExists = await wallet.get(username)
        if (userExists) {
            console.log(
                `An identity for user "${username}" already exists in the wallet.`
            )
            return
        }
        const enrollment = await ca.enroll({
            enrollmentID: 'user1',
            enrollmentSecret: 'user1pw',
        })
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: `Org${orgNum}MSP`,
            type: 'X.509',
        }
        await wallet.put(username, x509Identity)
        console.log(
            `Successfully enrolled user "${username}" and imported it into the wallet.`
        )
    } catch (error) {
        console.error(`Failed to enroll user "${username}": ${error}.`)
        process.exit(1)
    }
}

enrollUser(process.argv[2], process.argv[3])
    .then(() => {
        console.log('Finished enrolling user!')
    })
    .catch((e) => {
        console.log('Failed to enroll user.')
        console.log(e)
        console.log(e.stack)
        process.exit(-1)
    })
