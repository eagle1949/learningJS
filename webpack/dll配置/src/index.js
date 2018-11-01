/*
 * @Author: caijw 
 * @Date: 2018-11-02 00:06:51 
 * @Last Modified by: caijw
 * @Last Modified time: 2018-11-02 00:54:59
 */
import React, { Component } from 'react';
import ReactDOM,{render} from 'react-dom';


import axios from 'axios';

axios.get('http://localhost:3000/users')
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

render(<div>hello dddddddd rwerffffworld</div>, document.getElementById('root'));