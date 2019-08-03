const fetchUrl = 'https://statsapi.web.nhl.com/api/v1/teams/';

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
        });
    fetch(fetchUrl + teamID2 + '/stats')
        .then(res => res.json())
        .then(statSet2 => {
            const teamStat2 = (statSet1.stats[0].splits[0].stat)
        });
}


