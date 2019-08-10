const fetchUrl = 'https://statsapi.web.nhl.com/api/v1/teams/';

var options = {
statistics:false,
}

function nameRequest() {
    fetch(fetchUrl)
        .then(res => res.json())
        .then(data => {
            const sortedNames = (data.teams.sort((a, b) => (a.name > b.name) ? 1 : -1));
            appendTeamNames(sortedNames);
        })
}

function appendTeamNames(sortedNames) {
    var teamSelectorId = ["firstTeamSelect", "secondTeamSelect"];
    teamSelectorId.forEach(teamSelectorId => {
        sortedNames.forEach(sortedNames => {
            document.getElementById(teamSelectorId).innerHTML +=
                `<option>${sortedNames.name}</option>`
        })
    })
}


//$("#firstTeamSelect").change(function(){
//   getTeamSelection("first",$(this).val())
//});

//$("#secondTeamSelect").change(function(){
//    getTeamSelection("second",$(this).val())
//});


// WORK-IN-PROGRESS, IGNORE AT THIS POINT.
//if (document.getElementById("firstTeamSelect").value || document.getElementById("secondTeamSelect").value == "Anaheim Ducks"){
//    alert("QUACK QUACK QUACK");
//    console.log("QUACK QUACK QUACK");
//}

$(".dropdownSelector").change(function(){
    alert(`Turn and face the strange. ${$(this).val()}`)
})

function getTeamSelection(order,teamName){
    var shortenedTeamName = teamName.replace(/\s/g, '');
    document.getElementById(`${order}TeamLogo`).src = `assets/images/teamlogos/${shortenedTeamName}.png`;
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


function statsRequest(teamID) {
    fetch(fetchUrl + teamID1 + '/stats')
        .then(res => res.json())
        .then(statSet => {
            const teamStat = (statSet.stats[0].splits[0].stat)
            var teamSelect = 1
            writeStats(teamStat1, teamSelect)
        });
}

function writeStats(teamStat, teamSelect) {
    document.getElementById("wins" + teamSelect).textContent = teamStat.wins;
    document.getElementById("losses" + teamSelect).textContent = teamStat.losses;
    document.getElementById("pts" + teamSelect).textContent = teamStat.pts;
    document.getElementById("faceOffWinPercentage" + teamSelect).textContent = teamStat.faceOffWinPercentage;
    document.getElementById("savePctg" + teamSelect).textContent = teamStat.savePctg;
    document.getElementById("goalsPerGame" + teamSelect).textContent = teamStat.goalsPerGame;
}

function visibleStatistics() {
    document.getElementById("statistics").style.visibility = "visible";
}
