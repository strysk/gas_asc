function getJWT() {
  const ascAuthKeyId = PropertiesService.getScriptProperties().getProperty('ASC_AUTH_KEY_ID')
  const ascIssuerId = PropertiesService.getScriptProperties().getProperty('ASC_ISSUER_ID')
  const ascAuthSecretKey = PropertiesService.getScriptProperties().getProperty('ASC_AUTH_SECRET_KEY')

  const headerJson = JSON.stringify({
    "alg": "ES256", 
    "kid": ascAuthKeyId,
    "typ": "JWT"
  })
  const encodedHeader = Utilities.base64Encode(headerJson)

  const payloadJson = JSON.stringify({
    "iss": ascIssuerId,
    "iat": Date.now(),
    "exp": Date.now() + 800,
    "aud": "appstoreconnect-v1"
  })
  const encodedPayload = Utilities.base64Encode(payloadJson)

  const token = encodedHeader + "." + encodedPayload

  const signature = Utilities.computeHmacSha256Signature(token, ascAuthSecretKey)
  const encodedSignature = Utilities.base64Encode(signature)

  return token + "." + encodedSignature
}


async function addExternalTesterRequest() {
  const jwt = getJWT()

  const url = `https://api.appstoreconnect.apple.com/v1/betaTesters`
  const options = {
    method: "post",
    headers: {
      'Authorization': "Bearer " + jwt,
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify({
      "data": {
          "attributes": {
            "email": "",
            "firstName": "",
            "lastName": ""
          },
          "relationships": {
            "betaGroups": {
              "data": [
                {
                  "id": "",
                  "type": "betaGroups"
                }
              ]
            }
          },
          "type": "betaTesters"
        }
    })
  }

  const response = await UrlFetchApp.fetch(url, options)
  return await response
}