'use strict'

import '../../node_modules/bootstrap/js/dist/util.js'
import '../../node_modules/bootstrap/js/dist/collapse.js'
import '../../node_modules/bootstrap/js/dist/alert.js'

const url = new URL(window.location.href)
const params = url.searchParams
if (params.has('deleted')) {
    const id = params.get('deleted')
    document.querySelector('.alert').hidden = false
    $('.alert').alert()
    document.getElementById('alert-label').textContent = `Record ${id} successfully deleted.`
}
