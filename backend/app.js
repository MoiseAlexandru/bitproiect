
const { Client } = require('@elastic/elasticsearch');
const express = require('express');
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-Width, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

const client = new Client({
  node: "http://localhost:9200"
});

/*
client.ping(
  { requestTimeout: 30000 },
  function(error) {
    if(error) {
      console.error("Elasticsearch cluster is down!");
      //console.log(error);
    }
    else {
      console.log("Everything is ok");
    }
  }
);
*/

client.ping({}, {requestTimeout: 30000}, (err, response) => {
  if(err) {
    console.error("Elasticsearch cluster is down!");
  }
  else {
    console.log("Everything is ok");
  }
})

// Aici adaug o logare a unui user existent
app.put('/api/users/create', (req, res, next) => {
  client.indices.create(
    {
      index: 'index-pentru-proiect-intro'
    },
    function(error, response, status) {
      if(error) {
        //console.log(error);
      }
      else {
        //console.log("Created the index.", response);
      }
    }
  );
  client.index(
    {
      index: 'index-pentru-proiect-intro',
      body: {
        username: req.body.username,
        loginStatus: true,
        loginStart: Date.now(),
        timeSpent: 0
      },
    },
  )
  .catch(err => {
    console.log(err);
  })

  res.status(201).json({
    message: "User added successfully!"
  });

});

// Aici vad iau informatiile despre un utilizator
app.get('/api/users/search/:username', (req, res, next) => {
  client
    .search({
      index: 'index-pentru-proiect-intro',
      body: {
        size: 5000,
        query: {
          match: {
            username: req.params.username
          }
        }
      }
    })
    .then(response => {
      if(response.body.hits.hits.length > 0) {
        res.status(200).json({
          data: response.body.hits.hits,
          found: true
        })
      }
      else {
        res.status(200).json({
          data: null,
          found: false
        })
      }
    })
    .catch((err) => {
      if(err) {
        console.log(err);
        res.status(404);
      }
    })
});

// De aici iau toate logarile unui utilizator
app.get('/api/users/get/:username', (req, res, next) => {
  client
    .search({index: req.body.username})
    .then((results) => {
      // sa trimit rezultatele
    })
});

// Aici gasesc documentul in care utilizatorul e logat si returnez id-ul
app.get('/api/users/findlogged/:username', (req, res, next) => {
  client
    .search({
      index: 'index-pentru-proiect-intro',
      body: {
        size: 5000,
        query: {
          bool: {
            must: [
              {
                match: {
                  username: req.params.username
                }
              },
              {
                match: {
                  loginStatus: true
                }
              }
            ]
          }
        }
      }
    })
    .then((results) => {
      if(results.body.hits.hits[0]) {
        res.status(200).json({
          id: results.body.hits.hits[0]._id,
          found: true
        });
      }
      else {
        res.status(200).json({
          id: 0,
          loginStart: 0,
          found: false
        })
      }
    })
    // e posibil ca utilizatorul sa nu fi fost logat
    .catch((err) => {
      console.log(err);
      res.status(200).json({
        id: 0,
        loginStart: 0,
        found: false
      })
    })
})

// Aici deloghez utilizatorul
app.get('/api/users/logout/:id', (req, res, next) => {
  client
    .update({
      index: 'index-pentru-proiect-intro',
      id: req.params.id,
      body: {
        doc: {
          loginStatus: false,
          loginEnd: Date.now()
        }
      }
    })
    .catch(err => {
      console.log("eroare: ", err);
    })
})

app.post('/api/users/delete', (req, res, next) => {
  client
    .deleteByQuery({
      index: 'index-pentru-proiect-intro',
      body: {
        query: {
          match: {
            username: req.body.username
          }
        }
      }
    })
    .then(results => {
      res.status(200).json({
        message: "User deleted!"
      })
    })
    .catch(err => {
      console.log(err);
      res.status(404).json({
        message: "failed to delete user!"
      });
    })
})

app.get('/api/users/getlist', (req, res, next) => {
  let listOfUsers = [];
  client
    .search({index: 'index-pentru-proiect-intro', size: 5000})
    .then(results => {
      listOfUsers = results.body.hits.hits;
      res.status(200).json({
        users: listOfUsers
      })
    })
})

app.get('/api/users/erase', (req, res, next) => {
  client.indices.delete({
    index: '_all'
  },
  function(err, res) {
    if(err) {
      console.error(err.message);
    }
    else {
      console.log("Indexes have been deleted");
    }
  })
})

module.exports = app;
