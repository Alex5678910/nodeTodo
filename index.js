const express = require('express')
const mongoose = require('mongoose')

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json({extended: true}))
app.use('/api/auth', require('./routes/auth.router'))
app.use('/api/todo', require('./routes/todo.router'))

async function start() {
    try {
        await mongoose.connect('mongodb+srv://dmi:Vfkmljcs@cluster0.w92eu.mongodb.net/alex?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: true
        })
        app.listen(PORT, () => {
            console.log(`Server run`)
        })
    } catch (err) {
        console.error(err)
    }
}

start()


