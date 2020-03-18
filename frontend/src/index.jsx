/* DO NOT DELETE THESE LINES */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {Table} from './components/tempTable.jsx'
import {Line} from 'react-chartjs-2';

import './assets/stylesheets/style.css';

const { BACKEND_PORT } = process.env;
const baseUrl = window.location.hostname;
const backendUrl = `http://${baseUrl}:${BACKEND_PORT}`;

/* ADD YOUR CODE AFTER THIS LINE */

function getMinuteAverage(data) {
    let currentMinute;
    let totalAmount = 0;
    let numOfCases = 0;
    let newData=[];
    for(let i=0;i<data.length;i++){
	let thisMinute = new Date(data[i].timestamp).getMinutes()
	if(currentMinute === thisMinute){
	    totalAmount += data.temperature
	    numOfCases += 1
	}else{
	    newData.push({"timestamp":data[i].timestamp,"temperature":totalAmount/numOfCases})
	    numOfCases = 1
	    totalAmount = data.temperature
	    currentMinute = thisMinute
	}
    }
    return data
}

const getData = (events) => ({

  datasets: [
    {
      label: 'My First dataset',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
	data: getMinuteAverage(events.sort(function (a,b) {return new Date(a.x) - new Date(b.x)})).slice(events.length - 100).map(event => {
	    const timestamp = event.timestamp
	    const temperature = event.temperature
	    return {
		x: timestamp,
		y: temperature
	    }
	})
    }
  ]
})

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
      this.setState({ greeting: response.greeting,events: events.results });
  }
    render() {
      return (
	  <>
	    <Line
	      data={getData(this.state.events)}
	      options={{
		  scales: {
		      xAxes:[{
			  type: 'time',
			  distribution: 'series',  
		      }]
		  }
	      }}
	      />
	  </>
      );
  }
}

/* DO NOT DELETE AFTER THIS LINE */

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
