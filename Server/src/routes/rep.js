import { Router } from "express";
import { dbCon } from "../models/model.js";
import multer from "multer";
import bcrypt from "bcrypt";

const router = Router();
const uploads = multer();

router.get( "/data/:id?", function(req, res) {
    const { id } = req.params;

    const sqlQuery = `SELECT * FROM representatives ` + ( id ? `WHERE Id = '${id}';` : ";");
    dbCon.query( sqlQuery, function( err, result ) {
        if( err ) {
            console.log( err );
            res.status(500).send("Error Readinng data");
        }
        res.json( result );
    }) ;
});

router.post("/data/update", uploads.none(), async function( req, res ) {
    const id = req.body.id;
    const data  = JSON.parse( req.body.data );

    const sqlQuery = `UPDATE representatives SET RollNo = ?, Name = ?, MailID = ?, Password = ? WHERE Id = '${id}'`;

    console.log(data)

    try {
        let salt = await bcrypt.genSalt(8);
        let hash = await bcrypt.hash( data["password"], salt);
        await dbCon.promise().execute(sqlQuery, [data["rollNo"], data["name"], data["mailId"], hash]);
        res.json( {
            "message": "Data Uploaded Succesfully",
            "status": true,
            data
        })
    } catch ( err ) {
        console.log( err );
    }


});

export default router;