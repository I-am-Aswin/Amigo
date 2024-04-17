import { Router } from "express";
import { dbCon } from "../models/model.js";

const router = Router();

router.get("/depts", function( req, res ) {
    const sqlQuery = `SELECT * from department;`;
    dbCon.query( sqlQuery, function(err, data ) {
        if( err ) {
            console.log(err)
            res.json({ message: "Error Reading Data "});
        }
        res.json(data)
    })
    
    
})

export default router;