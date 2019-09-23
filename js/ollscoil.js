window.onload = init;
var ainmneacha = [];
var keepMessages = false;
var bubbleId = 0;
var speakerId = 0;
var thisMessage = 0;
var holdMessages = false;
var bubblePlayed = false;
var played = false;
var messageDivs = [];
var dictPopup;
var dictTri;
var dictText;
var dictImg;
var thisVerb;
var dictOn = false;
var play = false;
var pause = false;
var thisFile = "";
var bot;
var record;
var dialect;
var autoplay;
var audioDiv;
var contents;
var checkMonkey;
var monkey;

//for database....
var currentTopic = "";
var complete = false;
var messageforDb = "";
var switchTopic = false;
var level1Complete = false;
var level2Complete = false;
var level3Complete = false;
var date = new Date();

//Read Google Sheet with slenderised names...
function init(){
  var names = "https://docs.google.com/spreadsheets/d/1vvA9n123EJ0hmuQcnwE88JpsOVgxvUgDonPSaoULP3k/edit?usp=sharing";
  Tabletop.init({key: names, callback: loadData, simpleSheet: true } );
}

function loadData(data, tabletop){
  for(i = 0; i < data.length; i++){
    ainmneacha[i] = data[i];
  }
  setup();
}

function setup(){
  clearName();
  //load("start", "start"); //for testing only
  audioPlayer = document.getElementById("audio");
  audioCheckbox = document.querySelector("#autoplay");
  dictPopup = document.querySelector(".dictPopup");
  dictText = document.querySelector(".dictText");
  dialect = document.querySelector(".dialectSelection");
  bot = document.querySelector(".bg-modal");
  record = document.querySelector(".record");
  autoplay = document.querySelector(".checkSpan");
  audioDiv = document.querySelector(".audioDiv");
  contents = document.querySelector(".bot-contents");
  checkMonkey = document.querySelector(".checkMonkey");
  monkey = document.querySelector(".monkey-ctn");

  //collapsable menu for the contents
  var coll = document.getElementsByClassName("bot-collapsable");
  var i;
  for(i = 0; i < coll.length; i++){
    coll[i].addEventListener("click", function(){
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if(content.style.maxHeight){
        content.style.maxHeight = null;
      }
      else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
      //$(".bot-contents").animate({ scrollTop: $(".bot-contents")[0].scrollHeight }, 200);
    });
  }

  if(checkMonkey){
    var checkbox = document.querySelector("#monkeyCheck");
    checkbox.addEventListener("click", function(){
      if(checkbox.checked == true) monkey.style.display = "flex";
      else if(checkbox.checked == false) monkey.style.display = "none";
    });
  }
}

function closeDict(){
  dictPopup.style.opacity = "0";
  setTimeout(function(){
    dictPopup.style.display = "none"
  }, 1000);
  dictOn = false;
}

function loadBot(){
  play = true;
  dialect.style.opacity = "0";
  setTimeout(function(){
    dialect.style.display = "none";
    bot.style.display = "block";
    audioDiv.style.display = "flex";
    contents.style.display = "block";
    load("BriathraNeamhrialta", "askName");
  }, 200);
}

//loads file chosen by the user
function load(fileId, start, toPlay){
  thisFile = fileId;
  //for dictionary
  if(fileId.indexOf("quiz") == -1){
    var length = fileId.length - 2;
    thisVerb = fileId.substr(0, length);
    if(thisVerb == "bi") thisVerb = "bí";
    else if(thisVerb == "teigh") thisVerb = "téigh";
    else if(thisVerb == "dean") thisVerb = "déan";
  }

  if(toPlay) play = true;
  currentTopic = fileId;
  sendLogToDb();

  console.log("To Load: " + fileId);
  if(keepMessages == false){
    $(".bot-messages").empty();
  }
  for(i = 0; i < files.length; i++){
    if(fileId == files[i].id){
      console.log(files[i].id + " " + files[i].file);
      bot = new RiveScript({utf8: true});
      bot.loadFile(files[i].file).then( () => {
        bot.sortReplies();
        console.log(fileId + " loaded");
        if(start != null) chatSetup(start);
        else{
          if(isNameStored() == false) chatSetup("askname");
          else chatSetup("start");
        }
      });
    }
  }
  keepMessages = false;
}

function loadFromChat(fileId, start){ load(fileId, start); }

function appendTypingIndicator(){
  stillChatting = true;
  $(".messages").append($("<div class=\"typing-indicator\"><div class=\"user-photo\"><img src=\"img/monkey.png\" id=\"bot-img\"></div><div class=\"dots\"><p class=\"chat-message\"><span id=\"typ1\"></span><span id=\"typ2\"></span><span id=\"typ3\"></span></p></div></div></div>"));
  $(".typing-indicator").delay(1000).fadeOut("fast");
  $(".chatlogs").animate({ scrollTop: $(".chatlogs")[0].scrollHeight }, 200);
}

function appendMessage(isBot, isUser, text, showButtons){
  speakerId++;
  bubbleId++;
  var newMessage = document.createElement("div");
  var photoSrc = "";
  var photoId = "";
  if(isBot == true){
    newMessage.setAttribute("class", "chat bot");
    photoSrc = "img/monkey.png";
    photoId = "bot-img";
  }
  else if(isUser == true){
    newMessage.setAttribute("class", "chat user");
    photoSrc = "img/student.png";
    photoId = "user-img";
  }
  newMessage.setAttribute("id", bubbleId);
  var userphotoDiv = document.createElement("div");
  userphotoDiv.setAttribute("class", "user-photo");
  var photo = document.createElement("img");
  photo.src = photoSrc;
  photo.setAttribute("id", photoId);
  userphotoDiv.appendChild(photo)
  newMessage.appendChild(userphotoDiv);

  var newP = document.createElement("p");
  newP.setAttribute("class", "chat-message");
  var newSpan = document.createElement("span");
  newSpan.setAttribute("class", "output");
  newSpan.innerHTML = text;
  newP.appendChild(newSpan);

  var speakerImg = document.createElement("img");
  speakerImg.setAttribute("class", "speaker");
  speakerImg.setAttribute("id", speakerId);
  speakerImg.src = "img/speaker.png";
  speakerImg.onclick = function(){
    if(isPlaying == false) manualPlay(speakerImg.id, newMessage.id);
  }
  newP.appendChild(speakerImg);

  var pauseImg = document.createElement("img");
  pauseImg.setAttribute("class", "pauseButton");
  pauseImg.src = "img/pause.png"
  pauseImg.onclick = function(){
    audioPlayer.pause();
    isPlaying = false;
    pause = false;
  }
  newP.appendChild(pauseImg);

  if(isAQuestion){
    dictImg = document.createElement("img");
    dictImg.src = "img/dict.png";
    dictImg.setAttribute("class", "dictButton");
    dictImg.style.display = "flex";
    dictImg.onclick = function(){
      if(dictOn == false){
        dictText.innerHTML = thisVerb;
        dictPopup.style.display = "flex";
        setTimeout(function(){
          dictPopup.style.opacity = "1";
        }, 200);
        dictOn = true;
      }
    }
    newP.appendChild(dictImg);
    isAQuestion = false;
  }

  if(showButtons == false){
    speakerImg.style.display = "none";
    pauseImg.style.display = "none";
}

  newMessage.appendChild(newP);
  $(".messages").append(newMessage);
  messageDivs.push(newMessage);
}

//CHAT REPLIES AND INPUTS
function chatSetup(text, holdMessages, showButtons){
  //console.log(holdMessages);
  //console.log("chatSetup: " + text);
  var messages = document.querySelector(".messages");
  if(holdMessages == "true" && audioCheckbox.checked == true){
    audioPlayer.addEventListener("ended", function(){
      isPlaying = false;
      bot.reply("local-user", text).then( (reply) => {
        if(reply != ""){
          //console.log(reply);
          //makeMessageObj(true, reply);
          appendTypingIndicator();
          setTimeout(function(){
            appendMessage(true, false, reply, showButtons);
            if(play) audio(reply, bubbleId, false);

            $(".chatlogs").animate({ scrollTop: $(".chatlogs")[0].scrollHeight }, 200);
          }, 1200);
        }
      });
    });
  }
  else{
    bot.reply("local-user", text).then( (reply) => {
      if(reply != ""){
        //console.log(reply);
        //makeMessageObj(true, reply);
        appendTypingIndicator();
        setTimeout(function(){
          appendMessage(true, false, reply, showButtons);
          if(play) audio(reply, bubbleId, false);

          $(".chatlogs").animate({ scrollTop: $(".chatlogs")[0].scrollHeight }, 200);
        }, 1200);
      }
    });
  }
  return "";
}

function chat(){
  //if(holdInput) setTimeout(function(){}, 1200);
  var input = document.getElementById("user_input").value;
  $(".chatform").on("submit", (event) => {
    event.preventDefault();
  });
  if(input != ""){
    document.getElementById("user_input").value = "";
    //makeMessageObj(false, input);
    appendMessage(false, true, input);
    audio(input, bubbleId, true)
    $(".chatlogs").animate({ scrollTop: $(".chatlogs")[0].scrollHeight }, 200);
  }
  bot.reply("local-user", input).then( (reply) => {
    if(reply != ""){
      //makeMessageObj(true, reply);
      appendTypingIndicator();
      setTimeout(function(){
        appendMessage(true, false, reply);
        if(play) audio(reply, bubbleId, false);
        $(".chatlogs").animate({ scrollTop: $(".chatlogs")[0].scrollHeight }, 200);
      }, 1200);
      $(".chatlogs").animate({ scrollTop: $(".chatlogs")[0].scrollHeight }, 200);
    }
  });
}
