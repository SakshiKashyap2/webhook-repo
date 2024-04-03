const express = require('express')
const app= express()

const Data = require('./model/Data')
const connectDB = require('./utils/connectDb')
const cors = require('cors')

connectDB();

app.use(express.json())
app.use(cors())

app.get('/', (req, res)=>{
    res.send('Server Active!')
})

app.post('/push', async (req, res)=>{
    // console.log(req.body)
    console.log('PUSH');
    const dataExist = await Data.findOne({'action':'PUSH'})


    const newData=new Data({
        'request_id':req.body.head_commit.id,
        'author':req.body.head_commit.author.name,
        'action':'PUSH',
        'from_branch': req.body.repository.master_branch,
        'to_branch':req.body.repository.master_branch,
        'timestamp':req.body.head_commit.timestamp
    })
    console.log('New Data', newData)
    if(dataExist){
        console.log('Data Exist')
        dataExist.updateOne({$set: newData})
    }else{
        console.log('Dosent Exist')
        await newData.save();
    }
    res.status(201)
})




app.post('/pull', async (req, res)=>{
    // console.log(req.body)
    console.log('PULL')
    const dataExist = await Data.findOne({'action':'PULL_REQUEST'})


    const newData=new Data({
        'request_id':req.body.pull_request.id,
        'author':req.body.pull_request.user.login,
        'action':'PULL_REQUEST',
        'from_branch': req.body.pull_request.head.ref,
        'to_branch':req.body.pull_request.base.ref,
        'timestamp':req.body.pull_request.updated_at
    })

    if(dataExist){
        console.log('Data Exist')
        dataExist.updateOne({$set: newData})
    }else{
        console.log('Dosent Exist')
        await newData.save();
    }
    res.status(201)
})

app.post('/merge', async (req, res)=>{
    console.log(req.body.commits)
    console.log('MERGE')
    const dataExist = await Data.findOne({'action':'MERGE'})


    const newData=new Data({
        'request_id':req.body.head_commit.id || '',
        'author':req.body.commits[0].author.name,
        'action':'MERGE',
        'from_branch':req.body.repository.master_branch,
        'to_branch':req.body.repository.master_branch,
        'timestamp':req.body.commits[1].timestamp
    })

    if(dataExist){
        console.log('Data Exist')
        dataExist.updateOne({$set: newData})
    }else{
        console.log('Dosent Exist')
        await newData.save();
    }
    res.status(201)
})

app.get('/getPush', async (req, res)=>{
    const data = await Data.findOne({'action':'PUSH'})
    res.send(data)
})
app.get('/getPull', async (req, res)=>{
    const data = await Data.findOne({'action':'PULL_REQUEST'})
    res.send(data)
})
app.get('/getMerge', async (req, res)=>{
    const data = await Data.findOne({'action':'MERGE'})
    res.send(data)
})

const port=process.env.PORT || 5000
app.listen(port, ()=>{
    console.log('Server running on PORT:', port)
})