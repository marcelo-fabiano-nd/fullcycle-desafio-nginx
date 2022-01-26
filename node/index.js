const express = require('express')
const app = express()
const port = 5000
const config = {
    host: 'fullcycle-mysql',
    user: 'nodeuser',
    password: 'nodepwd',
    database: 'nodedb'
};
const mysql = require('mysql')
const connection = mysql.createConnection(config)

const sql = "INSERT INTO people (name) values ('Wesley')";
connection.query(sql);

app.get('/', (req, res) => {
    console.log('Request people received');
    
    var html = "<h1>Full Cycle Rocks!</h1><br/>";

    html += "<table style='width: 100px;' border='1' cellpadding='0' cellspacing='0'><tr><th width='20'>Id</th><th width='80'>Name</th></tr>";

    connection.query("SELECT * FROM nodedb.people", function (err, result) {
        if (err) console.log(err);

        result.forEach(function(row, index) {
            html += "<tr><td>" + row.id + "</td><td>" + row.name + "</td></tr>";
        })

        console.log("finish");
        html += "</table>";

        res.send(html);
    });
    
})

app.listen(port, ()=> {
    console.log('Rodando na porta ' + port);
})