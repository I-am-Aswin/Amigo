import { Router } from "express";
import { dbCon } from "../models/model.js"
import multer from "multer";

const router = Router();
const uploads = multer();

router.get('/data', function(req, res) {
    dbCon.connect( function( err ) {
        if (err) res.send(`Error Connecting File : ${err}`);
        
        dbCon.query( "SELECT * FROM representatives;",function(err, result) {
            res.json(result);
        })
    });
})

router.get( '/data/dates/:dept', function( req, res ) {
    const dept = req.params.dept;
    dbCon.query(`select Date, FLOOR(Count(CourseCode) / (select COUNT(RollNo) from students where Department = '${dept}') ) as Periods from attendance where DeptId = '${dept}' group by Date;`,
        function( err, result ) {
            if( err ) {
                console.log(err)
                res.status(500).json({"message":"Internal Server Error"});
            }
            res.status(200).json(result);
        })
});

router.get('/data/courses/:dept/:date', function( req, res ){
    let { dept , date } = req.params;

    dbCon.query(`select CourseCode from attendance where DeptId='${dept}' and date = '${date}' group by CourseCode;`, function( err, result ) {
        if( err ) {
            console.log(err);
            res.status(500).json( {"message": "Internal Server Error"});
        }
        res.status(200).json( result);
    })
});

router.get('/data/:date/:ccode', function(req, res){

    let cCode = req.params.ccode;
    let date = new Date( req.params.date );
    date = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

    dbCon.query(
        `SELECT RollNo, status FROM attendance WHERE Date = '${date}' and CourseCode = '${cCode}';`,
        function( error, result ) {
            if( error ) {
                console.log(error);
                res.status(500).json(["Empty"]);
            }
            res.status(200).json(result);
        }
    )
});


router.post('/data/add', uploads.none(),async function(req, res) {
    try {
        let status = JSON.parse(req.body.status);
        let courseCode = req.body.cCode;
        let date = new Date(req.body.date);
        let dept = req.body.dept;
        let period = req.body.period;

        let Id = `${date.getFullYear()}${date.getMonth()+1}${date.getDate()}_${period}_`; // ID Generation Algorithm 20220120_8_102

        let sqlQuery = `INSERT INTO attendance (AttendanceId, RollNo, CourseCode, Date, status, DeptId) VALUES (?, ?, ?, ?, ?, ?);`

        for( let person of status ){
            let tmpId = Id + person["RollNo"].slice(8,11);
            await dbCon.promise().execute( sqlQuery, [tmpId, person["RollNo"], courseCode, date.toISOString().split('T')[0], person["Status"], dept]);
        }
        res.json(true);
    } catch( err ) {
        console.error(err);
        res.json(false);
    }
});


export default router;