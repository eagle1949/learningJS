/*
 * @Author: caijw 
 * @Date: 2018-11-04 21:04:02 
 * @Last Modified by:   caijw 
 * @Last Modified time: 2018-11-04 21:04:02 
 * 
 * 按需加载
 */
import React from 'react';
export default class Bundle extends React.Component{
    state={Mod: null}
    componentWillMount() {
        this.props.load().then(mod=>this.setState({Mod: mod.default? mod.default:mod}));
    }
    render() {
        let Mod=this.state.Mod;
        return Mod&&<Mod  {...this.props}/>;
    }
}