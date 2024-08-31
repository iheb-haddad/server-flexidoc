const User = require("../models/user.model");
const Project = require("../models/project.model");
const SubProject = require("../models/subProject.model");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateUsername = async (firstname,lastname) => {
    const randomChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let username;
    let user ;
    do {
        const randomDigitsOrLetters = Array.from({ length: 2 }, () =>
        randomChars[Math.floor(Math.random() * randomChars.length)]
        ).join('');
    
        username =`${firstname}_${lastname}${randomDigitsOrLetters}`;
        user = await User.findOne({ username : username });
    } while (user);

     return username
}

const register = async (req, res) => {
    try {
        let user = req.body.newAdmin;
        const confirmation = req.body.confirmation;
        const duplicate = await User.findOne({ email: user.email });
        if (duplicate) {
            return res.status(400).json({ error: 'User already exists' });
        }
        if (user.password !== confirmation) {
            return res.status(401).json({ error: 'Passwords do not match' });
        }
        // verification of the projects
        if (user.projects.length === 0  && user.subProjects.length === 0) {
            return res.status(402).json({ error: 'You must select at least one project' });
        }else if(user.projects.length !== 0){
            user.projects.map(async (prj) =>
            {
                const project = await Project.findOne({ _id: prj._id });
                if (!project) {
                     return res.status(404).json({ message: "Project not found" });
                }
            })
        }
        // verification of the subProjects
        if(user.subProjects.length === 0 && user.projects.length === 0) {
            return res.status(403).json({ error: 'You must select at least one subProject' });
        }
        else if(user.subProjects.length !== 0){
            user.subProjects.map(async (subPrj) =>
            {
                const subProject = await SubProject.findOne({ _id: subPrj._id })
                    .populate('idProject');
                if (!subProject) {
                    return res.status(404).json({ message: "SubProject not found" });
                }
            })
        }
        const password = user.password;
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);   
        user.password = hashedPassword;
        if(user.username === '') {user.username = await generateUsername(user.firstName,user.lastName);}
        await User.create(user);
        res.status(201).json({ message: "user registred succesfully" });
    } catch {
        res.status(500).send();
}
};

const resgisterWithUpload = async (req, res) => {
    try {
        let user = req.body.newAdmin;
        const duplicate = await User.findOne
        ({ email: user.email });
        if (duplicate) {
            return res.status(400).json({ error: 'User already exists' });
        }
        // verification of the projects
        if (user.projects.length === 0  && user.subProjects.length === 0) {
            return res.status(402).json({ error: 'You must select at least one project' });
        }
        else if(user.projects.length !== 0){
            user.projects.map(async (prj) =>
            {
                const project = await Project.findOne({ name: prj });
                if (!project) {
                     return res.status(404).json({ message: "Project not found" });
                }
            }
            )
        }
        // verification of the subProjects
        if(user.subProjects.length === 0 && user.projects.length === 0) {
            return res.status(403).json({ error: 'You must select at least one subProject' });
        }
        else if(user.subProjects.length !== 0){
            user.subProjects.map(async (subPrj) =>
            {
                const subProject = await SubProject.findOne({ name: subPrj });
                if (!subProject) {
                    return res.status(404).json({ message: "SubProject not found" });
                }
            })
        }
        const password = user.password;
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        if(user.username === '') {user.username = await generateUsername(user.firstName,user.lastName);}
        await User.create(user);
        res.status(201).json({ message: "user registred succesfully" });
    }
    catch {
        res.status(500).send();
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid Email' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(403).json({ error: 'Invalid Password' });
        }
        res.json({ user });
    } catch (error) { 
        res.status(500).json({ error: 'Login failed' });
    }
    };

module.exports = {
    register,
    resgisterWithUpload,
    login
};