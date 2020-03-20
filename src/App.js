import React, {Fragment, useEffect} from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Navbar from './components/layouts/Navbar';
import Landing from './components/layouts/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from '../src/components/layouts/Alert';
import CreateProfile from './components/profile_forms/CreateProfile';
import PrivateRoute from './routing/PrivateRoute';
import setAuthToken from './uitils/setAuthToken';
import Dashboard from './components/dashboard/Dashboard';
import './App.css';

//Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';

if(localStorage.token) {
  setAuthToken(localStorage.token);
}

const App =()=>{
  useEffect(() =>{
    store.dispatch(loadUser());
  }, []);
 return (
  <Provider store={store}>
  <Router>
    <Fragment>
     <Navbar/>
    <Route exact path='/' component={Landing}/>
      <section className="container">
        <Alert/>
           <Switch>
             <Route exact path="/login" component={Login}/>
             <Route exact path ="/register" component={Register}/>
             <PrivateRoute exact path="/dashboard" component={Dashboard}/>
             <PrivateRoute exact path="/create-profile" component={CreateProfile}/>
           </Switch>
      </section>
</Fragment>
  </Router>
  </Provider>

)};
 


export default App;
