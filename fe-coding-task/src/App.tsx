import FilterPage from 'pages/FilterPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FilterPage />} />
        {/* other routes */}
      </Routes>
    </Router>
  );
}

export default App;