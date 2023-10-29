
import styles from './panel.styles';

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
  mdiHeatPumpOutline,
  mdiArrowDownThick,
  mdiArrowUpThick,
  mdiArrowDownThin,
  mdiArrowUpThin,
  mdiArrowRightThick,
  mdiArrowLeftThick,
  mdiArrowRightBold,
  mdiArrowLeftBold,
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
  mdiArrowLeft,
  mdiMoleculeCo2,
  mdiNumeric,
  mdiPump,
  mdiArrowRightBoldBoxOutline
} from '@mdi/js';

import '@jamescoyle/svg-icon';

const faultColor = css`#e300ff`;
const faultTextColor = css`#eeeeee`;

const alarmColor = css`#d0342cdf`; // #ff0033
const alarmTextColor = css`#eeeeee`; // #ff0033

const warningColor = css`#FFBF00df`;
const warningTextColor = css`#666666`;

const normalColor = css`#eeeeee`;
const normalTextColor = css`#bbbbbb`;
const houseOutlineColor = "#909090";
const hocolor = css`#a0a0a0`;
const hocolor2 = css`#909090`;
const activeColor = css`#00BFFF`;
const inActiveColor = css`#FFFFFF22`;
const offColor = css`#cccccc`;

const boilerColorLL = "#6892db";
const boilerColorL = "#c1d3f0";
const boilerColor = "#ef9490";
const boilerColorH = "#fb8984";
const boilerColorHH = "#f9423a";

const pumpLineInColor = "#ffcccc";
const pumpLineOutColor = "#b3d9ff";


const powerColorLL = "#6892db";
const powerColorL = "#c1d3f0";
const powerColor = "#ef9490";
const powerColorH = "#fdb8b5";
const powerColorHH = "#fa726b";

const boilerLL = 30;
const boilerL = 40;
const boilerH = 50;
const boilerHH = 55;

const powerLL = -50;
const powerL = -1;
const powerH = 1500;
const powerHH = 2000;

const boilerLimits = [boilerLL, boilerL, boilerH, boilerHH];
const boilerColors = [boilerColorLL, boilerColorL, boilerColor, boilerColorH, boilerColorHH]

const powerLimits = [powerLL, powerL, powerH, powerHH];
const powerColors = [powerColorLL, powerColorL, powerColor, powerColorH, powerColorHH]

const currentThemeName = "dark"
const theme = {
  light: {
    backgroundColor: css`#fefefe`,
    houseColor: css`#ffffff22`,
    unitColor: css`#666666`,
    valueColor: css`#333333`,
    titleColor: css`#333333`

  },
  dark: {
    backgroundColor: css`#113366`,
    houseColor: css`#ffffff22`,
    unitColor: css`#dddddd`,
    valueColor: css`#efefef`,
    valueDarkColor: css`#333333`,

    titleColor: css`#efefef`

  }

}

const currentTheme = theme[currentThemeName];

const getLimitedColor = (val, limits, colors) => {
  let index = 2;

  if (val < limits[0]) {
    index = 0;
  }
  else if (val < limits[1]) {
    index = 1;
  }
  else if (val > limits[3]) {
    index = 4;
  }
  else if (val > limits[2]) {
    index = 3;
  }
  return colors[index];
};

const tempLL =19;
const tempL = 20;
const tempH = 23;
const tempHH = 24;

const valueLimits = {
  temperature: {
    LL: tempLL,
    L: tempL,
    H: tempH,
    HH: tempHH
  },
  percentage: {
    LL: 10,
    L: 20,
    H: 40,
    HH: 60
  },
  co2: {
    LL: tempLL,
    L: tempL,
    H: tempH,
    HH: tempHH
  },
  power: {
    LL: -10,
    L: -1,
    H: 1500,
    HH: 2000
  },
};

export class JhomePanel extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      narrow: { type: Boolean },
      route: { type: Object },
      panel: { type: Object },
    };
  }

  _handlePumpClick(e) {
    console.log(e);

    console.log(this.prop);
  }

  render() {

    console.log(this.panel);

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


    const secondFloorLine1Count = this.panel.config.rooms.filter(a => a.line === 1 && a.floor === 2).length;
    const secondFloorLine2Count = this.panel.config.rooms.filter(a => a.line === 2 && a.floor === 2).length;
    const firstFloorLine1Count = this.panel.config.rooms.filter(a => a.line === 1 && a.floor === 1).length;
    const firstFloorLine2Count = this.panel.config.rooms.filter(a => a.line === 2 && a.floor === 1).length;
    const basementLine1Count = this.panel.config.rooms.filter(a => a.line === 1 && a.floor === 0).length;
    const basementLine2Count = this.panel.config.rooms.filter(a => a.line === 2 && a.floor === 0).length;


    const doors = [
      { floor: 0, side: "left" },
      { floor: 1, side: "left" },
      { floor: 1, side: "right" },
    ]
    const getColor = (val, limitTarget) => {

      if (!limitTarget) {
        return normalColorClass
      }
      const limits = valueLimits[limitTarget];

      if (typeof val !== "number") {
        return faultColorClass;
      }
      else if (val < limits.LL) {
        return alarmColorClass;
      }
      else if (val < limits.L) {
        return warningColorClass;
      }
      else if (val > limits.HH) {
        return alarmColorClass;
      }
      else if (val > limits.H) {
        return warningColorClass;
      }
      else {
        return normalColorClass;
      }
      ;

    }



    const showValue = (val, step, dec, limitTarget) => html`
      <div class="sensor-value ${getColor(Math.round(val/0.5)*0.5, limitTarget)}">
        ${(Math.round(val/step)*step).toFixed(dec)}
      </div>
    `;

    const showValueWithUnit = (val, unit, step, dec, limitTarget) => html`
                                <div class="sensor">
                                  ${showValue(val, step, dec, limitTarget)}
                                  <div class="sensor-unit">
                                    ${ unit.length > 10
                                      ? html`<svg-icon type="mdi" size="16" path=${unit} ></svg-icon>`
                                      : html`<div class="plain-unit">${unit}</div>`

                                    }
                                  </div>
                                </div>`;


    const showSensorValue = (val, unit) => {

      if (unit === "C") {
        return showValueWithUnit(val, mdiTemperatureCelsius, 0.5, 1, "temperature");
      }
      else if (unit === "%") {
        return showValueWithUnit(val, mdiWaterPercent, 1, 0, "percentage");
      }
      else if (unit === CO2) {
        return showValueWithUnit(val, mdiMoleculeCo2, 1, 0, "co2");
      }
      else {
        return showValueWithUnit(val, mdiNumeric, 1, 0, "power");
      }
    }

    const getState = (state) => this.hass.states[state.entityId].state;
    const getStateFromId = (id) => this.hass.states[id].state;

    const sensorValue2 = (val) => html`<div class="sensor-value">${this.hass.states[val.entityId].state}</div>`;
    const sensorValueBoiler = (val) => html`<div class="sensor-value dark">${this.hass.states[val.entityId].state}</div>`;

    const showSensor = (sensor) => {
      return html`
        ${ showSensorValue(this.hass.states[sensor.id].state, sensor.unit) }
      `;
    }

    const showRoom = (room, side) => {
      return html`
        <div class="room ${side}">
          <div class="sensor-name">${room.name}</div>
          ${room.entities.map(s => showSensor(s))}
        </div>
      `;
    }

    const drawRoofOutline = () => html`
      ${showAlarmStatus(1)}

      <div class="roof">
        <svg id="svg-roof" width="100%" height="100%" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="none">
          <polyline points="0,500 500,8, 1000,500" style="fill:${currentTheme.houseColor};stroke:${houseOutlineColor};stroke-width:14" />
        </svg>
      </div>
    `;

    const radiatorLine = (floor, line, pfix, extra) => html`
      <div class="radiator-line ${extra}">
        ${this.panel.config.rooms.filter(a => a.line === line && a.floor === floor).map(room => showRoom(room, (line === 1 ? "left" : "right") + pfix))}
      </div>
  `;

    const radiatorLines = (floor) => {

      const pfix = floor === 0 ? " b" : "";
      const extra = floor === 0 ? " basement" : "";

      return html`
        <div class="radiator-lines${extra}">
          ${floor !== 0 ? radiatorLine(floor, 1, pfix, extra) : null}
          ${radiatorLine(floor, 2, pfix, extra)}
        </div>
      `;
    }


    const supplyAndReturnLine = (c) => {

      const deviceOn = getDeviceStatus(getState(this.panel.config.entities.pumpPriority), [10, 20]);
      const iconColor = (deviceOn === "active" ? activeColor : normalTextColor);

      return html`
          <div class="supply-return-line" >
            <div class="column" >
            <font color=${boilerColorH}>
              <svg-icon type="mdi" size="24" path=${mdiArrowRightThick} ></svg-icon>
            </font>
            <font color=${boilerColorL}>
              <svg-icon type="mdi" size="24" path=${mdiArrowLeftThick} ></svg-icon>
            </font>
          </div>

          <div class="column value" >
            <div> ${getStateFromId(c.supplyId)}</div>
            <div> ${getStateFromId(c.returnId)}</div>
          </div>

          <div class="column" >
            <div class="item" >
              <font color=${iconColor}>
                <svg-icon type="mdi" size="24" path=${c.type === "radiator" ? mdiRadiator : mdiHeatingCoil} ></svg-icon>
              </font>
            </div>
          </div>
        </div>
      `;
    }


    const SupplyReturnLines = () => {

      return html`
        ${this.panel.config.heatingCircuits.map(c => supplyAndReturnLine(c))}
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



    // NIBE # 10: Off, 20: Hot Water, 30: Heat, 40: Pool, 50: Cooling
    const getDeviceStatus = (currentValue, inActiveValues) => {
      let status = "inactive";

      if (!inActiveValues.includes(parseInt(currentValue))) {
        status = "active";
      }
      return status;
    }



    const pumpLines = () => html`
    <div class="pumpLines">

      <div class="item half" >
        <font color=${pumpLineInColor}>
          <svg-icon type="mdi" size="24" path=${mdiArrowUpThin} ></svg-icon>
        </font>
      </div>
      <div class="item half" >
        <font color=${pumpLineOutColor}>
          <svg-icon type="mdi" size="24" path=${mdiArrowDownThin} ></svg-icon>
        </font>
      </div>

      <div class="item half" > <div> ${showValue(getState(this.panel.config.entities.brineInLine), 0.5, 1, "")}</div>

</div>
      <div class="item half" ><div> ${showValue(getState(this.panel.config.entities.brineOutLine), 0.5, 1, "")}</div></div>

    </div>
  `;


    const pump = () => {

      const deviceOn = getDeviceStatus(getState(this.panel.config.entities.pumpPriority), [10]);
      const icon = (deviceOn === "active" ? mdiHeatPump : mdiHeatPumpOutline);
      const iconColor = (deviceOn === "active" ? activeColor : normalTextColor);
      const power = deviceOn === "active" ? getState(this.panel.config.entities.pumpPower) * 0.001 : 0;

      return html`

      <div class="device ${deviceOn}" >
        <div class="pump" @click="${this._handlePumpClick}">
        <div class="item" style="color: ${iconColor}">
            <svg-icon type="mdi" size="28" path=${icon} ></svg-icon>
        </div>
        <div class="item" >${showValueWithUnit(power, "kWh", 0.1, 1, "power")}</div>
        </div>
      </div>
    `;
    }

    const buffer = () => {

      const deviceOn = getDeviceStatus(getState(this.panel.config.entities.pumpPriority), [10, 20]);
      const icon = (deviceOn === "active" ? mdiWaterBoiler : mdiWaterBoilerOff);
      const iconColor = (deviceOn === "active" ? activeColor : normalTextColor);

      return html`
        <div class="device ${deviceOn} round" >
          <div class="buffer">
            <div class="item" style="color: ${iconColor}">
              <svg-icon type="mdi" size="24" path=${mdiApproximatelyEqualBox} ></svg-icon>
            </div>
          </div>
        </div>
      `;
    }

    const boiler = () => {

      const valt = this.hass.states[this.panel.config.entities.waterTop.entityId].state;
      const valc = this.hass.states[this.panel.config.entities.waterCharge.entityId].state
      const topColor = getLimitedColor(valt, boilerLimits, boilerColors)
      const bottomColor = getLimitedColor(valc, boilerLimits, boilerColors)

      const deviceOn = getDeviceStatus(getState(this.panel.config.entities.pumpPriority), [10, 30]);
      const icon = (deviceOn === "active" ? mdiWaterBoiler : mdiWaterBoilerOff);
      const iconColor = (deviceOn === "active" ? activeColor : inActiveColor);

      return html`
      <div class="device ${deviceOn} roundish" style="background-image: linear-gradient(${topColor}, ${bottomColor});">
        <div class="boiler">
          <div class="item" >${sensorValueBoiler(this.panel.config.entities.waterTop)}</div>
          <div class="item withbackground" style="color: ${iconColor}">
            <svg-icon type="mdi" size="24" path=${icon} ></svg-icon>
          </div>
          <div class="item" >${sensorValueBoiler(this.panel.config.entities.waterCharge)}</div>
        </div>
      </div>
    `;
    }

    const pumpPowerTargetIndicator = () => {
      return html`
        <div class="pump-power-target" >
          <div class="buffer-arrow" style="color: ${Math.round(getState(this.panel.config.entities.pumpPriority)) === 30 ? activeColor : inActiveColor}">
            <svg-icon type="mdi" size="28" path=${mdiArrowRightBold} ></svg-icon>
          </div>
          <div class="boiler-arrow" style="color: ${Math.round(getState(this.panel.config.entities.pumpPriority)) === 20 ? activeColor : inActiveColor}">
            <svg-icon type="mdi" size="28" path=${mdiArrowRightBold} ></svg-icon>
          </div>
        </div>
      `;
    }

    const drawHouse = () => html`
      <div class="house">
        <div class="floors">

          <div class="floor second">
            ${radiatorLines(2)}
          </div>

          <div class="floor first">
            ${radiatorLines(1)}
          </div>

          <div class="floor basement">
            <div class="boiler-room">
              <div class="column-pump">
                ${pump()}
                ${pumpLines()}
              </div>

              <div class="column narrow">
                ${pumpPowerTargetIndicator()}
              </div>

              <div class="column-boiler">
                ${buffer()}
                ${boiler()}
              </div>

              <div class="column">
                ${SupplyReturnLines()}
              </div>

            </div> <!-- BOILER ROOM -->

            ${radiatorLines(0)}

            <!-- div class="radiator-lines basement">
              ${radiatorLine(0, 2, " b", "basement")}
            </div -->

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
    return [ styles, css`

      * {
       box-sizing: border-box;
      }
      :host {
        background-color: transparent;
        display: block;
      }

      .main{
        width: 100%;
        height: 100vh;
        display: flex;
        flex-wrap: wrap;
        background-color: ${currentTheme.backgroundColor};
        padding-top: 12px;

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
        width: 96%;
        margin: 0 auto;
        background-color: ${currentTheme.houseColor};
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

      .device {
        border: 3px solid #cccccc;
        border-radius: 3px;
      }

      .device.round {
        border-radius: 50%;
      }
      .device.roundish {
        border-radius: 25%;
      }


      .device.active {
        border-color: ${activeColor};

      }
      .device.off {
        border-color: ${offColor};

      }
      .device.inactive {
        border-color: ${normalTextColor};
      }

      .fault{
        background-color: ${faultColor} !important;
        color: ${faultTextColor} !important;

      }
      .alarm {
        background-color: ${alarmColor} !important;
        color: ${alarmTextColor} !important;
      }

      .warning {
        background-color: ${warningColor} !important;
        color: ${warningTextColor} !important;

      }

      .normal {
        background-color: transparent !important;
        color: #333333;
      }


      .item {
        flex: 100%;
        text-align: center;
        color: ${currentTheme.valueColor};
      }
      .item.withbackground {
        flex: 0 1;

        background-color: #00000055;
        border-radius: 50%;
        padding: 2px;
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
        font-size: 13px;
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

      .supply-return-line {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        border: 1px dashed #999999;

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
        border-top: 3px solid ${hocolor};
        border-right: 3px solid ${hocolor};
      }
      .room.right {
        border-top: 3px solid ${hocolor};
        border-left: 3px solid ${hocolor};
      }

      .room.left:first-child {
        border-top: 0px solid ${hocolor};
        border-right: 3px solid ${hocolor};
      }
      .room.left:last-child {
        border-top: 3px solid ${hocolor};
        border-bottom: 3px solid ${hocolor};

        border-right: 3px solid ${hocolor};
      }
      .room.right:first-child {
        border-top: 0px solid ${hocolor};
        border-left: 3px solid ${hocolor};
      }
      .room.right:last-child {
        border-top: 3px solid ${hocolor};
        border-bottom: 3px solid ${hocolor};
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
      .plain-unit {
        font-size: 1.2em;
        width: auto;
      }
      .sensor-unit {
          text-align: center;
          border-radius: 50%;
          width: auto;
          height: 20px;
          color: ${currentTheme.unitColor};
      }
      .sensor-value {
        text-align: center;
        font-size: 1.3em;
        color: ${currentTheme.valueColor};
        padding-left: 2px;
        padding-right: 2px;
        border-radius: 3px;

      }
      .sensor-value.dark {
        color: ${currentTheme.valueDarkColor};
        font-weight: 500;

      }

      .sensor-name {
        display: inline-block;
        font-weight: bold;
        width: 25%;
        color: ${currentTheme.titleColor};

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
        justify-content: space-around;
        padding-left: 3px;
        padding-top: 6px;
      }
      .column {
        flex: 0 0 30%;

        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: flex-start;
        padding-top: 3px

      }
      .column-pump {
        flex: 0 0 60px;

        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: flex-start;
        padding-top: 3px
        color: ${currentTheme.valueColor};


      }
      .column-boiler {
        flex: 0 0 45px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: flex-start;

      }
      .column.narrow {
        flex: 0 0 7%;
      }
      .column.value {
        height: 48px;
        color: ${currentTheme.titleColor};
      }
      .pump {
        cursor: pointer;
        height: 95px;
        width: 60px;
        font-size: 14px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        border-radius: 3px;
        /*flex: 0 0 25%;*/
        padding: 3px;
      }
      .pump-power-target {
        height: 95px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: flex-start;
      }

      .buffer-arrow {
        height: 45px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        /*border-top: 1px solid #999999;
        border-bottom: 1px solid #999999;*/
      }
      .boiler-arrow {
        height: 50px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: flex-end;
       /* border-top: 1px solid #999999;
        border-bottom: 1px solid #999999;*/

      }
      .buffer {
        height: 45px;
        width: 50px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        padding: 3px;
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
        height: 100%;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
      }


      .pumpLines {
        height: auto;
        width: 66px;
        border: 1px dashed #999999;
        display: flex;
        flex-wrap: wrap;
        justify-content: start;
        align-items: center;
        background-color: transparent;
        padding: 0px;
        margin-top: 3px;
        margin-bottom: 3px;

        border-radius: 3px;
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
        width: 40%;
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
    `];
  }
}




