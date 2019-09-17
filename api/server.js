const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const https = require("https");
const path = require("path");
const querystring = require('querystring');
const request = require('request');
const { parse, stringify } = require('node-html-parser');

var app = express();
const port = process.env.PORT || 4001;
app.listen(port, () => console.log("listening at " + port));
app.use(cors());
app.use(bodyParser.json());

var currentFile;
var spellingWords;

app.post('/storeFile/:fileName', function(req, res){
  currentFile = req.params.fileName;
  console.log(currentFile);
});

app.get('/getFile/', function(req, res){
  if(currentFile) res.send(currentFile);
});

app.post('/storeWords/', function(req, res){
  console.log(req.body);
  spellingWords = req.body;
});

app.get("/getWords", function(req, res){
  if(spellingWords) res.send(spellingWords);
});

app.post('/getAudio/', function(req, res){
  let bubble = req.body;
  console.log(bubble);
  if(bubble.text){
    var form = {
      Input: bubble.text,
      Locale: "ga_" + bubble.dialect,
      Format: 'html',
      Speed: '1',
    };

    var formData = querystring.stringify(form);
    var contentLength = formData.lenght;

    request({
      headers: {
        'Host' : 'www.abair.tcd.ie',
        'Content-Length': contentLength,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      uri: 'https://www.abair.tcd.ie/webreader/synthesis',
      body: formData,
      method: 'POST'
    }, function(err, resp, body){
      if(err) res.send(err);
      if(body){
        let audioContainer = parse(body.toString()).querySelectorAll('.audio_paragraph');
        let paragraphs = [];
        let urls = [];
        for(let p of audioContainer) {
            let sentences = [];
            for(let s of p.childNodes) {
                if(s.tagName === 'span') {
                    sentences.push(s.toString());
                } else if(s.tagName === 'audio') {
                    urls.push(s.id);
                }
            }
            paragraphs.push(sentences);
        }
        console.log("Success!");
        res.json({ html : paragraphs, audio : urls });
      } else {
        console.log("Fail");
        res.json({status: '404', message: 'No response from synthesiser'});
      }
    });
  } else {
    res.json({status: '404', message: 'Text not found'});
  }
});
