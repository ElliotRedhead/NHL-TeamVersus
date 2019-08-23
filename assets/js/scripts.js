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

var teamStatistics = {
    firstTeam: "",
    secondTeam: "",
}

function testFetch(fetchOptions) {
    //    fetch("https://statsapi.web.nhl.com/api/v1/teams?expand=team.roster&season=20142015")
    //    fetch("https://statsapi.web.nhl.com/api/v1/teams?teamId=4,3,2")
    //   fetch("https://statsapi.web.nhl.com/api/v1/teams?expand=team.stats") //SHOULD THIS BE USED INSTEAD TO MINIMISE FETCH REQUESTS?
    //  fetch("https://statsapi.web.nhl.com/api/v1/people/ID/stats")
    //  POTENTIAL TO SHOW LAST MATCH SCORES BETWEEN TWO TEAMS? NEXT MATCH FOR EACH TEAM AND NEXT MATCH FOR BOTH?
    fetch(fetchOptions.fetchUrl)
        .then(res => res.json())
        .then(data => console.log(data))
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
        teamStatistics.firstTeam = teamStat;
    }
    if (teamOrder == 1) {
        var teamDivSelect = "secondTeam";
        teamStatistics.secondTeam = teamStat;
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
    scrollToResults()
}

function highlightWins() {
    const requiredStatistics = ["wins", "losses", "pts", "faceOffWinPercentage", "savePctg", "goalsPerGame"]
    var statArray = [...[requiredStatistics]];
    var statObject = {};
    var greaterArray = [];
    var lesserArray = [];
    // // BRACKET NOTATION IS REQUIRED WHEN USING A VARIABLE OBJECT PROPERTY.
    // THE ATTEMPTED METHOD BELOW SHOULD BE APPLIED TO THE WRITESTATS FUNCTION ONCE ACCOMPLISHED TO REFACTOR.
    requiredStatistics.forEach(function (requiredStat) {
        // ALTHOUGH A VIABLE IDEA, AN IF/ELSE STATEMENT WILL WORK HERE JUST AS READILY.
        statArray.push([teamStatistics["firstTeam"][requiredStat], teamStatistics["secondTeam"][requiredStat]])
        statObject[requiredStat] = teamStatistics["firstTeam"][requiredStat];
        statObject[requiredStat] += teamStatistics["secondTeam"][requiredStat];
        greaterArray.push(Math.max(...[teamStatistics["firstTeam"][requiredStat], teamStatistics["secondTeam"][requiredStat]]))
        lesserArray.push(Math.min(...[teamStatistics["firstTeam"][requiredStat], teamStatistics["secondTeam"][requiredStat]]))
        })
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
    hiddenStatistics();
    var dropdownOrder = ($(this).attr("id")).replace("TeamSelect", "");
    var teamName = $(this).val();
    compareButtonVisibility();

    getTeamLogo(dropdownOrder, teamName);
})

function getTeamLogo(order, teamName) {
    var shortenedTeamName = teamName.replace(/\s/g, "");
    var teamLogo = document.getElementById(`${order}TeamLogo`);
    teamLogo.src = `assets/images/teamlogos/${shortenedTeamName}.png`;
    animationHandler(teamLogo);

}

function animationHandler(teamLogo) {
    teamLogo.classList.add("animated", "bounceInDown");
    teamLogo.style.animation = 'none';
    teamLogo.offsetLeft; /* Only used to trigger reflow. */
    teamLogo.style.animation = null;
}

function compareButtonVisibility() {
    const defaultSelect = "---Select Team---";
    var firstSelection = document.getElementById("firstTeamSelect").value;
    var secondSelection = document.getElementById("secondTeamSelect").value;
    if (firstSelection != defaultSelect && secondSelection != defaultSelect && firstSelection != secondSelection) {
        document.getElementById("compareButton").style.visibility = "visible"
    }
    else {
        document.getElementById("compareButton").style.visiblity = "hidden"
    }
}

function hiddenStatistics() {
    document.getElementById("statistics").style.display = "none";
}

function visibleStatistics() {
    document.getElementById("statistics").style.display = "block";
}

function scrollToResults() {
    document.getElementById("statistics").scrollIntoView(true);
}