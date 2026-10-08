const express = require('express');
const jwt = require('jsonwebtoken');
const { authMiddleware } = require('./middleware');

let USER_ID = 1;
let ORGANIZATION_ID = 1;
let BOARD_ID = 1;
let ISSUE_ID = 1;

const USERS = [];
const ORGANIZATIONS = [];
const BOARDS = [];
const ISSUES = [];

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is up, and working properly"
    });
})

app.post('/signup', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExist = USERS.find(u => u.username == username);

    if(userExist) {
        res.status(411).json({
            success: false,
            message: "User already exists"
        })
        return;
    }

    USERS.push({
        id: USER_ID++,
        username,
        password
    });

    res.status(200).json({
        success: true,
        message: "User created successfully"
    })
    return;
})

app.post('/signin', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExist = USERS.find(u => u.username == username && u.password == password);

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

    res.status(200).json({
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

    const orgExists = ORGANIZATIONS.find(org => org.organizationName == organizationName);

    if(orgExists) {
        res.status(411).json({
            success: true,
            message: "Organization already Exists"
        })
        return;
    }

    ORGANIZATIONS.push({
        id: ORGANIZATION_ID++,
        organizationName,
        description,
        adminId,
        members: []
    })

    res.status(200).json({
        success: true,
        message: "Organization creaed successfully"
    })
    return;
})

app.post('/add-member-to-org', authMiddleware, (req, res) => {
    const userId = req.userId;
    const organizationId = req.body.organizationId;
    const memberUsername = req.body.memberUsername;

    const organization = ORGANIZATIONS.find(org => org.id == organizationId);

    if(!organization || organization.adminId != userId){
        return res.status(411).json({
            success: false,
            message: "Either this organization does not exists or you are not the admin of this org"
        })
    }

    const memberUser = USERS.find(u => u.username == memberUsername);
    
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

app.post('/board', authMiddleware, (req, res) => {
    const userId = req.userId;
    const boardTitle = req.body.boardTitle;
    const organizationId = req.body.organizationId;

    const boardExists = BOARDS.find(b => b.boardTitle == boardTitle);

    if(boardExists) {
        res.status(411).json({
            success: false,
            message: "Board already exists"
        })
    }

    BOARDS.push({
        id: BOARD_ID++,
        boardTitle,
        organizationId
    })

    res.status(200).json({
        success: true,
        message: "Board created successfully"
    })

})

app.post('/issue', authMiddleware, (req, res) => {
    const issueTitle = req.body.issueTitle;
    const issueDescription = req.body.issueDescription;
    const issueStatus = req.body.issueStatus;
    const boardId = req.body.boardId;

    const issueExists = ISSUES.find(i => i.issueTitle == issueTitle);

    if(issueExists) {
        res.status(411).json({
            success: false,
            message: "Issue already created"
        })
    }

    ISSUES.push({
        id: ISSUE_ID++,
        issueTitle,
        issueDescription,
        issueStatus,
        boardId
    })

    res.status(200).json({
        success: true,
        message: "Issue created successfully"
    })
})

app.get('/organization', authMiddleware, (req, res) => {
    const userId = req.userId;
    const organizationId = req.query.organizationId;

    const organization = ORGANIZATIONS.find(org => org.id == organizationId);

    if(!organization || organization.adminId != userId){
        return res.status(404).json({
            success: false,
            message: "Organization does not exist"
        })
    }

    const isAdmin = organization.adminId == userId;
    const isMember = organization.members.includes(userId);

    if (!isAdmin && !isMember) {
        return res.status(403).json({
            success: false,
            message: "You are not a member of this organization"
        });
    }
    
    res.json({
        organization: {
            ...organization,
            members: organization.members.map(memberId => {
                const user = USERS.find(user => user.id === memberId);
                return {
                    id: user.id,
                    username: user.username
                }
            })
        }
    })
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