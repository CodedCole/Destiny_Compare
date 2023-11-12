import overallLogo from '../images/AccountIcon.png';
import vanguardLogo from '../images/vanguardSmallIconPNG.png';
import crucibleLogo from '../images/CrucibleLogo.png';
function StatsScreen(props) {
    return (<div className="App">
      <header className="App-header">
        <div>
         <div class="compare compare_inline">
            <h3>COMPARE</h3>
          </div>
          <div class="player_name compare_inline">
            <p>Player Name</p>
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
      </header>
    </div>
    )
  }

export default StatsScreen; 