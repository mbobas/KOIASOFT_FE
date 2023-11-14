import NavBar from 'components/Navbar';
import FilterPage from 'pages/FilterPage';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { IAppContext, initialMainState } from 'state/context';


const App = () => {
  const [appState, setAppState] = useState<IAppContext>(initialMainState)
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<FilterPage />} />
        {/* other routes */}
      </Routes>
    </Router>
  );
}

export default App;