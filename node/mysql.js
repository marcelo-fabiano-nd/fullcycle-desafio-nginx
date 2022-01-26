const mysql = require("mysql")

const connection = mysql.createConnection({
    host: 'fullcycle-mysql',
    user: 'nodeuser',
    password: 'nodepwd',
    database: 'nodedb'
})

module.exports = connection