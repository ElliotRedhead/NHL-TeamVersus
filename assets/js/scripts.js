const url = 'https://statsapi.web.nhl.com/api/v1/teams/';
var teamName1
var teamName2

function getTeamName() {
    teamName1 = document.getElementById("teamSelect1");
    teamName2 = document.getElementById("teamSelect2");
}


function dataRequest(fetchUrl){
    fetch(fetchUrl)
    .then(res => res.json())
    .then(data => {
        printTeamID(data, "New Jersey Devils", "Ottawa Senators")
//        console.log(data);
    });
}

function printTeamID(dataset,teamName1, teamName2) {
    var targetTeam1;
    var targetTeam2;
    targetTeam1 = dataset.teams.find(team1 => team1.name==teamName1);
    targetTeam2 = dataset.teams.find(team2 => team2.name==teamName2);
    var teamID1 = targetTeam1.id;
    var teamID2 = targetTeam2.id;
}


function statsRequest(fetchUrl, teamNumber) {
  fetch(fetchUrl + teamNumber + '/stats')
    .then(res => res.json())
    .then(data => {
        printStats(data);
    });
}


function printStats(dataset) {
    const statistics = dataset.stats[0].splits[0].stat;
    const wins = statistics.wins;
    console.log(wins);
}



dataRequest(url)
//statsRequest(url, 1);
//statsRequest(url, 2);