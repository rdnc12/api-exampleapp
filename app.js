const express = require('express');
const bodyparser = require('body-parser');
const request = require('request');

const app = express();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendfile(__dirname + '/signup.html');
});

app.post('/', (req, res) => {

    let firstName = req.body.fName;
    let lastName = req.body.lName;
    let email = req.body.email;
    let data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    let jsonData = JSON.stringify(data);

    let options = {
        url: 'https://us4.api.mailchimp.com/3.0/lists/list-id',
        method: 'POST',
        headers: {
            "Authorization": 'rdnc api-key'
        },
        body: jsonData
    };

    request(options, (error, response, body) => {

        if (error){
            res.sendfile(__dirname + '/failure.html');}
        else {
            if (response.statusCode === 200)
                res.sendfile(__dirname + '/succes.html');
            else
                res.send('Problem!!!')
        }
    });


});

app.post('/failure',(req,res)=>{
    res.redirect('/');
});

app.listen(3000, () => {
    console.log('Server is running...')
});
