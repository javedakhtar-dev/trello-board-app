const express = require('express');
const jwt = require('jsonwebtoken');
const { authMiddleware } = require('./middleware');

let USER_ID = 1;
let ORGANIZATION_ID = 1;
let BOARD_ID = 1;
let ISSUE_ID = 1;

const users = [];

const organizations = [{
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

app.use(express.json());

app.get('/', (req, res) => {
    res.json(users);
})

app.post('/signup', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExist = users.find(u => u.username == username);

    if(userExist) {
        res.status(411).json({
            success: false,
            message: "User already exists"
        })
        return;
    }

    users.push({
        id: USER_ID++,
        username,
        password
    });

    res.json({
        success: true,
        message: "User created successfully"
    })
    return;
})

app.post('/signin', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExist = users.find(u => u.username == username && u.password == password);

    if(!userExist) {
        res.status(411).json({
            success: false,
            error: "Username or Password are worng"
        })
        return;
    };

    const token = jwt.sign({
        userId: userExist.id
    }, 'organization-super-secret-key');

    res.json({
        success: true,
        token
    })
    return;
})

app.post('/organization', authMiddleware, (req, res) => {
    const userId = req.userId;
    const organizationName = req.body.organizationName;
    const description = req.body.description;
    const adminId = userId;

    organizations.push({
        id: ORGANIZATION_ID++,
        organizationName,
        description,
        adminId,
        members: []
    })

    res.json({
        success: true,
        message: "Organization creaed successfully"
    })
})

app.post('/add-member-to-org', authMiddleware, (req, res) => {
    const userId = req.userId;
    const organizationId = req.body.organizationId;
    const memberUsername = req.body.memberUsername;

    const organization = organizations.find(org => org.id == organizationId);

    if(!organization || organization.adminId != userId){
        return res.status(411).json({
            success: false,
            message: "Either this organization does not exists or you are not the admin of this org"
        })
    }

    const memberUser = users.find(u => u.username == memberUsername);
    
    if(!memberUser) {
        res.status(411).json({
            success: false,
            message: "User does not exist with this username"
        })
        return;
    };

    organization.members.push[memberUser.id]
    res.status(200).json({
        success: true,
        message: "User added successfully"
    })
})

app.post('/board', (req, res) => {

})
app.post('/issue', (req, res) => {

})

app.get('/organization', authMiddleware, (req, res) => {
    const userId = req.userId;
    const organizationId = req.query.organizationId;

    const organization = organizations.find(org => org.id == organizationId);

    if(!organization || organization.adminId != userId){
        return res.status(411).json({
            success: false,
            message: "Either this organization does not exists or you are not the admin of this org"
        })
    }

})
app.get('/boards', (req, res) => {

})
app.get('/issues', (req, res) => {

})
app.get('/members', (req, res) => {

})

app.put('/update-issue', (req, res) => {

})

app.delete('/member', authMiddleware, (req, res) => {
    const userId = req.userId;
    const organizationId = req.body.organizationId;
    const memberUsername = req.body.memberUsername;

    const organization = organizations.find(org => org.id == organizationId);

    if(!organization || organization.adminId != userId){
        return res.status(411).json({
            success: false,
            message: "Either this organization does not exists or you are not the admin of this org"
        })
    }

    const memberUser = users.find(u => u.username == memberUsername);
    
    if(!memberUser) {
        return res.status(411).json({
            success: false,
            message: "User does not exist with this username"
        })
    }

    organization.members = organization.members.filter(user => user.id !== memberUser.id);

    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    })
})

app.listen(3000, () => {
    console.log("Server running on port 3000");
});