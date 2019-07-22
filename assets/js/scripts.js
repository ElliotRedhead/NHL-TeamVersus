var firstTeamNumber = 1 //To be changed to variable input based on team selector.
var secondTeamNumber = 2 //To be changed to variable input based on team selector.
var teamUrl1 = 'https://statsapi.web.nhl.com/api/v1/teams/'+firstTeamNumber+'/stats'
var teamUrl2 = 'https://statsapi.web.nhl.com/api/v1/teams/'+secondTeamNumber+'/stats'

console.log('fetching data from NHL API...')

async function dataRequest(teamSpecificUrl) {
    let data = await fetch(teamSpecificUrl)
    .then(response => response.json())
    .then(function(data){
        let teamInfo = (data.stats[0].splits[0].team);
        let statisticsSingleSeason = (data.stats[0].splits[0].stat);
        return teamInfo, statisticsSingleSeason
        });
    };

var a = dataRequest(teamUrl1);
var b = dataRequest(teamUrl2);

console.log(a.teamInfo, a.statisticsSingleSeason);
console.log(b.teamInfo, b.statisticsSingleSeason);