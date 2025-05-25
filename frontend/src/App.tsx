import Leagues from "./app/leagues/LeagueMatchesPage.js";
import NavBar from "./app/layout/NavBar.js";
import MainPage from "./app/leagues/LeaguesPage.js";
import Team from "./app/teams/TeamPage.js";
import MatchDetails from "./app/matches/MatchDetails.js";
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
            <Route path="/leagues/:leagueName" element={<Leagues key={location.pathname} />} />
            <Route path="/team/:teamName" element={<Team />} />
            <Route path="/match_details" element={<MatchDetails />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </>
  );
}

export default App;
