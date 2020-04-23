const pug = require('pug')
const express = require('express')

const app = express()

let campaigns = [
    {
        name: 'Connor\'s Campaign',
        total: 500,
        id: 'a5a767c5-b678-4611-a4bb-0ee2f185ee38'
    },
    {
        name: 'Jasmine\'s Campaign',
        total: 300,
        id: '003b18e3-bdaf-4fe8-8174-52b44eec24be'
    },
    {
        name: 'Jonah\'s Campaign',
        total: 1000,
        id: 'eb7ecaa8-5add-44c2-83a0-bf7865ab49f5'
    }
]

app.set('view engine', 'pug')
app.set('views', './views')

app.use(express.static('static'))

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/campaigns', (req, res) => {
    res.render('campaigns', { campaigns: campaigns })
})

app.get('/campaign/:campaign', (req, res, next) => {
    for (campaign in campaigns) {
        if (campaigns[campaign].id == req.params.campaign) {
            return res.render('campaign', campaigns[campaign])
        }
    }
    next()
});

app.get('/cities', (req, res, next) => {
    next()
});

app.get('/cities/:city', (req, res, next) => {
    next()
})

app.get('/buyers/:buyer', (req, res, next) => {
    next()
});

app.get('/contracts/:contract', (req, res, next) => {
    next()
});

app.get('/about', (req, res, next) => {
    res.render('about')
})

app.use((req, res) => {
    res.render('404')
});

app.listen(process.env.PORT || 8080)