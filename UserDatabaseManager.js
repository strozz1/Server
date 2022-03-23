const mysql = require('mysql')


var sql = mysql.createConnection({
    host: "localhost",
    database: 'test',
    user: "root"
})

 async function de(user){


    try {
        const query = `SELECT * FROM users WHERE 'username' = '${user}'`;
        const rows = await sql.query(query);
        return rows[0];
    } catch (err) {
        console.log('ERROR => ' + err);
        return err;
    }
    
}

de('juan').then(val=> console.log(val))