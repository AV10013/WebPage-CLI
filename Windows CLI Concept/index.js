const express = require('express');
const cors = require("cors");
const {exec} = require("child_process");

const app = express();

const port = 3000;


app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.header("Access-Control-Allow-Header", "Content-Type");
    next();
})

app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.sendStatus(204); 
});

app.post("/execute", (req, res) => {
    const {command} = req.body;

    const commands = ["dir", "cd", "echo"];

    if (!commands.includes(command.split(" ")[0])) {
        return res.status(400).send({error: "not allowed"});
    }

    exec(command, {shell: "powershell.exe"}, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send({error: stderr});
        }

        res.send({output: stdout});
    });
});

app.listen(port, () => {
    console.log(`listening on port 3000 at http://localhost:${port}`)
})