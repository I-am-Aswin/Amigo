import { Router } from "express";
import { dbCon } from "../models/model.js"
import multer from "multer";

const router = Router();
const uploads = multer();

router.get('/list/:dept/:sem/:ccode?', function (req, res) {

    let sqlQuery = `SELECT * FROM course WHERE Department = '${req.params.dept}' and Semester = ${req.params.sem} `;
    sqlQuery += ( req.params.ccode ) ? `and CourseCode = '${req.params.ccode}';` : ';';
    
    dbCon.query(
        sqlQuery
        ,
        function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).send("Errorr Retrieving data");
            }

            res.json(result);
        }
    );
});


/* Request Body
    sem: number
    dept: string
    courses: array( course ) {Id, CName, CAbb, Credits, Batch_Cycle} */
router.post('/create', uploads.none(), async function(req, res) {
    const courses = JSON.parse(req.body.courses);
    const sem = req.body.sem;
    const department = req.body.dept;

    try {
        const insQuery = `INSERT INTO course (CourseCode, CourseName, CourseAbb, Credits, Department, Semester, Batch)  VALUES (?, ?, ?, ?, ?, ?, ?)`;

        for( let course of courses ) {
            await dbCon.promise().execute(insQuery, [course["Id"], course["Course"], course["Abbr"], course["Credits"], department, sem, (course["Batch"]) ? true : false]);
        }

        res.json({ok: true, message: "Courses Added Successfully"});
    } catch ( err ) {
        console.log(err);
        res.status(500).json( {ok: false, message: "Error Uploading Data"});
    }
});



export default router;