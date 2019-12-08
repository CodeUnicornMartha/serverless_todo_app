import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
//import request from 'request';

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'
//import { isContext } from 'vm'



const logger = createLogger('auth')


// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

export async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const jwksUrl = ''

  const token = getToken(authHeader)

  logger.info("token", token)

  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  logger.info("jwt", jwt)
  const kidheader = jwt.header.kid
  logger.info("kidheader", kidheader)
  const certificate = await getkeys(jwksUrl,kidheader)
  logger.info("certificate", certificate)
  
  //const certificate = Axios.get(jwksUrl)
  // https://hub.udacity.com/rooms/community:nd9990:840125-project-617/community:thread-4601288877-1137793?contextType=room
  
 
  const certformat = certToPEM(certificate)
  logger.info("cert", certformat)
  logger.error("cert", certformat)
  //const decodedcert = decode(certformat)
  //const secret = decode(certformat)
  return verify(token, certformat, { algorithms: ['RS256'] }) as JwtPayload

  //const jwksClient = require('jwks-rsa');
  
  //const keys = jwksClient.getJwks(jwksUrl);
  //const client = jwksClient({
  //  jwksUri: jwksUrl,
  //});
  //const cert = client.getSigningKey(jwt.header.kid)
  //logger.info("kidheader", jwt.header.kid)
  //logger.error("kidheader", jwt.header.kid)
  //.then(resp => {resp.data});
  //logger.info("cert without PEM", certificate)
  //logger.error("cert without PEM", certificate)
  //const certpem = certToPEM(certificate)
  //logger.info("cert with PEM", certpem)
  //logger.error("cert with PEM", certpem)

// Retrieve the JWKS and filter for potential signing keys. ->
  //const jwkkeys = await getJwks(jwksUrl)
  //logger.info("jwkkeys",jwkkeys)
// Extract the JWT from the request's authorization header  
// Decode the JWT and grab the kid property from the header.
  //const kidheader = jwt.header.kid
  //logger.info("kidheader", kidheader)
// Find the signing key in the filtered JWKS with a matching kid property.
  //const kidjwk = JSON.parse(jwkkeys).kid
  //const signingKey = jwkkeys.find(key => key.kid === kidheader);
  //logger.info(kidjwk)
  //logger.error(kidjwk)
  //if(kidheader === kidheader) {
  //const cert = getSigningKey(kidheader)
  //logger.info("key", cert)
  //logger.error(cert)

  //const signingkey = getSigningKey(key)
// Using the x5c property build a certificate which will be used to verify the JWT signature.
  
  //const x5u = JSON.parse(key)
  //logger.info("x5c", x5u)
  //const cert = key.
  //logger.info("cert", cert)
  
  }
  //else throw new Error("You are not authorized")
//}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

 function certToPEM(cert) {

  //cert = cert.match(/.{1,64}/g).join('\n');

  cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----`;

  return cert;

};
async function getkeys(jwksUrl: string, kidheader: string){
  const reply = await Axios.get(jwksUrl) 
  const keys: any[] = reply.data.keys

  const key = keys.find(key => key.kid === kidheader && key.kty === 'RSA') 
  if (!key) 
  throw new Error('Key not found')

  return key.x5c[0]
}
// https://github.com/sgmeyer/auth0-node-jwks-rs256/blob/master/src/lib/JwksClient.js#L7-L28
/*
async function getJwks(jwksUrl: string) {
  let jwks = null
  request({
    uri: jwksUrl,    
    json: true
  }, (err, res) => {
    if (err || res.statusCode < 200 || res.statusCode >= 300) {
        logger.error('Could not retrieve JWK',res)
        return null
    }
    jwks = res.body.keys;
    logger.info("jwks", jwks)
    return jwks
  });
  logger.info(jwks)
  return jwks
  }
  */
  /*
  function getSigningKey(kidheader): string {
    const signingKeys = kidheader.map(key => { 
            return { kid: key.kid, nbf: key.nbf, publicKey: certToPEM(key.x5c[0])};
          });
    logger.error(signingKeys)
    logger.info(signingKeys)
    const signingKey = signingKeys[0].publicKey;
    logger.error(signingKey)
    logger.info(signingKey)

    return signingKey
  }*/
  
// https://gist.github.com/chatu/7738411c7e8dcf604bc5a0aad7937299
// https://auth0.com/blog/navigating-rs256-and-jwks/


// https://auth0.com/blog/navigating-rs256-and-jwks/


// https://github.com/auth0/node-jwks-rsa/blob/master/src/utils.js#L1-L5
//https://github.com/auth0/node-jwks-rsa/blob/master/src/JwksClient.js
// https://github.com/sgmeyer/auth0-node-jwks-rs256/blob/master/src/lib/utils.js
/*
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { decode } from 'jsonwebtoken'
//verify
import { createLogger } from '../../utils/logger'
//import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
//const jwksUrl = '...'

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  logger.info(jwt)

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  return undefined
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

*/


 //if(!jwt) throw new Error ('No JWT Secret found')
  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  // Create Certificate based on the Key - from the URL - Key/Certificate 
  // https://auth0.com/blog/navigating-rs256-and-jwks/
 
/* get content of the link - get keys - incert (feedback of studenthub) - based key create certificate
-----BEGIN CERTIFICATE-----\n${key}\n-----END CERTIFICATE-----

  // URL - Split
  // Kid ID - jwt.header.kid - extract from URL - split by kid ID
  // Key - build a cert out of the key
  return verify(token, cert, { algorithms: ['RS256'] }) as JwtToken
*/ 
  //const rawCert = json.keys.map((v) => v.n).shift();

      /*if (kidheader === signingkey) {
  }
  else {
    throw new Error ('You are not authorized to see this content')
  }
  */
// Ensure the JWT contains the expected audience, issuer, expiration, etc.


  
  //https://github.com/auth0/node-jsonwebtoken
  
  //const kid = getSigningKey(jwt.header.kid,jwt.header)

  //const split = kidkey.split(' ')
  //const cert = split[1]
  