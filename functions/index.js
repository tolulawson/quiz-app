const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');
const dayjs = require('dayjs');
const { airtableAPIKey } = require('./api_keys');

admin.initializeApp();

exports.newQuiz = functions.firestore
  .document('quiz/{quizId}')
  .onCreate((snap, context) => {
    const quizDetails = snap.data();
    const airtableAPI = airtableAPIKey();
    console.log(airtableAPI);

    fetch('https://api.airtable.com/v0/appN5P8Wz0xWaeteN/Quiz%20Records', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${airtableAPI}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              Name: quizDetails.name,
              'Pharmacy Name': quizDetails.pharmacy,
              Timestamp: dayjs(quizDetails.timestamp.toDate()).format('DD/MM/YYYY, h:mm:ss A'),
              'Time Taken (s)': String(quizDetails.time),
              Score: String(quizDetails.result.correctPoints),
              Email: quizDetails.email,
              Rep: quizDetails.rep,
              Questions: quizDetails.result.questions.map((item) => `"${item.question}"`).join(', '),
              Responses: quizDetails.result.userInput.map((item) => `"${String(item)}"`).join(', '),
            },
          },
        ],
      }),
    }).catch((err) => { console.log(err); });
  });
