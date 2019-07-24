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