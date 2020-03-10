import React, { Component } from 'react';

export const Table = (props) => {
    console.log(props);
    const formattedEvents = props.events.map(event => ({...event, timestamp: new Date(event.timestamp).toLocaleString()}));
    return (
	<table>
	  <thead>
	  <tr>
	    <th>ID</th>
	    <th>TIMESTAMP</th>
	    <th>TEMPERATURE</th>
	    <th>HUMIDITY</th>
	  </tr>
	  </thead>
	  <tbody>
	  {formattedEvents.map( (event) => (
	      <tr key={event.id}>	
		<td>{event.id} </td>
		<td>{event.timestamp} </td>
		<td>{event.temperature} </td>
		<td>{event.humidity} </td>
	      </tr>
	  ))}
	</tbody>
	</table>
    );
};
