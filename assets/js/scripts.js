// The default parameters related to the fetching and handling of the NHL API data.
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

// The default parameters used for the handling of the teams' statistics.
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

const statisticsSection = document.getElementById("statisticsContainer");

// jQuery triggers the initial functions when the page has loaded.
$(document).ready(function() {
    dataFetch(fetchOptions);
    sectionCollapse(statisticsSection);
    appendStatisticsList();
    initialiseTooltips();
});

function welcomeModal() {
    Swal.fire({
        title: "Welcome to NHL showdown 2018-2019!",
        html:"Select two teams to compare from the dropdowns or click the shuffle button to have two teams randomly selected!<br>Click 'Compare!' to see who wins with a comparison of the teams' statistics!",
      })}

/**
 * Fetches data from the NHL API, with different if statements filtering how the data is manipulated and triggers a function to write the statistics to the DOM.
 *
 * @param {Object} fetchOptions Modifies what information is acquired by the fetch function and provides the associated URL.
 */
function dataFetch(fetchOptions) {
    fetch(fetchOptions.fetchUrl + fetchOptions.teamId + fetchOptions.statsUrl + "?season=20182019")
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
    let statisticsSection = document.getElementById("statisticsContainer");
    sectionCollapse(statisticsSection);
    resizeTeamLogo();
    const dropdownOrder = ($(this).attr("id")).replace("TeamSelect", "");
    const teamName = $(this).val();
    compareButtonVisibility();
    getTeamLogo(dropdownOrder, teamName);
})

/**
 * Displays the corresponding team logo to the selected team, calling the animation upon display.
 * @param {String} order The identifier used to determine which dropdown selector value to use.
 * @param {String} teamName The name of the selected team.
 */
function getTeamLogo(order, teamName) {
    const shortenedTeamName = teamName.replace(/\s/g, "");
    const teamLogo = document.getElementsByClassName(`${order}TeamLogo`);
    var i;
    for (i = 0; i < 2; i++) {
        teamLogo[i].src = `assets/images/teamlogos/${shortenedTeamName}.png`;
        teamLogo[i].setAttribute("aria-label", `${teamName} team logo.`)
    }

    animationHandler(teamLogo[0]);
}
/**
 * Adds an animation to the team logo images.
 * @param {Object} teamLogo The HTML image item displaying the team logo.
 */
function animationHandler(teamLogo) {
    teamLogo.classList.add("animated", "bounceInDown");
    teamLogo.style.animation = 'none';
    teamLogo.offsetLeft; /* Only used to trigger reflow. */
    teamLogo.style.animation = null;
}

/**
 * Determines if the compare button is displayed.
 * The button only displays if both selectors aren't equal to each other or equal to the default value.
 */
function compareButtonVisibility() {
    const defaultSelect = "Select Team";
    const firstSelection = document.getElementById("firstTeamSelect").value;
    const secondSelection = document.getElementById("secondTeamSelect").value;
    if (firstSelection == defaultSelect || secondSelection == defaultSelect || firstSelection == secondSelection) {
        document.getElementById("compareButton").style.visibility = "hidden";
    } else {
        document.getElementById("compareButton").style.visibility = "visible";
    }
}

/**
 * Determines the id of the selected team from the API data.
 * @param {Object} data The basic team data for all NHL teams.
 * @param {String} teamName The name of the selected team from the dropdown selector.
 */
function getTeamId(data, teamName) {
    return (data.teams.find(team => team.name == teamName).id);
}


$("#compareButton").click(function(){
    optionsEnableStats(fetchOptions);
})

/**
 * Triggers the statistics fetch and displays the statistics section.
 * @param {Object} fetchOptions The arguments used when fetching data to determine the function flow.
 */
function optionsEnableStats(fetchOptions) {
    dataFetch(fetchOptions);
    sectionExpand(sectionCollapse);
}

/**
 * Manipulates the statistics of a team into representative figures.
 * @param {Object} teamStat The available API current-season statistics for the selected team.
 */
function manipulateStats(teamStat) {
    teamStat.winLossRatio = teamStat.wins / teamStat.losses;
    teamStat.savePctg = teamStat.savePctg * 100;
    return teamStat;
}

/**
 * Writes the statistics to the DOM, setting the precision of statistic values.
 * @param {String} teamOrder The identifier used to determine which dropdown selector value to use.
 * @param {Object} teamStat The available API current-season statistics for the selected team.
 */
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

/**
 * Appends the team order descriptor i.e. "first", "second" and the statistic descriptor i.e. "WinLossRatio" to the HTML.
 */
function appendStatisticsList() {
    teamStatistics.elementId.forEach(function (elementId) {
        teamDescriptorId.forEach(function (descriptorValue) {
            document.getElementById(`${descriptorValue}StatList`).innerHTML += `<li id=${descriptorValue}${elementId}></li>`
        })

    })
}

/**
 * Scrolls to the results section of the page.
 */
function scrollToResults() {
    window.scrollTo({top: 900,behavior: 'smooth'})}

/**
 * Calculates whether the first or second team attributes are greater, highlighting the winning statistic.
 * Determines which team wins based on the number of winning attributes.
 */
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

/**
 * Calculates which team has won based on the polarity of the score counter.
 */
function declareWinner() {
    if (teamStatistics.scoreCounter > 0) {
        winnerModal(`${teamStatistics.firstTeamName} win!`);
    }
    else if (teamStatistics.scoreCounter < 0) {
        winnerModal(`${teamStatistics.secondTeamName} win!`);
    }
    else if (teamStatistics.scoreCounter == 0) {
        winnerModal("It's a draw!"); //Example: Toronto Maple Leafs vs Pittsburgh Penguins
    }
}

/**
 * Displays an alert to the user detailing which team has won or if there is a draw.
 * @param {String} modalText The text displayed as a message to the user in a modal alert.
 */
function winnerModal(modalText) {
    Swal.fire({
        title: modalText,
        confirmButtonText: 'View Statistics',
    }).then(function () { 
        scrollToResults();
     })
}

/**
 * Triggers upon clicking "Play Again" at the bottom of the page.
 * Resets the fetch options used to their default values.
 */


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
};


$("#randomButton").click(function() {
    randomiseSelection();
});

/**
 * Randomises the dropdown-selected values, ensuring they are not equal to one another.
 */
function randomiseSelection() {
    const dropdownOptions = document.getElementById(`${teamDescriptorId[0]}Select`).children;
    let firstRandomOption = Math.floor((Math.random() * (dropdownOptions.length - 1) + 1));
    let secondRandomOption = Math.floor((Math.random() * (dropdownOptions.length - 1) + 1));
    if (firstRandomOption == secondRandomOption) {
        firstRandomOption = Math.floor((Math.random() * (dropdownOptions.length - 1) + 1));
    }
    document.getElementById(`${teamDescriptorId[0]}Select`).value = dropdownOptions[firstRandomOption].value;
    document.getElementById(`${teamDescriptorId[1]}Select`).value = dropdownOptions[secondRandomOption].value;
    $(".dropdownSelector").change()
};

/**
 * Sets the team logos shown in the statistic section to a height equal to the descriptors for uniformity.
 */
function resizeTeamLogo() {
    let targetHeight = $("#teamDescriptor").height();
    $(".statLogo").height(targetHeight);
}

/**
 * Collapses the statistics section to effectively hide when not suitable to be shown i.e. statistics not yet fetched, team selections changed.
 */
function sectionCollapse(){
        requestAnimationFrame(function() {
            statisticsSection.style.height = 0 + 'px';
        });
      };

/**
 * Expands the statistics section to reveal the statistics data provided for both of the selected teams.
 */
function sectionExpand(){
    let sectionHeight = statisticsSection.scrollHeight;
    let elementTransition = statisticsSection.style.transition;
    requestAnimationFrame(function() {
        statisticsSection.style.height = sectionHeight + 'px';
        statisticsSection.style.transition = elementTransition;
    })}

$( "#resetButton" ).click(function () {
    resetPage();});
/**
 * Resets the fetch parameters, selected dropdown values and team logos to default.
 * Collapses the statistics section and scrolls to the top of the page.
 */
function resetPage() {
    defaultDropdownValue = "Select Team";
    ($(".dropdownSelector").each(function () {
        ($(this).val(defaultDropdownValue));
    }))
    defaultOptions();
    let order = ["first","second"];
    order.forEach(order => {
        getTeamLogo(order, defaultDropdownValue);
    })
    sectionCollapse(statisticsSection);
    compareButtonVisibility();
    window.scrollTo(0,0);
}

/**
 * Required function to use the statistic descriptor tooltips.
 */
function initialiseTooltips () {
    $('[data-toggle="tooltip"]').tooltip()
  }