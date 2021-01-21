const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const connection = require('./connection.js')
const { enrollAdmin, registerUser, enrollUser, disenrollUser } = require('./users.js')
const {
    createRecord,
    updateRecord,
    readRecord,
    deleteRecord,
    searchRecords,
} = require('./transactions.js')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const port = 3001

app.post('/registerUser', (req, res) => {
    const body = req.body
    if (
        !body.hasOwnProperty('username') ||
        !body.hasOwnProperty('password') ||
        !body.hasOwnProperty('orgNum')
    ) {
        res.status(400).send({ message: 'Invalid request body.' })
    } else {
        registerUser(body.username, body.password, body.orgNum, 'admin')
            .then(function () {
                res.send({ message: `${body.username} registered successfully!` })
            })
            .catch(function (e) {
                res.status(500).send({ message: 'Authentication error; failed to register user.' })
            })
    }
})

app.post('/enrollUser', (req, res) => {
    const body = req.body
    if (
        !body.hasOwnProperty('username') ||
        !body.hasOwnProperty('password') ||
        !body.hasOwnProperty('orgNum')
    ) {
        res.status(400).send({ message: 'Invalid request body.' })
    } else {
        enrollUser(body.username, body.password, body.orgNum)
            .then(function () {
                res.send({ message: `${body.username} enrolled successfully!` })
            })
            .catch(function (e) {
                res.status(500).send({ message: 'Authentication error; failed to enroll user.' })
            })
    }
})

app.post('/disenrollUser', (req, res) => {
    const body = req.body
    if (!body.hasOwnProperty('username') || !body.hasOwnProperty('orgNum')) {
        res.status(400).send({ message: 'Invalid request body.' })
    } else {
        disenrollUser(body.username, body.orgNum)
            .then(function () {
                res.send({ message: `${body.username} disenrolled successfully!` })
            })
            .catch(function (e) {
                res.status(500).send({ message: 'Authentication error; failed to disenroll user.' })
            })
    }
})

app.post('/createRecord', (req, res) => {
    const body = req.body
    if (!body.hasOwnProperty('orgNum') || !body.hasOwnProperty('record')) {
        res.status(400).send({ message: 'Invalid request body.' })
    } else {
        connection
            .connect('admin', body.orgNum, 'mychannel', 'medicalrecordcontract')
            .then(function (contract) {
                return createRecord(
                    contract,
                    body.record.ID,
                    body.record.lastName,
                    body.record.firstName
                )
            })
            .then(function (response) {
                res.send({ message: `Transaction successful. Record added: ${response.toString()}` })
            })
            .catch(function (error) {
                console.log(error)
                res.status(500).send({ message: 'Transaction unsuccessful.' })
            })
    }
})

app.post('/updateRecord', (req, res) => {
    const body = req.body
    if (!body.hasOwnProperty('orgNum') || !body.hasOwnProperty('record')) {
        res.status(400).send({ message: 'Invalid request body.' })
    } else {
        connection
            .connect('admin', body.orgNum, 'mychannel', 'medicalrecordcontract')
            .then(function (contract) {
                return updateRecord(contract, body.record)
            })
            .then(function (response) {
                res.send({ message: `Transaction successful. Record updated: ${response.toString()}` })
            })
            .catch(function (error) {
                res.status(500).send({ message: 'Transaction unsuccessful.' })
            })
    }
})

app.get('/records', (req, res) => {
    connection
        .connect('admin', 1, 'mychannel', 'medicalrecordcontract')
        .then(function (contract) {
            if (req.query.hasOwnProperty('id')) {
                var id = req.query.id
            } else {
                id = ''
            }
            if (req.query.hasOwnProperty('lastName')) {
                var lastName = req.query.lastName
            } else {
                lastName = ''
            }
            if (req.query.hasOwnProperty('firstName')) {
                var firstName = req.query.firstName
            } else {
                firstName = ''
            }
            return searchRecords(contract, id, lastName, firstName)
        })
        .then(function (response) {
            res.send(response.toString())
        })
        .catch(function (error) {
            res.status(500).send({ message: 'Transaction unsuccessful.' })
        })
})

app.get('/records/:id', (req, res) => {
    connection
        .connect('admin', 1, 'mychannel', 'medicalrecordcontract')
        .then(function (contract) {
            return readRecord(contract, req.params.id)
        })
        .then(function (response) {
            res.send(response.toString())
        })
        .catch(function (error) {
            res.status(500).send({ message: 'Transaction unsuccessful.' })
        })
})

app.delete('/records/:id', (req, res) => {
    connection
        .connect('admin', 1, 'mychannel', 'medicalrecordcontract')
        .then(function (contract) {
            return deleteRecord(contract, req.params.id)
        })
        .then(function (response) {
            res.send({ message: `Transaction successful. Record deleted.` })
        })
        .catch(function (error) {
            res.status(500).send({ message: 'Transaction unsuccessful.' })
        })
})

app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`)
    // enrollAdmin('admin', 'adminpw', 1)
    //     .then(function () {
    //         console.log(
    //             `Successfully enrolled admin user "admin" and imported identity into wallet.`
    //         )
    //     })
    //     .catch(function (error) {
    //         console.log(`Failed to enroll admin user "admin":`)
    //         console.log(error)
    //     })
    // enrollAdmin('admin', 'adminpw', 2)
    //     .then(function () {
    //         console.log(
    //             `Successfully enrolled admin user "admin" and imported identity into wallet.`
    //         )
    //     })
    //     .catch(function (error) {
    //         console.log(`Failed to enroll admin user "admin":`)
    //         console.log(error)
    //     })
})
