var request = new XMLHttpRequest();
var date = null;
var topic = "";
var messages = [];
var logToAdd = {date: null, topic: "", conversation: []};

//build conversation with array of message objects, then add to logs in db when a new topic is started
function makeMessageObj(sentByBot, text){
  logToAdd.topic = currentTopic;
  date = new Date();
  var newMessage = {date: date, sentByBot: sentByBot, text: text};
  messages.push(newMessage);
}

function sendLogToDb(){
  console.log(messages);
  logToAdd.date = new Date().toISOString();
  logToAdd.conversation = messages;
  if(logToAdd.conversation.length != 0) postLogToDb(logToAdd);
  messages = [];
  return "";
}

//add log to db
function postLogToDb(logObj, name){
  request.open('POST', 'http://localhost:4001/addLog/', true);
  request.setRequestHeader("Content-type", "application/json");
  request.send(JSON.stringify(logObj));
  request.onload = function(){
    console.log(this.response);
  }
}
