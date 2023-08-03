
let IPAPIKey = '974931d7e1mshf4ff7c164ce0734p13e74cjsn7fbb18de9321'

//fetch user IP
// fetch('https://api.techniknews.net/ip/')
//     .then(function (response) {
//         return response.text();
//     })
//     .then(function (data) {
//         ip = data;
//         console.log(ip);
//         getZipfromIp(ip);
//     })
//     .catch(function (er) { })

//function fetches user's zip using IP and API 'Geolocation by IP address'
// function getZipfromIp(ip) {
//     fetch('https://api.techniknews.net/ipgeo/' + ip)
//         .then(function (response) {
//             return response.json();
//         })
//         .then(function (data) {
//             zip = data.zip;
//             console.log(zip);
//             getHardinessfromzip(zip);
//         })
// }


//function fetches user's hardiness using zip and API ' Plant Hardiness Zone'
function getHardinessfromzip(zip) {

    fetch('https://plant-hardiness-zone.p.rapidapi.com/zipcodes/' + zip + '?rapidapi-key=' + IPAPIKey)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let hardinessEl = $('.hardiness')
            hardinessEl.text(data.hardiness_zone);
        })
  }