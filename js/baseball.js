// PLAYING THE GAME

var awayPlayerName = prompt("Away Team's Name:");
var homePlayerName = prompt("Home Team's Name:");

if (awayPlayerName === "" || awayPlayerName === null) {
  awayPlayerName = "Away Team";
}
if (homePlayerName === "" || homePlayerName === null) {
  homePlayerName = "Home Team";
}

let makeLineup = (team) => {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (val) {
        return val + '. ' + team
  })
}

var awayLineup = makeLineup(awayPlayerName)
var homeLineup = makeLineup(homePlayerName)

var outCounter = 0;
var message;
var awayRunCounter = 0;
var homeRunCounter = 0;
var hitResult = ["Single", "Double", "Triple", "Home-Run", "Walk"];
var outResult = ["Strikeout", "Pop Out", "Flyout", "Lineout", "Groundout"];
var inningNumber = 1;
var topInning = true;
var topOrBottom = "Top ";
var whichInning = topOrBottom + inningNumber;
var currentNumberAtBat = 1;
var awayCurrentNumberAtBat = 1;
var homeCurrentNumberAtBat = 0;
var team;

// WRITING THE TEAM NAMES IN THE TEAM COLUMN
var teamId = ["js-away", "js-home"];
var playerNames = [awayPlayerName + " " + awayRunCounter, homePlayerName + " " + homeRunCounter];

let writeTeamName = (teamId, message) => {
  var teams = document.getElementById(teamId);
  teams.innerHTML = message;
};

for (i = 0; i < playerNames.length; i += 1) {
  writeTeamName(teamId[i], playerNames[i]);
};

// WRITING EACH TEAM'S LINEUP
var awayListOfPlayers = [
  "Brett Gardner",
  "Aaron Hicks",
  "Aaron Judge",
  "Didi Gregorius",
  "Gary Sanchez",
  "Chase Headley",
  "Jacoby Ellsbury",
  "Todd Frazier",
  "Ronald Torreyes"
];

var homeListOfPlayers = [
  "Brett Gardner",
  "Derek Jeter",
  "Brian McCann",
  "Mark Teixeira",
  "Chase Headley",
  "Chris Young",
  "Stephen Drew",
  "Ichiro Suzuki",
  "Jose Pirela"
];

let generateLineup = (listOfPlayers) => {
  return listOfPlayers.reduce((lineupSoFar, batterName) => {
    lineupSoFar[batterName] = {ab: 0, hits: 0, walks: 0, runs: 0, base: 0}
    return lineupSoFar
  }, {})
}

var stats = {
  'away': generateLineup(awayListOfPlayers),
  'home': generateLineup(homeListOfPlayers)
};

let writeBattingOrder = (message1, awayId, message2, homeId) => {
  var place1 = document.getElementById(awayId);
  place1.innerHTML = message1;
  var place2 = document.getElementById(homeId);
  place2.innerHTML = message2;
};

for (i = 0; i < awayLineup.length; i += 1) {
  var htmlPosition = i + 1;
  var awayId = "away-batter-" + htmlPosition;
  var homeId = "home-batter-" + htmlPosition;
  writeBattingOrder(awayListOfPlayers[i], awayId, homeListOfPlayers[i], homeId);
};

printHTML("js-outs", outCounter);
printHTML("js-inning", whichInning);
printHTML("js-atBat", "At Bat: " + awayListOfPlayers[0])

//GENERAL FUNCTION TO PRINT TO HTML
function printHTML(Id, text) {
  var placement = document.getElementById(Id);
  placement.innerHTML = text;
}

// ENABLE/DISABLE BUTTONS ON CLICK
var jsPlayer1 = document.getElementsByClassName("js-player-1");
var jsPlayer2 = document.getElementsByClassName("js-player-2");

let disable = (thisPlayer) => {
  for (var i = 0; i < thisPlayer.length; i++) {
    thisPlayer[i].disabled = true;
  }
}

let enable = (thisPlayer) => {
  for (var i = 0; i < thisPlayer.length; i++) {
    thisPlayer[i].disabled = false;
  }
}

// RESET THE VALUES AFTER THEY ARE COMPARED AND PROCESSED
let resetValues = () => {
  if ( storedValueAway != undefined && storedValueHome != undefined ) {
    storedValueAway = undefined;
    storedValueHome = undefined;
  }
}

// CHANING FONT STYLE COLOR FOR PLACES THAT A CHANGE OCCURS SO THAT THE USER CAN BE MORE AWARE OF WHAT HAPPENED ON THE PLAY
let colorStyle = (Id, color, theStyle) => {
  document.getElementById(Id).style[theStyle] = color;
}

// HOW TO KEEP TRACK OF WHO IS ON BASE AND HOW MANY RUNS HAVE BEEN SCORED
//
// •	If there is an out, no one advances a base --> outCounter += 1 (DONE)
// •	If there is a hit or a walk, anyone other than the batter that has base > 0, advance same number of bases as batter (DONE)
// •	If anyone’s bases > 3, --> bases = 0 and run += 1 (DONE)
// •	If there are 3 outs, all runners’ bases = 0 (DONE)

var storedValueAway;
var storedValueHome;

let makeSelection = () => {
  // DETERMINE IF IT'S PLAYER ONE OR PLAYER TWO
  var whoPressedTheButton = event.target.className;

  // RETRIVE THE VALUE
  var buttonPressed = event.target.value;

  // STORE THE VALUE
  if ( whoPressedTheButton === "js-player-1" ) {
    storedValueAway = buttonPressed;
  } else {
    storedValueHome = buttonPressed;
  }
  var atBat;
  if (topInning === true) {
    team = "away";
    currentNumberAtBat = awayCurrentNumberAtBat;
    atBat = awayListOfPlayers[currentNumberAtBat - 1];
  } else {
    team = "home";
    currentNumberAtBat = homeCurrentNumberAtBat;
    atBat = homeListOfPlayers[currentNumberAtBat - 1];
  }
  printHTML("js-atBat", "At Bat: " + atBat)
  // COMPARE AND PROCESS AND RE-ENABLE BUTTONS
  gameLoop(storedValueAway, storedValueHome, team);
};

let keyboardClick = (event) => {
  var buttonPressed = event.which || event.keyCode;
  var buttonValue;
  if (buttonPressed === 97) {
    storedValueAway = 1;
    disable(jsPlayer1)
  } else if (buttonPressed === 115) {
    storedValueAway = 2
    disable(jsPlayer1)
  } else if (buttonPressed === 100) {
    storedValueAway = 3
    disable(jsPlayer1)
  } else if (buttonPressed === 122) {
    storedValueAway = 4
    disable(jsPlayer1)
  } else if (buttonPressed === 120) {
    storedValueAway = 5
    disable(jsPlayer1)
  } else if (buttonPressed === 104) {
    storedValueHome = 1
    disable(jsPlayer2)
  } else if (buttonPressed === 106) {
    storedValueHome = 2
    disable(jsPlayer2)
  } else if (buttonPressed === 107) {
    storedValueHome = 3
    disable(jsPlayer2)
  } else if (buttonPressed === 110) {
    storedValueHome = 4
    disable(jsPlayer2)
  } else if (buttonPressed === 109) {
    storedValueHome = 5
    disable(jsPlayer2)
  } else {
    buttonValue = null;
  }
  if (whichInning === "Final") {
    storedValueAway = undefined;
    storedValueHome = undefined;
  }
  var atBat;
  if (topInning === true) {
    team = "away";
    currentNumberAtBat = awayCurrentNumberAtBat;
    atBat = awayListOfPlayers[currentNumberAtBat - 1];
  } else {
    team = "home";
    currentNumberAtBat = homeCurrentNumberAtBat;
    atBat = homeListOfPlayers[currentNumberAtBat - 1];
  }
  printHTML("js-atBat", "At Bat: " + atBat)
  gameLoop(storedValueAway, storedValueHome, team)
}

// COMAPRE AND PROCESS THE VALUES
let gameLoop = (storedValueAway, storedValueHome, team) => {
  colorStyle("js-result", "inherit", "color");
  colorStyle("js-inning", "inherit", "color");
  colorStyle("js-outs", "inherit", "color");
  if (topInning === true) {
    atBat = awayListOfPlayers[currentNumberAtBat - 1];
  } else {
    atBat = homeListOfPlayers[currentNumberAtBat - 1];
  }
  if ( storedValueAway != undefined && storedValueHome != undefined ) {
    // printHTML("js-atBat", "At Bat: " + atBat)
    storedValueAway = parseInt(storedValueAway);
    storedValueHome = parseInt(storedValueHome);
    if ( storedValueAway != storedValueHome ) {
      colorStyle("js-result", "red", "color");
      colorStyle("js-outs", "red", "color");
      var finalOutCounter = false;
      outCounter += 1;
      if (outCounter === 3) {
        colorStyle("base-1", "black", "backgroundColor");
        colorStyle("base-2", "black", "backgroundColor");
        colorStyle("base-3", "black", "backgroundColor");
        outCounter = 0;
        if ( inningNumber > 8 && topInning === false && awayRunCounter > homeRunCounter) {
          finalOutCounter = true; // GET AROUND OUTCOUNTER IMMEDIATELY SWITCHING FROM 3 TO 0 AND HELP DETERMINE IF GAME IS OVER LATER ON IN CODE - SEE BELOW
        }
        for (var playerName in stats[team]) {
          if (stats[team].hasOwnProperty(playerName)) {
            stats[team][playerName].base = 0;
          }
        }
        if (topInning === true) {
          topInning = false;
          topOrBottom = "Bot ";
          awayCurrentNumberAtBat = currentNumberAtBat;
        } else {
          topInning = true;
          topOrBottom = "Top ";
          homeCurrentNumberAtBat = currentNumberAtBat;
          inningNumber += 1;
        }
        colorStyle("js-inning", "red", "color");
      }
      printHTML("js-outs", outCounter)
      printHTML("js-result", outResult[Math.floor(Math.random() * 5)] );
    } else {
      colorStyle("base-1", "black", "backgroundColor");
      colorStyle("base-2", "black", "backgroundColor");
      colorStyle("base-3", "black", "backgroundColor");
      colorStyle("js-outs", "inherit", "color");
      colorStyle("js-result", "green", "color");
      printHTML("js-result", hitResult[storedValueAway - 1]);
      if (storedValueAway === 5) {
        storedValueAway = 1; // WALK ACTS LIKE A SINGLE BUT DOES NOT RECIEVE A HIT OR AB
        stats[team][atBat].walks += 1;
        stats[team][atBat].hits -= 1;
        stats[team][atBat].ab -= 1;
      }
      stats[team][atBat].base += storedValueAway;
      stats[team][atBat].hits += 1;
      for ( var playerName in stats[team] ) {
        if ( stats[team].hasOwnProperty(playerName) ) {
          if ( stats[team][playerName].base > 0 ) {
            stats[team][playerName].base += storedValueAway;
            if (playerName === atBat) {
              stats[team][atBat].base -= storedValueAway;
            }
          }
          if (stats[team][playerName].base > 3) {
            if (team === "away") {
              awayRunCounter += 1;
            } else {
              homeRunCounter += 1;
            }
            stats[team][playerName].base = 0;
            stats[team][playerName].runs += 1;
          }
          if (stats[team][playerName].base > 0) {
            colorStyle("base-" + stats[team][playerName].base + "", "rgb(255, 255, 153)", "backgroundColor");
          }
        }
      }
    }
    stats[team][atBat].ab += 1;

    // DETERMINING THE INNING AND IF THE GAME IS OVER
    if ( (inningNumber > 8 && topInning === false && homeRunCounter > awayRunCounter) || (finalOutCounter === true) ) {
      whichInning = "Final";
      disable(jsPlayer1);
      disable(jsPlayer2);
    } else {
      whichInning = topOrBottom + inningNumber;
      enable(jsPlayer1);
      enable(jsPlayer2);
    }
    printHTML("js-inning", whichInning);

    // UPDATE SCORE
    printHTML("js-away", awayPlayerName + " " + awayRunCounter);
    printHTML("js-home", homePlayerName + " " + homeRunCounter);

    // UPDATE STATS SHEET
    printHTML(team + '-batter-' + currentNumberAtBat + '-ab', stats[team][atBat].ab)
    printHTML(team + '-batter-' + currentNumberAtBat + '-hits', stats[team][atBat].hits)
    printHTML(team + '-batter-' + currentNumberAtBat + '-walks', stats[team][atBat].walks)

    console.log(stats[team]);

    if (awayCurrentNumberAtBat > 8) {
      awayCurrentNumberAtBat = 0;
    }
    if (homeCurrentNumberAtBat > 8) {
      homeCurrentNumberAtBat = 0;
    }
    if (topInning === true) {
      awayCurrentNumberAtBat += 1;
    } else {
      homeCurrentNumberAtBat += 1;
    }
  }
  resetValues();
}

// TESTING CONST
// const test = [0, 2, 3]
// const test2 = 1;
// if (1 === 1) {
//   test[0] = 1
//   console.log(test[0])
//   console.log(test[1])
//   console.log(test[2])
// }
//END OF TEST
