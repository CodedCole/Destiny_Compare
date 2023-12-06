import "./homeScreen.css"
import welcomeImage from "../images/destiny-ghost.jpg"
import { SearchForPlayerByBungieID } from "../backend/bungieAPI.js";

export default function HomeScreen() {
    SearchForPlayerByBungieID("CodedCole").then((data) => {
        console.log(data);
    });
    return (
        <div id="welcome">
            <img src={welcomeImage} alt="" />
            <h1><span className="left_of_center">DESTINY</span><span className="right_of_center">COMPARE</span></h1>
            <div className="search_boxes">
                <input className="player_search" type="text" placeholder="Find Player..."></input>
                <input className="player_search" type="text" placeholder="Compare With..."></input>
            </div>
        </div>
    );
}