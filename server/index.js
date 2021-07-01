const express = require('express');

const app = express();
const port = 8080;

// routes will go here
const https = require('https');

let dataRes = ''
let sc = ''


function call() {https.get(`https://impraise-shorty.herokuapp.com/`+sc+`/stats`, (res) => {
  let data = [];
  const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
  console.log('Status Code:', res.statusCode);
  console.log('Date in Response header:', res.headers);

  console.log('Date in Response header:', res.body);

  res.on('data', chunk => {
    data.push(chunk);
    
  });
  var body = '';
  res.on('data', function(chunk) {
  
    body += chunk;
    
    
  });
  
  res.on('end', function() {
    console.log(body);
    dataRes = body
    console.log('datares'+dataRes)
  });
  res.on('end', () => {
    console.log('Response ended: ');
    const users = JSON.parse(Buffer.concat(data).toString());

   
  });
  
}).on('error', err => {
  console.log('Error: ', err.message);
});
}

let ap =''
const show = async () => {
  await call();
}
app.get('/:shortcode', async function(req, res,body) {
  sc = req.params.shortcode
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "POST, GET");
    res.header("Access-Control-Max-Age", "3600");
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

  let responData = {}
  await axios
  .get(`https://impraise-shorty.herokuapp.com/`+sc+`/stats`)
  .then(resp => {
    console.log(resp.data)
    responData = resp.data
  })
  .catch(error => {
    console.error(error)
  })
  console.log('resp Data'+responData)
  res.send(responData)
});
var bodyParser = require('body-parser');
const cors = require('cors')

app.use(cors())
app.use(express.urlencoded({extended: true})); 
app.use(express.json());  
const axios = require('axios')
app.post('/short', function(req, resp,body) {
  resp.header("Access-Control-Allow-Origin", "*");
  resp.header("Access-Control-Allow-Headers", "X-Requested-With");
    resp.header("Access-Control-Allow-Methods", "POST, GET");
    resp.header("Access-Control-Max-Age", "3600");
    resp.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 let responData = ''
  let tmp = {
    "url": req.body.url,
    "shortcode": req.body.shortcode
  }
axios
  .post('https://impraise-shorty.herokuapp.com/shorten',tmp)
  .then(res => {
    console.log(`statusCode: ${res.statusCode}`)
    console.log(res.data)
    console.log('shortCode' + req.body.shortcode)
    responData = res.data
    resp.send(res.data)
  })
  .catch(error => {
    console.error(error)
  })
  
  console.log('Got body:', req.body);
});


app.listen(port);
console.log('Server started at http://localhost:' + port);