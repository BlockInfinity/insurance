        const request = require("request");


        const flightdata = {
            airlinecode: "LH",
            flightnumber: 157,
            originflightdate: "2017-09-18"
        }

        var options = {
            url: 'https://developer.fraport.de/api/flights/1.0/flightDetails/' + flightdata.airlinecode + '/' + flightdata.flightnumber + '/' + flightdata.originflightdate,
            headers: {
                "Authorization": "Bearer fe9d187704da223dc1c8762447a858de",
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
                console.log(`here comes the result: ${body}`);
            }
        }

        request(options, callback);