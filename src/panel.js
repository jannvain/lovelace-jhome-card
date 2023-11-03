
import styles from './panel.styles';

import {
  LitElement,
  html,
  css
} from 'lit';

import {
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
  mdiArrowLeftThin,
  mdiArrowRightThin,
  mdiArrowRightThick,
  mdiArrowLeftThick,
  mdiArrowRightBold,
  mdiArrowLeftBold,
  mdiArrowRight,
    mdiArrowleft,
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

const normalTextColor = css`#bbbbbb`;
const houseOutlineColor = "transparent";

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

    const faultColorClass = "fault";
    const alarmColorClass = "alarm";
    const warningColorClass = "warning";
    const normalColorClass = "normal";

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
    }

    const showValue = (val, step, dec, limitTarget) => html`
      <div class="sensor-value ${getColor(Math.round(val/0.5)*0.5, limitTarget)}" >
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
      else if (unit === "CO2") {
        return showValueWithUnit(val, mdiMoleculeCo2, 1, 0, "co2");
      }
      else {
        return showValueWithUnit(val, mdiNumeric, 1, 0, "power");
      }
    }

    const getState = (state) => this.hass.states[state.entityId].state;
    const getStateFromId = (id) => this.hass.states[id].state;

    const sensorValueBoiler = (val) => html`<div class="sensor horizontal"><div class="sensor-value">${this.hass.states[val.entityId].state}</div></div>`;

    const showSensor = (sensor) => {
      return html`
        ${ showSensorValue(this.hass.states[sensor.id].state, sensor.unit) }
      `;
    }

    const showRoom = (room) => {
      return html`
        <div class="room">
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

    const radiatorLine = (floor, line) => html`
      ${this.panel.config.rooms.filter(a => a.line === line && a.floor === floor).map(room => showRoom(room))}
    `;

    const radiatorLines = (floor) => {

      return html`
        ${floor !== 0 ? radiatorLine(floor, 1) : null}
        ${radiatorLine(floor, 2)}
      `;
    }

    const SupplyReturnLines = () => {

      const deviceOn = getDeviceStatus(getState(this.panel.config.entities.pumpPriority), [10, 20]);
      const iconColor = (deviceOn === "active" ? activeColor : normalTextColor);

      return html`
        <div class="supply-return-lines" style="border-color: ${iconColor}">

          <div class="type-line">
          <div class="item empty">
            <font color=${iconColor}>
              <svg-icon type="mdi" size="20" path=${mdiTemperatureCelsius}} ></svg-icon>
            </font>
          </div>
            ${this.panel.config.heatingCircuits.map(c => {
              return html`
                <font color=${iconColor}>
                  <svg-icon type="mdi" size="20" path=${c.type === "radiator" ? mdiRadiator : mdiHeatingCoil} ></svg-icon>
                </font>
              `;
            })}

          </div>
          <div class="supply-line">
            <font color=${boilerColorH}>
              <svg-icon type="mdi" size="20" viewBox="0 0 24 24" path=${mdiArrowRightThin} ></svg-icon>
            </font>
            ${this.panel.config.heatingCircuits.map(c => {
              return html`

              <div class="sensor horizontal"> <div class="sensor-value">${getStateFromId(c.supplyId)} </div></div>
              `;
            })}
          </div>
          <div class="return-line">
             <font color=${boilerColorL}>
              <svg-icon type="mdi" size="20" viewBox="0 0 24 24" path=${mdiArrowLeftThin} ></svg-icon>
            </font>
            ${this.panel.config.heatingCircuits.map(c => {
              return html`
              <div class="sensor"> <div class="sensor-value">${getStateFromId(c.returnId)}</div></div>

              `;
            })}
          </div>

        </div>
      `;
    };

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


      <div class="item half"><div class="sensor horizontal">${showValue(getState(this.panel.config.entities.brineInLine), 0.5, 1, "")}</div></div>
      <div class="item half"><div class="sensor horizontal">${showValue(getState(this.panel.config.entities.brineOutLine), 0.5, 1, "")}</div></div>

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
          ${showValueWithUnit(power, "kW", 0.1, 1, "power")}
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
      const iconColor = (deviceOn === "active" ? activeColor : normalTextColor);

      return html`
      <div class="device ${deviceOn} roundish" >
        <div class="boiler">
          <div class="column">
            <div class="temp-bar" style="background-image: linear-gradient(${topColor}, ${bottomColor});"></div>
          </div>
          <div class="column wide center">
            ${sensorValueBoiler(this.panel.config.entities.waterTop)}
            <div class="item" style="color: ${iconColor}">
              <svg-icon type="mdi" size="24" path=${icon} ></svg-icon>
            </div>
            ${sensorValueBoiler(this.panel.config.entities.waterCharge)}
          </div>
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

        <div class="floor second">
          ${radiatorLines(2)}
        </div>

        <div class="floor first">
          ${radiatorLines(1)}
        </div>

        <div class="floor basement">
          <div class="boiler-room">

            <div class="column">
              ${pump()}
              ${pumpLines()}
            </div>

            <div class="column">
              ${pumpPowerTargetIndicator()}
            </div>

            <div class="column wide">
              ${SupplyReturnLines()}
              ${boiler()}
            </div>

          </div> <!-- BOILER ROOM -->

          <div>
          ${radiatorLines(0)}
          </div>

        </div> <!-- BASEMENT -->


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
        justify-content: center;
        background-color: transparent;
        align-items: flex-start;

      }
      .floor.first {
        margin-top: 6px;
        background-color: ${currentTheme.houseColor};
      }
      .floor.second {
        margin-top: 6px;
        background-color: ${currentTheme.houseColor};
      }
      .floor.basement {
        flex 0 1 30%;
          margin-top: 6px;
          justify-content: space-between;
          flex-wrap: nowrap;
          background-color: ${currentTheme.houseColor};
          padding-bottom: 6px;
      }

      .device {
        border: 2px solid #cccccc;
        border-radius: 3px;
      }

      .device.roundish {
        border-radius: 15%;
        margin-top: 6px;
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
        flex: 0 1 100%;
        text-align: center;
        color: ${currentTheme.valueColor};
      }
      .item.empty {
        flex: 0 1 20px;
        text-align: center;
        color: ${currentTheme.valueColor};
      }

      .item.half {
        flex: 0 0 50%;
        text-align: center;
        font-size: 12px;
      }

      .supply-return-lines {
        flex: 70%;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: center;
        border: 1px dashed #999999;

      }

      .room {
        min-height: 5vh;
        padding: 3px;
        margin: 0px;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        /*background-color: #00000033;*/
        border: 1px dashed #999999;
        margin: 6px;
        border-radius: 3px;
        flex: 0 1;
      }


      .sensor.horizontal {
        display: flex;
        flex-wrap: nowrap;
        justify-content: center;
        font-weight: bold;
        text-align: right;
        border-radius: 6px;
        padding: 1px;
        flex: 0 1 20%;
        border: 1px solid #999999;
        background-color: #00000033;

        margin-right: 3px;
        margin-left: 3px;


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
        border: 1px solid #999999;
        background-color: #00000033;

        margin-right: 3px;
        margin-left: 3px;

      }
      .plain-unit {
        font-size: 1.0em;
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
        font-size: 1.2em;
        color: ${currentTheme.valueColor};
        padding-left: 2px;
        padding-right: 2px;
        border-radius: 3px;
      }


      .sensor-name {
        display: inline-block;
        font-weight: bold;
        width: 25%;
        margin-right: 12px;
        color: ${currentTheme.titleColor};

      }

      .boiler-room {
        flex:  1 0 60%;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        padding-left: 3px;
        padding-top: 6px;
      }
      .column {
        flex: 0 1;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: flex-start;

      }

      .column.wide {
        flex: 1 0;
      }
      .column.wide.center {
        justify-content: center;

        flex: 1 0;
      }

      .type-line {
          display: flex;
          flex: 100%;
          justify-content: space-around;

      }

      .supply-line {
        display: flex;
        flex: 100%;
        align-items: center;
        justify-content: space-around;
        margin-bottom: 3px;

      }

      .return-line {
        display: flex;
        flex: 100%;
        align-items: center;
        justify-content: space-around;
        margin-bottom: 3px;


      }

      .column.narrow {
        flex: 0 1;
      }
      .pump {
        cursor: pointer;
        height: 110px;
        width: 70px;
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
        height: 110px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: flex-start;
        flex: 0 1;
      }

      .buffer-arrow {
        flex: 0 1;
        height: 65px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
      }

      .boiler-arrow {
        height: 50px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: flex-end;

      }

      .boiler {
        height: 90px;
        width: 55px;
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: center;
      }
      .temp-bar {
        height: 70px;
        flex: 0 0 8px;
        margin: 3px;
        margin-left: 6px;
        border: 1px solid #eeeeee;
        border-right: 1px solid #000000;
        border-top: 1px solid #000000;
      }

      .pumpLines {
        height: auto;
        width: 70px;
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
