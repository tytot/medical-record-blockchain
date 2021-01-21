'use strict'

const FabricCAServices = require('fabric-ca-client')
const { Wallets } = require('fabric-network')
const fs = require('fs')
const yaml = require('js-yaml')
const path = require('path')

function buildCAClient(orgNum) {
    const connectionProfile = yaml.safeLoad(
        fs.readFileSync(`../../profiles/connection-org${orgNum}.yaml`, 'utf8')
    )
    const caInfo = connectionProfile.certificateAuthorities[`ca.org${orgNum}.example.com`]
    const ca = new FabricCAServices(
        caInfo.url,
        { trustedRoots: caInfo.tlsCACerts.pem, verify: false },
        caInfo.caName
    )
    console.log(`Built CA client named ${caInfo.caName}.`)
    return ca
}

function enrollAdmin(username, secret, orgNum) {
    return new Promise(async function (resolve, reject) {
        try {
            console.log(`Enrolling admin user ${username} from organization ${orgNum}...`)
            const ca = buildCAClient(orgNum)
            const walletPath = path.join(process.cwd(), `../../wallets/org${orgNum}`)
            const wallet = await Wallets.newFileSystemWallet(walletPath)
            console.log(`Wallet path: ${walletPath}`)

            const userExists = await wallet.get(username)
            if (userExists) {
                await disenrollUser(username, orgNum)
            }
            const enrollment = await ca.enroll({
                enrollmentID: username,
                enrollmentSecret: secret,
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
            resolve()
        } catch (error) {
            reject(error)
        }
    })
}

function registerUser(username, secret, orgNum, adminUsername) {
    return new Promise(async function (resolve, reject) {
        try {
            console.log(`Enrolling user ${username} from organization ${orgNum}...`)
            const ca = buildCAClient(orgNum)
            const walletPath = path.join(process.cwd(), `../../wallets/org${orgNum}`)
            const wallet = await Wallets.newFileSystemWallet(walletPath)
            console.log(`Wallet path: ${walletPath}`)

            const adminIdentity = await wallet.get(adminUsername)
            if (!adminIdentity) {
                console.log(
                    `An identity for the admin user "${adminUsername}" does not exist in the wallet.`
                )
                reject(new Error('Admin user is not enrolled.'))
            } else {
                const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type)
                const adminUser = await provider.getUserContext(adminIdentity, adminUsername)
                await ca.register(
                    {
                        affiliation: `org${orgNum}`,
                        enrollmentID: username,
                        enrollmentSecret: secret,
                        maxEnrollments: -1,
                        role: 'user',
                    },
                    adminUser
                )
                resolve()
            }
        } catch (error) {
            reject(error)
        }
    })
}

function enrollUser(username, secret, orgNum) {
    return new Promise(async function (resolve, reject) {
        try {
            console.log(`Enrolling user ${username} from organization ${orgNum}...`)
            const ca = buildCAClient(orgNum)
            const walletPath = path.join(process.cwd(), `../../wallets/org${orgNum}`)
            const wallet = await Wallets.newFileSystemWallet(walletPath)
            console.log(`Wallet path: ${walletPath}`)

            const userExists = await wallet.get(username)
            if (userExists) {
                await disenrollUser(username, orgNum)
            }
            const enrollment = await ca.enroll({
                enrollmentID: username,
                enrollmentSecret: secret,
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
            resolve()
        } catch (error) {
            reject(error)
        }
    })
}

function disenrollUser(username, orgNum) {
    return new Promise(async function (resolve, reject) {
        try {
            console.log(`Disenrolling user ${username} from organization ${orgNum}...`)
            const walletPath = path.join(process.cwd(), `../../wallets/org${orgNum}`)
            const wallet = await Wallets.newFileSystemWallet(walletPath)
            console.log(`Wallet path: ${walletPath}`)

            const userExists = await wallet.get(username)
            if (userExists) {
                await wallet.remove(username)
            }
            resolve()
        } catch (error) {
            reject(error)
        }
    })
}

const flag = process.argv[2]
const givenUsername = process.argv[3] || 'admin'
const givenSecret = process.argv[4] || 'adminpw'
const parsedOrgNum = parseInt(process.argv[5])
const givenOrgNum = isNaN(parsedOrgNum) ? 1 : parsedOrgNum
const givenAdminUsername = process.argv[6] || 'admin'

if (flag === '--enrollAdmin') {
    enrollAdmin(givenUsername, givenSecret, givenOrgNum)
        .then(function () {
            console.log(
                `Successfully enrolled admin user "${givenUsername}" and imported identity into wallet.`
            )
        })
        .catch(function (error) {
            console.log(`Failed to enroll admin user "${givenUsername}":`)
            console.log(error)
        })
} else if (flag === '--registerUser') {
    registerUser(givenUsername, givenSecret, givenOrgNum, givenAdminUsername)
        .then(function () {
            console.log(`Successfully registered user "${givenUsername}".`)
        })
        .catch(function (error) {
            console.log(`Failed to register user "${givenUsername}":`)
            console.log(error)
            // code 0: already registered
            // code 20: authentication failure
        })
} else if (flag === '--enrollUser') {
    enrollUser(givenUsername, givenSecret, givenOrgNum)
        .then(function () {
            console.log(
                `Successfully enrolled user "${givenUsername}" and imported identity into wallet.`
            )
        })
        .catch(function (error) {
            console.log(`Failed to enroll user "${givenUsername}":`)
            console.log(error)
            // code 20: authentication failure
        })
} else if (flag === '--disenrollUser') {
    disenrollUser(givenUsername, givenOrgNum)
        .then(function () {
            console.log(
                `Successfully disenrolled user "${givenUsername}" and removed identity from wallet.`
            )
        })
        .catch(function (error) {
            console.log(`Failed to disenroll user "${givenUsername}":`)
            console.log(error)
            // code 20: authentication failure
        })
}

module.exports.enrollAdmin = enrollAdmin
module.exports.registerUser = registerUser
module.exports.enrollUser = enrollUser
module.exports.disenrollUser = disenrollUser