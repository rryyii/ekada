import { useParams } from "react-router";
import {
    useQuery,
} from '@tanstack/react-query'

function Team() {
    const params = useParams();
    const teamName = params.teamName;
    const { isPending, error, data } = useQuery({
        queryKey: ['teamData'],
        queryFn: () => fetch(`http://localhost:${import.meta.env.VITE_APP_PORT}/api/team_info/${teamName}`).then((res) => res.json()),
    })

    if (isPending) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message

    if (data) {
        return (
            <div>
                <div className="d-flex justify-content-center">
                    <div className="d-flex flex-column team-card">
                        <h1>{data.cargoquery[0].title.Name}</h1>Ï
                        <img src="@" alt={"Logo for " + data.cargoquery[0].title.Name} />
                        <h2>{data.cargoquery[0].title.Region}</h2>
                    </div>
                    <div className="d-flex">
                        <Roster />
                    </div>
                </div>
            </div>
        );
    }

}

function Roster() {
    return (
        <div></div>
    );
}

export default Team;