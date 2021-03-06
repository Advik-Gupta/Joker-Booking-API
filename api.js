const axios = require("axios");
const express = require("express");
var TourCMSApi = require("tourcms");
const app = express();
const port = process.env.PORT || 3030;
const url = `https://wave3app-staging.herokuapp.com/mark_api/v1`;
const cors = require("cors");
const date = require("date-and-time");
// ___________________________________________________________________________________________________________________________

const firebase = require("firebase");

const firebaseConfig = {
  apiKey: "AIzaSyDe6xx7mZOoMtkjbO62Cb7o9KEB7dbMhv8",
  authDomain: "joker-booking.firebaseapp.com",
  projectId: "joker-booking",
  storageBucket: "joker-booking.appspot.com",
  messagingSenderId: "918282203466",
  appId: "1:918282203466:web:72b24b56b04c3db28491b3",
  measurementId: "G-E7NEEVW7XM",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();

// ___________________________________________________________________________________________________________________________

app.use(express.json());
app.use(cors());

// ___________________________________________________________________________________________________________________________

app.get("/trial", async (req, res) => {
  res.send("Api working");
});

app.post("/tailoryourjourney", async (req, res) => {
  console.log(req.body);
  let responseData = {};

  let config = {
    method: "post",
    url: "https://vv.wildfire.buzz/wp-json/gf/v2/entries/",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Auth id",
    },
    data: req.body,
  };

  axios(config)
    .then(function (response) {
      responseData = JSON.stringify(response.data);
      let ID = JSON.parse(responseData).id;

      let newConfig = {
        method: "post",
        url: `https://vv.wildfire.buzz/wp-json/gf/v2/entries/${ID}/notifications`,
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Auth id",
        },
      };

      axios(newConfig)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          res.send(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
        });
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.get("/", async (req, res) => {
  const data = [];
  await db
    .collection("data")
    .get()
    .then((snapshot) => {
      snapshot.docs.map((doc) => {
        let { bronze, dates, silver, gold } = doc.data();
        let documentData = {
          bronze,
          dates,
          silver,
          gold,
        };
        data.push(documentData);
      });
    });
  res.send(data);
});

app.get("/:id", async (req, res) => {
  const { id } = req.params;
  await db
    .collection("data")
    .doc(id)
    .get()
    .then((snapshot) => {
      let { bronze, dates, silver, gold } = snapshot.data();
      let documentData = {
        bronze,
        dates,
        silver,
        gold,
      };
      res.send(documentData);
    })
    .catch((error) => {
      res.send(error);
      console.log(error);
    });
});

// ___________________________________________________________________________________________________________________________

app.listen(port, () => {
  console.log(`Example app listening at ${port}`);
});
