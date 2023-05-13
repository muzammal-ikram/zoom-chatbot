import express from 'express';
import routes from './routes/index';
import bodyParser from 'body-parser';
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(routes());

app.listen(port, () => {
  console.log(`Server running on port localhost:${port}`);
});
