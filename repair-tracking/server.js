const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// GET-сервис, который возвращает данные в формате JSON
app.get('/api/data', (req, res) => {
    const data = JSON.parse(fs.readFileSync('data.json'));
    res.json(data);
});

// POST-сервис, который возвращает данные в формате JSON
app.post('/api/data', (req, res) => {
    const data = { message: 'Hello, World!' };
    res.json(data);
});

// POST-сервис, который принимает данные
app.post('/api/submit', (req, res) => {
    const inputData = req.body;
    console.log('Received data:', inputData);
    res.json({ status: 'success', receivedData: inputData });
});

// GET-сервис, который возвращает веб-страницу с фронтендом
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Сервис для получения данных в формате XML/HTML/JSON
app.get('/api/format', (req, res) => {
    const accept = req.headers.accept;
    const data = JSON.parse(fs.readFileSync('data.json'));

    if (accept.includes('application/xml')) {
        let xmlData = '<?xml version="1.0" encoding="UTF-8"?><data>';
        for (const key in data) {
            xmlData += `<${key}>${data[key]}</${key}>`;
        }
        xmlData += '</data>';
        res.header('Content-Type', 'application/xml');
        res.send(xmlData);
    } else if (accept.includes('text/html')) {
        let htmlData = '<html><body><ul>';
        for (const key in data) {
            htmlData += `<li>${key}: ${data[key]}</li>`;
        }
        htmlData += '</ul></body></html>';
        res.header('Content-Type', 'text/html');
        res.send(htmlData);
    } else {
        res.json(data);
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
