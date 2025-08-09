import Leagues from "./leagues/LeagueMatchesPage.js";
import NavBar from "./layout/NavBar.js";
import MainPage from "./leagues/LeaguePage.js";
import Team from "./teams/TeamPage.js";
import MatchDetails from "./matches/MatchDetails.js";
import Footer from "./layout/Footer.js"
import { BrowserRouter as Router, Route, Routes } from "react-router";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

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
            <Route path="/team/:teamName/:leagueName" element={<Team />} />
            <Route path="/match_details" element={<MatchDetails />} />
          </Routes>
          <Footer />
        </Router>
      </QueryClientProvider>
    </>
  );
}

export default App;
