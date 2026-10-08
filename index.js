const express = require('express');

const users = [{
    id: 1,
    username: "Javed",
    password: "121212"
}, {
    id: 2,
    username: "Raman",
    password: "121212"
}];

const organization = [{
    id: 1,
    organizationName: "100xDevs",
    description: "Learning Coding Platform",
    adminId: 1,
    members: [2]
}];

const boards = [{
    id: 1,
    boardTitle: "100xSchool website (Frontend)",
    organizationId: 1
}];

const issues = [{
    id: 1,
    issueTitle: "Add dark mode",
    status: "inProgress",
    boardId: 1
}];

const app = express();

app.listen(3000);