import { Route, Routes, BrowserRouter } from 'react-router-dom';
import MainWrapper from './layouts/MainWrapper';
import PrivateRoute from './layouts/privateRoute';

import Register from '../src/views/auth/Register'

function App() {
 return (
  <BrowserRouter>
    <MainWrapper>
      <Routes>
        <Route path = "/" element = {<Register />} />
        <Route path = "/register" element = {<Register />} />
      </Routes>
    </MainWrapper>
  
  </BrowserRouter>
 );
}

export default App;
