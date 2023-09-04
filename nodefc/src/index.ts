"use strict";

import express, { Express, Request, Response } from 'express';
const axios = require('axios')
import dotenv from 'dotenv';
import * as faceapi from 'face-api.js'
import { canvas, faceDetectionNet, faceDetectionOptions, saveFile } from './commons'
import { any } from '@tensorflow/tfjs-node';
dotenv.config()

const app = express()
const PORT = (process.env.STATUS == 'production')
    ? process.env.PROD_PORT
    : process.env.DEV_PORT
app.use(express.json());

const API_URL = process.env.API_URL
axios.create({baseUrl: API_URL});


app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

console.log('Hello world!')




/**
 * functions
 */



    // STEP 2 - Get Guest
    const getGuests = (params:any, callback:any) => {

        console.log('getGuests')
        console.log('starting..')

        axios.get(API_URL+'/guests')
        .then((response: any) => {
            let guests = response.data

            console.log('Total '+Object.keys(guests).length+' guests found!')
            console.log(guests)

            callback(undefined, guests);

        })
        .catch((error:any) => {
            console.log(error);
        });
    }

    // STEP 1 - Get Criminals
    const getCriminals = (params:any, callback:any) => {

        console.log('getCriminals')
        console.log('starting..')

        axios.get(API_URL+'/criminals')
        .then((response:any) => {
            let criminals = response.data

            console.log('Total '+Object.keys(criminals).length+' criminals found!')
            console.log(criminals)

            callback(undefined, criminals);

        })
        .catch((error:any) => {
            console.log(error);
        });
    }



/**
 * Routes
 */


    app.get('/run-face-match', (req: Request, res: Response) => {
        console.log('run-face-match... ')

        /*****
             * STEP 1
            */
        //get criminals
        getCriminals( [], (error: any, criminalsData: any) => {
            //return res.send(criminalsData);

            //if error log, and exit
            if(error) return res.send({error})

            /*****
             * STEP 2
            */
            console.log('get guest details..');
            //get guest details
            if(Object.keys(criminalsData).length){
                getGuests( [], (error: any , guestsData: any) => {

                    //if error log, and exit
                    if(error) return res.send({error})

                    return res.send([criminalsData, guestsData]);



                    // STEP 3 - Load models

                    // Train Models

                    // Confirm readiness
                    //run face match
                    //runFaceMatch()


                } )
            }

        })

      });

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});
