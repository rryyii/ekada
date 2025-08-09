import { useState, useEffect } from "react";

/**
 * Returns a component that handles the application's searching function for easy access to team data.
 * 
 * @category Layout
 */
function Search() {
    const [output, changeOutput] = useState("");
    useEffect(() => {
        
    }, []);
    return (
        <div>
            <form>
                <input id="search-bar" value={output} onChange={e => changeOutput(e.target.value)} type="query" placeholder="Search" />
            </form>
            <p>{output}</p>
        </div>
    );
}

export default Search;