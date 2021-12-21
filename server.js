require('dotenv').config();
const express=require("express");
const app=express();
const path=require('path');
const cors=require('cors');
const PORT=process.env.PORT || 5500;



const connectDB=require('./config/db');
connectDB();
//cors
const corsOptions={
    origin:['http://localhost:5500','http://localhost:3000']
    //['http://localhost:3000','http://localhost:5000','http://localhost:3300'],process.env.ALLOWED_CLIENTS.split(',')
}
app.use(cors(corsOptions))




app.use(express.static('public'));

 app.use(express.json());

//Template engine
app.set('views',path.join(__dirname,'/views'));
app.set('view engine','ejs');

//Routes
app.use('/api/files',require('./routes/files'))
app.use('/files',require('./routes/show'));
app.use('/files/download',require('./routes/download'));



app.listen(PORT,()=>{
    console.log(`Server started successfully on port ${PORT}`);
})