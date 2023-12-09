import "./homeScreen.css"
import welcomeImage from "../images/destiny-ghost.jpg"
import { SearchForPlayerByBungieID, GetProfileFromDestinyMembershipID } from "../backend/bungieAPI.js";

function SearchPlayer(){
    SearchForPlayerByBungieID("CodedCole").then((data) => {
        console.log(data);
        GetProfileFromDestinyMembershipID(data.searchResults[0].PrimaryDestinyMembershipType, data.searchResults[0].PrimaryDestinyMembershipID).then((data) => {
            console.log(data);
        });
    });
    SearchForPlayerByBungieID("DJ Tears").then((data) => {
        console.log(data);
    });
}

// Test Players
// CodedCole#5868
// DJ Tears#4567

export default function HomeScreen() {
    
    return (
        <div id="welcome">
            <img src={welcomeImage} alt="" />
            <h1><span className="left_of_center">DESTINY</span><span className="right_of_center">COMPARE</span></h1>
            <div className="search_boxes">
                <input className="player_search" type="text" placeholder="Find Player..."></input>
                <input className="player_search" type="text" placeholder="Compare With..."></input>
            </div>
            <button onClick={SearchPlayer}>Compare</button>
        </div>
    );
}