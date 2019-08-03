const fetchUrl = 'https://statsapi.web.nhl.com/api/v1/teams/';

function nameRequest() {
    fetch(fetchUrl)
        .then(res => res.json())
        .then(data => {
            console.log(data.teams.sort((a, b) => (a.name > b.name) ? 1 : -1));
            for (var i = 0; i< data.teams.length ; i++) {
                console.log (data.teams[i].name)
                }
        });
}

function getTeamName() {
    const teamName1 = document.getElementById("teamSelect1").value;
    const teamName2 = document.getElementById("teamSelect2").value;
    dataRequest(teamName1, teamName2)
}


function dataRequest(teamName1, teamName2) {
    fetch(fetchUrl)
        .then(res => res.json())
        .then(data => {
            getTeamID(data.teams, teamName1, teamName2)
        });
}

function getTeamID(dataset, teamName1, teamName2) {
    var targetTeam1;
    var targetTeam2;
    targetTeam1 = dataset.find(team1 => team1.name == teamName1);
    targetTeam2 = dataset.find(team2 => team2.name == teamName2);
    var teamID1 = targetTeam1.id;
    var teamID2 = targetTeam2.id;
    statsRequest(teamID1, teamID2)
}


function statsRequest(teamID1, teamID2) {
    fetch(fetchUrl + teamID1 + '/stats')
        .then(res => res.json())
        .then(statSet1 => {
            const teamStat1 = (statSet1.stats[0].splits[0].stat)
            var teamSelect = 1
            writeStats(teamStat1, teamSelect)
        });
        
    fetch(fetchUrl + teamID2 + '/stats')
        .then(res => res.json())
        .then(statSet2 => {
            const teamStat2 = (statSet2.stats[0].splits[0].stat)
            var teamSelect = 2
            writeStats(teamStat2, teamSelect)
        });
}

function writeStats(teamStat, teamSelect) {
    console.log(teamStat);
    document.getElementById("wins"+teamSelect).textContent = teamStat.wins;
    document.getElementById("losses"+teamSelect).textContent = teamStat.losses;
    document.getElementById("pts"+teamSelect).textContent = teamStat.pts;
    document.getElementById("faceOffWinPercentage"+teamSelect).textContent = teamStat.faceOffWinPercentage;
    document.getElementById("savePctg"+teamSelect).textContent = teamStat.savePctg;
    document.getElementById("goalsPerGame"+teamSelect).textContent = teamStat.goalsPerGame;
}

