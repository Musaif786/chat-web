import "./App.css";
import "./Css/utility.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from './pages/Profile'
import Reset from "./pages/Reset";
import AuthProvider from "./context/auth";
import PrivateRoute from "./components/PrivateRoute";
import Box from "./components/Box";
import Edit from "./pages/Edit";
import Main from "./pages/Main";
import Allusers from "./components/Adminpage/Allusers";
import Two from "./components/Adminpage/Two";
import { Chatbot } from "./components/Chatbot";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/reset" component={Reset} />
          <Route exact path="/" component={Main} />
          <PrivateRoute exact path="/profile" component={Profile} />
          <PrivateRoute exact path="/chat" component={Home} />
          <PrivateRoute exact path="/box" component={Box} />
          <PrivateRoute exact path="/edit" component={Edit} />
          <PrivateRoute exact path="/allusers" component={Allusers} />
          <PrivateRoute exact path="/two/:id" component={Two} />

        </Switch>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
