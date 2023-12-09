import overallLogo from '../images/AccountIcon.png';
import vanguardLogo from '../images/vanguardSmallIconPNG.png';
import crucibleLogo from '../images/CrucibleLogo.png';
import playerLogo from '../images/emblemPlaceholderIcon.png';
import AnyChart from 'anychart-react';
import {SearchForPlayerByBungieID, GetProfileFromDestinyMembershipID} from '../backend/bungieAPI.js';
import './statsScreen.css';

var stats = {"isLoading": true}; 

export async function getStats() {
  var person = await SearchForPlayerByBungieID("CodedCole");
  stats["response"] = await GetProfileFromDestinyMembershipID(person.searchResults[0].PrimaryDestinyMembershipType, person.searchResults[0].PrimaryDestinyMembershipID);
  stats["isLoading"] = false; 
}

function StatsScreen(props) {
  getStats(); 
    return (<div className="App">
      <header className="App-header">
        <div>
         <div class="compare compare_inline">
            <h3>COMPARE</h3>
          </div>
          <div class="player_name compare_inline">
            <div class="blockLogo">
              <img src={playerLogo} />
            </div>
            <p class="compare_inline">PLAYER NAME</p>
          </div>
        </div>
        <div class="container compare_categories">
          <div class="blockLogo">
            <img src={overallLogo} /> 
          </div>
          <div class="text">
            <h3>OVERALL</h3>
          </div>
        </div>
        <div class="compare_categories">
          <div class="blockLogo">
            <img src={vanguardLogo} />
          </div>
          <div class="text">
            <h3>VANGUARD</h3>
          </div>
        </div>
        <div class="compare_categories">
          <div class="blockLogo">
            <img src={crucibleLogo} />
          </div>
          <div class="text">
            <h3>CRUCIBLE</h3>
          </div>
        </div>
        <div class="played_class">
          <p class="played_class_text">Most Played Class: Hunter</p>
          <p class="played_class_text">Last Played Class: {stats.isLoading ? "loading" : stats.response.lastPlayedClass}</p>
        </div>
        {/*<div class="pie_category">*/}
          <div class="pie_category">
            <AnyChart 
              width={800}
              height={600}
              fontColor="#FFFFFF"
              type="pie"
              data={[["Hunter", stats.isLoading ? 1 : stats.response.playtime.hunter], ["Titan", stats.isLoading ? 2 : stats.response.playtime.titan], ["Warlock", stats.isLoading ? 3 : stats.response.playtime.warlock]]}
              title="Playtime by Class"
            />
          </div>
          {/*<div class="pie_category">
          <p class="played_class_text">Playtime By Class</p>
          <div class="donut">
            <p class="pie_text">491 HRS PLAYED</p>
          </div>
          <p class="play_by_class">Hunter: 307 hrs</p>
          <p class="play_by_class">Warlock: 123 hrs</p>
          <p class="play_by_class">Titan: 61 hrs</p>
        </div>
        <div class="pie_category">
          <p class="played_class_text">Kills By Class</p>
          <div class="donut2">
            <p class="pie_text">82,321</p>
          </div>
          <p class="play_by_class">Hunter: 61,740</p>
          <p class="play_by_class">Warlock: 12,349</p>
          <p class="play_by_class">Titan: 8,232</p>
</div>*/}
      </header>
    </div>
    )
  }

export default StatsScreen; 