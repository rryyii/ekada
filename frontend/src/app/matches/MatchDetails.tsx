import { useLocation, Link } from "react-router";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { championList, ItemImage, SummonerImage } from "../util/champion-images";
import { groupPlayersIntoTeams, MatchData } from "../util/match-series";

/**
 * Returns a component that displays necessary details for a selected match.
 * 
 * @category Match
 */
function MatchDetails() {
    const location = useLocation();
    const { value, tournamentName } = location.state;
    const [selectedMatch, setSelectedMatch] = useState<MatchData>();
    const [teams, setTeams] = useState<any>();
    const [queryKey, setQueryKey] = useState(0);

    const { data } = useQuery({
        queryKey: [`matchData-${selectedMatch?.MatchId}`, selectedMatch?.MatchId, queryKey],
        queryFn: () => fetch(`http://localhost:${import.meta.env.VITE_APP_PORT}/api/match/${encodeURIComponent(selectedMatch?.MatchId ?? "")}/${queryKey}`)
            .then((res) => res.json()),
        enabled: !!selectedMatch && !!queryKey,
        refetchOnWindowFocus: true,
        staleTime: 0,
    })

    useEffect(() => {
        if (data) {
            setTeams(groupPlayersIntoTeams(data));
        }
        if (value && queryKey == 0) {
            setSelectedMatch(value[0].title);
            setQueryKey(1);
        }
    }, [data])

    return (
        <div className="d-flex flex-column">
            <div id="match-details" className="d-flex flex-col justify-content-evenly">
                <div id="match-content">
                    <div className="match-btns">
                        {value.map((item: any, index: number) => (
                            <button key={index} className="btn btn-light match-btn" onClick={() => { setSelectedMatch(item.title); setQueryKey(index + 1); }}>{index + 1}</button>
                        ))}
                        <a className="btn btn-light" target="_blank" href={selectedMatch ? selectedMatch.VOD : "Loading"}>
                            VOD
                        </a>
                    </div>
                    <div className="d-flex flex-col justify-content-around">
                        <div className="match-team1 d-flex">
                            <Link to={`/team/${selectedMatch?.Team1}/${tournamentName}`}>
                                <h1>{selectedMatch ? selectedMatch.Team1 : "No Team 1 Found"}</h1>
                            </Link>
                        </div>
                        <div className="match-team2">
                            <Link to={`/team/${selectedMatch?.Team2}/${tournamentName}`}>
                                <h1>{selectedMatch ? selectedMatch.Team2 : "No Team 2 Found"}</h1>
                            </Link>
                        </div>
                    </div>
                    <div className="d-flex flex-column gap-3 p-2">
                        <div id="match-bans" className="d-flex flex-row justify-content-around">
                            {selectedMatch ? championList(selectedMatch.Team1Bans) : "Fetching Team 1 Bans"}
                            {selectedMatch ? championList(selectedMatch.Team2Bans) : "Fetching Team 2 Bans"}
                        </div>
                        {selectedMatch ? <Objectives selectedMatch={selectedMatch} /> : "Failed to display objectives"}
                    </div>
                    <div className="d-flex p-5 flex-col gap-3 match-container flex-wrap">
                        <table className="match-table">
                            <thead>
                                <tr>
                                    <th>
                                        {selectedMatch?.Team1} {selectedMatch?.WinTeam == selectedMatch?.Team1 ?
                                            <h1 className="winner-team">Won</h1>
                                            : <h1 className="loser-team">Lost</h1>
                                        }
                                        <div>
                                            {teams?.get(selectedMatch?.Team1)[0].title.Side == "1" ? "Blue" : "Red"}
                                        </div>
                                    </th>
                                    <th>
                                        <p>Patch {selectedMatch ? selectedMatch.Patch : "Loading"}</p>
                                    </th>
                                    <th>
                                        <p>{selectedMatch ? selectedMatch.Gamelength : "Loading"}</p>
                                    </th>
                                </tr>
                                <tr className="match-table-header">
                                    <th>Spells</th>
                                    <th>Items</th>
                                    <th>KDA</th>
                                    <th>CS</th>
                                    <th>Gold</th>
                                    <th>Damage</th>
                                    <th>Champion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teams ? teams.get(selectedMatch?.Team1).map((item: any) => (
                                    <tr key={`team-details-${item.title.Name}`}>
                                        <td>
                                            <ItemImage item={item.title.Trinket} patch={selectedMatch?.Patch ?? ""} />
                                            {item.title.SummonerSpells.split(",").map((val: string, idx: number) => (
                                                <SummonerImage key={idx} spell={val} />
                                            ))}
                                        </td>
                                        <td className="d-flex flex-wrap player-items">
                                            {item.title.Items.split(";").map((val: string, idx: number) => (
                                                <ItemImage key={idx} item={val} patch={selectedMatch?.Patch ?? ""} />
                                            ))}
                                        </td>
                                        <td>
                                            <span>{item.title.Kills}</span>
                                            <span>/</span>
                                            <span>{item.title.Deaths}</span>
                                            <span>/</span>
                                            <span>{item.title.Assists}</span>
                                        </td>
                                        <td>
                                            <span>{item.title.CS}</span>
                                        </td>
                                        <td>
                                            <span>{parseInt(item.title.Gold).toLocaleString("en-US")} </span>
                                        </td>
                                        <td>
                                            <span>{parseInt(item.title.DamageToChampions).toLocaleString("en-US")} </span>
                                        </td>
                                        <td className="d-flex flex-row align-items-end">
                                            <span>{championList(item.title.Champion)}</span>
                                            <span> {item.title.Name}</span>
                                        </td>
                                    </tr>
                                ))
                                    : <tr></tr>}
                            </tbody>
                        </table>
                        <hr></hr>
                        <table className="match-table">
                            <thead>
                                <tr>
                                    <th>
                                        {selectedMatch?.Team2} {selectedMatch?.WinTeam == selectedMatch?.Team2 ?
                                            <h1 className="winner-team">Won</h1>
                                            : <h1 className="loser-team">Lost</h1>
                                        }
                                        <div>
                                            {teams?.get(selectedMatch?.Team2)[0].title.Side == "1" ? "Blue" : "Red"}
                                        </div>
                                    </th>
                                </tr>
                                <tr className="match-table-header">
                                    <th>Spells</th>
                                    <th>Items</th>
                                    <th>KDA</th>
                                    <th>CS</th>
                                    <th>Gold</th>
                                    <th>Damage</th>
                                    <th>Champion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teams ? teams.get(selectedMatch?.Team2).map((item: any) => (
                                    <tr key={`team-details-${item.title.Name}`}>
                                        <td>
                                            <ItemImage item={item.title.Trinket} patch={selectedMatch?.Patch ?? ""} />
                                            {item.title.SummonerSpells.split(",").map((val: string, idx: number) => (
                                                <SummonerImage key={idx} spell={val} />
                                            ))}
                                        </td>
                                        <td className="d-flex flex-wrap player-items">
                                            {item.title.Items.split(";").map((val: string, idx: number) => (
                                                <ItemImage key={idx} item={val} patch={selectedMatch?.Patch ?? ""} />
                                            ))}
                                        </td>
                                        <td>
                                            <span>{item.title.Kills}</span>
                                            <span>/</span>
                                            <span>{item.title.Deaths}</span>
                                            <span>/</span>
                                            <span>{item.title.Assists}</span>
                                        </td>
                                        <td>
                                            <span>{item.title.CS}</span>
                                        </td>
                                        <td>
                                            <span>{parseInt(item.title.Gold).toLocaleString("en-US")} </span>
                                        </td>
                                        <td>
                                            <span>{parseInt(item.title.DamageToChampions).toLocaleString("en-US")} </span>
                                        </td>
                                        <td className="d-flex flex-row align-items-end">
                                            <span>{championList(item.title.Champion)}</span>
                                            <span> {item.title.Name}</span>
                                        </td>
                                    </tr>
                                ))
                                    : <tr></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

/**
 * Returns a component including relevant elements for a matches objective data, including icons and their corresponding numbers
 *
 * @param selectedMatch Relevant match data for the selected match.
 * @category Match
 */
function Objectives({ selectedMatch }: { selectedMatch: MatchData }) {
    return (
        <div>
            <div id="match-objectives" className="d-flex flex-row gap-5 justify-content-evenly">
                <div className="d-flex flex-row gap-3">
                    <div className="match-objective-div">
                        <svg width="32" height="32" viewBox="0 0 32 32" className="size-16 lg:size-20 scale-110" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M18.2557 5.31855L26.3761 9.8299C26.7612 10.0438 27 10.4497 27 10.8902C27 11.0785 26.9562 11.2642 26.872 11.4326L24.5883 16C24.0923 21.0584 20.4607 25.5315 19.333 26.8109C19.1841 26.9799 18.9147 26.9207 18.8435 26.7069L18 24.1765H14L13.1565 26.7069C13.0853 26.9207 12.8159 26.9799 12.667 26.8109C11.5393 25.5315 7.90768 21.0584 7.41174 16L5.12805 11.4326C5.04384 11.2642 5 11.0785 5 10.8902C5 10.4497 5.23881 10.0438 5.62386 9.8299L13.7443 5.31855C13.8276 5.27226 13.9223 5.35774 13.8848 5.44536L11 12.1765C11.8333 13.0098 14 13.7765 16 10.1765C18 13.7765 20.1667 13.0098 21 12.1765L18.1152 5.44536C18.0777 5.35774 18.1724 5.27226 18.2557 5.31855ZM16 17.1765C16.8284 17.1765 17.5 16.5049 17.5 15.6765C17.5 14.8481 16.8284 14.1765 16 14.1765C15.1716 14.1765 14.5 14.8481 14.5 15.6765C14.5 16.5049 15.1716 17.1765 16 17.1765ZM16 22.1765C16.8284 22.1765 17.5 21.5049 17.5 20.6765C17.5 19.8481 16.8284 19.1765 16 19.1765C15.1716 19.1765 14.5 19.8481 14.5 20.6765C14.5 21.5049 15.1716 22.1765 16 22.1765ZM20.25 18.1765C20.25 19.0049 19.5784 19.6765 18.75 19.6765C17.9216 19.6765 17.25 19.0049 17.25 18.1765C17.25 17.3481 17.9216 16.6765 18.75 16.6765C19.5784 16.6765 20.25 17.3481 20.25 18.1765ZM13.25 19.6765C14.0784 19.6765 14.75 19.0049 14.75 18.1765C14.75 17.3481 14.0784 16.6765 13.25 16.6765C12.4216 16.6765 11.75 17.3481 11.75 18.1765C11.75 19.0049 12.4216 19.6765 13.25 19.6765Z" fill="currentColor">
                            </path>
                        </svg>
                        {selectedMatch ? selectedMatch.Team1Barons : "No Team 1 Barons"}
                    </div>
                    <div className="match-objective-div">
                        <svg width="32" height="32" viewBox="0 0 32 32" className="size-16 lg:size-20 scale-110" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M23 5.5V11.5H28L23 16.5V20.5L18 24.5L17 27.5H15L14 24.5L9 20.5V16.5L4 11.5H9V5.5L13.5 10L16 4.5L18.4965 10L23 5.5ZM17 17.5L22 14.5L19 20.5L17 19.5V17.5ZM10 14.5L15 17.5V19.5L13 20.5L10 14.5Z" fill="currentColor"></path></svg>
                        {selectedMatch ? selectedMatch.Team1Dragons : "No Team 1 Dragons"}
                    </div>
                    <div className="match-objective-div">
                        <svg width="32" height="32" viewBox="0 0 32 32" className="size-16 lg:size-20 scale-110" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.25 9.375C17.75 7.625 16 5.125 16 5.125C16 5.125 14.25 7.625 13.75 9.375C14.25 11.125 16 13.625 16 13.625C16 13.625 17.75 11.125 18.25 9.375Z" fill="currentColor"></path>
                            <path d="M9.75004 10.125C8.25004 11.125 6.75004 13.875 8.75004 15.625C9.14284 13.4646 9.68995 12.7854 10.3913 11.9146C10.5828 11.677 10.7856 11.4251 11 11.125L13.25 12.625C13.25 12.625 13.5 10.625 12.75 9.125C11.25 8.125 9.75004 7.875 9.75004 7.875V10.125Z" fill="currentColor"></path><path d="M22.25 10.125C23.75 11.125 25.25 13.875 23.25 15.625C22.8572 13.4646 22.3101 12.7854 21.6087 11.9146C21.4172 11.677 21.2144 11.4251 21 11.125L18.75 12.625C18.75 12.625 18.5 10.625 19.25 9.125C20.75 8.125 22.25 7.875 22.25 7.875V10.125Z" fill="currentColor"></path><path fillRule="evenodd" clipRule="evenodd" d="M11 13.125C9 15.125 9.25 17.125 9.25 17.125C7.75 15.125 5.25 14.625 3.25 14.625C4.12371 16.3724 5.7608 18.2153 7.39008 20.0493C9.49035 22.4136 11.5776 24.7632 12 26.875V22.125C12 22.125 13.75 23.625 16 24.375C18.25 23.625 20 22.125 20 22.125V26.875C20.4224 24.7632 22.5096 22.4136 24.6099 20.0493C26.2392 18.2153 27.8763 16.3724 28.75 14.625C26.75 14.625 24.25 15.125 22.75 17.125C22.75 17.125 23 15.125 21 13.125C21 13.125 19.75 15.625 16 16.625C12.25 15.625 11 13.125 11 13.125ZM10.6135 16.9637C12.9319 17.7524 14.0552 18.8518 14.2942 20.5726C11.2589 20.2141 10.6135 18.5651 10.6135 16.9637ZM21.3865 16.9637C19.0681 17.7524 17.9448 18.8518 17.7058 20.5726C20.7411 20.2141 21.3865 18.5651 21.3865 16.9637Z" fill="currentColor">
                            </path>
                        </svg>
                        {selectedMatch ? selectedMatch.Team1Atakhans : "No Team 1 Atakhans"}
                    </div>
                    <div className="match-objective-div">
                        <svg width="32" height="32" viewBox="0 0 32 32" className="size-16 lg:size-20 scale-110" xmlns="http://www.w3.org/2000/svg"><path d="M15.9997 19.339C16.7132 19.339 17.2917 17.9477 17.2917 16.7586C17.2917 15.5694 16.7132 15.0327 15.9997 15.0327C15.2862 15.0327 14.7079 15.5694 14.7079 16.7586C14.7079 17.9477 15.2862 19.339 15.9997 19.339Z" fill="currentColor"></path><path fillRule="evenodd" clipRule="evenodd" d="M11.6803 11.0327H12.3511C13.4192 10.3975 14.667 10.0327 15.9999 10.0327C17.3329 10.0327 18.5806 10.3975 19.6488 11.0327H20.3195C20.3195 9.03271 20.3195 8.03553 18.9999 6.03271C21.3332 6.53271 25.9999 9.43271 25.9999 17.0327C24.3362 17.6982 23.0184 19.4492 22.3345 20.4989C21.1392 22.777 18.751 24.3309 15.9999 24.3309C13.2488 24.3309 10.8606 22.777 9.66527 20.4989C8.98137 19.4492 7.66364 17.6982 5.9999 17.0327C5.9999 9.43271 10.6666 6.53271 12.9999 6.03271C11.6803 8.03553 11.6803 9.03271 11.6803 11.0327ZM19.7496 16.3329C19.7496 19.1532 18.0709 21.0327 16 21.0327C13.9291 21.0327 12.2502 19.1532 12.2502 16.3329C12.2502 14.262 13.9967 13.5333 16 13.5333C18.0034 13.5333 19.7496 14.262 19.7496 16.3329Z" fill="currentColor"></path><path d="M22.1668 25.0509C22.3553 24.4995 22.678 24.0152 23.0006 23.5309C23.4138 22.9108 23.8269 22.2909 23.9576 21.5307C24.0044 21.2585 24.2404 21.0099 24.4829 21.142C24.6688 21.2433 24.7837 21.4011 24.8964 21.556C25.0726 21.798 25.2434 22.0327 25.6711 22.0327C26.6434 22.0327 27 22.0327 27 23.0332C27 23.9184 25.4367 25.585 22.997 25.9576C22.451 26.041 21.9881 25.5736 22.1668 25.0509Z" fill="currentColor"></path><path d="M8.99936 23.5309C9.322 24.0152 9.64473 24.4995 9.83321 25.0509C10.0119 25.5736 9.549 26.041 9.00297 25.9576C6.56334 25.585 5 23.9184 5 23.0332C5 22.0327 5.35661 22.0327 6.32887 22.0327C6.75662 22.0327 6.92743 21.798 7.10356 21.556C7.21629 21.4011 7.33121 21.2433 7.51707 21.142C7.75959 21.0099 7.99559 21.2585 8.0424 21.5307C8.17314 22.2909 8.58618 22.9108 8.99936 23.5309Z" fill="currentColor"></path></svg>
                        {selectedMatch ? selectedMatch.Team1RiftHeralds : "No Team 1 Rift Heralds"}
                    </div>
                    <div className="match-objective-div">
                        <svg width="32" height="32" viewBox="0 0 32 32" className="size-16 lg:size-20 scale-110" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24 7.26397C27 7.26397 27 10.264 27 11.264C27 14.264 24 15.264 24 15.264H27C26.0189 15.918 25.3587 17.1069 24.6345 18.4107C23.1444 21.0938 21.3837 24.264 16 24.264C10.6163 24.264 8.85561 21.0938 7.36548 18.4107C6.64135 17.1069 5.9811 15.918 5 15.264H8C8 15.264 5 14.264 5 11.264C5 10.264 5 7.26397 8 7.26397H9.58357C10.5151 7.26397 11.4337 7.0471 12.2669 6.63052L15.1056 5.21115C15.6686 4.92962 16.3314 4.92962 16.8944 5.21115L19.7331 6.63051C20.5663 7.0471 21.4849 7.26397 22.4164 7.26397H24ZM19.5354 12.264L15.9999 8.72845L12.4644 12.264L13.7322 13.5319L10.4646 16.7995L14.0001 20.335L15.9993 18.3359L17.9984 20.335L21.5339 16.7995L18.2669 13.5325L19.5354 12.264Z" fill="currentColor"></path></svg>
                        {selectedMatch ? selectedMatch.Team1VoidGrubs : "No Team 1 Void Grubs"}
                    </div>
                    <div className="match-objective-div">
                        <svg width="32" height="32" viewBox="0 0 32 32" className="size-16 lg:size-20 scale-110" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M22.5068 10.3065L16 3.79968L9.49317 10.3065L11.3867 12.2001H8L16 20.2001L24 12.2001H20.6133L22.5068 10.3065ZM19.8207 10.3064L16 6.48567L12.1793 10.3064L16 14.1271L19.8207 10.3064Z" fill="currentColor"></path><path d="M13.1429 28.2001L10.2857 15.6286L16 22.4858L21.7143 15.6286L18.8571 28.2001H13.1429Z" fill="currentColor"></path></svg>

                        {selectedMatch ? selectedMatch.Team1Towers : "No Team 1 Towers"}
                    </div>
                </div>
                <div className="d-flex flex-row gap-3">
                    <div className="match-objective-div">
                        <svg width="32" height="32" viewBox="0 0 32 32" className="size-16 lg:size-20 scale-110" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M18.2557 5.31855L26.3761 9.8299C26.7612 10.0438 27 10.4497 27 10.8902C27 11.0785 26.9562 11.2642 26.872 11.4326L24.5883 16C24.0923 21.0584 20.4607 25.5315 19.333 26.8109C19.1841 26.9799 18.9147 26.9207 18.8435 26.7069L18 24.1765H14L13.1565 26.7069C13.0853 26.9207 12.8159 26.9799 12.667 26.8109C11.5393 25.5315 7.90768 21.0584 7.41174 16L5.12805 11.4326C5.04384 11.2642 5 11.0785 5 10.8902C5 10.4497 5.23881 10.0438 5.62386 9.8299L13.7443 5.31855C13.8276 5.27226 13.9223 5.35774 13.8848 5.44536L11 12.1765C11.8333 13.0098 14 13.7765 16 10.1765C18 13.7765 20.1667 13.0098 21 12.1765L18.1152 5.44536C18.0777 5.35774 18.1724 5.27226 18.2557 5.31855ZM16 17.1765C16.8284 17.1765 17.5 16.5049 17.5 15.6765C17.5 14.8481 16.8284 14.1765 16 14.1765C15.1716 14.1765 14.5 14.8481 14.5 15.6765C14.5 16.5049 15.1716 17.1765 16 17.1765ZM16 22.1765C16.8284 22.1765 17.5 21.5049 17.5 20.6765C17.5 19.8481 16.8284 19.1765 16 19.1765C15.1716 19.1765 14.5 19.8481 14.5 20.6765C14.5 21.5049 15.1716 22.1765 16 22.1765ZM20.25 18.1765C20.25 19.0049 19.5784 19.6765 18.75 19.6765C17.9216 19.6765 17.25 19.0049 17.25 18.1765C17.25 17.3481 17.9216 16.6765 18.75 16.6765C19.5784 16.6765 20.25 17.3481 20.25 18.1765ZM13.25 19.6765C14.0784 19.6765 14.75 19.0049 14.75 18.1765C14.75 17.3481 14.0784 16.6765 13.25 16.6765C12.4216 16.6765 11.75 17.3481 11.75 18.1765C11.75 19.0049 12.4216 19.6765 13.25 19.6765Z" fill="currentColor"></path></svg>
                        {selectedMatch ? selectedMatch.Team2Barons : "No Team 2 Barons"}
                    </div>
                    <div className="match-objective-div">
                        <svg width="32" height="32" viewBox="0 0 32 32" className="size-16 lg:size-20 scale-110" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M23 5.5V11.5H28L23 16.5V20.5L18 24.5L17 27.5H15L14 24.5L9 20.5V16.5L4 11.5H9V5.5L13.5 10L16 4.5L18.4965 10L23 5.5ZM17 17.5L22 14.5L19 20.5L17 19.5V17.5ZM10 14.5L15 17.5V19.5L13 20.5L10 14.5Z" fill="currentColor"></path></svg>
                        {selectedMatch ? selectedMatch.Team2Dragons : "No Team 2 Dragons"}
                    </div>
                    <div className="match-objective-div">
                        <svg width="32" height="32" viewBox="0 0 32 32" className="size-16 lg:size-20 scale-110" xmlns="http://www.w3.org/2000/svg"><path d="M18.25 9.375C17.75 7.625 16 5.125 16 5.125C16 5.125 14.25 7.625 13.75 9.375C14.25 11.125 16 13.625 16 13.625C16 13.625 17.75 11.125 18.25 9.375Z" fill="currentColor"></path><path d="M9.75004 10.125C8.25004 11.125 6.75004 13.875 8.75004 15.625C9.14284 13.4646 9.68995 12.7854 10.3913 11.9146C10.5828 11.677 10.7856 11.4251 11 11.125L13.25 12.625C13.25 12.625 13.5 10.625 12.75 9.125C11.25 8.125 9.75004 7.875 9.75004 7.875V10.125Z" fill="currentColor"></path><path d="M22.25 10.125C23.75 11.125 25.25 13.875 23.25 15.625C22.8572 13.4646 22.3101 12.7854 21.6087 11.9146C21.4172 11.677 21.2144 11.4251 21 11.125L18.75 12.625C18.75 12.625 18.5 10.625 19.25 9.125C20.75 8.125 22.25 7.875 22.25 7.875V10.125Z" fill="currentColor"></path><path fillRule="evenodd" clipRule="evenodd" d="M11 13.125C9 15.125 9.25 17.125 9.25 17.125C7.75 15.125 5.25 14.625 3.25 14.625C4.12371 16.3724 5.7608 18.2153 7.39008 20.0493C9.49035 22.4136 11.5776 24.7632 12 26.875V22.125C12 22.125 13.75 23.625 16 24.375C18.25 23.625 20 22.125 20 22.125V26.875C20.4224 24.7632 22.5096 22.4136 24.6099 20.0493C26.2392 18.2153 27.8763 16.3724 28.75 14.625C26.75 14.625 24.25 15.125 22.75 17.125C22.75 17.125 23 15.125 21 13.125C21 13.125 19.75 15.625 16 16.625C12.25 15.625 11 13.125 11 13.125ZM10.6135 16.9637C12.9319 17.7524 14.0552 18.8518 14.2942 20.5726C11.2589 20.2141 10.6135 18.5651 10.6135 16.9637ZM21.3865 16.9637C19.0681 17.7524 17.9448 18.8518 17.7058 20.5726C20.7411 20.2141 21.3865 18.5651 21.3865 16.9637Z" fill="currentColor"></path></svg>
                        {selectedMatch ? selectedMatch.Team2Atakhans : "No Team 2 Atakhans"}
                    </div>
                    <div className="match-objective-div">
                        <svg width="32" height="32" viewBox="0 0 32 32" className="size-16 lg:size-20 scale-110" xmlns="http://www.w3.org/2000/svg"><path d="M15.9997 19.339C16.7132 19.339 17.2917 17.9477 17.2917 16.7586C17.2917 15.5694 16.7132 15.0327 15.9997 15.0327C15.2862 15.0327 14.7079 15.5694 14.7079 16.7586C14.7079 17.9477 15.2862 19.339 15.9997 19.339Z" fill="currentColor"></path><path fillRule="evenodd" clipRule="evenodd" d="M11.6803 11.0327H12.3511C13.4192 10.3975 14.667 10.0327 15.9999 10.0327C17.3329 10.0327 18.5806 10.3975 19.6488 11.0327H20.3195C20.3195 9.03271 20.3195 8.03553 18.9999 6.03271C21.3332 6.53271 25.9999 9.43271 25.9999 17.0327C24.3362 17.6982 23.0184 19.4492 22.3345 20.4989C21.1392 22.777 18.751 24.3309 15.9999 24.3309C13.2488 24.3309 10.8606 22.777 9.66527 20.4989C8.98137 19.4492 7.66364 17.6982 5.9999 17.0327C5.9999 9.43271 10.6666 6.53271 12.9999 6.03271C11.6803 8.03553 11.6803 9.03271 11.6803 11.0327ZM19.7496 16.3329C19.7496 19.1532 18.0709 21.0327 16 21.0327C13.9291 21.0327 12.2502 19.1532 12.2502 16.3329C12.2502 14.262 13.9967 13.5333 16 13.5333C18.0034 13.5333 19.7496 14.262 19.7496 16.3329Z" fill="currentColor"></path><path d="M22.1668 25.0509C22.3553 24.4995 22.678 24.0152 23.0006 23.5309C23.4138 22.9108 23.8269 22.2909 23.9576 21.5307C24.0044 21.2585 24.2404 21.0099 24.4829 21.142C24.6688 21.2433 24.7837 21.4011 24.8964 21.556C25.0726 21.798 25.2434 22.0327 25.6711 22.0327C26.6434 22.0327 27 22.0327 27 23.0332C27 23.9184 25.4367 25.585 22.997 25.9576C22.451 26.041 21.9881 25.5736 22.1668 25.0509Z" fill="currentColor"></path><path d="M8.99936 23.5309C9.322 24.0152 9.64473 24.4995 9.83321 25.0509C10.0119 25.5736 9.549 26.041 9.00297 25.9576C6.56334 25.585 5 23.9184 5 23.0332C5 22.0327 5.35661 22.0327 6.32887 22.0327C6.75662 22.0327 6.92743 21.798 7.10356 21.556C7.21629 21.4011 7.33121 21.2433 7.51707 21.142C7.75959 21.0099 7.99559 21.2585 8.0424 21.5307C8.17314 22.2909 8.58618 22.9108 8.99936 23.5309Z" fill="currentColor"></path></svg>
                        {selectedMatch ? selectedMatch.Team2RiftHeralds : "No Team 2 Rift Heralds"}
                    </div>
                    <div className="match-objective-div">
                        <svg width="32" height="32" viewBox="0 0 32 32" className="size-16 lg:size-20 scale-110" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24 7.26397C27 7.26397 27 10.264 27 11.264C27 14.264 24 15.264 24 15.264H27C26.0189 15.918 25.3587 17.1069 24.6345 18.4107C23.1444 21.0938 21.3837 24.264 16 24.264C10.6163 24.264 8.85561 21.0938 7.36548 18.4107C6.64135 17.1069 5.9811 15.918 5 15.264H8C8 15.264 5 14.264 5 11.264C5 10.264 5 7.26397 8 7.26397H9.58357C10.5151 7.26397 11.4337 7.0471 12.2669 6.63052L15.1056 5.21115C15.6686 4.92962 16.3314 4.92962 16.8944 5.21115L19.7331 6.63051C20.5663 7.0471 21.4849 7.26397 22.4164 7.26397H24ZM19.5354 12.264L15.9999 8.72845L12.4644 12.264L13.7322 13.5319L10.4646 16.7995L14.0001 20.335L15.9993 18.3359L17.9984 20.335L21.5339 16.7995L18.2669 13.5325L19.5354 12.264Z" fill="currentColor"></path></svg>

                        {selectedMatch ? selectedMatch.Team2VoidGrubs : "No Team 2 Void Grubs"}
                    </div>
                    <div className="match-objective-div">
                        <svg width="32" height="32" viewBox="0 0 32 32" className="size-16 lg:size-20 scale-110" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M22.5068 10.3065L16 3.79968L9.49317 10.3065L11.3867 12.2001H8L16 20.2001L24 12.2001H20.6133L22.5068 10.3065ZM19.8207 10.3064L16 6.48567L12.1793 10.3064L16 14.1271L19.8207 10.3064Z" fill="currentColor"></path><path d="M13.1429 28.2001L10.2857 15.6286L16 22.4858L21.7143 15.6286L18.8571 28.2001H13.1429Z" fill="currentColor"></path></svg>
                        {selectedMatch ? selectedMatch.Team2Towers : "No Team 2 Towers"}
                    </div>
                </div>
            </div>

        </div>
    );
}


export default MatchDetails;

