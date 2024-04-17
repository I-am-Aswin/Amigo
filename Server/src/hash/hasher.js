import { Router } from "express";
import bcrypt from "bcrypt";

const router = Router();

router.post("/", async function(req, res) {
    const {password, storedHash} = req.body;

    try {
        let result = await bcrypt.compare( password, storedHash);
        console.log( result );
        res.json( result );
    } catch ( err ) {
        console.log(err);
    }
})

export default router;