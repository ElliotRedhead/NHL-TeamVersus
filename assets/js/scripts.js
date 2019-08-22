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
            console.log(data);
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
    scrollToResults()
}

function highlightWins() {

    //IS THERE A WAY TO MAKE VARIABLE NAMES FROM AN ARRAY OF STRINGS?
    //const requiredStatisticValues = ["winValues", "lossValues", "pointsValues", "faceOffWinPercentageValues", "savePctgValues", "goalsPerGameValues"];
    const requiredStatistics = ["Wins","Losses","Points","FaceOffWinPercentage","SavePercentage","GoalsPerGame"]
    // requiredVariableNames.forEach(function(element){
    //     var element = [];
    // })
    var winValues = [];
    var lossValues = [];
    var pointsValues = [];
    var faceOffWinPercentageValues = [];
    var savePctgValues = [];
    var goalsPerGameValues = [];
// CAN I USE A DICTIONARY SYSTEM HERE?
    var firstStatDict = [];
    requiredStatistics.forEach(function(requiredStat) {
        firstStatDict.push({
        statName: requiredStat, statValue: document.getElementById(`firstTeam${requiredStat}`).textContent})
    })
    console.log(firstStatDict);
    var secondStatDict = [];
    requiredStatistics.forEach(function(requiredStat) {
        secondStatDict.push({
        statName: requiredStat, statValue: document.getElementById(`secondTeam${requiredStat}`).textContent})
    })
    console.log(secondStatDict);


    // winValues.push(document.getElementById("firstTeamWins").textContent,document.getElementById("secondTeamWins").textContent);
    // lossValues.push(document.getElementById("firstTeamLosses").textContent,document.getElementById("secondTeamLosses").textContent);
    // console.log(winValues, lossValues);
    // console.log(Math.max((document.getElementById("firstTeamWins").textContent),(document.getElementById("secondTeamWins").textContent)));

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
    var teamLogo = document.getElementById(`${order}TeamLogo`);
    teamLogo.src = `assets/images/teamlogos/${shortenedTeamName}.png`;
    animationHandler(teamLogo);

}

function animationHandler(teamLogo){
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


function visibleStatistics() {
    document.getElementById("statistics").style.display = "block";
}

function scrollToResults(){
    document.getElementById("statistics").scrollIntoView(true);
}