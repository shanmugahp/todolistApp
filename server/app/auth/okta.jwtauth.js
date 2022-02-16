
const oktaConfig = require('../config/okta.config.js');
const OktaJwtVerifier = require("@okta/jwt-verifier");

const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: oktaConfig.resourceServer.oidc.clientId,
  issuer: oktaConfig.resourceServer.oidc.issuer,
  assertClaims: oktaConfig.resourceServer.assertClaims,
  testing: oktaConfig.resourceServer.oidc.testing
});

function authenticationRequired(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/Bearer (.+)/);

  if (!match) {
    res.status(401);
    return next('Unauthorized');
  }

  const accessToken = match[1];
  const audience = oktaConfig.resourceServer.assertClaims.aud;
  return oktaJwtVerifier.verifyAccessToken(accessToken, audience)
    .then((jwt) => {
      req.jwt = jwt;
      console.log("***************"+req.jwt);
      next();
    })
    .catch((err) => {
      res.status(401).send(err.message);
    });
}


module.exports=authenticationRequired