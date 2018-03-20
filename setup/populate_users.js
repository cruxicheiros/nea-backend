const mysql2 = require('mysql2');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'admin',
    database: 'nea'
});

class User {
    constructor(birthday, email, gender, name, password, roleID) {
        this.birthday = birthday;
        this.email = email;
        this.gender = gender;
        this.name = name;
        this.roleID = roleID;


        this.passwordSalt = bcrypt.genSaltSync(saltRounds);
        this.passwordHash = bcrypt.hashSync(password, this.passwordSalt);
    }
}

/* My system will be designed to work with names constructed of unicode characters. However, I */
function generateName() {
    let first_names = ['Adam', 'Jules', 'Bob', 'John', 'Monica', 'Jesse', 'Derek', 'Zara', 'Alice', 'Joe', 'Sue'];
    let last_names = ['Doe', 'Smith', 'Park', 'Wu', 'Johnson', 'Aduba'];


    return first_names[Math.floor(Math.random()*first_names.length)] + ' ' + last_names[Math.floor(Math.random()*last_names.length)];
}

function generateBirthDate() {
    let year = Math.floor(Math.random() * (2017 - 1950)) + 1950;
    let month = Math.floor(Math.random() * (12) + 1);
    let day = Math.floor(Math.random() * (28) + 1);

    return year + '-' + month + '-' + day;
}

function generateGender() {
    let gender = 'M';

    if (Math.random() > 0.5) {
        gender = 'F'
    }

    return gender;
}

function generateEmail() {
    let pseudorandom_string = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return pseudorandom_string + '@mailinator.com' // Produces a valid address with an inbox that can be checked later.
}


function generateUser(roleID, password) {
    return new User(generateBirthDate(), generateEmail(), generateGender(), generateName(), password, roleID);
}

function addUser(user) {
    connection.execute(
        'insert into `User` (RoleID, UserName, Birthday, Gender, Email, PasswordSalt, PasswordHash) values (?, ?, ?, ?, ?, ?, ?)',
        [user.roleID, user.name, user.birthday, user.gender, user.email, user.passwordSalt, user.passwordHash]
    );
}


/*  ROLES:
*   1 - Admins
*   2 - Teachers
*   3 - Students
* */

const new_teachers = 5;
const new_students = 60;

for (i = 0; i < new_teachers; i++) {
    addUser(generateUser(2, 'password'));
}

for (i = 0; i < new_students; i++) {
    addUser(generateUser(3, 'password'));
}

addUser(new User('1975-01-01', 'supercilioussquirrel@mailinator.com', '-', 'Admin Account', 'admin', 1));

console.log('Complete!');