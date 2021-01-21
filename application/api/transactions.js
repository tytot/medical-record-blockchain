'use strict'

const connection = require('./connection.js')

function createRecord(contract, id, lastName, firstName) {
    return new Promise(async function (resolve, reject) {
        try {
            console.log('Submitting create medical record transaction...')
            let response = await contract.submitTransaction('createRecord', id, lastName, firstName)
            console.log('Response:')
            console.log(response.toString())
            resolve(response)
        } catch (e) {
            console.log('An error occurred while creating the record.')
            reject(e)
        }
    })
}

function updateRecord(contract, record) {
    return new Promise(async function (resolve, reject) {
        try {
            console.log('Submitting update medical record transaction...')
            let response = await contract.submitTransaction('updateRecord', JSON.stringify(record))
            console.log('Response:')
            console.log(response.toString())
            resolve(response)
        } catch (e) {
            console.log('An error occurred while updating the record.')
            reject(e)
        }
    })
}

function readRecord(contract, id) {
    return new Promise(async function (resolve, reject) {
        try {
            console.log(`Submitting read medical record transaction...`)
            let response = await contract.evaluateTransaction('readRecord', id)
            console.log('Response:')
            console.log(response.toString())
            resolve(response)
        } catch (e) {
            console.log(`An error occurred while reading record ${id}.`)
            reject(e)
        }
    })
}

function deleteRecord(contract, id) {
    return new Promise(async function (resolve, reject) {
        try {
            console.log('Submitting delete medical record transaction...')
            let response = await contract.submitTransaction('deleteRecord', id)
            console.log('Response:')
            console.log(response.toString())
            resolve(response)
        } catch (e) {
            console.log('An error occurred while deleting the record.')
            reject(e)
        }
    })
}

function searchRecords(contract, id, lastName, firstName) {
    return new Promise(async function (resolve, reject) {
        try {
            console.log(`Submitting search medical records transaction...`)
            let response = await contract.evaluateTransaction(
                'searchRecords',
                id,
                lastName,
                firstName
            )
            console.log('Response:')
            console.log(response.toString())
            resolve(response)
        } catch (e) {
            console.log(`An error occurred while searching for records.`)
            reject(e)
        }
    })
}

const flag = process.argv[2]

if (flag === '--create') {
    const parsedOrgNum = parseInt(process.argv[3])
    const givenOrgNum = isNaN(parsedOrgNum) ? 1 : parsedOrgNum
    const sampleRecord = {
        ID: '12-34-56',
        lastName: 'Doe',
        firstName: 'John',
    }
    connection
        .connect(givenOrgNum, 'mychannel', 'medicalrecordcontract')
        .then(function (contract) {
            return createRecord(
                contract,
                sampleRecord.ID,
                sampleRecord.lastName,
                sampleRecord.firstName
            )
        })
        .then(function (response) {
            console.log('Transaction successful.')
            process.exit(0)
        })
        .catch(function (error) {
            console.log('Transaction unsuccessful.')
            console.log(error)
        })
} else if (flag === '--update') {
    const parsedOrgNum = parseInt(process.argv[3])
    const givenOrgNum = isNaN(parsedOrgNum) ? 1 : parsedOrgNum
    const sampleRecord = {
        ID: '12-34-56',
        lastName: 'Doe',
        firstName: 'John',
        medications: [],
        immunizations: [],
    }
    connection
        .connect(givenOrgNum, 'mychannel', 'medicalrecordcontract')
        .then(function (contract) {
            return updateRecord(contract, sampleRecord)
        })
        .then(function (response) {
            console.log('Transaction successful.')
            process.exit(0)
        })
        .catch(function (error) {
            console.log('Transaction unsuccessful.')
            console.log(error)
        })
} else if (flag === '--read') {
    const parsedOrgNum = parseInt(process.argv[3])
    const givenOrgNum = isNaN(parsedOrgNum) ? 1 : parsedOrgNum
    connection
        .connect(givenOrgNum, 'mychannel', 'medicalrecordcontract')
        .then(function (contract) {
            return readRecord(contract, '12-34-56')
        })
        .then(function (response) {
            console.log('Transaction successful.')
            process.exit(0)
        })
        .catch(function (error) {
            console.log('Transaction unsuccessful.')
            console.log(error)
        })
} else if (flag === '--delete') {
    const parsedOrgNum = parseInt(process.argv[3])
    const givenOrgNum = isNaN(parsedOrgNum) ? 1 : parsedOrgNum
    connection
        .connect(givenOrgNum, 'mychannel', 'medicalrecordcontract')
        .then(function (contract) {
            return deleteRecord(contract, '12-34-56')
        })
        .then(function (response) {
            console.log('Transaction successful.')
            process.exit(0)
        })
        .catch(function (error) {
            console.log('Transaction unsuccessful.')
            console.log(error)
        })
} else if (flag === '--search') {
    const parsedOrgNum = parseInt(process.argv[3])
    const givenOrgNum = isNaN(parsedOrgNum) ? 1 : parsedOrgNum
    connection
        .connect(givenOrgNum, 'mychannel', 'medicalrecordcontract')
        .then(function (contract) {
            return searchRecords(contract, '12-34-56', '', '')
        })
        .then(function (response) {
            console.log('Transaction successful.')
            process.exit(0)
        })
        .catch(function (error) {
            console.log('Transaction unsuccessful.')
            console.log(error)
        })
}
module.exports.createRecord = createRecord
module.exports.updateRecord = updateRecord
module.exports.readRecord = readRecord
module.exports.deleteRecord = deleteRecord
module.exports.searchRecords = searchRecords
