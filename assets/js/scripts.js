const url = 'https://statsapi.web.nhl.com/api/v1/teams/5/stats'

console.log('fetching...')

fetch(url)
    .then(response => response.json()) 
    .then(function(data){
        return data.stats[0].splits[0];
    })
    .then(function(statistics){
        console.log(statistics)
        document.getElementById("teamname").innerHTML = `Team: ${statistics.team.name}`
        document.getElementById("wins").innerHTML = `Wins: ${statistics.stat.wins}`
            if (statistics.stats.wins > 30) {
                document.getElementById("wins").style.color="green";
            }
        document.getElementById("losses").innerHTML = `Losses: ${statistics.stat.losses}`
    })

        

