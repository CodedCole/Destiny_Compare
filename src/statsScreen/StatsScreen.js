import overallLogo from '../images/AccountIcon.png';
import vanguardLogo from '../images/vanguardSmallIconPNG.png';
import crucibleLogo from '../images/CrucibleLogo.png';
import playerLogo from '../images/emblemPlaceholderIcon.png';
import AnyChart from 'anychart-react';
import {SearchForPlayerByBungieID, GetProfileFromDestinyMembershipID} from '../backend/bungieAPI.js';
import './statsScreen.css';

var stats1 = {"isLoading": true}; 
var stats2 = {"isLoading": true}; 
var person1 = {"isLoading": true}; 
var person2 = {"isLoading": true}; 


export async function getStats(name1, name2) {
  person1 = await SearchForPlayerByBungieID(name1);
  person1["isLoading"] = false; 
  stats1["response"] = await GetProfileFromDestinyMembershipID(person1.searchResults[0].PrimaryDestinyMembershipType, person1.searchResults[0].PrimaryDestinyMembershipID);
  stats1["isLoading"] = false; 

  person2 = await SearchForPlayerByBungieID(name2);
  person2["isLoading"] = false; 
  stats2["response"] = await GetProfileFromDestinyMembershipID(person2.searchResults[0].PrimaryDestinyMembershipType, person2.searchResults[0].PrimaryDestinyMembershipID);
  stats2["isLoading"] = false; 

  console.log("Last Class Played: " + stats1.response.lastClassPlayed);
  console.log("Hunter Playtime: " + stats1.response.playtime.hunter);
  console.log("Warlock Playtime: " + stats1.response.playtime.warlock);
  console.log("Titan Playtime: " + stats1.response.playtime.titan);
}

function StatsScreen(props) {
  getStats("CodedCole", "DJ Tears"); 
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
            <p class="compare_inline"> {person1.isLoading ? "PLAYER NAME" : person1.searchResults[0].BungieDisplayName}</p>
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
          <p class="played_class_text">
            Most Played Class: {stats1.isLoading ? "loading" : (stats1.response.playtime.hunter > stats1.response.playtime.warlock && stats1.response.playtime.hunter > stats1.response.playtime.titan ? "Hunter" : (stats1.response.playtime.warlock > stats1.response.playtime.titan ? "Warlock" : "Titan"))}
          </p>
          <p class="played_class_text">Last Played Class: {stats1.isLoading ? "loading" : stats1.response.lastClassPlayed}</p>
        </div>
          <div class="pie_category">
            <AnyChart 
              width={500}
              height={400}
              background="#222222"
              type="pie"
              data={[["Hunter", stats1.isLoading ? 1 : stats1.response.playtime.hunter], ["Titan", stats1.isLoading ? 2 : stats1.response.playtime.titan], ["Warlock", stats1.isLoading ? 3 : stats1.response.playtime.warlock]]}
              title="Playtime by Class in Minutes"
            />
          </div>
        {/*<div class="pie_category2">
          <AnyChart 
                width={500}
                height={400}
                background="#222222"
                type="pie"
                data={[["Hunter", stats1.isLoading ? 1 : stats1.response.playtime.hunter], ["Titan", stats1.isLoading ? 2 : stats1.response.playtime.titan], ["Warlock", stats1.isLoading ? 3 : stats1.response.playtime.warlock]]}
                title="Playtime by Class in Minutes"
          />
</div>*/}
        <div class="played_class">
          <p class="played_class_text">
            Total Kills: {stats1.isLoading ? "loading" : stats1.response.kills.pvpKillsOverall.value}
          </p>
        </div>

         {/* <AnyChart 
            width={500}
            height={400}
            background="#222222"
            type="pie"
            data={[["Hunter", stats2.isLoading ? 1 : stats2.response.playtime.hunter], ["Titan", stats2.isLoading ? 2 : stats2.response.playtime.titan], ["Warlock", stats2.isLoading ? 3 : stats2.response.playtime.warlock]]}
            title="Playtime by Class in Minutes"
/>*/}
      </header>
    </div>
    )
  }

export default StatsScreen; 