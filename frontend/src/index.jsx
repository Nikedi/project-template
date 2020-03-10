/* DO NOT DELETE THESE LINES */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {Table} from './components/tempTable.jsx'

import './assets/stylesheets/style.css';

const { BACKEND_PORT } = process.env;
const baseUrl = window.location.hostname;
const backendUrl = `http://${baseUrl}:${BACKEND_PORT}`;

/* ADD YOUR CODE AFTER THIS LINE */

const getGreetingFromBackend = async () => {
  try {
    const url = `${backendUrl}/api/greeting`;
    console.log(`Getting greeting from ${url}`);
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    console.error(error);
  }
  return { greeting: 'Could not get greeting from backend' };
};

const getEvents = async () => {
    const url = `${backendUrl}/api/events`
    const response = await fetch(url)
    return response.json()
}

const BackendGreeting = (props) => (
  <div>
    <p>
      Backend says:
      {' '}
      {props.greeting}
    </p>
  </div>
);

const BackendEvent = (props) => {
    return(
	<div>
	<p>
	Temperature: {props.temperature}
	</p>
	</div>
    )}

BackendGreeting.propTypes = {
    greeting: PropTypes.string,
};

BackendGreeting.defaultProps = {
  greeting: '',
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
	greeting: '',
	events: [],
    };
  }

  async componentDidMount() {
      const response = await getGreetingFromBackend();
      const events = await getEvents();
      console.log(events)
      this.setState({ greeting: response.greeting,events: events.results });
  }

  render() {
      return (
	  <>
	<Table events={this.state.events}/>
	  </>
      );
  }
}

/* DO NOT DELETE AFTER THIS LINE */

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
