/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.generateAppClipURL = functions.firestore
    .document('events/{eventId}')
    .onCreate(async (snap, context) => {
        const eventId = context.params.eventId;
        const eventData = snap.data();

        // Generate the App Clip URL
        const appClipBaseURL = "https://disposableapp.xyz/clip";
        const appClipURL = `${appClipBaseURL}?eventId=${eventId}`;

        // Update the Firestore document with the App Clip URL
        await admin.firestore().collection('events').doc(eventId).update({
            appClipURL: appClipURL
        });

        return null;
    });
