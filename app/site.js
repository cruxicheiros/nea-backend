const express = require('express');
const router = express.Router();
const validator = require('validator');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const request_promise = require("request-promise");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser());
router.use(express.static('public'));


/* PLACEHOLDER DATA */

const baseUrl = "http://localhost:8080/api/";

/* PLACEHOLDER DATA*/

const apiConnector = {
    token: null,

    getGroup: function(groupID) {
        return request_promise({
            method: "GET",
            uri: baseUrl + '/groups/' + groupID.toString(10),
            qs: {
                /*access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx'*/
            },
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        });
    },

    getUser: function(userID) {
        return request_promise({
            method: "GET",
            uri: baseUrl + '/users/' + userID.toString(10),
            qs: {
                /*access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx'*/
            },
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        });
    },

    getUserGroups: function(userID) {
        let promise = new Promise(function (resolve, reject) {
            let user_group_ids = [];

            let groups_data = request_promise({
                method: "GET",
                uri: baseUrl + '/users/' + userID.toString(10) + '/groups/',
                qs: {
                    /*access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx'*/
                },
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                json: true // Automatically parses the JSON string in the response

            }).then(function (response) {
                for (let i = 0; i < response.length; i++) {
                    user_group_ids.push(response[i].GroupID);
                }

                resolve(user_group_ids);
            })
        });

        return promise;
    }
};

const dataConverter = {
    convertGroup : function (group) {  // converts group data from DB to usable-by-frontend
        let groupData = group[0];

        return {
            id: groupData.GroupID,
            title: groupData.GroupName,
            description: groupData.GroupDescription
        }
    },

    convertUser : function (user) {
        let userData = user[0];

        return {
            id: userData.UserID,
            birthday: userData.Birthday,
            email: userData.email,
            gender: userData.Gender,
            name: userData.UserName,
            role: userData.RoleID,
        }


    }

}

router.get("/", function (req, res) {
    let userData = apiConnector.getUser(222);
    let userGroupIDs = apiConnector.getUserGroups(222);
    let userGroupData =  new Promise(function (resolve) {
        let groupList = [];
        userGroupIDs.then(function (groupIDs) {
            for (let i = 0; i < groupIDs.length; i++) {
                apiConnector.getGroup(groupIDs[i]).then(
                    function (group) {
                        groupList.push(dataConverter.convertGroup(group));

                        if (groupList.length === groupIDs.length) {
                            resolve(groupList);
                        }
                    }
                )

            }

        });
    });

    Promise.all([userData, userGroupData]).then(function (values) {
        let user = dataConverter.convertUser(values[0]);
        res.render('index', {baseURL : baseUrl, name: user.name, group: values[1], showGroups : true});
    });

});

router.get("/groups/:group_id/", function (req, res) {

});


module.exports = router;