const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const readData = () => {
    const data = fs.readFileSync('data.json');
    return JSON.parse(data);
};

const writeData = (data) => {
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
};

app.get('/api/data', (req, res) => {
    const data = readData();
    res.json(data);
});

app.post('/api/data', (req, res) => {
    const data = { message: 'Hello, World!' };
    res.json(data);
});

app.post('/api/submit', (req, res) => {
    const inputData = req.body;
    console.log('Received data:', inputData);
    res.json({ status: 'success', receivedData: inputData });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/api/format', (req, res) => {
    const accept = req.headers.accept;
    const data = readData();

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

app.post('/api/equipment', (req, res) => {
    const newEquipment = req.body;
    const data = readData();
    newEquipment.id = data.equipment.length ? data.equipment[data.equipment.length - 1].id + 1 : 1;
    data.equipment.push(newEquipment);
    writeData(data);
    res.json({ status: 'success', equipment: newEquipment });
});

app.put('/api/equipment/:id', (req, res) => {
    const equipmentId = parseInt(req.params.id, 10);
    const updatedEquipment = req.body;
    const data = readData();
    const index = data.equipment.findIndex(item => item.id === equipmentId);
    if (index !== -1) {
        data.equipment[index] = { ...data.equipment[index], ...updatedEquipment };
        writeData(data);
        res.json({ status: 'success', equipment: data.equipment[index] });
    } else {
        res.status(404).json({ status: 'error', message: 'Equipment not found' });
    }
});

app.delete('/api/equipment/:id', (req, res) => {
    const equipmentId = parseInt(req.params.id, 10);
    const data = readData();
    const newEquipmentList = data.equipment.filter(item => item.id !== equipmentId);
    if (newEquipmentList.length !== data.equipment.length) {
        data.equipment = newEquipmentList;
        writeData(data);
        res.json({ status: 'success', message: 'Equipment deleted' });
    } else {
        res.status(404).json({ status: 'error', message: 'Equipment not found' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
