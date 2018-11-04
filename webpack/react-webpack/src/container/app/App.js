/*
 * @Author: caijw 
 * @Date: 2018-10-23 00:23:08 
 * @Last Modified by:   caijw 
 * @Last Modified time: 2018-10-23 00:23:08 
 */
import React, { Component } from 'react'
import Nav from '../../components/Nav';
export default class App extends Component {
  render() {
    return (
      <div>
         <Nav></Nav>
        <div className="container">
         {this.props.children}
        </div>
      </div>
    )
  }
}
