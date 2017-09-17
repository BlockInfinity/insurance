        const request = require("request");





        const flightdata = {
            airlinecode: "LH",
            flightnumber: 1051,
            originflightdate: "2017-09-17"
        }

        var options = {
            url: 'https://developer.fraport.de/api/flights/1.0/flightDetails/' + flightdata.airlinecode + '/' + flightdata.flightnumber + '/' + flightdata.originflightdate,
            headers: {
                "Authorization": "Bearer 3c20828255657d0bbbc017650c307b4e",
            }
        };


        // var options = {
        //     url: 'https://developer.fraport.de/api/flights/1.0/flightDetails/LH/1331/2017-09-17',
        //     headers: { Authorization: 'Bearer 62f9b8edbd7636c3f9c5c65c4bccde82' }
        // }


        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                var info = JSON.parse(body);
                console.log(info[0].flight.flightStatus)
                console.log(`here comes the result: ${info}`);
            }
        }

        request(options, callback);