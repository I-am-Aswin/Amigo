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

const generator = async ( pass ) => {
    let salt = await bcrypt.genSalt(8);
    let hash = await bcrypt.hash( pass, salt );
    return hash;
}

export default { router , genPass: generator};