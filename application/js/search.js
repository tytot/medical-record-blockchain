'use strict'

// Importing JavaScript
//
// You have two choices for including Bootstrap's JS files—the whole thing,
// or just the bits that you need.

// Option 1
//
// Import Bootstrap's bundle (all of Bootstrap's JS + Popper.js dependency)

// import "../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";

// Option 2
//
// Import just what we need

// If you're importing tooltips or popovers, be sure to include our Popper.js dependency
// import "../../node_modules/popper.js/dist/popper.min.js";

import '../../node_modules/bootstrap/js/dist/util.js'
import '../../node_modules/bootstrap/js/dist/collapse.js'
import '../../node_modules/bootstrap/js/dist/alert.js'

const firstNameField = document.getElementById('first-name')
const lastNameField = document.getElementById('last-name')
const idField = document.getElementById('patient-id')
const spinnerTemplate = document.getElementById('spinner-template')
const resultsEl = document.getElementById('results')
const resultTemplate = document.getElementById('result-template')
const form = document.getElementById('search-form')

const errorAlert = document.querySelector('.alert')

idField.addEventListener('input', function (event) {
    const parent = idField.parentElement
    if (parent.classList.contains('was-validated') && idField.value === '') {
        parent.classList.remove('was-validated')
    } else if (!parent.classList.contains('was-validated') && idField.value !== '') {
        parent.classList.add('was-validated')
    }
})

form.addEventListener('submit', async function (event) {
    if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
    } else {
        event.preventDefault()
        $('.result-card').remove()
        resultsEl.hidden = true
        const spinner = spinnerTemplate.content.firstElementChild.cloneNode(true)
        divider.insertAdjacentElement('afterend', spinner)

        console.log('Searching record on blockchain...')
        const params = new URLSearchParams()
        if (idField.value !== '') {
            params.append('id', idField.value)
        }
        if (lastNameField.value !== '') {
            params.append('lastName', lastNameField.value)
        }
        if (firstNameField.value !== '') {
            params.append('firstName', firstNameField.value)
        }
        errorAlert.hidden = true
        const url = `http://localhost:3001/records?${params.toString()}`
        console.log('Query: ' + url)
        fetch(url)
            .then((res) => {
                const json = res.json()
                if (!res.ok) {
                    throw new Error(json.message)
                }
                return json
            })
            .then((res) => {
                console.log(res)
                spinner.parentNode.removeChild(spinner)
                resultsEl.hidden = false
                resultsEl.querySelector('#num-results').textContent = `${res.length} found`
                for (const result of res) {
                    const resultEl = resultTemplate.content.firstElementChild.cloneNode(true)
                    resultEl.querySelector('.card-header').innerHTML = `ID: <b>${result.ID}</b>`
                    resultEl.querySelector(
                        '.card-title'
                    ).textContent = `${result.lastName}, ${result.firstName}`
                    const texts = resultEl.querySelectorAll('.card-text')
                    const numMs = result.numMedications,
                        numIs = result.numImmunizations
                    texts[0].textContent = `${numMs} Medication${numMs === 1 ? '' : 's'}`
                    texts[1].textContent = `${numIs} Immunization${numIs === 1 ? '' : 's'}`
                    resultEl.querySelector('.open').addEventListener('click', function (event) {
                        const url = new URL(window.location.href)
                        const params = url.searchParams
                        params.set('id', result.ID)
                        url.pathname = '/records'
                        window.location.href = url
                    })
                    resultsEl.appendChild(resultEl)
                }
            })
            .catch((error) => {
                console.log(error)
                spinner.parentNode.removeChild(spinner)
                errorAlert.hidden = false
                $('.alert').alert()
            })
    }
})
