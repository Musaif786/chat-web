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


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/reset" component={Reset} />
          <PrivateRoute exact path="/profile" component={Profile} />
          <PrivateRoute exact path="/" component={Home} />
          <PrivateRoute exact path="/box" component={Box} />

        </Switch>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
