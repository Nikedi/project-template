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
    let totalAmount;
    let numOfCases;
    let newData=[];
    for(let i=0;i<data.length;i++){
	let thisMinute = new Date(data[i].timestamp).getMinutes()
	if(currentMinute === thisMinute){
	    totalAmount += data[i].temperature
	    numOfCases += 1
	}else{
	    newData.push({"timestamp":data[i].timestamp,"temperature":(totalAmount/numOfCases).toFixed(2)})
	    numOfCases = 1
	    totalAmount = data[i].temperature
	    currentMinute = thisMinute
	}
    }
    return newData
}

const getData = (events,timeframeMinutes) => ({

  datasets: [
    {
      label: timeframeMinutes,
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
	data: getMinuteAverage(events.sort(function(a,b) {return new Date(a.timestamp) - new Date(b.timestamp)})).slice(-timeframeMinutes).map(event => {
	    console.log(timeframeMinutes)
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
	timeframe: 60,
    };
  }

  async componentDidMount() {
      const response = await getGreetingFromBackend();
      const events = await getEvents();
      this.setState({ greeting: response.greeting,events: events.results});
  }
    
    render() {
	return (
	    <>
	      <button onClick={() => this.setState({timeframe: 60})}>Hour</button>
	      <button onClick={() => this.setState({timeframe: 1440})}>Day </button>
	      <button onClick={() => this.setState({timeframe: 10080})}>Week </button>
	      <div className="line">
		<Line
		  data={getData(this.state.events,this.state.timeframe)}
		  options={{
		      maintainAspectRatio: false,
		      scales: {
			  xAxes:[{
			      type: 'time',
			      distribution: 'series',  
			  }]
		      }
		  }}
		  />
	      </div>
	    </>
	);
    }
}

/* DO NOT DELETE AFTER THIS LINE */

ReactDOM.render(
    <App />,
    document.getElementById('root'),
);
