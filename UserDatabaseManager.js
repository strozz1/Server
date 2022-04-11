const mysql = require('mysql')


var con = mysql.createConnection({
    host: "localhost",
    database: 'test',
    user: "root"
})

 function de(user, callback) {

    const query = `SELECT * FROM users WHERE username = '${user}'`;
    con.connect(function (err) {
        if (err) throw err;
        con.query(query, function (err, result, fields) {
            if (err) throw err;
             callback(result)
        });
    });

}
 de("Juan", async(res) => {
    return res
})