const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Javed:admin123@cluster0.iobmisv.mongodb.net/trello');

const userSchema = mongoose.Schema({
    username: String,
    password: String
})

const organizationSchema = mongoose.Schema({
    organizationName: String,
    description: String,
    adminId: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    members: [{type: String}]
})

const addMemberSchema = mongoose.Schema({
    organizationId: {type: mongoose.Schema.Types.ObjectId, ref: 'organizations'},
    memberUsername: String,
})

const boardSchema = mongoose.Schema({
    boardTitle: String,
    organizationId: {type: mongoose.Schema.Types.ObjectId, ref: 'organizations'}
})

const issueSchama = mongoose.Schema({
    issueTitle: String,
    issueDescription: String,
    issueStatus: {type: String, enum: ['init', 'inProgress', 'Done'], default: 'init'},
    boardId: {type: mongoose.Schema.Types.ObjectId, ref: 'boards'}
})

const User = mongoose.model('users', userSchema);
const Organization = mongoose.model('organizations', organizationSchema);
const AddMember = mongoose.model('addMembers', addMemberSchema);
const Board = mongoose.model('boards', boardSchema);
const Issue = mongoose.model('issues', issueSchama);

module.exports = {
    User,
    Organization,
    AddMember,
    Board,
    Issue
}