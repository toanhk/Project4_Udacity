const apiId = 'ubapwcqs4j'
//https://8pjlnr94ig.execute-api.us-east-1.amazonaws.com/dev/todos
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'toanhk.us.auth0.com',            // Auth0 domain
  clientId: 'bP2NhJqrwnEkq02Zv9ijeT1nw3db5JYV',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
