import logo from './logo.svg';
import './App.css';
import NavBar from "./components/NavBar"
import Marketplace from "./pages/Marketplace"
import Collection from "./pages/Collection"
import SimpleMarketPlace from "./pages/SimpleMarketPlace"

import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";

const StyledMainBodyDiv = styled.div`
width: 100%;
margin: auto;
`
const StyledFontDiv = styled.div`
color: lightsalmon;
font-size: 50px;
`
function App() {
  const { account, chainId } = useWeb3React()
  return (
    <Router>
      <div className="App">
        <NavBar />
        <StyledMainBodyDiv>
          <Switch>
            <Route path="/marketplace">
              {
                account ? <Marketplace /> : <StyledFontDiv>please connect wallet</StyledFontDiv>
              }
            </Route>
            {/* <Route path="/collection">
            {
              account ? <Collection /> : null
            }
          </Route> */}
            <Route path="/order">
              {
                account ? <SimpleMarketPlace /> : <StyledFontDiv>please connect wallet</StyledFontDiv>
              }
            </Route>
          </Switch>
        </StyledMainBodyDiv>
      </div>
    </Router>
  );
}

export default App;
