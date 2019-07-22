var firstTeamNumber = 1
var secondTeamNumber = 2
var url1 = 'https://statsapi.web.nhl.com/api/v1/teams/'+firstTeamNumber+'/stats'
var url2 = 'https://statsapi.web.nhl.com/api/v1/teams/'+secondTeamNumber+'/stats'

console.log('fetching...')

fetch(url1)
    .then(response => response.json()) 
    .then(function(data){
        return data.stats[0].splits[0];
    })
    .then(function(statistics1){
        console.log(statistics1)
        document.getElementById("firstteamname").innerHTML = `Team: ${statistics1.team.name}`
        document.getElementById("firstwins").innerHTML = `Wins: ${statistics1.stat.wins}`
        if (statistics1.stat.wins > statistics2.stat.wins) {
            document.getElementById("firstwins").style.color="green";
        }
        document.getElementById("firstlosses").innerHTML = `Losses: ${statistics1.stat.losses}`
        return(statistics1)
    }
    )


fetch(url2)
    .then(response => response.json()) 
    .then(function(data){
        return data.stats[0].splits[0];
    })
    .then(function(statistics2){
        console.log(statistics2)
        document.getElementById("secondteamname").innerHTML = `Team: ${statistics2.team.name}`
        document.getElementById("secondwins").innerHTML = `Wins: ${statistics2.stat.wins}`
        if (statistics2.stat.wins > statistics1.stat.wins) {
            document.getElementById("secondwins").style.color="green";
        }
        document.getElementById("secondlosses").innerHTML = `Losses: ${statistics2.stat.losses}`
        return (statistics2)
    }
    )
        

