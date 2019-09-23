var files = [
  {id: "start", file: "rive/start.rive"},
  {id: "bc", file: "rive/briathraneamhrialtaChaite.rive"},
  {id: "bl", file: "rive/briathraneamhrialtaLaithreach.rive"},
  {id: "BriathraNeamhrialta", file: "rive/BriathraNeamhrialta.rive"},
  {id: "BriathraNeamhrialtaInfo", file: "rive/BriathraNeamhrialtaInfo.rive"},
  {id: "BQuiz", file: "rive/BQuiz.rive"},
  {id: "deanAC", file: "rive/deanAC.rive"},
  {id: "deanAL", file: "rive/deanAL.rive"},
  {id: "deanAF", file: "rive/deanAF.rive"},
  {id: "deanMC", file: "rive/deanMC.rive"},
  {id: "beirAC", file: "rive/beirAC.rive"},
  {id: "beirAL", file: "rive/beirAL.rive"},
  {id: "beirAF", file: "rive/beirAF.rive"},
  {id: "beirMC", file: "rive/beirMC.rive"},
  {id: "faighAC", file: "rive/faighAC.rive"},
  {id: "faighAL", file: "rive/faighAL.rive"},
  {id: "faighAF", file: "rive/faighAF.rive"},
  {id: "faighMC", file: "rive/faighMC.rive"},
  {id: "feicAC", file: "rive/feicAC.rive"},
  {id: "feicAL", file: "rive/feicAL.rive"},
  {id: "feicAF", file: "rive/feicAF.rive"},
  {id: "feicMC", file: "rive/feicMC.rive"},
  {id: "abairAC", file: "rive/abairAC.rive"},
  {id: "abairAL", file: "rive/abairAL.rive"},
  {id: "abairAF", file: "rive/abairAF.rive"},
  {id: "abairMC", file: "/rive/abairMC.rive"},
  {id: "tabhairAC", file: "rive/tabhairAC.rive"},
  {id: "tabhairAL", file: "rive/tabhairAL.rive"},
  {id: "tabhairAF", file: "rive/tabhairAF.rive"},
  {id: "tabhairMC", file: "rive/tabhairMC.rive"},
  {id: "tarAC", file: "rive/tarAC.rive"},
  {id: "tarAL", file: "rive/tarAL.rive"},
  {id: "tarAF", file: "rive/tarAF.rive"},
  {id: "tarMC", file: "rive/tarMC.rive"},
  {id: "biAC", file: "rive/biAC.rive"},
  {id: "biAL", file: "rive/biAL.rive"},
  {id: "biAF", file: "rive/biAF.rive"},
  {id: "biMC", file: "rive/biMC.rive"},
  {id: "teighAC", file: "rive/teighAC.rive"},
  {id: "teighAL", file: "rive/teighAL.rive"},
  {id: "teighAF", file: "rive/teighAF.rive"},
  {id: "teighMC", file: "rive/teighMC.rive"},
  {id: "ithAC", file: "rive/ithAC.rive"},
  {id: "ithAL", file: "rive/ithAL.rive"},
  {id: "ithAF", file: "rive/ithAF.rive"},
  {id: "ithMC", file: "rive/ithMC.rive"},
  {id: "cloisAC", file: "rive/cloisAC.rive"},
  {id: "cloisAL", file: "rive/cloisAL.rive"},
  {id: "cloisAF", file: "rive/cloisAF.rive"},
  {id: "cloisMC", file: "rive/cloisMC.rive"},
  {id: "IrrQuiz", file: "rive/BriathraNQuiz.rive"},
];

var userName;
var name;
var botName = "Taidhgín";
var progress = 0;
var currentQuestion;
var prevQuestion = -1;
var wrongCount = 0;
var answer2;
var answeringQuestions = false;
var isLevelComplete = false;
var isQuizComplete = false;
var quiz = false;
var quizScore = 0;
var quizProgress = 0;
var isAQuestion = false;

function next(){
  if(thisDialect != "" && thisGender != "" || thisDialect != "" || thisGender != ""){
    chatSetup("askname");
    play = true;
  }
  else{
    appendTypingIndicator();
    setTimeout(function(){
      appendMessage(true, false, "Please choose a dialect!", false);
      $(".chatlogs").animate({ scrollTop: $(".chatlogs")[0].scrollHeight }, 200);
    }, 1200);
  }
}

function searchNames(name){
  var slenderName;
  for(i = 0; i < ainmneacha.length; i++){
    if(name == ainmneacha[i].ainm){
      slenderName = ainmneacha[i].slender;
      localStorage.setItem("name", slenderName);
    }
  }
  return slenderName;
}

function storeName(name){
  play = true;
  userName = name;
  var slName = searchNames(name);
  if(slName) localStorage.setItem("name", slName);
  else localStorage.setItem("name", name);
  return "";
}

function getName(){
  name = localStorage.getItem("name");
  if(name) return name;
  else return userName;
}

function getCurrentTopic(){
  return currentTopic;
}

function getUserName(){
  return userName;
}
function getBotName(){
  if(botName) return botName;
}

function clearName(){
  localStorage.removeItem("name");
  userName = "";
}

function isNameStored(){
  if(localStorage.getItem("name")) return true;
  else return false;
}

function askName(){
  var greeting = "Dia Dhuit, Is mise " + getBotName() + ". ";
  var askNames = ["Cén t-ainm atá ort?", "Cad is ainm duit?", "Cé thú féin?", "Cad a thabharfaidh mé ort?"];
  var ran = getRandomIntInclusive(0, askNames.length - 1);
  return greeting + askNames[ran];
}

function getProgress(){
  if(isLevelComplete == true && quiz == false) return "";
  else if(isQuizComplete == true) return "";
  else return "Scór: " + progress + "<br>";
}

function resetProgress(){
  progress = 0;
  return "";
}

function triailAris(){
  console.log(wrongCount);
  var rep = [", féach ar an gceann seo arís, a ", ", beagnach ceart ach féach arís air, a "];
  var ran = getRandomIntInclusive(0, rep.length - 1);
  var thisHint;
  if(wrongCount == 2){
    thisHint = "<b>Hint:</b> " + currentQuestion.hint1;
  }
  else if(wrongCount == 4){
    var link =   "https://www.teanglann.ie/ga/gram/" + thisVerb;
    thisHint = "<b>Hint:</b> <a href=\"javascript:void(0)\" onclick=\"openHintWindowPopup()\"><button class='rive-button'>www.teanglann.ie</button></a>"
  }
  else if(wrongCount == 6){
    thisHint = "<i><b>Freagra:</b></i> " + currentQuestion.answer + ". ";
    wrongCount = 0;
    setTimeout(function(){
      chatSetup("continue", "true");
    }, 2500);
    wrongCount = 0;
    return "<br><br>" + thisHint;
  }
  return rep[ran] + getName() + ". <br><br>" + thisHint;
}

function openHintWindowPopup(){
  var url  = "https://www.teanglann.ie/ga/gram/" + thisVerb;
  window.open(url,'popUpWindow','height=500,width=700,left=50,top=50,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
}

function missingContentMessage(){
  var missingCont = ["Ó, níl na ceisteanna réidh don chuid seo go fóillín. Bogfaimid ar aghaigh go dtí an chéad chuid eile.", "A " + getName() + " níl an chuid seo ullmhaithe i gceart duit go fóill. Bogfaimid " +
  "ar aghaidh.", "A " + getName() + " bogfaimid ar aghaidh is cosúil nach bhfuil an chuid seo réidh.", "A " + getName() + "bogfaimid ar aghaidh níor smaoinigh mé ar cheisteanna duit anseo go fóill."];
  var ran = getRandomIntInclusive(0, missingCont.length - 1);
  return missingCont[ran];
}

function nilToCeim(){
  var nils = ["Tóg briseadh beag mar sin", "Fág é go dtí an chéad lá eile", "Ar aghaidh go briathar eile", "Ar ais go dtí an leathanach baile mar sin",
  "Go breá. Is féidir leat topaic eile a phiocadh nó teacht ar ais uair éigin eile. (exit back to main menu?)"];
  var ran = getRandomIntInclusive(0, nils.length - 1);
  return nils[ran];
}

function nilToQuiz(){
  var nilToQuiz = ["Tá sé sin go breá. Pioc topaic éigin eile", "Sin a bhfuil mar sin. Slán go fóill agus bain triail as gné eile den ghramadach uair éigin eile. Slán!"];
  var ran = getRandomIntInclusive(0, nilToQuiz.length - 1);
  return nilToQuiz[ran];
}

function nilToCleachtadh(){
  return "";
}

function getCrioch(){
  var crioch = ["Maith thú, a " + getName() + ", sin deireadh leis an gcleachtadh anois!", "Fágfaidh mé slán anseo agat! Bhí sé go deas bheith ag caint leat, a " +
  getName(), "Slán go fóill, a " + getName() + ". Beimid ag caint arís tá súil agam.", "Bhí sé go deas bheith ag caint leat. Más maith leat cleachtadh eile a dhéanamh téigh go dtí an leathanach baile."];
  var ran = getRandomIntInclusive(0, crioch.length - 1);
  return crioch[ran];
}

function getRandomQuestion(questions){
    answer2 = "";
  wrongCount = 0;
  if(isLevelComplete == true && quiz == false){
    return "";
  }
  if(isQuizComplete == true) return "";
  if(quiz) quizProgress++;
  var index = getRandomIntInclusive(0, questions.length - 1);
  console.log("index: " +  index);
  if(index == prevQuestion) index = getRandomIntInclusive(0, questions.length - 1);
  prevQuestion = index;
  currentQuestion = questions[index];
  if("answer2" in currentQuestion){
    answer2 = currentQuestion.answer2;
  }
  console.log(currentQuestion.question + ", " + currentQuestion.answer + " " + answer2);
  var ceist = "Ceist: " + currentQuestion.question;
  isAQuestion = true;
  return ceist;
}

function getCurrentAnswer(){
  return currentQuestion.answer;
}

function getRandomReply(){
  if(isLevelComplete == true && quiz == false) return "";
  if(isQuizComplete == true) return "";
  var reply = "Maith thú, a " + getName() + ". ";
  var reply2 = "An ceart ar fad agat, a " + getName() + ". ";
  var reply3 = "Sin agat é, a " + getName() + ". ";
  var reply4 = "An mhaith ar fad! "
  var replies = [reply, reply2, reply3, reply4];
  var i = getRandomIntInclusive(0, replies.length-1);
  return replies[i];
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function changeProgress(sign){
  if(sign == "+"){
    progress++;
    if(progress == 3){
      isLevelComplete = true;
      console.log("level complete")
    }
    if(quiz) quizScore++;
  }
  if(quiz) {
    if(quizProgress == abairQuiz.length - 1){
      isQuizComplete = true;
      chatSetup("quizcomplete");
    }
    console.log("quiz: " + quizScore);
  }
  return "";
}
