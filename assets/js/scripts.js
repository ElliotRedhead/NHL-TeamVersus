var fetchOptions = {
    fetchUrl: "https://statsapi.web.nhl.com/api/v1/teams/",
    statsUrl: "",
    teamIdArray: [],
    teamId: "",
    sortData: true,
    getId: true,
    getStatistics: true,
    handleStatistics: false,
    optionsReset: false,
}

function dataFetch(fetchOptions) {
    fetch(fetchOptions.fetchUrl + fetchOptions.teamId + fetchOptions.statsUrl)
        .then(res => res.json())
        .then(data => {
            if (fetchOptions.sortData) {
                var data = (data.teams.sort((a, b) => (a.name > b.name) ? 1 : -1));
                console.log(data);
                appendTeamNames(data);
                fetchOptions.sortData = false;
                return data;
            }
            if (fetchOptions.getId) {
                fetchOptions.getId = false;
                var firstTeamName = document.getElementById("firstTeamSelect").value;
                var secondTeamName = document.getElementById("secondTeamSelect").value;
                fetchOptions.teamIdArray.push(getTeamId(data, firstTeamName));
                fetchOptions.teamIdArray.push(getTeamId(data, secondTeamName));
            }
            if (fetchOptions.getStatistics) {
                fetchOptions.statsUrl = "/stats";
                fetchOptions.getStatistics = false;
                fetchOptions.teamIdArray.forEach(element => {
                    fetchOptions.teamId = element;
                    fetchOptions.handleStatistics = true;
                    dataFetch(fetchOptions);
                });

            }
            else if (fetchOptions.handleStatistics) {
                var teamOrder = fetchOptions.teamIdArray.indexOf(data.stats[0].splits[0].team.id);
                console.log(teamOrder);
                var teamStat = data.stats[0].splits[0].stat;
                writeStats(teamOrder, teamStat);
            }

            if (fetchOptions.optionsReset) {
                console.log("Reset.")
                defaultOptions(fetchOptions);
            }
            
        })
}

function writeStats(teamOrder, teamStat) {
    if (teamOrder == 0) {
        var teamDivSelect = "firstTeam";
    }
    else if(teamOrder == 1) {
        var teamDivSelect = "secondTeam";
        fetchOptions.optionsReset = true; //REDEFINE WHEN THE RESET OCCURS, SOMETIMES THE SECOND TEAM IS LOADING BEFORE THE FIRST.
    };
    console.log(teamOrder);
    document.getElementById(teamDivSelect + "Wins").textContent = teamStat.wins;
    document.getElementById(teamDivSelect + "Losses").textContent = teamStat.losses;
    document.getElementById(teamDivSelect + "Points").textContent = teamStat.pts;
    document.getElementById(teamDivSelect + "FaceOffWinPercentage").textContent = teamStat.faceOffWinPercentage;
    document.getElementById(teamDivSelect + "SavePercentage").textContent = teamStat.savePctg;
    document.getElementById(teamDivSelect + "GoalsPerGame").textContent = teamStat.goalsPerGame;
}

function getTeamId(data, teamName) {
    return (data.teams.find(team => team.name == teamName).id);
}

function optionsEnableStats(fetchOptions) {
    fetchOptions.getId = true;
    fetchOptions.getStatistics = true;
    dataFetch(fetchOptions);
}

function defaultOptions(fetchOptions) {
    fetchOptions.statsUrl = "";
    fetchOptions.teamIdArray = [];
    fetchOptions.sortData = true;
    fetchOptions.getId = true;
    fetchOptions.getStatistics = true;
    fetchOptions.handleStatistics = false;
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
    getTeamLogo(dropdownOrder, teamName);
})

function getTeamLogo(order, teamName) {
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


function visibleStatistics() {
    document.getElementById("statistics").style.visibility = "visible";
}
