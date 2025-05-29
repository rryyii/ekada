import { useState } from "react";

/**
 * Returns a component that handles the application's searching function for easy access to team data.
 * 
 * @category Layout
 */
function Search() {
    const [output, changeOutput] = useState("");
    return (
        <div>
            <form>
                <input value={output} onChange={e => changeOutput(e.target.value)} type="query" placeholder="Search" />
            </form>
            <p>{output}</p>
        </div>
    );
}

export default Search;