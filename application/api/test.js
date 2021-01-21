const axios = require('axios')

axios
    .delete('http://localhost:3001/12-34-56')
    .then((res) => {
        console.log(res)
    })
    .catch((error) => {
        console.error(error)
    })