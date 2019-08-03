const fetchUrl = 'https://statsapi.web.nhl.com/api/v1/teams/';

function getTeamName() {
    const teamName1 = document.getElementById("teamSelect1").value;
    const teamName2 = document.getElementById("teamSelect2").value;
    dataRequest(teamName1,teamName2)
}


function dataRequest(teamName1,teamName2){
    const fetchUrl = 'https://statsapi.web.nhl.com/api/v1/teams/';
    fetch(fetchUrl)
    .then(res => res.json())
    .then(data => {
    getTeamID(data, teamName1, teamName2)
    });
}

function getTeamID(dataset,teamName1, teamName2) {
    var targetTeam1;
    var targetTeam2;
    targetTeam1 = dataset.teams.find(team1 => team1.name==teamName1);
    targetTeam2 = dataset.teams.find(team2 => team2.name==teamName2);
    var teamID1 = targetTeam1.id;
    var teamID2 = targetTeam2.id;
    console.log(teamID1);
    console.log(teamID2);
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


getTeamName()
//statsRequest(url, 1);
//statsRequest(url, 2);