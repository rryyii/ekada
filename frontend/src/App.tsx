import Leagues from "./components/content/LeagueMatchesPage.js";
import NavBar from "./components/layout/NavBar.js";
import MainPage from "./components/content/LeaguesPage.js";
import Team from "./components/content/TeamPage.js";
import MatchDetails from "./components/content/MatchDetails.js";
import { BrowserRouter as Router, Route, Routes } from "react-router";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/leagues/:leagueName" element={<Leagues />} />
            <Route path="/team/:teamName" element={<Team />} />
            <Route path="/match_details" element={<MatchDetails />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </>
  );
}

export default App;
