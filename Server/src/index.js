import 'dotenv/config';
import express, { json, urlencoded } from 'express';
import cors from 'cors';
import routes from './routes/routes.js';
import hasher from "./hash/hasher.js";

const app = express();
const PORT = process.env.PORT;


// MiddleWares
app.use( cors({
    'origin': "*"
}));
app.use( json() );
app.use( urlencoded( {extended: true} ));
app.use( (req, _, next) => {
    console.log("New request received ", req.url);
    next();
})


// Routes
app.use('/course', routes.course);
app.use('/tt', routes.tt);
app.use('/rep', routes.rep);
app.use('/student', routes.student);
app.use('/records', routes.record );
app.use('/dept', routes.dept);
app.use('/hash', hasher);


app.get('/', function(req, res) {
    res.send("Home Suceesfgss");
})





app.listen(PORT, () => {
    console.log(`Server Started Listening on Port ${PORT}`);
})
