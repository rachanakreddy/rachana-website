import express from 'express';
import logger from 'morgan';

const app = express();
const port = process.env.PORT || 3006;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use('/', express.static('client'));


app.listen(port, () => {
    console.log(`Hello we are on port: ${port}`);
});