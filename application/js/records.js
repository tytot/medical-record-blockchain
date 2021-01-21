'use strict'

import '../../node_modules/bootstrap/js/dist/util.js'
import '../../node_modules/bootstrap/js/dist/collapse.js'
import '../../node_modules/bootstrap/js/dist/modal.js'
import '../../node_modules/bootstrap/js/dist/alert.js'

const params = new URL(window.location.href).searchParams
const id = params.get('id')
const url = `http://localhost:3001/records/${id}`
console.log('Query: ' + url)
fetch(url)
    .then((res) => {
        if (res.status === 500) {
            throw new Error('Record does not exist.')
        }
        return res.json()
    })
    .then((res) => {
        console.log(res)
        const record = document.getElementById('all').content.cloneNode(true)
        document.querySelector('.container').appendChild(record)

        document.getElementById(
            'title'
        ).innerHTML = `${res.firstName} ${res.lastName} <small>${id}</small>`
        const idField = document.getElementById('patient-id')
        const lastNameField = document.getElementById('last-name')
        const firstNameField = document.getElementById('first-name')
        idField.value = id
        lastNameField.value = res.lastName
        firstNameField.value = res.firstName

        const medicationList = document.getElementById('medications')
        const medicationTemplate = document.getElementById('medication-template')
        const medicationModal = document.getElementById('medication-modal')
        const medicationForm = document.getElementById('medication-form')
        const medicationNameField = document.getElementById('medication-name')
        const medicationDoseField = document.getElementById('medication-dose')
        const medicationDosageField = document.getElementById('medication-dosage')
        const medicationStartDateField = document.getElementById('medication-start-date')
        const medicationEndDateField = document.getElementById('medication-end-date')
        const medicationReasonField = document.getElementById('medication-reason')
        const medicationPrescriberField = document.getElementById('medication-prescriber')
        const medicationManufacturerField = document.getElementById('medication-manufacturer')

        function medicationElFromMeta(meta) {
            const medicationEl = medicationTemplate.content.firstElementChild.cloneNode(true)
            medicationEl.meta = meta
            const label = medicationEl.querySelector('h5')
            label.textContent = meta.name
            label.insertAdjacentHTML(
                'beforeend',
                `\n<small class="text-muted">${meta.startDate === '' ? 'N/A' : meta.startDate} to ${
                    meta.endDate === '' ? 'Present' : meta.endDate
                }</small>`
            )
            writeElement(
                medicationEl.querySelector('h6'),
                (meta.dose === '' ? '' : meta.dose + ' mg') +
                    (meta.dose !== '' && meta.frequency !== '' ? ', ' : '') +
                    meta.frequency
            )
            writeElement(medicationEl.querySelector('.manufacturer'), meta.manufacturer)
            writeElement(medicationEl.querySelector('em'), meta.note)
            writeElement(
                medicationEl.querySelector('.prescription'),
                meta.prescriber === '' ? '' : `Prescribed by ${meta.prescriber}`
            )
            medicationEl.addEventListener('click', function (event) {
                medicationNameField.value = meta.name
                medicationDoseField.value = meta.dose
                medicationDosageField.value = meta.frequency
                medicationStartDateField.value = meta.startDate
                medicationEndDateField.value = meta.endDate
                medicationReasonField.value = meta.note
                medicationPrescriberField.value = meta.prescriber
                medicationManufacturerField.value = meta.manufacturer
                $('#medication-modal').modal('show')
                medicationModal.reference = medicationEl
            })
            if (meta.endDate !== '') {
                medicationEl.classList.add('list-group-item-light')
            }
            return medicationEl
        }
        res.medications.forEach(function (meta) {
            const medicationEl = medicationElFromMeta(meta)
            medicationList.appendChild(medicationEl)
        })
        document.getElementById('save-medication').addEventListener('click', function (event) {
            if (!medicationForm.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
                medicationNameField.parentElement.classList.add('was-validated')
            } else {
                const meta = {
                    name: medicationNameField.value,
                    dose: medicationDoseField.value,
                    frequency: medicationDosageField.value,
                    startDate: medicationStartDateField.value,
                    endDate: medicationEndDateField.value,
                    note: medicationReasonField.value,
                    prescriber: medicationPrescriberField.value,
                    manufacturer: medicationManufacturerField.value,
                }
                const medicationEl = medicationElFromMeta(meta)
                medicationList.appendChild(medicationEl)
                if (medicationModal.reference) {
                    medicationModal.reference.parentElement.removeChild(medicationModal.reference)
                }
                $('#medication-modal').modal('hide')
            }
        })

        $('#medication-modal').on('hidden.bs.modal', function (e) {
            medicationNameField.value = ''
            medicationDoseField.value = ''
            medicationDosageField.value = ''
            medicationStartDateField.value = ''
            medicationEndDateField.value = ''
            medicationReasonField.value = ''
            medicationPrescriberField.value = ''
            medicationManufacturerField.value = ''
            delete medicationModal.reference
        })

        const doseList = document.getElementById('doses')
        const doseTemplate = document.getElementById('dose-template')
        const addDoseTemplate = document.getElementById('add-dose')
        const doseFormTemplate = document.getElementById('dose-form')

        function registerAddDoseButton() {
            const addDoseButton = addDoseTemplate.content.firstElementChild.cloneNode(true)
            addDoseButton.addEventListener('click', function (event) {
                addDoseButton.replaceWith(newDoseForm({ num: doseList.childElementCount }))
            })
            doseList.appendChild(addDoseButton)
        }

        function newDoseForm(meta) {
            const doseForm = doseFormTemplate.content.firstElementChild.cloneNode(true)
            const doseNumberField = doseForm.querySelector('#dose-num')
            const dateField = doseForm.querySelector('#dose-date')
            const lotNumberField = doseForm.querySelector('#dose-lot-number')
            const noteField = doseForm.querySelector('#dose-note')
            const administratorField = doseForm.querySelector('#dose-administrator')
            const manufacturerField = doseForm.querySelector('#dose-manufacturer')
            doseNumberField.value = meta.num
            const init = !meta.hasOwnProperty('dateAdministered')
            if (!init) {
                dateField.value = meta.dateAdministered
            }
            if (meta.hasOwnProperty('lotNumber')) {
                lotNumberField.value = meta.lotNumber
            }
            if (meta.hasOwnProperty('note')) {
                noteField.value = meta.note
            }
            if (meta.hasOwnProperty('administrator')) {
                administratorField.value = meta.administrator
            }
            if (meta.hasOwnProperty('manufacturer')) {
                manufacturerField.value = meta.manufacturer
            }
            const cancelButton = doseForm.querySelector('#cancel-dose')
            const deleteButton = doseForm.querySelector('#delete-dose')
            cancelButton.addEventListener('click', function (event) {
                if (init) {
                    registerAddDoseButton()
                    doseList.removeChild(doseForm)
                } else {
                    doseForm.replaceWith(doseElFromMeta(meta))
                }
            })
            if (!init) {
                deleteButton.hidden = false
                deleteButton.addEventListener('click', function (event) {
                    doseList.removeChild(doseForm)
                })
            }
            doseForm.querySelector('#save-dose').addEventListener('click', function (event) {
                if (!dateField.checkValidity()) {
                    dateField.parentElement.classList.add('was-validated')
                } else {
                    meta = {
                        num: meta.num,
                        dateAdministered: dateField.value,
                        lotNumber: lotNumberField.value,
                        note: noteField.value,
                        administrator: administratorField.value,
                        manufacturer: manufacturerField.value,
                    }
                    if (init) {
                        registerAddDoseButton()
                    }
                    doseForm.replaceWith(doseElFromMeta(meta))
                }
            })
            return doseForm
        }

        function doseElFromMeta(meta) {
            const doseEl = doseTemplate.content.firstElementChild.cloneNode(true)
            doseEl.meta = meta
            const label = doseEl.querySelector('h5')
            label.textContent = `Dose ${meta.num}`
            label.insertAdjacentHTML(
                'beforeend',
                `\n<small class="text-muted">${meta.dateAdministered}</small>`
            )
            writeElement(doseEl.querySelector('.manufacturer'), meta.manufacturer)
            writeElement(
                doseEl.querySelector('h6'),
                meta.lotNumber === '' ? '' : `Lot #${meta.lotNumber}`
            )
            writeElement(doseEl.querySelector('p'), meta.note)
            writeElement(
                doseEl.querySelector('.administration'),
                meta.administrator === '' ? '' : `Administered by ${meta.administrator}`
            )
            doseEl.addEventListener('click', function (event) {
                doseEl.replaceWith(newDoseForm(meta))
            })
            return doseEl
        }

        const immunizationList = document.getElementById('immunizations')
        const immunizationTemplate = document.getElementById('immunization-template')
        const immunizationModal = document.getElementById('immunization-modal')
        const immunizationForm = document.getElementById('immunization-form')
        const immunizationNameField = document.getElementById('immunization-name')

        function immunizationElFromMeta(meta) {
            const immunizationEl = immunizationTemplate.content.firstElementChild.cloneNode(true)
            immunizationEl.meta = meta
            const label = immunizationEl.querySelector('h5')
            label.textContent = meta.name
            label.insertAdjacentHTML(
                'beforeend',
                `\n<span class="badge badge-secondary">${meta.doses.length}</span>
                \n<small>(click to expand)</small>`
            )
            const collapse = immunizationEl.querySelector('.collapse')
            const inline = immunizationEl.querySelector('.d-inline-flex')
            meta.doses.forEach((doseMeta) => {
                const doseEl = doseElFromMeta(doseMeta)
                collapse.appendChild(doseEl)
                doseEl.outerHTML = `<div class="my-2 shadow-sm p-3 bg-light align-items-start">${doseEl.innerHTML}</div>`
            })
            const collapseID = `dose-collapse-${immunizationList.childElementCount}`
            collapse.id = collapseID
            inline.setAttribute('href', `#${collapseID}`)
            inline.setAttribute('aria-controls', collapseID)
            immunizationEl.addEventListener('click', function (event) {
                if (event.target !== inline && !inline.contains(event.target)) {
                    immunizationNameField.value = meta.name
                    meta.doses.forEach((doseMeta) => {
                        doseList.appendChild(doseElFromMeta(doseMeta))
                    })
                    $('#immunization-modal').modal('show')
                    immunizationModal.reference = immunizationEl
                }
            })
            return immunizationEl
        }
        res.immunizations.forEach(function (meta) {
            meta.doses.forEach(function (doseMeta, index) {
                meta.doses[index].num = index + 1
            })
            const immunizationEl = immunizationElFromMeta(meta)
            immunizationList.appendChild(immunizationEl)
        })
        document.getElementById('save-immunization').addEventListener('click', function (event) {
            if (!immunizationForm.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
                immunizationNameField.parentElement.classList.add('was-validated')
            } else {
                const meta = {
                    name: immunizationNameField.value,
                    doses: [...doseList.children]
                        .filter((child) => child.tagName === 'A')
                        .map((dose) => dose.meta),
                }
                const immunizationEl = immunizationElFromMeta(meta)
                immunizationList.appendChild(immunizationEl)
                if (immunizationModal.reference) {
                    immunizationModal.reference.parentElement.removeChild(
                        immunizationModal.reference
                    )
                }
                $('#immunization-modal').modal('hide')
            }
        })

        $('#immunization-modal').on('show.bs.modal', function (e) {
            registerAddDoseButton()
        })

        $('#immunization-modal').on('hidden.bs.modal', function (e) {
            immunizationNameField.value = ''
            doseList.innerHTML = ''
            delete immunizationModal.reference
        })

        function writeElement(element, text) {
            if (text === '') {
                element.parentElement.removeChild(element)
            } else {
                element.textContent = text
            }
        }
        const form = document.getElementById('new-form')
        const deleteSpinner = document.getElementById('delete-spinner')
        const deleteButton = document.getElementById('delete')
        const saveSpinner = document.getElementById('save-spinner')
        const saveButton = document.getElementById('submit')
        const errorAlert = document.querySelector('.alert-danger')
        const errorAlertLabel = document.querySelector('#danger-alert-label')
        const successAlert = document.querySelector('.alert-success')

        deleteButton.addEventListener('click', function (event) {
            deleteSpinner.hidden = false
            deleteButton.disabled = true
            saveButton.disabled = true
            errorAlert.hidden = true
            successAlert.hidden = true

            const patientID = idField.value
            const options = {
                method: 'DELETE',
            }
            console.log('Deleting record on blockchain...')
            fetch(`http://localhost:3001/records/${patientID}`, options)
                .then((res) => {
                    const json = res.json()
                    if (!res.ok) {
                        throw new Error(json.message)
                    }
                    return json
                })
                .then((res) => {
                    console.log(res)
                    deleteSpinner.hidden = true
                    deleteButton.disabled = false
                    saveButton.disabled = false
                    const url = new URL(window.location.href)
                    const params = url.searchParams
                    params.set('deleted', params.get('id'))
                    params.delete('id')
                    url.params = ''
                    window.location.href = url
                })
                .catch((error) => {
                    console.log(error)
                    deleteSpinner.hidden = true
                    deleteButton.disabled = false
                    saveButton.disabled = false
                    errorAlert.hidden = false
                    errorAlertLabel.textContent = 'Failed to delete record.'
                    $('.alert-danger').alert()
                })
        })
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
                form.classList.add('was-validated')
            } else {
                event.preventDefault()
                event.stopPropagation()
                const patientID = idField.value
                const lastName = lastNameField.value
                const firstName = firstNameField.value
                const submission = {
                    ID: patientID,
                    lastName: lastName,
                    firstName: firstName,
                    medications: Array.from(medicationList.children).map(
                        (medicationEl) => medicationEl.meta
                    ),
                    immunizations: Array.from(immunizationList.children).map(
                        (immunizationEl) => immunizationEl.meta
                    ),
                }
                console.log(JSON.stringify(submission, null, 4))

                saveSpinner.hidden = false
                deleteButton.disabled = true
                saveButton.disabled = true
                errorAlert.hidden = true
                successAlert.hidden = true
                const options = {
                    method: 'POST',
                    body: JSON.stringify({
                        orgNum: 1,
                        record: submission,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
                console.log('Updating record on blockchain...')
                fetch('http://localhost:3001/updateRecord', options)
                    .then((res) => {
                        const json = res.json()
                        if (!res.ok) {
                            throw new Error(json.message)
                        }
                        return json
                    })
                    .then((res) => {
                        console.log(res)
                        saveSpinner.hidden = true
                        deleteButton.disabled = false
                        saveButton.disabled = false
                        successAlert.hidden = false
                        $('.alert-success').alert()
                    })
                    .catch((error) => {
                        console.log(error)
                        saveSpinner.hidden = true
                        deleteButton.disabled = false
                        saveButton.disabled = false
                        errorAlert.hidden = false
                        errorAlertLabel.textContent = 'Failed to save record.'
                        $('.alert-danger').alert()
                    })
            }
        })
    })
    .catch((error) => {
        document.getElementById('error').hidden = false
        console.log(error)
    })
