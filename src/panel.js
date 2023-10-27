
import css from "bundle-text:./card.css";

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
  mdiHeatPump,
  mdiArrowDownThick,
  mdiArrowUpThick,
  mdiArrowRightThick,
  mdiArrowLeftThick,
  mdiArrowRight,
    mdiArrowleft,
  mdiApproximatelyEqualBox,
  mdiHeatingCoil,
  mdiRadiator,
  mdiRadiatorDisabled,
  mdiTemperatureCelsius,
  mdiWaterPercent,
  mdiShieldAlert,
  mdiWeathersunny,
  mdiWeatherCloudy,
  mdiWeatherPartlyCloudy,
  mdiRadiatorOff,
  mdiArrowLeft
} from '@mdi/js';

import '@jamescoyle/svg-icon';


const faultColor = css`#e300ff`;
const alarmColor = css`#d0342caf`; // #ff0033
const warningColor = css`#FFBF007f`;
const normalColor = css`#eeeeee`;
const normalTextColor = css`#bbbbbb`;

const houseOutlineColor = "#909090";
const hocolor = css`#a0a0a0`;
const hocolor2 = css`#909090`;

const activeColor = "#00BFFF";

const celciusSymbol = "C";

const boilerColorLL = "#6892db";
const boilerColorL = "#c1d3f0";

const boilerColor = "#ef9490";
const boilerColorH = "#fb8984";
const boilerColorHH = "#f9423a";

const boilerLL = 30;
const boilerL = 40;
const boilerH = 50;
const boilerHH = 55;

const boilerLimits = [boilerLL, boilerL, boilerH, boilerHH];
const boilerColors = [boilerColorLL, boilerColorL, boilerColor, boilerColorH, boilerColorHH]

const getLimitedColor = (val, limits, colors) => {
  let index = 2;

  if (val < boilerLimits[0]) {
    index = 0;
  }
  else if (val < boilerLimits[1]) {
    index = 1;
  }
  else if (val > boilerLimits[3]) {
    index = 4;
  }
  else if (val > boilerLimits[2]) {
    index = 3;
  }
  return boilerColors[index];
};




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

# 10: Off, 20: Hot Water, 30: Heat, 40: Pool, 50: Cooling
*/

const tempLL =19;

const tempL = 20;
const tempH = 22;
const tempHH = 23;

export class JhomePanel extends LitElement {
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



    const showValue = (val, step) => html`
      <div class="sensor-value ${getColor(Math.round(val/0.5)*0.5)}">
        ${Math.round(val/step)*step}
      </div>
    `;

    const showValueWithUnit = (val, unit, step) => html`
                                <div class="sensor">
                                  ${showValue(val, step)}
                                  <div class="sensor-unit">
                                    ${ unit.length > 10
                                      ? html`<svg-icon type="mdi" size="16" path=${unit} ></svg-icon>`
                                      : html`${unit}`

                                    }
                                  </div>
                                </div>`;


    const showTempValue = (val) => showValueWithUnit(val, mdiTemperatureCelsius, 0.5);
    const showHumValue = (val) => showValueWithUnit(val, mdiWaterPercent, 1);


    const getState = (state) => this.hass.states[state.entityId].state;

    const sensorValue = (val, side, unit) => html`<div class="room ${side}"><div class="sensor-name">${val.name}</div>${showTempValue(this.hass.states[val.entityId].state, unit)} ${showHumValue(this.hass.states[val.entityId].state, unit)}</div>`;
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
        ${this.panel.config.roomTemperatures.filter(a => a.line === line && a.floor === floor).map(n => sensorValue(n, (line === 1 ? "left" : "right") + pfix, mdiTemperatureCelsius))}
      </div>
  `;

    const SupplyReturnLines = (supplyTemp, returnTemp, icon, dir) => {


      return html`
        <div class="supply-return-lines">

        <div class="column value" >
          <div> ${getState(this.panel.config.entities.supplyLine)}</div>
          <div> ${getState(this.panel.config.entities.returnLine)}</div>


        </div>

        <div class="column" >
          <font color=${boilerColorH}>
            <svg-icon type="mdi" size="24" path=${mdiArrowRightThick} ></svg-icon>
          </font>
          <font color=${boilerColorL}>
            <svg-icon type="mdi" size="24" path=${mdiArrowLeftThick} ></svg-icon>
          </font>
        </div>

        <div class="column" >
          <div class="item" >
            <font color="black">
              <svg-icon type="mdi" size="24" path=${icon} ></svg-icon>
            </font>
          </div>
        </div>


      </div>
      `;
    };

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
        <div class="item" >
          <font color="#cccccc">
            <svg-icon type="mdi" size="24" path=${mdiApproximatelyEqualBox} ></svg-icon>
          </font>
        </div>
      </div>
    `;

    const pump = () => html`
      <div class="pump">
      <div class="item" >Heating</div>
      <div class="item" >
        <font color=${activeColor}>
          <svg-icon type="mdi" size="28" path=${mdiHeatPump} ></svg-icon>
        </font>
      </div>
        <div class="item" >${showValueWithUnit(getState(this.panel.config.entities.pumpPower), "w", 1)}</div>
      </div>
    `;

    const pumpLines = () => html`
    <div class="pumpLines">


      <div class="item half" >
        <font color=${boilerColorH}>
          <svg-icon type="mdi" size="24" path=${mdiArrowUpThick} ></svg-icon>
        </font>
      </div>
      <div class="item half" >
        <font color=${boilerColorLL}>
          <svg-icon type="mdi" size="24" path=${mdiArrowDownThick} ></svg-icon>
        </font>
      </div>

      <div class="item half" > <div> ${getState(this.panel.config.entities.brineInLine)}</div>

</div>
      <div class="item half" ><div> ${getState(this.panel.config.entities.brineOutLine)}</div></div>

    </div>
  `;

    const boiler = () => {

      const valt = this.hass.states[this.panel.config.entities.waterTop.entityId].state;
      const valc = this.hass.states[this.panel.config.entities.waterCharge.entityId].state
      const topColor = getLimitedColor(valt, boilerLimits, boilerColors)
      const bottomColor = getLimitedColor(valc, boilerLimits, boilerColors)

      return html`

      <div class="boiler" style="background-image: linear-gradient(${topColor}, ${bottomColor});">
        <div class="item" >${sensorValue2(this.panel.config.entities.waterTop)}</div>
        <div class="item" >
          <font color="#666666">
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

              <div class="column">
                ${pump()}
                ${pumpLines()}
              </div>

              <div class="column narrow">


                <div class="buffer-arrow">
                  <font color=${Math.round(getState(this.panel.config.entities.pumpPriority)) === 2 ? activeColor : normalColor}>
                    <svg-icon type="mdi" size="20 " path=${mdiArrowRightThick} ></svg-icon>
                  </font>
                </div>
                <div class="boiler-arrow">
                  <font color=${Math.round(getState(this.panel.config.entities.pumpPriority)) === 3 ? activeColor : normalColor}>
                    <svg-icon type="mdi" size="20 " path=${mdiArrowRightThick} ></svg-icon>
                  </font>
                </div>
              </div>

              <div class="column">
                ${buffer()}
                ${boiler()}

              </div>



              <div class="column">
                ${SupplyReturnLines(35, 32, mdiRadiator)}
                ${SupplyReturnLines(32, 29, mdiHeatingCoil)}
              </div>


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

      * {
       box-sizing: border-box;
      }
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
        background-color: ${faultColor} !important;
        color: #eeeeee !important;

      }
      .alarm {
        background-color: ${alarmColor} !important;
        color: #eeeeee !important;
      }

      .warning {
        background-color: ${warningColor} !important;
        color: #666666 !important;

      }

      .normal {
        background-color: transparent;
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
      .itemb {
        text-align: center;

      }
      .item.twoCol {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        align-content: space-between;
        flex 10%;
      }
      .itemb.twoCol {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        align-content: space-between;
        flex 10%;
      }
      .item.half {
        flex: 0 0 50%;
        text-align: center;
      }
      .item.left {
        text-align: left;

      }
      .item.right {
        text-align: right;

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

      .supply-return-lines {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
      }


      .room {
        min-height: 5vh;
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
        justify-content: center;
        font-weight: bold;
        width: 50%
        text-align: right;
        border-radius: 6px;
        padding: 1px;
        flex: 0 1 20%;
      }
      .sensor-unit {
          text-align: center;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          color: #666666;
      }
      .sensor-value {
        text-align: center;
        font-size: 1.3em;
        color: #444444;
        padding-left: 2px;
        padding-right: 2px;
        border-radius: 3px;

      }

      .sensor-name {
        display: inline-block;
        font-weight: bold;
        width: 25%
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
        display: flex;
        flex-wrap: wrap;
      }
      .column {
        flex: 0 0 30%;

        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;

      }
      .column.narrow {
        flex: 0 0 7%;
      }
      .column.value {
        height: 48px;
      }
      .pump {
        height: 95px;
        width: 60px;
        font-size: 14px;
        border: 3px solid #00BFFF;
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
        height: 45px;
        width: 45px;
        border: 3px solid #cccccc;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        background-color: #f0f0f0;
        padding: 3px;
        margin: 3px;

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
        border: 3px solid #00BFFF;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        background-color: #aa6666;
        padding: 3px;
        margin: 3px;
        margin-right: 6px;

        border-radius: 10%;
        background: linear-gradient(to bottom, #00cc00 50%,#66ccff 50%);
      }

      .buffer-arrow {
        height: 80px;
      }
      .boiler-arrow {
        height: 95px;
      }
      .pumpLines {
        height: auto;
        width: 65px;
        border: 3px solid transparent;
        display: flex;
        flex-wrap: wrap;
        justify-content: start;
        align-items: center;
        background-color: transparent;
        padding: 0px;
        margin: 3px;
        border-radius: 10%;
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




