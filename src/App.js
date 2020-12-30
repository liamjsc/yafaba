import { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const baseApi = 'https://api.login.yahoo.com/oauth2';
const route = '/request_auth';
const client_id = 'dj0yJmk9a3FUWHNVWEZvR0NlJmQ9WVdrOWJWQk1XV040ZFhrbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTdh';
const redirect_uri = 'https://liamschauerman.com/yfs';
const response_type = 'code';
const authUrl = `${baseApi}${route}?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}`;


class App extends Component {
  componentDidMount() {
    console.log('cdm', window.location);
    if ((window.location.href || '').indexOf('yfs')) {
      const params = window.location.search;
      const indexOfCode = params.indexOf('code=') + 5;
      const code = params.substring(indexOfCode);
      console.log(window.location.search);
      console.log(code);
    }
  }
  render() {
    return (
      <div className="App">
        <button onClick={() => window.location = authUrl}>Sign in with Yahoo!</button>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
        </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
        </a>
        </header>
      </div>
    );
  }
}

export default App;
