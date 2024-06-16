import { Router } from "express";
import { dbCon } from "../models/model.js";
import multer from "multer";
import csvParser from "csv-parser";
import { Readable } from "stream";
import hasher from "../hash/hasher.js";

const router = Router();
const storage = multer.memoryStorage();
const uploads = multer({ storage: storage });

router.get("/list/:batch/:dept", function (req, res) {

    dbCon.query(
        `SELECT * FROM students WHERE Department = '${req.params.dept}' and Batch = ${req.params.batch}`,
        function (err, result) {
            if (err) {
                console.log(err);
                res.end();
            }
            res.json(result);
        }
    );
});


/*  student_datasheet - file
    department - string
    password - password
    key_heads - Array( CSV headers ) [ RollNo, Name, MailId ] */
router.post(
    "/list/update",
    uploads.single("student_datasheet"),
    async function (req, res) {

        try {
            if (!req.file) {
                res.send("Error Uploading File...!");
            }

            const parseData = () => {
                return new Promise((resolve, reject) => {
                    let data = []
                    let headers = [];
                    const bfStream = new Readable();

                    bfStream.push(req.file.buffer);
                    bfStream.push(null);

                    bfStream
                        .pipe(csvParser())
                        .on("headers", (head) => headers = head)
                        .on("data", (dataRow) => data.push(dataRow))
                        .on("end", () => {
                            console.log("Input File Data Parsed Successfully");
                            resolve({ 'headers': headers, 'data': data });
                        })
                        .on('error', () => reject(error));
                })
            };


            const results = await parseData();
            console.log(results['headers']);

            let insQuery = "INSERT INTO students (RollNo, Name, Department, Batch, MailId, Password) VALUES (?, ?, ?, ?, ?, ?);";

            const heads = JSON.parse(req.body.key_heads);
            let pass =  await hasher.genPass(req.body.password);
            const values = results['data'].map((arr) => [arr[heads[0]], arr[heads[1]], req.body.department, Number(req.body.batch) , arr[heads[2]], pass]);

            for (let element of values) {
                await dbCon.promise().execute(insQuery, element);
            }

            // await dbCon.promise().execute(insQuery, [values])
            res.json({ ok:true, message:"Data Uploaded Successfully"});
        }
        catch (error) {
            if (error) {
                console.log(error);
                res.json({ok:false, message:"Error Inserting Data"})
            };
        }
    });

export default router;
