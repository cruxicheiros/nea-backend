const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const validator = require('validator');
const dbConnector = require('./dbConnector.js');
const exphbs  = require('express-handlebars');


let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

/* REST API */

app.get("api/assignments/", function (req, res) { /* add search by due date functionality */
    let valid_params = ['name'];
    let filter_params = {};

    for (let i = 0; i < valid_params.length; i++) {
        if (req.query[valid_params[i]] !== undefined) {
            filter_params[valid_params[i]] = req.query[valid_params[i]];
        }
    }

    dbConnector.searchAssignments(filter_params)
        .then(function (results) {
            res.send(results);
            console.log('results', results);
        });
});

app.get("api/assignments/:assignment_id", function (req, res) {
    if (validator.isInt(req.params['assignment_id'])) {
        dbConnector.searchAssignments({'assignment_id': req.params.assignment_id})
            .then(function (results) {
                res.send(results);
                console.log('results', results);
            });

    } else {
        res.send([]);
    }
});

app.get("api/assignments/:assignment_id/submissions", function (req, res) {
    if (validator.isInt(req.params['assignment_id'])) {
        dbConnector.findAssignmentSubmissions(req.params['assignment_id'], 0, 5)
            .then(function (results) {
                res.send(results);
                console.log('results', results);
            });

    } else {
        res.send([]);
    }
});


app.get("api/users/", function (req, res) {
    let valid_params = ['name', 'role_id', 'birthday', 'gender', 'email'];
    let filter_params = {};

    for (let i = 0; i < valid_params.length; i++) {
        if (req.query[valid_params[i]] !== undefined) {
            filter_params[valid_params[i]] = req.query[valid_params[i]];
        }
    }

    dbConnector.searchUsers(filter_params)
        .then(function (results) {
            res.send(results);
            console.log('results', results);
        });
});

app.get("api/users/:user_id", function (req, res) {
    if (validator.isInt(req.params['user_id'])) {
        dbConnector.searchUsers({'user_id': req.params.user_id})
            .then(function (results) {
                res.send(results);
                console.log('results', results);
            });

    } else {
        res.send([]);
    }
});

app.get("api/users/:user_id/groups", function (req, res) {
    if (validator.isInt(req.params['user_id'])) {
        dbConnector.findUserGroups(req.params['user_id'], 0, 5)
            .then(function (results) {
                res.send(results);
                console.log('results', results);
            });

    } else {
        res.send([]);
    }
});

app.get("api/users/:user_id/submissions", function (req, res) {
    if (validator.isInt(req.params['user_id'])) {
        dbConnector.findUserSubmissions(req.params['user_id'], 0, 5)
            .then(function (results) {
                res.send(results);
                console.log('results', results);
            });

    } else {
        res.send([]);
    }
});

app.get("api/groups/", function (req, res) {
    let valid_params = ['name'];
    let filter_params = {};

    for (let i = 0; i < valid_params.length; i++) {
        if (req.query[valid_params[i]] !== undefined) {
            filter_params[valid_params[i]] = req.query[valid_params[i]];
        }
    }

    dbConnector.searchGroups(filter_params)
        .then(function (results) {
            res.send(results);
            console.log('results', results);
        });
});

app.get("api/groups/:group_id", function (req, res) {
    if (validator.isInt(req.params['group_id'])) {
        dbConnector.searchGroups({'group_id': req.params.group_id})
            .then(function (results) {
                res.send(results);
                console.log('results', results);
            });

    } else {
        res.send([]);
    }
});

app.get("api/groups/:group_id/users", function (req, res) {
    if (validator.isInt(req.params['group_id'])) {
        dbConnector.findGroupUsers(req.params['group_id'], 0, 5)
            .then(function (results) {
                res.send(results);
                console.log('results', results);
            });

    } else {
        res.send([]);
    }
});

app.get("api/groups/:group_id/users", function (req, res) {
    if (validator.isInt(req.params['group_id'])) {
        dbConnector.findGroupUsers(req.params['group_id'], 0, 5)
            .then(function (results) {
                res.send(results);
                console.log('results', results);
            });

    } else {
        res.send([]);
    }
});

app.get("api/groups/:group_id/assignments", function (req, res) {
    if (validator.isInt(req.params['group_id'])) {
        dbConnector.findGroupAssignments(req.params['group_id'], 0, 5)
            .then(function (results) {
                res.send(results);
                console.log('results', results);
            });

    } else {
        res.send([]);
    }
});




app.listen(8080);