var fetchOptions = {
    fetchUrl: "https://statsapi.web.nhl.com/api/v1/teams/",
    statsUrl: "",
    teamIdArray: [],
    teamId: "",
    sort: true,
    getId: false,
    getStatistics: false,
}

function dataFetch(fetchOptions) {
    console.log(fetchOptions.fetchUrl + fetchOptions.teamId + fetchOptions.statsUrl);
    fetch(fetchOptions.fetchUrl + fetchOptions.teamId + fetchOptions.statsUrl)
        .then(res => res.json())
        .then(data => {
        //    if (fetchOptions.sort == true) Shorthand notation follows:
            if (fetchOptions.sort) {
                var data = (data.teams.sort((a, b) => (a.name > b.name) ? 1 : -1));
                appendTeamNames(data);
                fetchOptions.sort = false;
                fetchOptions.getId = true;
            }
            if (fetchOptions.getId == true) {
                var firstTeamName = document.getElementById("firstTeamSelect").value;
                var secondTeamName = document.getElementById("secondTeamSelect").value;
                fetchOptions.teamIdArray.push(getTeamId(data.teams, firstTeamName));
                fetchOptions.teamIdArray.push(getTeamId(data.teams, secondTeamName));
                fetchOptions.getId = false;
                fetchOptions.getStatistics = true;
            //    dataFetch(fetchOptions);
            }
            if (fetchOptions.getStatistics == true) {
            fetchOptions.statsUrl = "/stats";
                fetchOptions.getStatistics = false;
                fetchOptions.teamIdArray.forEach(element => {
                    fetchOptions.teamId = element;
                    dataFetch(fetchOptions);
                })
            }
        })
}


function getTeamId(data, teamName) {
    return (data.find(Team => Team.name == teamName).id);
}

function getStats(teamID) {
    fetch(fetchUrl + teamID1 + '/stats')
        .then(res => res.json())
        .then(statSet => {
            const teamStat = (statSet.stats[0].splits[0].stat)
            var teamSelect = 1
            writeStats(teamStat1, teamSelect)
        });
}

//These two variables can be combined later on.
function optionsEnableStats(options) {
    fetchOptions.getStatistics = true;
    dataFetch(fetchOptions);
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

//function dataRequest(teamName1, teamName2) {
//    fetch(fetchUrl)
//        .then(res => res.json())
//        .then(data => {
//            getTeamId(data.teams, teamName1, teamName2)
//        });
//}





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
