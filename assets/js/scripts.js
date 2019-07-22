var firstTeamNumber = 1 //To be changed to variable input based on team selector.
var secondTeamNumber = 2 //To be changed to variable input based on team selector.
var teamUrl1 = 'https://statsapi.web.nhl.com/api/v1/teams/'+firstTeamNumber+'/stats'
var teamUrl2 = 'https://statsapi.web.nhl.com/api/v1/teams/'+secondTeamNumber+'/stats'


console.log('fetching...')


function dataRequest(teamSpecificUrl) {
    fetch(teamSpecificUrl)
    .then(response => response.json())
    .then(function(data){
        teamInfo = (data.stats[0].splits[0].team);
        statisticsSingleSeason = (data.stats[0].splits[0].stat);
        console.log(`${teamInfo.name}`);
        console.log(`${statisticsSingleSeason.wins} wins`)
        }
        )
}

dataRequest(teamUrl1);
dataRequest(teamUrl2);