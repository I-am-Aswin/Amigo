import { Router } from "express";
import { dbCon } from "../models/model.js";
import multer from "multer";

const router = Router();
const uploads = multer();

router.get('/list/:dept/:day?', function ( req, res ) {
    let { dept, day } = req.params;
    let sqlQuery = `SELECT Period,CourseId FROM timetable WHERE Department = '${dept}' ${ (day) ? 'AND Day = ' + day : ''};`

    dbCon.query( sqlQuery, function( err, result ) {
        if( err ) {
            console.log(err);
            res.status(500).send("Error Reading Data");
        }
        res.json(result);
    });
});

/* Request Body
    dept: string,
    tt: Object( day: periods )
        periods: Array( { Period, Course} )
*/
router.post( '/create', uploads.none(), async function( req, res ) {
    const dept = req.body.dept;
    const tt = JSON.parse( req.body.tt );
    let sqlQuery = `INSERT INTO timetable ( Department, Day, Period, CourseId) VALUES (?, ?, ?, ?);`;

    try {
        for( let [key, value] of Object.entries(tt) ) {
            for( let periods of value ) {
                await dbCon.promise().execute( sqlQuery, [dept, Number(key), periods["Period"], periods["Course"]]);
                console.log("TimeTable Entry Added Successfully");
            }
        }
        res.json( {ok:true, message:"TimeTable has been created successfully"});
    } catch ( err ) {
        res.status(501).json( {ok:false, message:"Error uploading data"});
    }
});



export default router;