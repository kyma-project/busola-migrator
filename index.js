var express = require('express');
var app = express();
var os = require("os");
const fetch = require('node-fetch');
const axios = require('axios');
var querystring = require("querystring");
var jwt = require('jsonwebtoken');

const { URLSearchParams } = require('url');

const clientid = process.env.UAA_CLIENT_ID;
const clientsecret = process.env.UAA_CLIENT_SECRET;
const domain = process.env.DOMAIN;
const redirect_uri = `https://dex.${domain}/callback`;
const uaaUrl = process.env.UAA_URL;
const wellKnown = '/.well-known/openid-configuration';
//create a server object:

// Configuration
var port = process.env.PORT || 8080;
var message = process.env.MESSAGE || "Hello me!";

function getOpenIdConfiguration() {
  console.log("URL: %s",uaaUrl + wellKnown)
  return fetch(uaaUrl + wellKnown).then(res => res.json())
}
app.get(wellKnown, async function (req, res) {
  const cfg = await getOpenIdConfiguration();
  res.send(cfg);
});

// URL: https://console.{domain}
app.get('/', async function (req, res) {
  // TODO: present some static page with explanation what is busola and 2 buttons:
  // - enable access from busola - will redirect to UAA authorize and then create proper cluster role, and go to busola
  // - redirect to busola directly (first step already done)

  const cfg = await getOpenIdConfiguration();
  const params = {
    client_id: clientid,
    redirect_uri,
    response_type: "code",
    state: "blabla"
  }  
  res.redirect(cfg.authorization_endpoint + '?' + querystring.encode(params));
});

// URL: https://dex.{domain}/callback
app.get('/callback', async function (req, res) {
  const cfg = await fetch(uaaUrl + wellKnown).then(res => res.json());

  const params = {
    redirect_uri,
    grant_type: "authorization_code",
    code: req.query.code
  };

  try {
    const token = await axios.post(cfg.token_endpoint, querystring.encode(params), { auth: { username: clientid, password: clientsecret } })
    if (token.data.access_token) {
      token.data.decoded_access_token = jwt.decode(token.data.access_token)
      // TODO:
      // if (verifyToken(token.data)) {
      //   createClusterRole(token.data)
      //   res.redirect(createBusolaLink())
      // }
     }
    res.send(token.data);

  } catch (error) {
    console.log(error)
    res.send("Error")
  }
});

// Set up listener
app.listen(port, function () {
  console.log("Listening on: http://%s:%s", os.hostname(), port);
});