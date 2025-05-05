import { useState } from "react";

function Search() {
    const [output, changeOutput] = useState("");
    // function handleSearch(input) {
    //
    //}

    return (
        <div>
            {/* <form action={handleSearch}>
                <input value={output} onChange={e => changeOutput(e.target.value)} type="query" placeholder="Search" />
            </form>
            <p>{output}</p> */}
        </div>
    );
}

export default Search;