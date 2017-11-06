$(document).ready(function() {
  //buttonsEnabled(false);//originally have ouuter buttons set to off
  var strict = false;
  var sequenceArray = [];
  var currentStep = 0;
  var startReset = "start";
  //simon button object
  var simonButtons = [{
    buttonID: "red-button",
    soundID: "red-sound",
    buttonNum: 1,
    unclickColor: "darkRed",
    clickColor: "red"
  }, {
    buttonID: "green-button",
    soundID: "green-sound",
    buttonNum: 2,
    unclickColor: "darkGreen",
    clickColor: "#00c624"
  }, {
    buttonID: "yellow-button",
    soundID: "yellow-sound",
    buttonNum: 3,
    unclickColor: "#bcbf00",
    clickColor: "yellow"
  }, {
    buttonID: "blue-button",
    soundID: "blue-sound",
    buttonNum: 4,
    unclickColor: "darkBlue",
    clickColor: "blue"
  }]; //simon button object end

  //when outer button is clicked
  $(".outer-button").on("click", function() {
    //get ID
    var buttonClicked = $(this).attr("id");
    //search through simonButton obj array for corresponding button
    simonButtons.forEach(function(button) {

      //when they match,
      if (button.buttonID === buttonClicked) {
        buttonsEnabled(false);
        //change background color
        $("#" + button.buttonID).css("background-color", button.clickColor);
        //call buttonClick function with time delay
        setTimeout(function() {
          simonButtonClick(button, button.soundID);
        }, 300)
        checkSequence(button.buttonNum);
      } //if end
    }); //for each end

  }); //outer button click end

  //start/reset btn
  $("#start-btn").on("click", function() {
    //start button also works as reset button
    if (startReset === "start") { //start game, calling gamePlay
      buttonsEnabled(false);
      startReset = "reset";
      gamePlay("append");
    } else {
      $("#output-screen").text("New Game");
      buttonsEnabled(false);
      setTimeout(function() {
        resetGame(); //resetGame;
      }, 400)
    }
  });

  //strict button
  $("#strict-btn").on("click", function() {
    if (strict === false) {
      strict = true;
      $(this).css("background-color", "yellow");
    } else {
      strict = false;
      $(this).css("background-color", "#c6c433")
    }
  }); //strict end
  //function that changes the color of the simon button with clicked and does sound
  function simonButtonClick(button, audioID) {
    $("#" + button.buttonID).css("background-color", button.unclickColor);
    var audio = document.getElementById(audioID);
    audio.play();
  } //simonbutton clicks end

  function buttonsEnabled(bool) {
    if (bool === true) {
      $(".outer-button").css("pointer-events", "auto");
    } else {
      $(".outer-button").css("pointer-events", "none");
    }
  } //buttonsEnabled end

  function gamePlay(append) {
    //don't allow button clicks
    buttonsEnabled(false); //don't allow futher button clicks
    //turn back on when time has passed
    setTimeout(function() {
      buttonsEnabled(true);
    }, 1000 * sequenceArray.length)

    //first, get a new random  button press to add to the sequence
    //but only if append if true
    if (append === "append") {
      sequenceArray.push(randButton());
      $("#output-screen").text(sequenceArray.length);
    }
    //second play through old sequence with new addition
    var i = 0;
    //loop through current sequence
    for (var i = 0; i < sequenceArray.length; i++) {
      (function(i) {
        //delay by a second the displaying of each button in sequence
        setTimeout(function() {
          //switch statement to determine which of four buttons to be pressed
          switch (sequenceArray[i]) {
            case 1: //red
              $("#" + simonButtons[0].buttonID).css("background-color", simonButtons[0].clickColor);
              setTimeout(function() {
                simonButtonClick(simonButtons[0], simonButtons[0].soundID);
              }, 300);
              break;
            case 2: //green
              $("#" + simonButtons[1].buttonID).css("background-color", simonButtons[1].clickColor);
              setTimeout(function() {
                simonButtonClick(simonButtons[1], simonButtons[1].soundID);
              }, 300);
              break;
            case 3: //yellow
              $("#" + simonButtons[2].buttonID).css("background-color", simonButtons[2].clickColor);
              setTimeout(function() {
                simonButtonClick(simonButtons[2], simonButtons[2].soundID);
              }, 300);
              break;
            case 4: //blue
              $("#" + simonButtons[3].buttonID).css("background-color", simonButtons[3].clickColor);
              setTimeout(function() {
                simonButtonClick(simonButtons[3], simonButtons[3].soundID);
              }, 300);
              break;
          }
        }, 1000 * i); //timeout end
      }(i)); //function within sequence loop end
    } //sequence loop end
    console.log(sequenceArray);
  }; //gamePlay end

  function randButton() {
    var randButtonNum = Math.floor(Math.random() * (5 - 1) + 1);
    return randButtonNum;
  }

  //function to check if the user click the correct button in the sequence
  function checkSequence(buttonNum) {
    if (buttonNum === sequenceArray[currentStep]) {
      //if user reaches end of sequence
      //check if 20 (they won game) or call game sequence again with additional step
      if (currentStep + 1 === sequenceArray.length) {
        if (sequenceArray.length === 20) { //end of game
          currentStep = 0;
          $("#output-screen").text("You Win!");
          setTimeout(function() {
            $("#output-screen").text(sequenceArray.length);
            resetGame();
            return;
          }, 1000);
        }
        setTimeout(function() {
          gamePlay("append"); //call sequence to play again with additional step
        }, 1300);
        currentStep = 0; //reset current step
      } else { //if not at end of sequence, add to currentStep
        buttonsEnabled(true);
        currentStep++;
      }

    } else { //if button clicked by user is not correct, either play sequence again with
      //no additional step (no strict), or restart sequence
      if (strict === false) { //IF STRICT IS OFF
        $("#output-screen").text("Opps!");
        currentStep = 0;
        setTimeout(function() {
          $("#output-screen").text(sequenceArray.length);
          gamePlay("noAppend")
        }, 1000);
      } else { //IF STRICT IS ON
        currentStep = 0;
        $("#output-screen").text("Opps!");
        setTimeout(function() {
          $("#output-screen").text(sequenceArray.length);
          resetGame();
        }, 1000);
      }
    }
  } //checkSequence function end

  function resetGame() {
    currentStep = 0; //set step to 0, should be done already but this is a failsafe
    sequenceArray = []; //reset sequence array to being empty.
    gamePlay("append"); //call the gamePLay function, adding a new step to begin game again
  }
}); //document ready end