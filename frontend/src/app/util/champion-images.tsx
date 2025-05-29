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
                        <img className="champion-img" loading="lazy" src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/champion/${champion.replace(/\s/g, '')}.png`} width="78" height="78" draggable="false" alt={`${champion} image`} />
                    </div>
                ))}
            </div>
        );
    }

}
