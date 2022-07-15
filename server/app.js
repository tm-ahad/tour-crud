import express from 'express';
import cors from 'cors';
import cluster from 'cluster';
import os from 'os';
import config from './config/config.json' assert {type: "json"};
import bodyParser from 'body-parser';
import connectdb from './config/connectdb.js';
import morgan from 'morgan';
import http from 'http';
import tourController from './controllers/tourController.js';
import userController from './controllers/userControllers.js';
import { Worker, parentPort } from 'worker_threads';

let worker = new Worker('./app.js');

let cpuArr = os.cpus();
const app = express();
const port = config.port || 5000;

if (cluster.isWorker){
   app.use(bodyParser.urlencoded({extended: true }));
   app.use(bodyParser.json());
   app.use(express.json());
   app.use(cors(config.corsconfig));
   app.use();

   app.post('/create', tourController.bookTour);
   app.post('/delete', tourController.cancelTour);
   app.post('/update', tourController.updateTour);
   app.post('/register', userController.register);
   app.post('/login', userController.login);
   http.createServer(app).listen(port, () => {
         console.log(`app listening ${process.pid} on port ${port}`);
   });
   worker.on()
   await connectdb();
} else {
   let i = 0;
   let currentCPU;
   while (i !== (cpuArr.length - 1)) {
      currentCPU = cpuArr[i];
      cluster.fork();
      console.log('Cluster created');
      i++;
   }
   cluster.on('exit', () => {
      console.log('Cluster destroyed');
   });
   cluster.on('error', err => {
      console.log(`Cluster error: ${err.message}`);
   });
   cluster.on('online', worker => {
      console.log(`worker is online: ${worker.id}`);
   });
}
