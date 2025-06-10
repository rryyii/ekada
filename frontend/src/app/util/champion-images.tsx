/**
 * A helper function that returns a component with the corresponding champion's image.
 * 
 * @param champions List or String of champion(s) to fetch their corresponding image/icon.
 * @category Util
 */
export function championList(champions: string) {
    if (champions) {
        return (
            <div className="d-flex flex-row">
                {champions.split(",").map((champion, index) => (
                    <div key={index}>
                        <img className="champion-img" loading="lazy" src={`https://ddragon.leagueoflegends.com/cdn/15.11.1/img/champion/${champion.replace(/\s/g, '')}.png`} width="78" height="78" draggable="false" alt={`${champion} image`} />
                    </div>
                ))}
            </div>
        );
    }
}


import { useQuery } from "@tanstack/react-query";
export function ItemImage({ item }: { item: string }) {
    const { isPending, error, data } = useQuery({
        queryKey: [`leagueData-${item}`],
        queryFn: () => fetch(`http://localhost:${import.meta.env.VITE_APP_PORT}/api/item/${encodeURIComponent(item)}`).then((res) => res.json()),
        refetchOnWindowFocus: true,
        staleTime: 0,
    });

    if (item && data) {
        return (
            <img className="item-img" loading="lazy" src={`${data.url}`} width="30" height="30" draggable="false" alt={`${item} image`} />
        );
    }
}

export function SummonerImage({ spell }: { spell: string }) {
    const { isPending, error, data } = useQuery({
        queryKey: [`leagueData-${spell}`],
        queryFn: () => fetch(`http://localhost:${import.meta.env.VITE_APP_PORT}/api/summoner_spell/${encodeURIComponent(spell)}`).then((res) => res.json()),
        refetchOnWindowFocus: true,
        staleTime: 0,
    });

    if (spell && data) {
        return (
            <div>
                <img loading="lazy" src={`${data.url}`} width="30" height="30" draggable="false" alt={`${spell} image`} />
            </div>
        )
    }
}