var fetchOptions = {
    fetchUrl: "https://statsapi.web.nhl.com/api/v1/teams/",
    statsUrl: "",
    teamIdArray: [],
    teamId: "",
    sortData: true,
    getId: true,
    getStatistics: false,
    handleStatistics: false,
    firstWriteCompletion: false,
    secondWriteCompletion: false,
}

function testFetch(){
//    fetch("https://statsapi.web.nhl.com/api/v1/teams?expand=team.roster&season=20142015")
//    fetch("https://statsapi.web.nhl.com/api/v1/teams?teamId=4,3,2")
//    fetch("https://statsapi.web.nhl.com/api/v1/teams?expand=team.stats") SHOULD THIS BE USED INSTEAD TO MINIMISE FETCH REQUESTS?
//    fetch("https://statsapi.web.nhl.com/api/v1/people/ID/stats")
//    POTENTIAL TO SHOW LAST MATCH SCORES BETWEEN TWO TEAMS? NEXT MATCH FOR EACH TEAM AND NEXT MATCH FOR BOTH?
//        .then(res => res.json())
//        .then(data => console.log(data))
}

function dataFetch(fetchOptions) {
    console.log(fetchOptions.fetchUrl + fetchOptions.teamId + fetchOptions.statsUrl);
    fetch(fetchOptions.fetchUrl + fetchOptions.teamId + fetchOptions.statsUrl)
        .then(res => res.json())
        .then(data => {
            if (fetchOptions.sortData) {
                var data = (data.teams.sort((a, b) => (a.name > b.name) ? 1 : -1));
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
                fetchOptions.getStatistics = true;

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
                var teamStat = data.stats[0].splits[0].stat;
                writeStats(teamOrder, teamStat);
            }

        })
}

function writeStats(teamOrder, teamStat) {
    if (teamOrder == 0) {
        var teamDivSelect = "firstTeam";
    }
    if (teamOrder == 1) {
        var teamDivSelect = "secondTeam";
    };
    document.getElementById(teamDivSelect + "Wins").textContent = teamStat.wins;
    document.getElementById(teamDivSelect + "Losses").textContent = teamStat.losses;
    document.getElementById(teamDivSelect + "Points").textContent = teamStat.pts;
    document.getElementById(teamDivSelect + "FaceOffWinPercentage").textContent = teamStat.faceOffWinPercentage;
    document.getElementById(teamDivSelect + "SavePercentage").textContent = teamStat.savePctg;
    document.getElementById(teamDivSelect + "GoalsPerGame").textContent = teamStat.goalsPerGame;
    if (teamOrder == 0) { fetchOptions.firstWriteCompletion = true; }
    if (teamOrder == 1) { fetchOptions.secondWriteCompletion = true; }
    if (fetchOptions.firstWriteCompletion && fetchOptions.secondWriteCompletion) {
        defaultOptions(fetchOptions);
    }
}


function getTeamId(data, teamName) {
    console.log(data);
    return (data.teams.find(team => team.name == teamName).id);
}

function optionsEnableStats(fetchOptions) {
    fetchOptions.getId = true;
    dataFetch(fetchOptions);
}

function defaultOptions(fetchOptions) {
    fetchOptions.statsUrl = "";
    fetchOptions.teamIdArray = [];
    fetchOptions.teamId = "";
    fetchOptions.sortData = false;
    fetchOptions.getId = true;
    fetchOptions.getStatistics = false;
    fetchOptions.handleStatistics = false;
    fetchOptions.firstWriteCompletion = false;
    fetchOptions.secondWriteCompletion = false;
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
