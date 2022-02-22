import { useState } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import "./App.css";
import Auth from "./pages/Auth";
import Bookings from "./pages/Bookings";
import Events from "./pages/Events";
import MainNavigation from "./components/Navigation/MainNavigation";
import AuthContext from "./context/authContext";

function App() {
  const [state, setState] = useState({
    token: null,
    userId: null,
  });

  const login = (token, userId, tokenExpiration) => {
    setState({ token: token, userId: userId });
  };
  const logout = () => {
    setState({ token: null, userId: null });
  };

  return (
    <div className="App">
      <Router>
        <AuthContext.Provider
          value={{
            token: state.token,
            userId: state.userId,
            login: login,
            logout: logout,
          }}
        >
          <MainNavigation />
          <main className="main-content">
            <Switch>
              {state.token && <Redirect from="/" to="/events" exact />}
              {state.token && <Redirect from="/auth" to="/events" exact />}
              {!state.token && (
                <Route path="/auth">
                  <Auth />
                </Route>
              )}
              <Route path="/events">
                <Events />
              </Route>
              {state.token && (
                <Route path="/bookings">
                  <Bookings />
                </Route>
              )}
              {!state.token && <Redirect to="/auth" exact />}
            </Switch>
          </main>
        </AuthContext.Provider>
      </Router>
    </div>
  );
}

export default App;
