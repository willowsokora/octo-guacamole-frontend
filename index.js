const pug = require('pug')
const express = require('express')
const request = require('request')

const app = express()

app.set('view engine', 'pug')
app.set('views', './views')

app.use(express.static('static'))

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/about', (req, res, next) => {
    res.render('about')
})

app.get('/committees', (req, res) => {
    request('https://l83v1lhe72.execute-api.us-east-2.amazonaws.com/dev/committees', { json: true }, (err, response, body) => {
        if (err) {
            return next()
        }
        res.render('committees', { committees: body })
    })
})

app.get('/committees/:committee', (req, res, next) => {
    request(`https://l83v1lhe72.execute-api.us-east-2.amazonaws.com/dev/committees?id=${req.params.committee}`, { json: true }, (err, response, body) => {
        if (err) {
            return next()
        }
        request(`https://l83v1lhe72.execute-api.us-east-2.amazonaws.com/dev/contracts?committee-id=${req.params.committee}`, { json: true }, (err, response, contracts) => {
            body.contracts = contracts.reduce((result, item) => {
                var gross = parseFloat(item.gross_amount)
                var spots = parseInt(item.number_of_spots) || 0
                if (!result['total']) result['total'] = { spots: 0, gross: 0 }
                result['total'].gross += gross
                result['total'].spots += spots
                if (!result[item.buyer_id]) result[item.buyer_id] = { spots: 0, gross: 0 }
                result[item.buyer_id].gross += gross
                result[item.buyer_id].spots += spots
                return result
            }, {})
            request(`https://l83v1lhe72.execute-api.us-east-2.amazonaws.com/dev/buyers?committee-id=${req.params.committee}`, { json: true }, (err, response, buyers) => {
                body.buyers = buyers    
                res.render('committee', body)
            })
        })
    })
});

app.get('/cities', (req, res, next) => {
    next()
});

app.get('/cities/:city', (req, res, next) => {
    next()
})

app.get('/stations', (req, res, next) => {
    request('https://l83v1lhe72.execute-api.us-east-2.amazonaws.com/dev/stations', { json: true }, (err, response, body) => {
        if (err) {
            return next()
        }
        res.render('stations', { stations: body })
    })
})

app.get('/stations/:station', (req, res, next) => {
    request(`https://l83v1lhe72.execute-api.us-east-2.amazonaws.com/dev/stations?id=${req.params.station}`, { json: true }, (err, response, body) => {
        if (err) {
            return next()
        }
        res.render('station', body)
    })
})

app.get('/buyers', (req, res, next) => {
    request('https://l83v1lhe72.execute-api.us-east-2.amazonaws.com/dev/buyers', { json: true }, (err, response, body) => {
        if (err) {
            return next()
        }
        res.render('buyers', { buyers: body })
    })
})

app.get('/buyers/:buyer', (req, res, next) => {
    request(`https://l83v1lhe72.execute-api.us-east-2.amazonaws.com/dev/buyers?id=${req.params.buyer}`, { json: true }, (err, response, body) => {
        if (err) {
            return next()
        }
        request(`https://l83v1lhe72.execute-api.us-east-2.amazonaws.com/dev/contracts?buyer-id=${req.params.buyer}`, { json: true }, (err, response, contracts) => {
            // var gross = 0
            // var spots = 0
            // contracts.forEach((contract) => {
            //     gross += parseFloat(contract.gross_amount)
            //     spots += parseInt(contract.number_of_spots) || 0
            // })
            // body.gross = gross.toFixed(2)
            // body.spots = spots
            body.contracts = contracts.reduce((result, item) => {
                var gross = parseFloat(item.gross_amount)
                var spots = parseInt(item.number_of_spots) || 0
                if (!result['total']) result['total'] = { spots: 0, gross: 0 }
                result['total'].gross += gross
                result['total'].spots += spots
                if (!result[item.committee_id]) result[item.committee_id] = { spots: 0, gross: 0 }
                result[item.committee_id].gross += gross
                result[item.committee_id].spots += spots
                return result
            }, {})
            request(`https://l83v1lhe72.execute-api.us-east-2.amazonaws.com/dev/committees?buyer-id=${req.params.buyer}`, { json: true }, (err, response, committees) => {
                body.committees = committees    
                res.render('buyer', body)
            })
        })
    })
})

// app.get('/contracts', (req, res, next) => {
//     request('https://l83v1lhe72.execute-api.us-east-2.amazonaws.com/dev/contracts', { json: true }, (err, response, body) => {
//         if (err) {
//             return next()
//         }
//         res.render('contracts', { contracts: body })
//     })
// })

// app.get('/contracts/:contract', (req, res, next) => {
//     request(`https://l83v1lhe72.execute-api.us-east-2.amazonaws.com/dev/contracts?id=${req.params.contract}`, { json: true }, (err, response, body) => {
//         if (err) {
//             return next()
//         }
//         res.render('contract', body)
//     })
// })

app.use((req, res) => {
    res.render('404')
});

app.listen(process.env.PORT || 8080)