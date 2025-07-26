import { useQuery } from "@tanstack/react-query";

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
                        <img className="base-img" loading="lazy" src={`https://ddragon.leagueoflegends.com/cdn/15.11.1/img/champion/${champion.replace(/\s/g, '').replace(/'/g, '')}.png`} width="60" height="60" draggable="false" alt={`${champion} image`} />
                    </div>
                ))}
            </div>
        );
    }
    console.log("Champion list is empty.")
}

/**
 * A helper function that returns an image component referencing the requested item.
 *
 * @param item Name of the item 
 * @param patch Relevant patch for the requested item
 * @returns An image component of the fetched item
 * @category Util
 */
export function ItemImage({ item, patch }: { item: string, patch: string }) {
    const { error, data } = useQuery({
        queryKey: [`leagueData-${item}`],
        queryFn: () => fetch(`http://localhost:${import.meta.env.VITE_APP_PORT}/api/item/${encodeURIComponent(item)}/${encodeURIComponent(patch)}`)
            .then((res) => res.json()),
        refetchOnWindowFocus: true,
        staleTime: 0,
    });

    if (item && data) {
        return (
            <img className="base-img" loading="lazy" src={`${data.url}`} width="35" height="35" draggable="false" alt={`${item} image`} />
        );
    }
    console.error("Failed to fetch image of the given item.");
}

 /* A helper function that returns an image component referencing the requested summoner spell.
 *
 * @param item Name of the spell 
 * @returns An image component of the fetched spell
 * @category Util
 */
export function SummonerImage({ spell }: { spell: string }) {
    const { data } = useQuery({
        queryKey: [`leagueData-${spell}`],
        queryFn: () => fetch(`http://localhost:${import.meta.env.VITE_APP_PORT}/api/summoner_spell/${encodeURIComponent(spell)}`).then((res) => res.json()),
        refetchOnWindowFocus: true,
        staleTime: 0,
    });

    if (spell && data) {
        return (
            <img className="base-img" loading="lazy" src={`${data.url}`} width="35" height="35" draggable="false" alt={`${spell} image`} />
        )
    }
    console.error("Failed to fetch correct summoner spell image.")
}