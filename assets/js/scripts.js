const url = 'https://statsapi.web.nhl.com/api/v1/teams/';

function dataRequest(fetchUrl){
    fetch(fetchUrl)
    .then(res => res.json())
    .then(data => {
        printTeamID(data, "New Jersey Devils", "Ottawa Senators")
//        console.log(data);
    });
}

function printTeamID(dataset,targetTeamName1, targetTeamName2) {
    var targetTeam1
    var targetTeam2
    targetTeam1 = dataset.teams.find(team1 => team1.name==targetTeamName1);
    targetTeam2 = dataset.teams.find(team2 => team2.name==targetTeamName2);
    console.log(targetTeam1.id);
    console.log(targetTeam2.id);
}


function getTeamID(arrayTeams, propertyName, propertyValue) {
    var teamName = document.getElementById("teamSelect");
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