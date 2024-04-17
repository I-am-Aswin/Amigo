import { createConnection } from 'mysql2';

const dbCon = createConnection({
    host: process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DBPORT
});

dbCon.connect(function (err) {
    if (err) {
        console.log(err);
        res.status(500).send("Error Connecting to the database");
    }
    console.log(`DataBase Connected Succesfully at ${process.env.USERNAME + "@" + process.env.HOST}`);
});

process.on('exit', () => {
    dbCon.end( function( err ) {
        if( err ) console.log("Error Closing DataBase Connection");

        console.log("DataBase Connection Closed Successfully"); 
    })
})
export { dbCon };