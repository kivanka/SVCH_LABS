const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Middleware для чтения JSON-файлов
const readJsonFile = (filePath) => {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

// GET-сервис для получения данных
app.get('/api/data', (req, res) => {
    const data = readJsonFile('./data/data.json');
    res.json(data);
});

// POST-сервис для получения данных
app.post('/api/data', (req, res) => {
    const data = readJsonFile('./data/data.json');
    res.json(data);
});

// POST-сервис для отправки данных
app.post('/api/save', (req, res) => {
    const newData = req.body;
    fs.writeFileSync('./data/data.json', JSON.stringify(newData, null, 2));
    res.json({ message: 'Data saved successfully' });
});

// GET-сервис для получения веб-страницы
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Сервис для получения данных в формате XML/HTML/JSON
app.get('/api/data/format', (req, res) => {
    const data = readJsonFile('./data/data.json');
    const accept = req.headers.accept;

    if (accept.includes('application/xml')) {
        res.set('Content-Type', 'application/xml');
        // Преобразование JSON в XML (простой пример)
        const xml = `<data>${Object.entries(data).map(([key, value]) => `<${key}>${value}</${key}>`).join('')}</data>`;
        res.send(xml);
    } else if (accept.includes('text/html')) {
        res.set('Content-Type', 'text/html');
        // Преобразование JSON в HTML (простой пример)
        const html = `<ul>${Object.entries(data).map(([key, value]) => `<li>${key}: ${value}</li>`).join('')}</ul>`;
        res.send(html);
    } else {
        res.json(data);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});