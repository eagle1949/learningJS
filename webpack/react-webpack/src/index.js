/*
 * @Author: caijw 
 * @Date: 2018-10-22 23:32:30 
 * @Last Modified by: caijw
 * @Last Modified time: 2018-11-04 20:54:33
 */
import React from 'react';
import {render} from 'react-dom';
import { Router, Route,Switch,Redirect,Link } from 'react-router-dom'
import BrowserHistory from 'history/createBrowserHistory';
import Bundle from "./components/Bundle";
import App from './container/app/App';

// 按需加载
let LazyHome =(props) => (<Bundle {...props} load={()=>import('./container/home/Home')}/>)
let LazyProfile =(props) => (<Bundle {...props} load={()=>import('./container/profile/Profile')}/>)

let history = BrowserHistory();
class Index extends React.Component {
  render() {
    return (
      <Router history={history}>
        <App>
            <Switch>
                <Route path='/' exact={true} component={LazyHome}></Route>
                <Route path='/profile' component={LazyProfile}></Route>
                <Redirect to="/"></Redirect>
            </Switch>
        </App>
      </Router>
    )
  }
}
render(<Index/>, document.getElementById('root'));
