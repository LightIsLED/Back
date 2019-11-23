var app = require("./app");

const PORT = process.env.PORT || 2000;

const handleListening = () => 
    console.log(`Listening on: http://localhost:${PORT}`);

app.listen(PORT,handleListening);