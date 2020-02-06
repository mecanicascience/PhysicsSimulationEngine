/** LOCAL SERVER ONLY FOR DEVELOPMENT **/
const testFileName = './instance/index.html';

const express = require('express');
const path    = require('path');

const app = express();
app
    .use(express.static(path.join(__dirname, "instance")))

    .get('/', function (req, res) {
        res.redirect(testFileName);
    })

    .use((req, res, next) => res.status(404).send('Error 404. Not Found.'));


const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => console.log(`Server started.\nLocal server is running on port ${ PORT }.`));
