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
    scoreCounter: 0,
    firstTeamName: "",
    secondTeamName: "",
    firstTeam: "",
    secondTeam: "",
    elementId: ["WinLossRatio", "Points", "FaceOffWinPercentage", "SavePercentage", "GoalsPerGame"],
    statisticShorthand: ["winLossRatio", "pts", "faceOffWinPercentage", "savePctg", "goalsPerGame"],
}

const teamDescriptorId = ["firstTeam", "secondTeam"];

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
                teamStatistics.firstTeamName = document.getElementById(`${teamDescriptorId[0]}Select`).value;
                teamStatistics.secondTeamName = document.getElementById(`${teamDescriptorId[1]}Select`).value;
                fetchOptions.teamIdArray.push(getTeamId(data, teamStatistics.firstTeamName));
                fetchOptions.teamIdArray.push(getTeamId(data, teamStatistics.secondTeamName));
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
                teamStat.winLossRatio = teamStat.wins / teamStat.losses;
                teamStat.savePctg = teamStat.savePctg * 100;
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

    let i = 0;
    teamStatistics.elementId.forEach(function (elementId) {
        let statisticValue = Number(teamStat[teamStatistics["statisticShorthand"][i]]).toPrecision(3);
        if (elementId == "Points") {
            statisticValue = parseInt(statisticValue);
        }
        document.getElementById(teamDivSelect + elementId).textContent = statisticValue;
        i = i + 1;
    })

    teamOrder === 0 ? fetchOptions.firstWriteCompletion = true : fetchOptions.secondWriteCompletion = true;
    if (fetchOptions.firstWriteCompletion && fetchOptions.secondWriteCompletion) {
        defaultOptions(fetchOptions);
    }
    highlightWins();
    statisticsToggle("block");
    scrollToResults();
}

function highlightWins() {
    let i = 0;
    // BRACKET NOTATION IS REQUIRED WHEN USING A VARIABLE OBJECT PROPERTY.
    // CHANGE ALL COLOUR REFERENCES TO HEX VALUES.
    teamStatistics.statisticShorthand.forEach(function (statisticName) {
        if (teamStatistics["firstTeam"][statisticName] > teamStatistics["secondTeam"][statisticName]) {
            teamStatistics.scoreCounter = teamStatistics.scoreCounter + 1;
            document.getElementById("firstTeam" + teamStatistics.elementId[i]).style.color = "green";
            document.getElementById("secondTeam" + teamStatistics.elementId[i]).style.color = "red";
        }
        else if (teamStatistics["firstTeam"][statisticName] < teamStatistics["secondTeam"][statisticName]) {
            teamStatistics.scoreCounter = teamStatistics.scoreCounter - 1;
            document.getElementById("firstTeam" + teamStatistics.elementId[i]).style.color = "red";
            document.getElementById("secondTeam" + teamStatistics.elementId[i]).style.color = "green";
        }
        else if (teamStatistics["firstTeam"][statisticName] == teamStatistics["secondTeam"][statisticName]) {
            document.getElementById("firstTeam" + teamStatistics.elementId[i]).style.color = "yellow";
            document.getElementById("secondTeam" + teamStatistics.elementId[i]).style.color = "yellow";
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
    teamDescriptorId.forEach(teamDescriptorId => {
        sortedData.forEach(sortedData => {
            document.getElementById(`${teamDescriptorId}Select`).innerHTML +=
            `<option>${sortedData.name}</option>`
        })
    })
}

function appendStatisticsList() {
    teamStatistics.elementId.forEach(function(elementId){
        teamDescriptorId.forEach(function(descriptorValue){
            console.log(`${descriptorValue}${elementId}`);
            document.getElementById(`${descriptorValue}StatList`).innerHTML += `<li id=${descriptorValue}${elementId}></li>`
        })

    })}

function randomiseSelection() {
    const dropdownOptions = document.getElementById(`${teamDescriptorId[0]}Select`).children;
    let randomOption = Math.floor((Math.random() * (dropdownOptions.length - 1) + 1));
    const secondRandomOption = Math.floor((Math.random() * (dropdownOptions.length - 1) + 1));
    if (randomOption == secondRandomOption) {
        console.log("switcheroo");
        randomOption = Math.floor((Math.random() * (dropdownOptions.length - 1) + 1));
    }
    document.getElementById(`${teamDescriptorId[0]}Select`).value = dropdownOptions[randomOption].value;
    document.getElementById(`${teamDescriptorId[1]}Select`).value = dropdownOptions[secondRandomOption].value;
    $(".dropdownSelector").change()
}

$(".dropdownSelector").change(function () {
    statisticsToggle("none");
    console.log("Change detected.")
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
    if (firstSelection == defaultSelect || secondSelection == defaultSelect || firstSelection == secondSelection) {
        document.getElementById("compareButton").style.visibility = "hidden";
    } else {
        document.getElementById("compareButton").style.visibility = "visible";
    }
}

function statisticsToggle(displayValue) {
    document.getElementById("statistics").style.display = displayValue;
}

function scrollToResults() {
    document.getElementById("statistics").scrollIntoView(true);
    declareWinner();
}

function declareWinner() {
    if (teamStatistics.scoreCounter > 0){
        alert(`${teamStatistics.firstTeamName} win!`);
    }
    else if (teamStatistics.scoreCounter < 0){
        alert(`${teamStatistics.secondTeamName} win!`);
    }
    else if (teamStatistics.scoreCounter == 0){
        alert("It's a draw!"); //Example: Winnipeg Jets vs Boston Bruins.
    }
}

