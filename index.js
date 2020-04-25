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
        for (var i = 0; i < body.length; i++) {
            body[i].election_date = new Date(body[i].election_date).toLocaleDateString('en-US')
        }
        res.render('committees', { committees: body })
    })
})

app.get('/committees/:committee', (req, res, next) => {
    request(`https://l83v1lhe72.execute-api.us-east-2.amazonaws.com/dev/committees?id=${req.params.committee}`, { json: true }, (err, response, body) => {
        if (err) {
            return next()
        }
        res.render('committee', body)
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
        res.render('buyer', body)
    })
})

app.get('/contracts', (req, res, next) => {
    request('https://l83v1lhe72.execute-api.us-east-2.amazonaws.com/dev/contracts', { json: true }, (err, response, body) => {
        if (err) {
            return next()
        }
        res.render('contracts', { contracts: body })
    })
})

app.get('/contracts/:contract', (req, res, next) => {
    request(`https://l83v1lhe72.execute-api.us-east-2.amazonaws.com/dev/contracts?id=${req.params.contract}`, { json: true }, (err, response, body) => {
        if (err) {
            return next()
        }
        res.render('contract', body)
    })
})

app.use((req, res) => {
    res.render('404')
});

app.listen(process.env.PORT || 8080)