import NavBar from 'components/NavBar/Navbar';
import FilterPage from 'pages/FilterPage/FilterPage';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { IAppContext, IStettingsState, initialMainState, initialSettingsState, appContext } from 'state/context';


const App = () => {
  const [appState, setAppState] = useState<IAppContext>(initialMainState)
  const [settingsState, setSettingsState] = useState<IStettingsState>(initialSettingsState)

  return (
    <Router>
        <appContext.Provider value={{appState, setAppState, settingsState, setSettingsState}}>
          <NavBar />
          <Routes>
            <Route path="/" element={<FilterPage />} />
          </Routes>
        </appContext.Provider>
    </Router>
  );
}

export default App;