import { useQuery } from "@tanstack/react-query";

/**
 * A helper function that returns a component with the corresponding champion's image.
 * 
 * @param champions List or String of champion(s) to fetch their corresponding image/icon.
 * @returns A component with each given champion as their main icon.
 * @category Util
 */
export function championList(champions: string) {
    if (champions) {
        const data = handleNameCases(champions.split(","));
        return (
            <div className="d-flex flex-row">
                {data.map((champion, index) => (
                    <div key={index}>
                        <img className="base-img" loading="lazy" src={`https://ddragon.leagueoflegends.com/cdn/15.15.1/img/champion/${champion.replace(/\s/g, '').replace(/'/g, '')}.png`} width="40" height="40" draggable="false" alt={`${champion} image`} />
                    </div>
                ))}
            </div>
        );
    }
}

/**
 * Helper function to handle champion name cases to properly fetch from the CDN.
 * @param championData Array of champion names.
 * @returns championData but with the proper champion names.
 * @category Util
 */
function handleNameCases(championData : Array<string>) {
        let kaisaIndex = championData.indexOf("Kai'Sa");
        let wuIndex = championData.indexOf("Wukong");
        let renIndex = championData.indexOf("Renata Glasc");
        let belIndex = championData.indexOf("Bel'Veth");
        let choIndex = championData.indexOf("Cho'Gath");
        let blancIndex = championData.indexOf("LeBlanc");
        if (kaisaIndex != -1) {
            championData[kaisaIndex] = "Kaisa";
        }
        if (wuIndex != -1) {
            championData[wuIndex] = "MonkeyKing";
        }
        if (renIndex != -1) {
            championData[renIndex] = "Renata";
        }
        if (belIndex != -1) {
            championData[belIndex] = "Belveth";
        }
        if (choIndex != -1) {
            championData[choIndex] = "Chogath";
        }
        if (blancIndex != -1) {
            championData[blancIndex] = "Leblanc";
        }
        return championData;
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
    const { data } = useQuery({
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
}

/**
 * A helper function that returns an image component referencing the requested summoner spell.
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
}