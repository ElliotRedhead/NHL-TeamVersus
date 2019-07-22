// var firstTeamNumber = 1 //To be changed to variable input based on team selector.
// var secondTeamNumber = 2 //To be changed to variable input based on team selector.
// var teamUrl1 = 'https://statsapi.web.nhl.com/api/v1/teams/'+firstTeamNumber+'/stats'
// var teamUrl2 = 'https://statsapi.web.nhl.com/api/v1/teams/'+secondTeamNumber+'/stats'
// var teamInfo;
// var statisticsSingleSeason;

// console.log('fetching data from NHL API...')

// async function dataRequest(teamSpecificUrl) {
//     let data = await fetch(teamSpecificUrl)
//     .then(response => response.json())
//     .then(function(data){
//         var teamInfo = (data.stats[0].splits[0].team);
//         var statisticsSingleSeason = (data.stats[0].splits[0].stat);
//         return teamInfo, statisticsSingleSeason;
//         }
//         );
//     };


// dataRequest(teamUrl1);
// console.log(teamInfo, statisticsSingleSeason);

// dataRequest(teamUrl2);
// console.log(teamInfo, statisticsSingleSeason);

const url = 'https://statsapi.web.nhl.com/api/v1/teams/';

function dataRequest(nhlUrl, teamNumber) {
  fetch(nhlUrl + teamNumber + '/stats')
    .then(res => res.json())
    .then(data => {
        printData(data);
    });
}


function printData(dataset) {
    const statistics = dataset.stats[0].splits[0].stat;
    const wins = statistics.wins;
    console.log(wins);
}

dataRequest(url, 1);
dataRequest(url, 2);