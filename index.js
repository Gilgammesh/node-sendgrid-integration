// Require dependencies
const express = require('express');
const multer = require('multer');

// Initialize express
const app = express();
const upload = multer();

// Route Get Hello
app.get('/api/hello', (req, res) => {
    return res.send('Hello from API');
});

// Route Post parse email sent from sendgrid
app.post('/api/parseEmail', upload.any(), async (req, res) => {
    
    const body = req.body;

    console.log(body);

    if (req.files.length > 0) {
	console.log(req.files);
    } else {
        console.log('No files');
    }

    return res.json('Email parsed');

});

// Initialize server
app.listen(3001, () => {
    console.log('Server running => to work!!');
});
