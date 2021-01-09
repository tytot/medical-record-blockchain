'use strict'

import FabricCAServices from 'fabric-ca-client'
import { Wallets } from 'fabric-network'
import fs from 'fs'
import yaml from 'js-yaml'
import path from 'path'

async function enrollUser(username, password, orgNum) {
    try {
        const connectionProfile = yaml.safeLoad(
            fs.readFileSync(`../profiles/connection-org${orgNum}.yaml`, 'utf8')
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
            enrollmentID: username,
            enrollmentSecret: password,
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

const givenUsername = process.argv[2] || 'username'
const givenPassword = process.argv[3] || 'password'
const givenOrgNum = Number.isInteger(process.argv[4]) ? process.argv[4] : 1
console.log(`Enrolling user ${givenUsername} from organization ${givenOrgNum}...`)
enrollUser(givenUsername, givenPassword, givenOrgNum)
    .then(() => {
        console.log('Finished enrolling user!')
    })
    .catch((e) => {
        console.log('Failed to enroll user.')
        console.log(e)
        console.log(e.stack)
        process.exit(-1)
    })
