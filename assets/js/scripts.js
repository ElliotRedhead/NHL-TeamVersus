fetchOptions = {
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
    scoreCounter: "",
    firstTeamName: "",
    secondTeamName: "",
    firstTeam: "",
    secondTeam: "",
    elementId: ["WinLossRatio", "Points", "FaceOffWinPercentage", "SavePercentage", "GoalsPerGame"],
    statisticShorthand: ["winLossRatio", "pts", "faceOffWinPercentage", "savePctg", "goalsPerGame"],
}

const teamDescriptorId = ["firstTeam", "secondTeam"];

/**
 * Fetches data from the NHL API, with different if statements filtering how the data is manipulated and triggers a function to write the statistics to the DOM.
 *
 * @param {Object} fetchOptions Modifies what information is acquired by the fetch function and provides the associated URL.
 */
function dataFetch(fetchOptions) {
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
                manipulateStats(teamStat);
                writeStats(teamOrder, teamStat);
            }
        })
}

/**
 * Takes the team names acquired from the API data and writes the dropdown selector team lists.
 * @param {Object} sortedData Contains the alphabetically sorted team data.
 */
function appendTeamNames(sortedData) {
    teamDescriptorId.forEach(teamDescriptorId => {
        sortedData.forEach(sortedData => {
            document.getElementById(`${teamDescriptorId}Select`).innerHTML +=
                `<option>${sortedData.name}</option>`
        })
    })
}

/** 
 * On selection of a dropdown option this function hides the statistics section to prevent previous results being shown.
 * The affected dropdown number and the selection are passed to other functions.
*/
$(".dropdownSelector").change(function () {
    toggleStatisticsCollapse(true);
    resizeTeamLogo();
    const dropdownOrder = ($(this).attr("id")).replace("TeamSelect", "");
    const teamName = $(this).val();
    compareButtonVisibility();
    getTeamLogo(dropdownOrder, teamName);
})

function getTeamLogo(order, teamName) {
    const shortenedTeamName = teamName.replace(/\s/g, "");
    const teamLogo = document.getElementsByClassName(`${order}TeamLogo`);
    var i;
    for (i=0; i < 2; i++) {
        teamLogo[i].src = `assets/images/teamlogos/${shortenedTeamName}.png`;
    }

    animationHandler(teamLogo[0]);
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

function getTeamId(data, teamName) {
    return (data.teams.find(team => team.name == teamName).id);
}

function optionsEnableStats(fetchOptions) {
    fetchOptions.getId = true;
    dataFetch(fetchOptions);
    toggleStatisticsCollapse(false);
}

function manipulateStats(teamStat) {
    teamStat.winLossRatio = teamStat.wins / teamStat.losses;
    teamStat.savePctg = teamStat.savePctg * 100;
    return teamStat;
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
        highlightWins();
    }

    if (typeof (teamStatistics.scoreCounter) === "number") {
        declareWinner();
        defaultOptions();
    }
}

function statisticsVisibilityToggle(visibilityValue) {
    document.getElementById("statisticsContainer").style.visibility = visibilityValue;
}

function appendStatisticsList() {
    teamStatistics.elementId.forEach(function (elementId) {
        teamDescriptorId.forEach(function (descriptorValue) {
            document.getElementById(`${descriptorValue}StatList`).innerHTML += `<li id=${descriptorValue}${elementId}></li>`
        })

    })
}

function scrollToResults() {
    document.getElementById("statistics").scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
    console.log("SCROLL!");
}

function highlightWins() {
    teamStatistics.scoreCounter = 0;
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

function declareWinner() {
    console.log(teamStatistics.scoreCounter);
    if (teamStatistics.scoreCounter > 0) {
        winnerModal(`${teamStatistics.firstTeamName} win!`);
    }
    else if (teamStatistics.scoreCounter < 0) {
        // alert(`${teamStatistics.secondTeamName} win!`);
        winnerModal(`${teamStatistics.secondTeamName} win!`);
    }
    else if (teamStatistics.scoreCounter == 0) {
        winnerModal("It's a draw!"); //Example: Toronto Maple Leafs vs Pittsburgh Penguins
    }
}

function winnerModal(modalText) {
    Swal.fire({
        title: modalText,
        confirmButtonText: 'View Statistics',
    }).then(function () {
    scrollToResults();
    })
}


function defaultOptions() {
    fetchOptions.statsUrl = "";
    fetchOptions.teamIdArray = [];
    fetchOptions.teamId = "";
    fetchOptions.sortData = false;
    fetchOptions.getId = true;
    fetchOptions.getStatistics = false;
    fetchOptions.handleStatistics = false;
    fetchOptions.firstWriteCompletion = false;
    fetchOptions.secondWriteCompletion = false;
    teamStatistics.scoreCounter = "";
}

function randomiseSelection() {
    const dropdownOptions = document.getElementById(`${teamDescriptorId[0]}Select`).children;
    let randomOption = Math.floor((Math.random() * (dropdownOptions.length - 1) + 1));
    const secondRandomOption = Math.floor((Math.random() * (dropdownOptions.length - 1) + 1));
    if (randomOption == secondRandomOption) {
        randomOption = Math.floor((Math.random() * (dropdownOptions.length - 1) + 1));
    }
    document.getElementById(`${teamDescriptorId[0]}Select`).value = dropdownOptions[randomOption].value;
    document.getElementById(`${teamDescriptorId[1]}Select`).value = dropdownOptions[secondRandomOption].value;
    $(".dropdownSelector").change()
}

function resizeTeamLogo() {
    let targetHeight = $("#teamDescriptor").height();
    $(".statLogo").height(targetHeight);}


function toggleStatisticsCollapse(toggleState) {
    document.getElementById("statisticsContainer").classList.toggle('collapsed', toggleState);
}