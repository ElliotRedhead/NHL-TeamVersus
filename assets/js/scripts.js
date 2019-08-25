const fetchOptions = {
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

const teamStatistics = {
    firstTeam: "",
    secondTeam: "",
}

function dataFetch(fetchOptions) {
    console.log(fetchOptions.fetchUrl + fetchOptions.teamId + fetchOptions.statsUrl);
    fetch(fetchOptions.fetchUrl + fetchOptions.teamId + fetchOptions.statsUrl)
        .then(res => res.json())
        .then(data => {
            if (fetchOptions.sortData) {
                data = (data.teams.sort((a, b) => (a.name > b.name) ? 1 : -1));
                appendTeamNames(data);
                fetchOptions.sortData = false;
                return data;
            }
            if (fetchOptions.getId) {
                fetchOptions.getId = false;
                let firstTeamName = document.getElementById("firstTeamSelect").value;
                let secondTeamName = document.getElementById("secondTeamSelect").value;
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
                const teamOrder = fetchOptions.teamIdArray.indexOf(data.stats[0].splits[0].team.id);
                const teamStat = data.stats[0].splits[0].stat;
                writeStats(teamOrder, teamStat);
            }

        })
}

function writeStats(teamOrder, teamStat) {
    if (teamOrder == 0) {
        teamDivSelect = "firstTeam";
        teamStatistics.firstTeam = teamStat;
    }
    if (teamOrder == 1) {
        teamDivSelect = "secondTeam";
        teamStatistics.secondTeam = teamStat;
    };
    // USE BRACKET NOTATION HERE TO ENFORCE "DRY"!
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
    highlightWins()
    scrollToResults()
}

function highlightWins() {
    const positiveStatistic = ["wins", "pts", "faceOffWinPercentage", "savePctg", "goalsPerGame"];
    const positiveElementId = ["Wins", "Points", "FaceOffWinPercentage", "SavePercentage", "GoalsPerGame"];
    let i = 0;
    // BRACKET NOTATION IS REQUIRED WHEN USING A VARIABLE OBJECT PROPERTY.
    // THE ATTEMPTED METHOD BELOW SHOULD BE APPLIED TO THE WRITESTATS FUNCTION ONCE ACCOMPLISHED TO REFACTOR.
    // CHANGE ALL COLOUR REFERENCES TO HEX VALUES.
    positiveStatistic.forEach(function (positiveStatistic) {
        if (teamStatistics["firstTeam"][positiveStatistic] > teamStatistics["secondTeam"][positiveStatistic]) {
            document.getElementById("firstTeam" + positiveElementId[i]).style.color = "green";
            document.getElementById("secondTeam" + positiveElementId[i]).style.color = "red";
        }
        else if (teamStatistics["firstTeam"][positiveStatistic] < teamStatistics["secondTeam"][positiveStatistic]) {
            document.getElementById("firstTeam" + positiveElementId[i]).style.color = "red";
            document.getElementById("secondTeam" + positiveElementId[i]).style.color = "green";
        }
        else if (teamStatistics["firstTeam"][positiveStatistic] == teamStatistics["secondTeam"][positiveStatistic]) {
            document.getElementById("firstTeam" + positiveElementId[i]).style.color = "yellow";
            document.getElementById("secondTeam" + positiveElementId[i]).style.color = "yellow";
        }
        i = i + 1;

    })
}


function getTeamId(data, teamName) {
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
    const teamSelectorId = ["firstTeamSelect", "secondTeamSelect"];
    teamSelectorId.forEach(teamSelectorId => {
        sortedData.forEach(sortedData => {
            document.getElementById(teamSelectorId).innerHTML +=
                `<option>${sortedData.name}</option>`
        })
    })
}

$(".dropdownSelector").change(function () {
    hiddenStatistics();
    const dropdownOrder = ($(this).attr("id")).replace("TeamSelect", "");
    const teamName = $(this).val();
    compareButtonVisibility();

    getTeamLogo(dropdownOrder, teamName);
})

function getTeamLogo(order, teamName) {
    const shortenedTeamName = teamName.replace(/\s/g, "");
    const teamLogo = document.getElementById(`${order}TeamLogo`);
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
    const firstSelection = document.getElementById("firstTeamSelect").value;
    const secondSelection = document.getElementById("secondTeamSelect").value;
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