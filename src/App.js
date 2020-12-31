import { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// yahoo auth flow https://developer.yahoo.com/oauth2/guide/flows_authcode/
// request a code, then exchange the code for access_token & refresh_token

const baseApi = 'https://api.login.yahoo.com/oauth2';
const route = '/request_auth';
const client_id = 'dj0yJmk9a3FUWHNVWEZvR0NlJmQ9WVdrOWJWQk1XV040ZFhrbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTdh';
const client_secret = 'e503f57b0d0d10adf5cedd2522e4a50d05deee62';
const redirect_uri = 'https://yafaba.herokuapp.com/yfs';
const response_type = 'code';
const authUrl = `${baseApi}${route}?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}`;

const getTokenUrl = 'https://api.login.yahoo.com/oauth2/get_token';

function log() { console.log(...arguments); };
class App extends Component {
  state = {
    access_token: '',
    refresh_token: '',
    loggedIn: false,
  }
  componentDidMount() {
    // check if we have a refresh token
    const refresh_token = localStorage.getItem('refresh_token');
    const access_token = localStorage.getItem('access_token');
    log('checking for refresh token...');
    if (refresh_token) {
      log('refresh token found: ', refresh_token);
      log('access token found: ', access_token);
      this.setState({ access_token, refresh_token, loggedIn: true });
      // TODO - get a new access token
      return
    }
    log('no refresh token. checking if the user is coming from yahoo auth');
    // if theres no refresh token, just wait for the user to sign in
    // if the user is coming from yahoo auth, the url will include /yfs?code=abcd
    if ((window.location.href || '').indexOf('yfs')) {
      
      const params = window.location.search;
      const indexOfCode = params.indexOf('code=') + 5;
      const code = params.substring(indexOfCode);
      log('just logged, the code is', code);
      log('exchange code for access_token and refresh_token');

      const postBody = {
        client_id,
        client_secret,
        redirect_uri: '',
        code,
        grant_type: 'authorization_code'
      }
      fetch(getTokenUrl, {
        mode: 'cors',
        method: 'POST',
        body: JSON.stringify(postBody),
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
      }).then((response) => response.json()).then((data) => {
        // sample response:
        //   {
        //     "access_token":"Jzxbkqqcvjqik2IMxGFEE1cuaos--",
        //     "token_type":"bearer",
        //     "expires_in":3600,
        //     "refresh_token":"AOiRUlJn_qOmByVGTmUpwcMKW3XDcipToOoHx2wRoyLgJC_RFlA-",
        //     "xoauth_yahoo_guid":"JT4FACLQZI2OCE"
        //  }
        const { access_token, refresh_token } = data;
        window.localStorage.setItem('refresh_token', refresh_token);
        window.localStorage.setItem('access_token', access_token);
        log('set localStorage');
      }).catch((error) => {
        console.error(error);
      })
    }
  }

  render() {
    const { access_token, refresh_token } = this.state;
    return (
      <div className="App">
        <button onClick={() => window.location = authUrl}>Sign in with Yahoo!</button>
        <div>
          Access Token: {access_token || 'not found'}
          Refresh Token: {refresh_token || 'not found'}
        </div>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
        </p>
        </header>
      </div>
    );
  }
}

export default App;
