'use strict'

export default async function searchRecords(lastName, firstName, id) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([
                {
                    lastName: 'Lin',
                    firstName: 'Tyler',
                    id: '12-34-56',
                    numMedications: 2,
                    numImmunizations: 14
                },
            ])
        }, 1000)
    })
}
