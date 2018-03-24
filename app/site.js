const express = require('express');
const router = express.Router();
const validator = require('validator');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const request = require("request");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser());
router.use(express.static('public'));


/* PLACEHOLDER DATA */

const userID = 222;
const base_url = "http://localhost:8080/api/";

/* PLACEHOLDER DATA*/

router.get("/", function (req, res) { /* add search by due date functionality */
    let user_data;
    let user_groups;
    let groups_data = [];

    request.get(base_url + '/users/' + userID.toString(10), function(error, response, body) {
        user_data = JSON.parse(body)[0];
        request.get(base_url + '/users/' + userID.toString(10) + '/groups', function(error, response, body) {
            user_groups = JSON.parse(body);
            for (let i = 0; i < user_groups.length; i++) {
                request.get(base_url + '/groups/' + user_groups[i].GroupID.toString(10), function(error, response, body) {
                    let group = JSON.parse(body)[0];
                    groups_data.push({id: group.GroupID, title: group.GroupName, description: group.GroupDescription});
                });
            }
            console.log('groups data', groups_data);
            res.render('index', {name: user_data.UserName, group: groups_data, showGroups : true});
        });
    });


});

module.exports = router;