'use strict'

import '../../node_modules/bootstrap/js/dist/util.js'
import '../../node_modules/bootstrap/js/dist/collapse.js'
import '../../node_modules/bootstrap/js/dist/alert.js'

const form = document.querySelector('form')
const usernameField = document.getElementById('username')
const passwordField = document.getElementById('password')
const hospital1Radio = document.getElementById('hospital-1')
const hospital2Radio = document.getElementById('hospital-2')
const loginButton = document.getElementById('submit')
const spinner = document.getElementById('spinner')
const errorAlert = document.querySelector('.alert')

let hospital = 1
hospital1Radio.addEventListener('click', function (event) {
    hospital = 1
})
hospital2Radio.addEventListener('click', function (event) {
    hospital = 2
})
form.addEventListener('submit', function (event) {
    if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
        usernameField.parentElement.classList.add('was-validated')
        passwordField.parentElement.classList.add('was-validated')
    } else {
        event.preventDefault()
        console.log('Enrolling user...')
        errorAlert.hidden = true
        loginButton.disabled = true
        spinner.hidden = false

        const username = usernameField.value
        const orgNum = hospital
        const options = {
            method: 'POST',
            body: JSON.stringify({
                username: username,
                password: passwordField.value,
                orgNum: orgNum
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }
        console.log('Enrolling user...')
        fetch('http://localhost:3001/enrollUser', options)
            .then((res) => {
                const json = res.json()
                if (!res.ok) {
                    throw new Error(json.message)
                }
                return json
            })
            .then((res) => {
                console.log(res)
                loginButton.disabled = false
                spinner.hidden = true
                document.cookie = `username=${username}`
                document.cookie = `orgNum=${orgNum}`
                window.location.href = new URL(window.location.href).origin
            })
            .catch((error) => {
                console.log(error)
                errorAlert.hidden = false
                loginButton.disabled = false
                spinner.hidden = true;
                $('.alert').alert()
            })
    }
})