import "./homeScreen.css"
import welcomeImage from "../images/destiny-ghost.jpg"
import { SearchForPlayerByBungieID, GetProfileFromDestinyMembershipID } from "../backend/bungieAPI.js";
import { getStats } from "../statsScreen/statsScreen.js";
let setPageFunc = () => {}
async function SearchPlayer(e){
    e.preventDefault();
    const form = new FormData(e.target);
    const entries = Object.fromEntries(form.entries());
    console.log(entries);
    await getStats(entries.player1, entries.player2);
    /*await SearchForPlayerByBungieID("CodedCole").then((data) => {
        console.log(data);
        GetProfileFromDestinyMembershipID(data.searchResults[0].PrimaryDestinyMembershipType, data.searchResults[0].PrimaryDestinyMembershipID).then((data) => {
            console.log(data);
        });
    });
    await SearchForPlayerByBungieID("DJ Tears").then((data) => {
        console.log(data);
        GetProfileFromDestinyMembershipID(data.searchResults[0].PrimaryDestinyMembershipType, data.searchResults[0].PrimaryDestinyMembershipID).then((data) => {
            console.log(data);
        });
    });//*/
    setPageFunc(1);
}

// Test Players
// CodedCole#5868
// DJ Tears#4567

export default function HomeScreen({setPage}) {
    setPageFunc = setPage;
    return (
        <div id="welcome">
            <img src={welcomeImage} alt="" />
            <div>
            <h1><span className="left_of_center">DESTINY</span><span className="right_of_center">COMPARE</span></h1>
            </div>
            <form onSubmit={SearchPlayer}>
                <div className="search_boxes">
                    <input className="player_search" name="player1" type="text" placeholder="Find Player..."></input>
                    <input className="player_search" name="player2" type="text" placeholder="Compare With..."></input>
                </div>
                <button type="submit">Compare</button>
            </form>
        </div>
    );
}