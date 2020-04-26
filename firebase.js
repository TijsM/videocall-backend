const firebase = require('firebase/app')
require('firebase/firestore')
const {firebaseConfig} = require('./secrets')

firebase.initializeApp(firebaseConfig)

const firestore = firebase.firestore();

module.exports={
  firestore
}