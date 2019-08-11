var options = {
    fetchUrl: "https://statsapi.web.nhl.com/api/v1/teams/",
    statsUrl: "/stats",
    sort: true,
    getId : false,
    getStats: false,
}

function dataFetch(options) {
    fetch(options.fetchUrl)
        .then(res => res.json())
        .then(data => {
            if (options.sort = true) {
                nameRequest(data)
            }
            else if (options.getId = true){
                getTeamId(data)
            }
            else if (options.getStats = true){
                statsRequest(data)
            }
        }
        )
}

//These two variables can be combined later on.
function optionsUpdate() {
    options.getId = true;
    options.getStats = true;
}

function nameRequest(data) {
    const sortedData = (data.teams.sort((a, b) => (a.name > b.name) ? 1 : -1));
    appendTeamNames(sortedData);
    options.sort = false;
    return (sortedData);
}

function appendTeamNames(sortedData) {
    var teamSelectorId = ["firstTeamSelect", "secondTeamSelect"];
    teamSelectorId.forEach(teamSelectorId => {
        sortedData.forEach(sortedData => {
            document.getElementById(teamSelectorId).innerHTML +=
                `<option>${sortedData.name}</option>`
        })
    })
}

$(".dropdownSelector").change(function () {
    var dropdownOrder = ($(this).attr("id")).replace("TeamSelect", "");
    var teamName = $(this).val();
    compareButtonVisibility();
    getTeamSelection(dropdownOrder, teamName);
})

function getTeamSelection(order, teamName) {
    var shortenedTeamName = teamName.replace(/\s/g, "");
    document.getElementById(`${order}TeamLogo`).src = `assets/images/teamlogos/${shortenedTeamName}.png`;
}

function compareButtonVisibility() {
    var defaultSelect = "---Select Team---";
    var firstSelection = document.getElementById("firstTeamSelect").value;
    var secondSelection = document.getElementById("secondTeamSelect").value;
    if (firstSelection != defaultSelect && secondSelection != defaultSelect && firstSelection != secondSelection) {
        document.getElementById("compareButton").style.visibility = "visible"
    }
    else {
        document.getElementById("compareButton").style.visibility = "hidden"
    }
}

function dataRequest(teamName1, teamName2) {
    fetch(fetchUrl)
        .then(res => res.json())
        .then(data => {
            getTeamId(data.teams, teamName1, teamName2)
        });
}

function getTeamId(dataset, teamName1, teamName2) {
    var firstTargetTeam = dataset.find(team1 => team1.name == teamName1);
    var secondTargetTeam = dataset.find(team2 => team2.name == teamName2);
    firstTargetTeam = firstTargetTeam.id;
    secondTargetTeam = secondTargetTeam.id;
    statsRequest(firstTargetTeam, secondTargetTeam)
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
