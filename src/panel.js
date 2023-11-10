
import styles from './panel.styles';
import ApexCharts from 'apexcharts'
import * as ss from 'simple-statistics'

import {
  LitElement,
  html,
  css
} from 'lit';

import {
  mdiShieldLock,
  mdiShieldOffOutline,
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
  mdiArrowLeft,
  mdiMoleculeCo2,
  mdiNumeric,
  mdiPump,
  mdiArrowRightBoldBoxOutline,
  mdiTransmissionTowerImport
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

/*const boilerColorLL = "#6892db";
const boilerColorL = "#c1d3f0";
const boilerColor = "#ef9490";
const boilerColorH = "#fb8984";
const boilerColorHH = "#f9423a";*/

const boilerColorLL = "#97dfff";
const boilerColorL = "#c2f9ff";
const boilerColor = "#aad688";
const boilerColorH = "#8bbd78";
const boilerColorHH = "#5ea758";

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

const supplyColor = css`#8bbd78`;
const returnColor = css`#97dfff`;

const pumpLineInColor = css`#aad688`;
const pumpLineOutColor = returnColor;


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
    unitColor: css`#cccccc`,
    valueColor: css`#efefef`,
    valueDarkColor: css`#333333`,
    titleColor: css`#dddddd`,
    textColor: css`#efefef`,

    roomBorderColor:  css`#ffffff44`
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

const valueLimits = {
  temperature: {
    LL: 19,
    L: 20,
    H: 23,
    HH: 24
  },
  percentage: {
    LL: 10,
    L: 20,
    H: 40,
    HH: 60
  },
  co2: {
    LL: 400,
    L: 4000,
    H: 12000,
    HH: 20000
  },
  power: {
    LL: -10,
    L: -1,
    H: 1500,
    HH: 2000
  },
  noLimit: {
    LL: -100000,
    L: -100000,
    H: 100000,
    HH: 100000
  }
};

export class JhomePanel extends LitElement {

  static test = 8;

  static get properties() {
    return {
      hass: { type: Object },
      narrow: { type: Boolean },
      route: { type: Object },
      panel: { type: Object },
      faceplateOpen: { type: Boolean },
      activeTab: { type: Boolean },
      statistics: { type: Object },
      faceplateE: { type: Object },
      chart: { type: Object }

    };
  }

  constructor() {
    super();
    this.faceplateOpen = false;
    this.faceplateE = {};
    this.chart = {};
    this.activeTab = "graphTab";
    this.statistics = {
      min: 0,
      max: 0
    }

  }

  _initialize() {
    console.log("INITIALIZING");
  }

  firstUpdated(changedProperties) {
    console.log("firstUpdated");
    console.log(changedProperties);
    console.log(this.shadowRoot.querySelector(".faceplate"))
    console.log(this.shadowRoot.querySelector("#graph"))

    console.log(this.shadowRoot)


    const options = {
      chart: {
        type: 'line'
      },
      series: [{
        name: 'sales',
        data: []
      }],
      chart: {
        id: 'area-datetime',
        type: 'area',
        height: 200,
        zoom: {
          autoScaleYaxis: true
        }
      },
    /*  annotations: {
        yaxis: [{
          y: 30,
          borderColor: '#999',
          label: {
            show: true,
            text: 'Support',
            style: {
              color: "#fff",
              background: '#00E396'
            }
          }
        }],
        xaxis: [{
          x: new Date('14 Nov 2012').getTime(),
          borderColor: '#999',
          yAxisIndex: 0,
          label: {
            show: true,
            text: 'Rally',
            style: {
              color: "#fff",
              background: '#775DD0'
            }
          }
        }]
      },
      */
      yaxis: {

        show: true,
        tickAmount: 4,

        labels: {
          show: true,
          style: {
            colors: ["#ffffff"],
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 400,
            cssClass: 'apexcharts-yaxis-label',
          },
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {

        type: "datetime",
        //categories: [1991,1992,1993,1994,1995,1996,1997, 1998,1999]
        //min: new Date().getTime() - (24 * 60 * 60 * 1000),
        tickAmount: 5,
        labels: {
          show: true,
          style: {
            colors: ["#ffffff", "#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"],
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 400,
            cssClass: 'apexcharts-yaxis-label',
        },
        }
      },
      grid: {
        show: true,
        borderColor: '#fff',
        strokeDashArray: 3,
        yaxis: {

          lines: {
            show: true,
          }
        },
        xaxis: {
          lines: {
            show: true,
          }
        }
      },
      stroke: {
        width: 2
      }

    }

    this.chart = new ApexCharts(this.shadowRoot.querySelector('#graph'), options);

    this.chart.render();

  }

  updated(changedProps) {
    super.updated()

  }


  connectedCallback() {
    super.connectedCallback()

    console.log("CONNECTED");
     this.staticNode = this.renderRoot.querySelector('.main');
    console.log(this);
    console.log(this.renderRoot);

    console.log(this.shadowRoot.querySelector("#graph"))
  }

  disconnectedCallback() {
    super.disconnectedCallback()
  }

  async updateEntity(entity, index, initStart, end) {

    let newStateHistory = await this.fetchRecent(
      entity.entityId,
      initStart,
      end,
      false,
    );

    return newStateHistory[0];
  }

  decimate(newArr, cur) {
    console.log(newArr);
    console.log(cur);
    newArr.push(cur)
    return newArr;
  }

  decimateData(data, samplesInHour) {

    const outData = [];

    const msStep = 60 * 60 * 1000 / samplesInHour;
    let sum = 0;
    let count = 0;
    let first = Date.parse(data[0].last_changed);
    for (let i = 0; i < data.length; i++){
      const timeStamp = Date.parse(data[i].last_changed);
      const value = parseFloat(data[i].state);

      if (timeStamp < first + msStep) {
        sum = sum + value;
        count++;

      }
      else {
        console.log("PUSH ", sum / count);
        outData.push([first, Math.round(sum / count * 10)/10]);
        sum = value;
        count = 1;
        first = first + msStep;
      }
    }
    console.log(data);
    console.log("SOURCE ", data.length, outData.length)

    return outData;
  }
  async updateData(entities, dataInHours, samplesInHour) {
    this.updating = true;

    const getMilli = hours => hours * 60 ** 2 * 10 ** 3;
    const date = new Date();
    date.setHours(date.getHours() + 1);
    date.setMinutes(0, 0);
    const end = date;
    const start = new Date(end);
    start.setMilliseconds(start.getMilliseconds() - getMilli(dataInHours));

    try {
      const promise = entities.map(entity => this.updateEntity(entity, 0, start, end));
      const data = await Promise.all(promise);
      return this.decimateData(data[0], samplesInHour);

    } catch (err) {
      console.log(err);
    }


  }

  async fetchRecent(entityId, start, end, skipInitialState, withAttributes) {
    let url = 'history/period';
    if (start) url += `/${start.toISOString()}`;
    url += `?filter_entity_id=${entityId}`;
    if (end) url += `&end_time=${end.toISOString()}`;
    if (skipInitialState) url += '&skip_initial_state';
    if (!withAttributes) url += '&minimal_response';
    if (withAttributes) url += '&significant_changes_only=0';
    return this.hass.callApi('GET', url);
  }

  calculateStatistics(data) {


    console.log(data);
    const stat = {
      min: ss.min(data),
      max: ss.max(data),
      mean: ss.mean(data),
      mode: ss.mode(data),
      median: ss.median(data)

    };

    console.log(stat)
    return stat;
  }
  _handleSensorClick(e, sensor) {
    console.log(e);
    let width = screen.width;
    let height = screen.height;
    console.log(width,height );

    const topOffset = screen.height * 0.2;
    const houseHeight = screen.height * 0.8
    this.faceplateOpen = true;
    this.faceplateE = { clientY: e.clientY  > height * 0.5 ? e.clientY - houseHeight * 0.5 - topOffset + 12: e.clientY - topOffset , title: sensor.name };

    const promise = this.updateData([sensor], 12, 1);

    promise.then((data) => {
      console.log("PROMISE")

      if (data && data.length > 0) {

        console.log("UPDATE CHART");
        console.log(data)

        this.statistics = this.calculateStatistics(data.map(d => parseFloat(d[1])));


        this.chart.updateSeries([{
          name: 'sales',
          //data: data.map(a => [Date.parse(a.last_changed), a.state])

          data: data
        }])
      }

    });

  }

  _handlePumpClick(e) {
    console.log(e);
    this.faceplateOpen = true;
    this.faceplateE = { clientY: e.clientY, title: "Pump" };


  }

  _closeFaceplate(e) {
    this.faceplateOpen = false;
  }


  openTab(evt,tabName) {
    console.log(tabName);
    this.activeTab = tabName;
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
   // tabcontent = document.getElementsByClassName("tabcontent");
    // for (i = 0; i < tabcontent.length; i++) {
   //   tabcontent[i].style.display = "none";
    //}

    // Get all elements with class="tablinks" and remove the class "active"
   //  tablinks = document.getElementsByClassName("tablinks");
    // for (i = 0; i < tablinks.length; i++) {
   //   tablinks[i].className = tablinks[i].className.replace(" active", "");
    //}


  }

  getColor(val, limitTarget) {

  }
  render() {

    console.log(this.panel);

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
      const limits = limitTarget;

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

    const showValueWithUnit = (val, unit, step, dec, limitTarget, horizontal, sensor, eventInParent) => {

      return html`
      <div class="sensor ${horizontal}" @click="${(e) => this._handleSensorClick(e, sensor)}">
        ${showValue(val, step, dec, limitTarget)}
        <div class="sensor-unit">
          ${ unit.length > 6
            ? html`<svg-icon type="mdi" size="16" path=${unit} ></svg-icon>`
            : html`<div class="plain-unit">${unit}</div>`
          }
        </div>
      </div>`;

    }


    const getState = (state) => this.hass.states[state.entityId].state;
    const getStateFromId = (entityId) => this.hass.states[entityId].state;

    const showSensor = (sensor, horizontal) => {

      const value = this.hass.states[sensor.entityId].state;
      const accuracy = sensor.accuracy > 0 ? sensor.accuracy : 0.1;
      const decimals = sensor.decimals >= 0 ? sensor.decimals : 1;
      let unit = sensor.unit && sensor.unit.length > 0 ? sensor.unit : "";
      let limits = valueLimits["noLimit"];

      if (unit === "C") {
        unit = mdiTemperatureCelsius;
        limits = valueLimits["temperature"];
      }
      else if (unit === "%") {
        unit = mdiWaterPercent;
        limits = valueLimits["percentage"];
      }
      else if (unit === "CO2") {
        unit = mdiMoleculeCo2;
        limits = valueLimits["co2"];
      }

      return showValueWithUnit(value, unit, accuracy, decimals, sensor.limits ?? limits, horizontal, sensor)
    }

    const showRoom = (room) => {
      return html`
        <div class="room">
          <div class="room-name">${room.name}</div>
          ${room.entities.map(s => showSensor(s))}
        </div>
      `;
    }

    const drawRoofOutline = () => html`
      ${showAlarmStatus(1)}

      <div class="roof">
        <svg id="svg-roof" width="100%" height="100%" viewBox="0 0 1000 500" preserveAspectRatio="none">
          <polyline points="0,500 500,8, 1000,500" style="fill:${currentTheme.houseColor};stroke:${houseOutlineColor};stroke-width:14" />
        </svg>
      </div>
    `;




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
            <font color=${supplyColor}>
              <svg-icon type="mdi" size="20" viewBox="0 0 24 24" path=${mdiArrowRightThin} ></svg-icon>
            </font>
            ${this.panel.config.heatingCircuits.map(c => showSensor(c.supply))}
          </div>
          <div class="return-line">
            <font color=${returnColor}>
              <svg-icon type="mdi" size="20" viewBox="0 0 24 24" path=${mdiArrowLeftThin} ></svg-icon>
            </font>
            ${this.panel.config.heatingCircuits.map(c => showSensor(c.return))}
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

      <div class="item half">${showSensor(this.panel.config.entities.brineInLine)}</div>
      <div class="item half">${showSensor(this.panel.config.entities.brineOutLine)}</div>

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


    </div>
  `;




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
            ${showSensor(this.panel.config.entities.waterTop)}
            <div class="item icon" style="color: ${iconColor}">
              <svg-icon type="mdi" size="24" path=${icon} ></svg-icon>
            </div>
            ${showSensor(this.panel.config.entities.waterCharge)}
          </div>
        </div>
      </div>
    `;
    }

    const pumpPowerTargetIndicator = () => {
      return html`
        <div class="pump-power-target" >
          <div class="buffer-arrow" style="color: ${Math.round(getState(this.panel.config.entities.pumpPriority)) === 20 ? activeColor : inActiveColor}">
            <svg-icon type="mdi" size="28" path=${mdiArrowRightBold} ></svg-icon>
          </div>
          <div class="boiler-arrow" style="color: ${Math.round(getState(this.panel.config.entities.pumpPriority)) === 30 ? activeColor : inActiveColor}">
            <svg-icon type="mdi" size="28" path=${mdiArrowRightBold} ></svg-icon>
          </div>
        </div>
      `;
    }

    /* READY */



    const showFaceplate = () => {


      const y = this.faceplateE.clientY;

      return html`
        <div class="faceplate" style="display:${this.faceplateOpen ? "block" : "none"};top:${y}px">


          <div class="faceplate-title">
            ${this.faceplateE.title}

            <!-- Tab links -->
            <div class="tab">
              <button class="tablinks ${this.activeTab === "graphTab" ? "active" : ""}" @click="${(e) => this.openTab(e, 'graphTab')}">Graph</button>
              <button class="tablinks ${this.activeTab === "statTab" ? "active" : ""}" @click="${(e) => this.openTab(e, 'statTab')}">Stat</button>
              <button class="tablinks ${this.activeTab === "operateTab" ? "active" : ""}" @click="${(e) => this.openTab(e, 'operateTab')}">Operate</button>
            </div>
            <div class="faceplate-close" @click="${this._closeFaceplate}">
              X
            </div>
          </div>

          <!-- Tab content -->
          <div id="graphTab" class="tabcontent" style="display: ${this.activeTab === "graphTab" ? "block" : "none"}">
            <div id="graph"></div>
          </div>

          <div id="statTab" class="tabcontent" style="display: ${this.activeTab === "statTab" ? "block" : "none"}">
            <h3>Statistics</h3>
            <p>min: ${this.statistics.min}</p>
            <p>max: ${this.statistics.max}</p>
            <p>mean: ${this.statistics.mean}</p>
            <p>mode: ${this.statistics.mode}</p>
            <p>median: ${this.statistics.median}</p>


          </div>
          <div id="graphTab" class="tabcontent" style="display: ${this.activeTab === "operateTab" ? "block" : "none"}">
            <p>Operations</p>
          </div>
        </div>
      `;
    }

    const pump = () => {

      const deviceOn = getDeviceStatus(getState(this.panel.config.entities.pumpPriority), [10]);
      const icon = (deviceOn === "active" ? mdiHeatPump : mdiHeatPumpOutline);
      const iconColor = (deviceOn === "active" ? activeColor : normalTextColor);
      const powerValue = deviceOn === "active" ? getState(this.panel.config.entities.pumpPower) * 0.001 : 0;

      return html`
        <div class="device ${deviceOn}" >
          <div class="pump" @click="${this._handlePumpClick}">
            <div class="item" style="color: ${iconColor}"><svg-icon type="mdi" size="28" path=${icon} ></svg-icon></div>
            ${showValueWithUnit(powerValue, "kW", 0.1, 1, "")}
          </div>
        </div>
      `;
    }

    const electricity = () => {

      const valt = this.hass.states[this.panel.config.entities.waterTop.entityId].state;
      const valc = this.hass.states[this.panel.config.entities.waterCharge.entityId].state
      const topColor = getLimitedColor(valt, boilerLimits, boilerColors)
      const bottomColor = getLimitedColor(valc, boilerLimits, boilerColors)

      const deviceOn = getDeviceStatus(getState(this.panel.config.entities.pumpPriority), [10, 30]);
      const icon = (deviceOn === "active" ? mdiTransmissionTowerImport : mdiTransmissionTowerImport);
      const iconColor = (deviceOn === "active" ? activeColor : normalTextColor);

      return html`
      <div class="device ${deviceOn}" >
        <div class="electricity">

          <div class="columnx">
            ${showSensor(this.panel.config.entities.waterTop)}
            <div class="item icon" style="color: ${iconColor}">
              <svg-icon type="mdi" size="24" path=${icon} ></svg-icon>
            </div>
            ${showSensor(this.panel.config.entities.waterCharge)}
          </div>
        </div>
      </div>
    `;
    }

    const radiatorLine = (floor, line) => html`
      ${this.panel.config.rooms.filter(a => a.line === line && a.floor === floor).map(room => showRoom(room))}
    `;

    const drawHouse = () => html`
      <div class="house">


        <div class="floor second">
          ${radiatorLine(2, 1)}
          ${radiatorLine(2, 2)}
        </div>

        <div class="floor first">
          ${radiatorLine(1, 1)}
          ${radiatorLine(1, 2)}
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
              ${boiler()}
              ${SupplyReturnLines()}
            </div>

          </div> <!-- BOILER ROOM -->

          <div class="other-basement">
            <div class="column">
              ${radiatorLine(0, 2)}
            </div>
            ${electricity()}
          </div>
        </div> <!-- BASEMENT -->

      ${showFaceplate()}
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

      let status = "disarmed";
      let color = normalTextColor;
      let icon = mdiShieldOffOutline;
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
      <div class="alarm-status" >
        <font color=${color}>
          <svg-icon type="mdi" size="28" path=${icon} ></svg-icon>
        </font>
        <!-- div class="alarm-text">${aText}</div -->

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
        color: ${currentTheme.textColor};
        font-size: 3vw;
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
        height: 80vh;
      }

      .bcor, .bcen {
        height: 15vh;
        display: none;
      }

      /* Style the tab */
      .tab {
        overflow: hidden;
        border: 1px solid #ccc;
        background-color: #f1f1f133;
      }

      /* Style the buttons that are used to open the tab content */
      .tab button {
        background-color: inherit;
        float: left;
        border: none;
        outline: none;
        cursor: pointer;
        padding: 2px 6px;
        transition: 0.3s;
      }

      /* Change background color of buttons on hover */
      .tab button:hover {
        background-color: #ddd;
      }

      /* Create an active/current tablink class */
      .tab button.active {
        background-color: #ccc;
      }

      /* Style the tab content */
      .tabcontent {
        display: block;
        padding: 3px 6px;

      }
      .tabcontent.hidden{
        display: none;
      }

      .house {
        position: relative;
        padding: 0;
        width: 100%;
        padding-left: 10px;
        padding-right: 10px;
        padding-bottom: 10px;
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
        background-color: ${currentTheme.houseColor};
        align-items: flex-start;
        margin-top: 6px;
        padding: 5px;
        min-height: 20vh;

      }
      .floor.first {
        align-items: center;
      }
      .floor.second {
        align-items: center;
      }
      .floor.basement {
        justify-content: space-between;
        flex-wrap: nowrap;
        padding-bottom: 6px;
      }

      .room {
        min-height: 5vh;
        padding: 3px;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        border: 1px solid ${currentTheme.roomBorderColor};
        margin: 5px;
        border-radius: 3px;
        flex: 0 1;
      }

      .room-name {
        font-weight: bold;
        margin-right: 12px;
        color: ${currentTheme.titleColor};
      }

      .other-basement {
        flex: 1 0 40%;
        padding: 0px;
        margin-left: 6px;
      }

      .sensor {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        font-weight: bold;
        border-radius: 6px;
        padding: 1px;
        flex: 0 1;
        border: 1px solid #999999;
        background-color: #00000033;
        margin-right: 3px;
        margin-left: 3px;
      }

      .sensor.horizontal {
        flex-wrap: nowrap;
      }


      .device {
        border: 2px solid #cccccc;
        border-radius: 3px;
        padding: 3px;

      }

      .device.roundish {
        border-radius: 15%;
        margin-top: 0px;
        margin-right: 6px;
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

      .pump {
        cursor: pointer;
        height: 110px;
        width: 17vw;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
      }

      .faceplate {
        position: absolute;
        background-color: ${currentTheme.valueDarkColor};
        width: 96%;
        height: 50%;
        left: 2%;
        top: 50%;
        border: 2px solid #efefef;
      }

      .faceplate-title {
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-items: center;
        background-color: transparent;
        padding-left: 6px;
        padding-top:6px;
        color: #ffffff;
        width: 100%;
        height: 24px;
      }
      .faceplate-close {
        padding-left: 6px;
        padding-right: 6px;

        height: 16px;
        width: 28px;
        color: #ffffff;

      }

      .boiler {
        height: 85px;
        width: 45px;
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: center;
      }

      .electricity {
        height: auto;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: center;
        }

      .item {
        flex: 0 1 100%;
        text-align: center;
        color: ${currentTheme.valueColor};
      }

      .item.icon {
        padding-top: 3px;
      }

      /* JANNE */



      .item.empty {
        flex: 0 1 20px;
        text-align: center;
        color: ${currentTheme.valueColor};
      }

      .item.half {
        flex: 0 0 50%;
        text-align: center;
        font-size: 3vw;
      }

      .supply-return-lines {
        flex: 70%;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: center;
        border: 1px dashed #999999;
        margin-top: 6px;

      }







      .plain-unit {
        font-size: 3vw;
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
        font-size: 4vw;
        color: ${currentTheme.valueColor};
        padding-left: 2px;
        padding-right: 2px;
        border-radius: 3px;
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
          justify-content: space-evenly;

      }

      .supply-line {
        display: flex;
        flex: 100%;
        align-items: center;
        justify-content: space-evenly;
        margin-bottom: 3px;

      }

      .return-line {
        display: flex;
        flex: 100%;
        align-items: center;
        justify-content: space-evenly;
        margin-bottom: 3px;


      }

      .column.narrow {
        flex: 0 1;
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
        height: 75px;
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


      .temp-bar {
        height: 77px;
        flex: 0 0 8px;
        margin-left: 3px;
        margin-right: 6px;
        border: 1px solid #999999;
        border-radius: 2px;
        border-right: 2px solid #666666;
        border-bottom: 1px solid #666666;
      }

      .pumpLines {
        height: auto;
        width: 100%;
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
        top: 16px;
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
