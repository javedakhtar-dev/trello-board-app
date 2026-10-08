const express = require('express');
const jwt = require('jsonwebtoken');
const { authMiddleware } = require('./middleware');
const { User, Organization } = require('./model');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is up, and working properly"
    });
})

app.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExist = await User.findOne({
        username: username
    });
    
    if(userExist) {
        res.status(411).json({
            success: false,
            message: "User already exists"
        })
        return;
    }

    User.create({
        username,
        password
    });

    res.status(200).json({
        success: true,
        message: "User created successfully"
    })
    return;
})

app.post('/signin', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExist = await User.findOne({
        username,
        password
    });

    if(!userExist) {
        res.status(411).json({
            success: false,
            error: "Username or Password are worng"
        })
        return;
    };

    const token = jwt.sign({
        userId: userExist._id
    }, 'organization-super-secret-key');

    res.status(200).json({
        success: true,
        token
    })
    return;
})

app.post('/organization', authMiddleware, async (req, res) => {
    const userId = req.userId;
    const organizationName = req.body.organizationName;
    const description = req.body.description;

    const orgExists = await Organization.findOne({
        organizationName
    });

    if(orgExists) {
        res.status(411).json({
            success: true,
            message: "Organization already Exists"
        })
        return;
    }

    Organization.create({
        organizationName,
        description,
        adminId: userId,
        members: []
    })

    res.status(200).json({
        success: true,
        message: "Organization creaed successfully"
    })
    return;
})

app.post('/add-member-to-org/:organizationId', authMiddleware, async (req, res) => {
    const userId = req.userId;
    const organizationId = req.params.organizationId;
    const memberUsername = req.body.memberUsername;

    const organization = await Organization.findOne({
        _id: organizationId
    });

    if(!organization || organization.adminId != userId){
        return res.status(411).json({
            success: false,
            message: "Either this organization does not exists or you are not the admin of this org"
        })
    }

    const user = await User.findOne({
        username: memberUsername
    });
    
    if(!user) {
        res.status(411).json({
            success: false,
            message: "User does not exist with this username"
        })
        return;
    };

    const alreadyMember = organization.members.some(
        memberId => memberId.toString() === user._id.toString()
    );
    if (alreadyMember) {
        return res.status(409).json({
            success: false,
            message: "User is already a member of this organization"
        });
    }

    await Organization.findByIdAndUpdate(
        organizationId, {
            $push: {
                members: user._id
            }
        }
    )
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