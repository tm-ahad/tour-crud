import bodyParser from 'body-parser';
import cluster from 'cluster';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';
import morgan from 'morgan';
import os from 'os';
import config from './config/config.json' assert { type: "json" };
import connectdb from './config/connectdb.js';
import tourController from './controllers/tourController.js';
import userController from './controllers/userControllers.js';

let cpuArr = os.cpus();
const app = express();
const port = config.port || 5001;

if (cluster.isWorker){
   let j = 0;

   app.on('error', err => console.log(err))

   app.use(bodyParser.urlencoded({extended: true }));
   app.use(bodyParser.json());
   app.use(express.json());
   app.use(cors(config.corsconfig));
   app.use(morgan('dev'));
   app.use(cookieParser());

   app.post('/tour/create', tourController.bookTour);
   app.post('/tour/delete', tourController.cancelTour);
   app.post('/tour/update', tourController.updateTour);
   app.post('/user/register', userController.register);
   app.post('/user/login', userController.login);
   app.post('/user/logout', userController.logout);
   http.createServer(app).listen(port, () => {
         console.log(`app listening ${process.pid} on port ${port}`);
   });
   await connectdb();
} else {
   for (let cpus of cpuArr){
      cluster.fork();
      console.log('Cluster created');
   }
   cluster.on('error', err => {
      console.log(`Cluster error: ${err.message}`);
      cluster.emit('exit');
   });
   cluster.on('online', worker => {
      console.log(`worker is online: ${worker.id}`);
   });
   cluster.on('disconnect', () => {
      console.log(`Cluster destroyed.`);
      cluster.emit('exit');
   })
   cluster.on('setup', () => {
      console.log('Cluster ready to use');
   })
   cluster.on('listening', () => {
      console.log('cluster listening');
   })
}
