const url = 'https://statsapi.web.nhl.com/api/v1/teams/';

//function Team (name, number){
//    this.teamName = name;
//    this.teamNumber = number;
//}

//Retrieve the team number from the API to convert from teamname instead of doing locally.

function dataRequest(fetchUrl){
    fetch(fetchUrl)
    .then(res => res.json())
    .then(data => {
//        console.log(data);
        printData(data);
    });
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

function printData(dataset) {
    var datasetAnalysis = dataset.teams;
    console.log(datasetAnalysis);
    console.log(datasetAnalysis.length);
    for (var i=0; i < datasetAnalysis.length; i++)
        if (datasetAnalysis[i][name] == "New Jersey Devils")
            console.log (datasetAnalysis[i]);
        else console.log ("No dice.")
}

dataRequest(url)
//statsRequest(url, 1);
//statsRequest(url, 2);