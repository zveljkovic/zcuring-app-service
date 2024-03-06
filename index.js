const express = require('express')
const fs = require("fs");
const path = require("path");
const app = express();
const { Pool } = require('pg');


const ipFilePath = process.env.IP_FILE_PATH || path.join(__dirname, 'ip.txt').toString();
const authToken = process.env.AUTH_TOKEN;


const pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
})


app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.get('/ip', (req, res) => {
    res.json({ip: fs.readFileSync(ipFilePath).toString()});
});

app.post('/stats', async (req, res) => {
    if (req.header('authorization') !== authToken) {
        throw new Error('Auth token invalid')
    }

    await pool.query(`insert into stats (created_at, current_temperature, current_humidity, target_temperature, target_humidity, fridgeState, humidifierState, dehumidifierState)
                      values (NOW(), ${req.body.currentTemperature}, ${req.body.currentHumidity}, ${req.body.targetTemperature}, ${req.body.fridgeState}, ${req.body.humidifierState}, ${req.body.targetHumidity}, ${req.body.dehumidifierState})`);

    res.json({status: "ok"});
});

app.listen(3000, () => {
    console.log(`Example app listening on port 3000`)
})