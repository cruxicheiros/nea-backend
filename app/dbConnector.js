const mysql2 = require('mysql2');
const validator = require('validator');

const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'nea'
});

let genAssignmentsSearchFilter = function(params) {
    let params_keys = Object.keys(params);
    let filter_parts = [];
    let search_data = [];

    for (i = 0; i < params_keys.length; i++) {
        if (params_keys[i] === 'assignment_id') {
            if (validator.isInt(params['assignment_id'])) {
                filter_parts.push('Assignment.AssignmentID = ?');
                search_data.push(params['assignment_id']);
            }

        } else if (params_keys[i] === 'name') {
            if (validator.isLength(params['name'], {min: 1, max: 70})) {
                filter_parts.push('Assignment.AssignmentName = ?');
                search_data.push(params['name']);
            }

        }
    }

    let query = 'select AssignmentID, GroupID, AssignmentName, AssignmentDescription, DueDate, AssignmentFilePath from Assignment';

    if (filter_parts.length > 0) {
        query += ' where ' + filter_parts.join(' and ');
    }

    console.log({
        'query' : query,
        'data': search_data
    });

    return({
        'query' : query,
        'data': search_data
    });
};

let searchAssignments = function (params) {
    let filter = genAssignmentsSearchFilter(params);
    return new Promise(function (resolve, reject) {
        connection.execute(
            filter.query,
            filter.data,
            function (err, results) {
                console.log(filter.query, filter.data);
                resolve(results);
            }
        );
    });
};

let genUsersSearchFilter = function (params) {
    let params_keys = Object.keys(params);
    console.log(params_keys);
    console.log(params);

    let filter_parts = [];
    let search_data = [];

    for (i = 0; i < params_keys.length; i++) {
        if (params_keys[i] === 'user_id') {
            if (validator.isInt(params['user_id'])) {
                filter_parts.push('User.UserID = ?');
                search_data.push(params['user_id']);
            }

        } else if (params_keys[i] === 'name') {
            if (validator.isLength(params['name'], {min: 1, max: 70})) {
                filter_parts.push('User.UserName = ?');
                search_data.push(params['name']);
            }

        } else if (params_keys[i] === 'role_id') {
            if (validator.isInt(params['role_id'])) {
                filter_parts.push('User.RoleID = ?');
                search_data.push(params['role_id']);
            }

        } else if (params_keys[i] === 'birthday') {
            if (validator.toDate(params['birthday']) !== null) {
                filter_parts.push('User.Birthday = ?');
                search_data.push(params['birthday']);
            }

        } else if (params_keys[i] === 'gender') {
            if (['F', 'M', '-'].includes(params['gender'])) {
                filter_parts.push('User.Gender = ?');
                search_data.push(params['gender']);
            }
        } else if (params_keys[i] === 'email') {
            if (validator.isEmail(params['email'])) {
                filter_parts.push('User.Email = ?');
                search_data.push(params['role_id']);
            }
        }
    }

    let query = 'select UserID, UserName, RoleID, Birthday, Gender, Email from User';

    if (filter_parts.length > 0) {
        query += ' where ' + filter_parts.join(' and ');
    }

    return({
        'query' : query,
        'data': search_data
    });
};

let searchUsers = function (params) {
    let filter = genUsersSearchFilter(params);
    return new Promise(function (resolve, reject) {
        connection.execute(
            filter.query,
            filter.data,
            function (err, results) {
                console.log(filter.query, filter.data);
                resolve(results);
            }
        );
    });
};

let genGroupsSearchFilter = function(params) {
    let params_keys = Object.keys(params);
    let filter_parts = [];
    let search_data = [];

    for (i = 0; i < params_keys.length; i++) {
        if (params_keys[i] === 'group_id') {
            if (validator.isInt(params['group_id'])) {
                filter_parts.push('`Group`.GroupID = ?');
                search_data.push(params['group_id']);
            }

        } else if (params_keys[i] === 'name') {
            if (validator.isLength(params['name'], {min: 1, max: 70})) {
                filter_parts.push('`Group`.GroupName = ?');
                search_data.push(params['name']);
            }

        }
    }

    let query = 'select GroupID, GroupName, GroupDescription from `Group`';

    if (filter_parts.length > 0) {
        query += ' where ' + filter_parts.join(' and ');
    }

    console.log({
        'query' : query,
        'data': search_data
    });

    return({
        'query' : query,
        'data': search_data
    });
};


let searchGroups = function (params) {
    let filter = genGroupsSearchFilter(params);
    return new Promise(function (resolve, reject) {
        connection.execute(
            filter.query,
            filter.data,
            function (err, results) {
                console.log(filter.query, filter.data);
                resolve(results);
            }
        );
    });
};

let findUserGroups = function (userID, page, pageSize) {
    return new Promise(function (resolve, reject) {
        connection.execute(
            'select `group`.GroupID\n' +
            'from User\n' +
            '  join UserGroups on User.UserID = UserGroups.UserID\n' +
            '  join `group` on UserGroups.GroupID = `group`.GroupID\n' +
            'where User.UserID = ?\n' +
            'order by `group`.GroupID asc\n' +
            'limit ?, ?;',


            [userID, page * pageSize, page * pageSize + pageSize],
            function (err, results) {
                resolve(results);
            }
        );
    });
};

let findGroupAssignments = function (groupID, page, pageSize) {
    return new Promise(function (resolve, reject) {
        connection.execute(
            'select Assignment.AssignmentID, assignment.AssignmentName\n' +
            'from `group`\n' +
            '  join Assignment on `group`.GroupID = Assignment.GroupID\n' +
            'where `group`.GroupID = ?\n' +
            'order by `group`.GroupID asc\n' +
            'limit ?, ?;',

            [groupID, page * pageSize, pageSize],
            function (err, results) {
                resolve(results);
            }
        );
    });
};

function findGroupSubmissions(groupID, page, pageSize) {
    return new Promise(function (resolve, reject) {
        connection.execute(
            'select Assignment.AssignmentID, assignment.AssignmentName\n' +
            'from `group`\n' +
            '  join Assignment on `group`.GroupID = Assignment.GroupID\n' +
            '  join Submission on Assignment.GroupID = Submission.GroupID' +
            'where `group`.GroupID = ?\n' +
            'order by `group`.GroupID asc\n' +
            'limit ?, ?;',

            [groupID, page * pageSize, pageSize],
            function (err, results) {
                resolve(results);
            }
        );
    });
}

function findAssignmentSubmissions(assignmentID, page, pageSize) {
    return new Promise(function (resolve, reject) {
        connection.execute(
            'select Submission.SubmissionID, Submission.StatusName\n' +
            'from Assignment\n' +
            '  join Submission on Assignment.AssignmentID = Submission.AssignmentID\n' +
            'where Assignment.AssignmentID = ?\n' +
            'order by Submission.SubmissionID asc\n' +
            'limit ?, ?;',

            [assignmentID, page * pageSize, pageSize],

            function (err, results) {
                resolve(results);
            }
        );
    });
}

function findUserSubmissions(userID, page, pageSize) {
    return new Promise(function (resolve, reject) {
        connection.execute(
            'select Submission.SubmissionID, Submission.StatusName\n' +
            'from User\n' +
            '  join Submission on User.UserID = Submission.UserID\n' +
            'where User.UserID = ?\n' +
            'order by Submission.SubmissionID asc\n' +
            'limit ?, ?;',

            [userID, page * pageSize, pageSize],

            function (err, results) {
                resolve(results);
            }
        );
    });
}


let findGroupUsers = function (groupID, page, pageSize) {
    return new Promise(function (resolve, reject) {
        connection.execute(
            'select User.UserID\n' +
            'from `group`\n' +
            '  join UserGroups on `group`.GroupID = UserGroups.GroupID\n' +
            '  join User on UserGroups.UserID = User.UserID\n' +
            'where `group`.GroupID = ?\n' +
            'order by User.UserID asc\n' +
            'limit ?, ?;',

            [groupID, page * pageSize, pageSize],
            function (err, results) {
                resolve(results);
            }
        );
    });
};

let findUsersByName = function (UserName, page, pageSize, complete) {
    return new Promise(function (resolve, reject) {
        if (complete === true) {
            connection.execute(
                'select User.UserID, User.UserName\n' +
                'from User\n' +
                'where User.UserName = ?\n' +
                'order by User.UserName asc\n' +
                'limit ?, ?;',

                [UserName, page * pageSize, pageSize],

                function (err, results) {
                    resolve(results);
                    console.log(results);
                }
            );
        } else {
            connection.execute(
                'select User.UserID, User.UserName\n' +
                'from User\n' +
                'where User.UserName like ?\n' +
                'order by User.UserName asc\n' +
                'limit ?, ?;',

                ['%' + UserName + '%', page * pageSize, pageSize],
                function (err, results) {
                    resolve(results);
                    console.log(results);
                }
            );
        }
    });
};

let findGroupByName = function (GroupName, page, pageSize, complete) {
    return new Promise(function (resolve, reject) {
        if (complete === true) {
            connection.execute(
                'select `Group`.GroupID, `Group`.GroupName\n' +
                'from `Group`\n' +
                'where `Group`.GroupName = ?\n' +
                'order by `Group`.GroupName asc\n' +
                'limit ?, ?;',

                [GroupName, (page * pageSize), pageSize],

                function (err, results) {
                    resolve(results);
                }
            );
        } else {
            connection.execute(
                'select `Group`.GroupID, `Group`.GroupName\n' +
                'from `Group`\n' +
                'where `Group`.GroupName like ?\n' +
                'order by `Group`.GroupName asc\n' +
                'limit ?, ?;',

                ['%' + GroupName + '%', page * pageSize, pageSize],
                function (err, results) {
                    resolve(results);
                }
            );
        }
    });
};

module.exports = {
    searchUsers: searchUsers,
    searchGroups: searchGroups,
    searchAssignments: searchAssignments,
    findUserGroups: findUserGroups,
    findGroupUsers: findGroupUsers,
    findGroupAssignments: findGroupAssignments,
    findGroupSubmissions: findGroupSubmissions,
    findAssignmentSubmissions: findAssignmentSubmissions,
    findUserSubmissions: findUserSubmissions,
    findUsersByName: findUsersByName,
    findGroupByName: findGroupByName

};

