const express = require('express')
const path = require('path')
const app = express()
const PORT = 8080

app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.listen(
    PORT, 
    () => console.log('Application running at ${PORT}')
    );