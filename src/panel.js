

import {
  LitElement,
  html,
  css
} from 'lit';



import {
  mdiAccount,
  mdiShieldLock,
  mdiShieldOff,
  mdiShieldHome,
  mdiWaterBoiler,
  mdiWaterBoilerOff,
  mdiShieldAlert,
  mdiWeathersunny,
  mdiWeatherCloudy,
  mdiWeatherPartlyCloudy
} from '@mdi/js';

import '@jamescoyle/svg-icon';


const faultColor = css`#e300ff`;
const alarmColor = css`#d0342c`; // #ff0033
const warningColor = css`#FFBF00`;
const normalColor = css`#eeeeee`;
const normalTextColor = css`#bbbbbb`;

const houseOutlineColor = "#909090";
const hocolor = css`#a0a0a0`;
const hocolor2 = css`#909090`;

const celciusSymbol = "C";

/*  &#8451;  &#x2103;
650 lines

521

000000 333333 666666 999999 cccccc ffffff

002878 5064b4 c8ecfa 008c3c

alarm
fa3232 fff546 ff9600 ff64c8 46ff64


cold blue 81acf5 6892db
warm green
81c24f background-image: linear-gradient(red, yellow);
*/

const tempLL =19;

const tempL = 20;
const tempH = 22;
const tempHH = 23;

class JhomePanel extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      narrow: { type: Boolean },
      route: { type: Object },
      panel: { type: Object },
    };
  }

  render() {

    console.log(this.panel);


    const temps = this.panel.config.roomTemperatures.reduce((res, cur) => res + '<div style="color:#2222ff">' + cur.name + '</div>', '')

    const x = 200;
    const svgWidth = 1000;
    const svgHeight = 500;

    const centerX = svgWidth / 2;
    const upY = 150;
    const topMargin = 10;
    const houseWidth = svgWidth * 0.70;
    const wallHeight = 650;
    const roofHeight = houseWidth * 0.3;
    const bottomFloorHeight = 0.33 * wallHeight;
    const firstFloorHeight = 0.33 * wallHeight;
    const secondFloorHeight = 0.33 * wallHeight;

    const faultColorClass = "fault";
    const alarmColorClass = "alarm";
    const warningColorClass = "warning";
    const normalColorClass = "normal";


    const doors = [
      { floor: 0, side: "left" },
      { floor: 1, side: "left" },
      { floor: 1, side: "right" },
    ]
    const getColor = (val) => {

      if (!val) {
        return faultColorClass;

      }
      else if (val < tempLL) {
        return alarmColorClass;
      }
      else if (val < tempL) {
        return warningColorClass;
      }
      else if (val > tempHH) {
        return alarmColorClass;
      }
      else if (val > tempH) {
        return warningColorClass;
      }
      else {
        return normalColorClass;
      }
      ;

    }

    const showValue = (val, unit) => html`
                                <div class="sensor ${getColor(val)}">
                                  <div class="sensor-value">
                                    ${val}
                                  </div>
                                  <div class="sensor-unit">
                                    ${unit}
                                  </div>
                                </div>`;

    const sensorValue = (val, side, unit) => html`<div class="room ${side}"><div class="sensor-name">${val.name}</div>${showValue(this.hass.states[val.entityId].state, unit)} ${showValue(this.hass.states[val.entityId].state, unit)} ${showValue(this.hass.states[val.entityId].state, unit)}</div>`;
    const sensorValue2 = (val) => html`<div class="sensor-value">${this.hass.states[val.entityId].state}</div>`;

    const drawRoofOutline = () => html`
      ${showAlarmStatus(1)}


      <div class="roof">
        <svg id="svg-roof" width="100%" height="100%" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="none">
          <polyline points="0,500 500,8, 1000,500" style="fill:transparent;stroke:${houseOutlineColor};stroke-width:14" />
        </svg>
      </div>
    `;

    const radiatorLine = (floor, line, pfix, extra) => html`
      <div class="radiator-line ${extra}">
        ${this.panel.config.roomTemperatures.filter(a => a.line === line && a.floor === floor).map(n => sensorValue(n, (line === 1 ? "left" : "right") + pfix, celciusSymbol))}
      </div>
  `;

    const bufferLines = () => html`
      <div class="buffer-lines">
        <div class="item-line" >${sensorValue2(this.panel.config.entities.supplyLine)} C</div>
        <div class="arrow red">&larr;</div>
        <div class="item-line" >${sensorValue2(this.panel.config.entities.returnLine)} C</div>
        <div class="arrow blue">&rarr;</div>
      </div>
    `;

    const buffer = () => html`
      <div class="buffer">
        <div class="item" >Buffer</div>
      </div>
    `;

    const pump = () => html`
      <div class="pump">
        <div class="item" >Pump</div>
        <div class="item" >${sensorValue2(this.panel.config.entities.pumpPower)} w</div>
        <div class="item" >Heating</div>
      </div>
    `;

    const boiler = () => {


      /*

cold blue 81acf5 6892db
warm green
81c24f background-image: linear-gradient(red, yellow);
*/


      let topColor = "#81c24f";
      let bottomColor = "#81c24f";

      console.log(this.panel.config.entities.waterTop, this.panel.config.entities.waterCharge)
      const valt = this.hass.states[this.panel.config.entities.waterTop.entityId].state;
      const valc = this.hass.states[this.panel.config.entities.waterCharge.entityId].state

      if (valt < 36) {
        topColor = "#6892db";
      }
      else if (valt < 40) {
        topColor = "#6892db";
      }

      if (valc < 36) {
        bottomColor = "#6892db";
      }
      else if (valc < 40) {
        bottomColor = "#6892db";
      }

      return    html`
      <div class="boiler" style="background-image: linear-gradient(${topColor}, ${bottomColor});">
        <div class="item" >${sensorValue2(this.panel.config.entities.waterTop)}</div>
        <div class="item" >
          <font color="white">
            <svg-icon type="mdi" size="24" path=${mdiWaterBoiler} ></svg-icon>
          </font>
        </div>
        <div class="item" >${sensorValue2(this.panel.config.entities.waterCharge)}</div>
      </div>
    `;
    }


    const drawHouse = () => html`
      <div class="house">
        <div class="floors">

          <div class="floor second">
           <div class="radiator-lines">
              ${radiatorLine(2, 1, "")}
              ${radiatorLine(2, 2, "")}
            </div>
          </div>

          <div class="floor first">
            <div class="radiator-lines">
              ${radiatorLine(1, 1, "")}
              ${radiatorLine(1, 2, "")}
            </div>
          </div>

          <div class="floor basement">

            <div class="boiler-room">
              ${bufferLines()}
              ${buffer()}
              ${boiler()}
              ${pump()}
            </div> <!-- BOILER ROOM -->

            <div class="radiator-lines basement">
              <!-- ${radiatorLine(0, 1, " b")} -->
              ${radiatorLine(0, 2, " b", "basement")}
            </div>

          </div> <!-- BASEMENT -->

        </div> <!-- FLOORS -->

      </div> <!-- HOUSE -->
    `;

    const drawDoors = (doors) => html`
      <div class="doors">
        ${doors.map(d=>"Door")}
      </div>
    `;

    const drawCorner = (type) => html`<div ?hidden=${this.narrow} class="${type}cor">  </div>`;
    const drawCenter = (type, content) => html`<div class="${type}cen"> ${content} </div>`;
    const drawSide = (type, doors) => html`
      <div ?hidden=${this.narrow} class="${type}sid">
        ${drawDoors(doors)}
      </div>
    `;


    const showAlarmStatus = (status2) => {

      let status = "armed_home";
      let color = normalTextColor;
      let icon = mdiShieldOff;
      let aText = "Disarmed";
      switch (status) {
        case "armed_home":
          color = "#00BFFF";
          icon = mdiShieldHome;
          aText = "Armed home";

          break;
        case "armed_away":
          color = "#00BFFF";
          icon = mdiShieldLock;
          aText = "Armed away";
        default:
      }
      return html`
      <div class="alarm-status">
        <font color=${color}>
          <svg-icon type="mdi" size="48" path=${icon} ></svg-icon>
        </font>
        <div class="alarm-text">${aText}</div>

      </div>
    `;
    }

    return html`




      <div class="main">
        ${drawCorner("t")}
        ${drawCenter("t", drawRoofOutline())}
        ${drawCorner("t")}
        ${drawSide("m", doors.filter( d => d.side === "left"))}
        ${drawCenter("m", drawHouse())}
        ${drawSide("m", doors.filter( d => d.side === "right"))}
        ${drawCorner("b")}
        ${drawCenter("b", "")}
        ${drawCorner("b")}
      </div> `;
  }

  static get styles() {
    return css`

      :host {
        background-color: transparent;
        padding: 0px;
        display: block;
      }

      .main{
        width: 100%;
        height: 100vh;
        display: flex;
        flex-wrap: wrap;
      }
      .tcor, .bcor, .msid {
        flex: 15%;
      }
      .tcen, .mcen, .bcen {
        flex: 70%;
        position: relative;
      }

      .tcor, .tcen {
        height: 20vh;
      }

      .mcen, .msid {
        height: 65vh;
      }

      .bcor, .bcen {
        height: 15vh;
      }

      .house {
        padding: 0;
        width: 100%;
        margin: 0 auto;
      }

      .fault{
        background-color: ${faultColor};
        color: #ffffff;

      }
      .alarm {
        background-color: ${alarmColor};
        color: #ffffff;
      }

      .warning {
        background-color: ${warningColor};
        color: #333333;
      }

      .normal {
        background-color: ${normalColor};
        color: #333333;
      }
      .floors {
        padding: 0;
        border: 6px solid ${hocolor2};
      }
      .roof {
        width: 100%;
        height: 100%;
        padding: 0;
        margin:0;
        border: 0;
        background-color: transparent;
      }
      #svg-roof {
        vertical-align:top;
      }
      .floor {
        padding: 0px;
        display: flex;
        flex-wrap: wrap;
        background-color: transparent;

      }
      .floor:nth-child(even) {
        /*background-color: #fefefe;*/

      }
      .floor:nth-child(odd) {
        /*background-color: #f0f0f0;*/
      }
      .floor.first {
        border-bottom: 6px solid ${hocolor2};
      }
      .floor.second {
        border-bottom: 6px solid ${hocolor2};
      }
      .floor.virtual {
        border-bottom: 6px solid ${hocolor2};
      }
      .floor.basement {
          justify-content: space-between;
          flex-wrap: nowrap;
      }

      .item {
        flex: 100%;
        text-align: center;
      }
      .item-line {
        flex: 50%;
        text-align: center;
      }
      .item-ground {
        text-align: center;
        flex: 50%;
      }
      .item-ground.left {
        text-align: right;
        flex: 0 0 55%;
        padding-right: 6px;
      }
      .item-ground.right {
        text-align: left;
        padding-left: 6px;
        flex: 0 0 35%;
      }

      .ground {
        padding: 3px;
        display: flex;
        flex-wrap: wrap;
        width: 75%;
        margin: 0 auto;
      }

      .ground-lines {
        /*height: 80px;*/
        width: 100%;
        border: 0px solid #3333ff;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        background-color: transparent;
        padding: 3px;
        margin: 3px;
      }

      .room {
        height: 5vh;
        padding: 3px;
        margin: 0px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
      }
      .room.left {
        border-bottom: 3px solid ${hocolor};
        border-right: 3px solid ${hocolor};
      }
      .room.right {
        border-bottom: 3px solid ${hocolor};
        border-left: 3px solid ${hocolor};
      }

      .room.left:first-child {
        border-right: 3px solid ${hocolor};
      }
      .room.left:last-child {
        border-bottom: 0;
        border-right: 3px solid ${hocolor};
      }
      .room.right:first-child {
        border-left: 3px solid ${hocolor};
      }
      .room.right:last-child {
        border-bottom: 0;
        border-left: 3px solid ${hocolor};
      }

      .room.left.b:last-child {
        border-bottom: 3px solid ${hocolor};
        border-right: 3px solid ${hocolor};
      }

      .room.right.b:last-child {
        border-bottom: 3px solid ${hocolor};
        border-left: 3px solid ${hocolor};
      }

      .sensor {
        display: flex;
        flex-wrap: wrap;
        font-weight: bold;
        width: 50%
        text-align: right;
        border-radius: 6px;
        padding: 3px;
        flex: 0 1 20%;
      }
      .sensor-unit {
          flex: 100%;
          text-align: center;
      }
      .sensor-value {
        flex: 100%;
        text-align: center;
      }

      .sensor-name {
        display: inline-block;
        width: 20%
      }
      .arrow {
        font-size: 32px;
        flex: 50%;
      }
      .arrow.red {
        color: red;
      }
      .arrow.blue {
        color: blue;
      }

      .arrowv {
        font-size: 32px;
      }
      .arrowv.red {
        color: red;
        text-align: right;
        flex: 60%;
      }
      .arrowv.blue {
        color: blue;
        text-align: left;
        flex: 40%;
      }

      .boiler-room {
        width: 60%;
        padding: 6px;
        padding-top: 12px;
        display: flex;
        flex-wrap: wrap;
      }
      .pump {
        height: 80px;
        width: 80px;
        font-size: 14px;
        border: 3px solid #cc0033;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        border-radius: 6px;
        background-color: #f0f0f0;
        /*flex: 0 0 25%;*/
        padding: 3px;
        margin: 3px;
      }
      .buffer {
        height: 60px;
        width: 60px;
        border: 3px solid #3300cc;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        background-color: #f0f0f0;
        padding: 3px;
        margin-right: 6px;
        border-radius: 50%;
      }
      .buffer-lines {
        height: 70px;
        width: 70px;
        border: 0px solid #3333ff;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        background-color: #transparent;
        padding: 3px;
        margin: 0;
      }

      .boiler {
        height: 80px;
        width: 50px;
        border: 3px solid #333366;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        background-color: #aa6666;
        padding: 3px;
        margin: 0;
        border-radius: 10%;
        background: linear-gradient(to bottom, #00cc00 50%,#66ccff 50%);
      }

      .radiator-line {
        padding: 0px;
        flex: 0 0 40%;
        margin: 0px;
      }
      .radiator-lines{
        display: flex;
        justify-content: space-between;
        width: 100%;
      }
      .radiator-lines.basement{
        display: flex;
        justify-content: space-between;
        width: 41.5%;
      }
      .radiator-line.basement{
        padding: 0px;
        flex: 0 0 100%;
        margin: 0px;
      }
      .alarm-status {
        position: absolute;
        width: 150px;
        top: 24px;
        left: calc(50% - 75px);
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
      }
      .alarm-text{
        text-align: center;
        width: 140px;

      }
     alarm-icon {
        transform: scale(2);
      }
    `;
  }
}
customElements.define("Jhome-panel", JhomePanel);




