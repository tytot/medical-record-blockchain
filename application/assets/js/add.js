'use strict'

import '../../node_modules/bootstrap/js/dist/util.js'
import '../../node_modules/bootstrap/js/dist/collapse.js'
import '../../node_modules/bootstrap/js/dist/modal.js'

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

document.getElementById('save-medication').addEventListener('click', function (event) {
    if (!medicationForm.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
        medicationNameField.parentElement.classList.add('was-validated')
    } else {
        const medicationEl = medicationTemplate.content.firstElementChild.cloneNode(true)
        const meta = {
            name: medicationNameField.value,
            dose: medicationDoseField.value,
            dosage: medicationDosageField.value,
            startDate: medicationStartDateField.value,
            endDate: medicationEndDateField.value,
            reason: medicationReasonField.value,
            prescriber: medicationPrescriberField.value,
            manufacturer: medicationManufacturerField.value,
        }
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
                (meta.dose !== '' && meta.dosage !== '' ? ', ' : '') +
                meta.dosage
        )
        writeElement(medicationEl.querySelector('.manufacturer'), meta.manufacturer)
        writeElement(medicationEl.querySelector('em'), meta.reason)
        writeElement(
            medicationEl.querySelector('.prescription'),
            meta.prescriber === '' ? '' : `Prescribed by ${meta.prescriber}`
        )
        medicationEl.addEventListener('click', function (event) {
            medicationNameField.value = meta.name
            medicationDoseField.value = meta.dose
            medicationDosageField.value = meta.dosage
            medicationStartDateField.value = meta.startDate
            medicationEndDateField.value = meta.endDate
            medicationReasonField.value = meta.reason
            medicationPrescriberField.value = meta.prescriber
            medicationManufacturerField.value = meta.manufacturer
            $('#medication-modal').modal('show')
            medicationModal.reference = medicationEl
        })
        if (meta.endDate !== '') {
            medicationEl.classList.add('list-group-item-light')
        }
        medicationList.insertAdjacentElement('beforeend', medicationEl)
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
    doseList.insertAdjacentElement('beforeend', addDoseButton)
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
    const init = !meta.hasOwnProperty('date')
    if (!init) {
        dateField.value = meta.date
    }
    if (meta.hasOwnProperty('lotNum')) {
        lotNumberField.value = meta.lotNum
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
                date: dateField.value,
                lotNum: lotNumberField.value,
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
    label.insertAdjacentHTML('beforeend', `\n<small class="text-muted">${meta.date}</small>`)
    writeElement(doseEl.querySelector('.manufacturer'), meta.manufacturer)
    writeElement(doseEl.querySelector('h6'), meta.lotNum === '' ? '' : `Lot #${meta.lotNum}`)
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

document.getElementById('save-immunization').addEventListener('click', function (event) {
    if (!immunizationForm.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
        immunizationNameField.parentElement.classList.add('was-validated')
    } else {
        const immunizationEl = immunizationTemplate.content.firstElementChild.cloneNode(true)
        const meta = {
            name: immunizationNameField.value,
            doses: [...doseList.children]
                .filter((child) => child.tagName === 'A')
                .map((dose) => dose.meta),
        }
        immunizationEl.meta = meta
        const label = immunizationEl.querySelector('h5')
        label.textContent = meta.name
        label.insertAdjacentHTML(
            'beforeend',
            `\n<span class="badge badge-secondary">${meta.doses.length}</span>`
        )
        immunizationEl.addEventListener('click', function (event) {
            immunizationNameField.value = meta.name
            meta.doses.forEach((doseMeta) => {
                doseList.appendChild(doseElFromMeta(doseMeta))
            })
            $('#immunization-modal').modal('show')
            immunizationModal.reference = immunizationEl
        })
        immunizationList.insertAdjacentElement('beforeend', immunizationEl)
        if (immunizationModal.reference) {
            immunizationModal.reference.parentElement.removeChild(immunizationModal.reference)
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
