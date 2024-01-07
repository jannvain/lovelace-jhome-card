
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
  mdiWaterPump,
  mdiWaterPumpOff,
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
    mdiWeatherSunny,
  mdiWeatherCloudy,
  mdiWeatherPartlyCloudy,
  mdiWeatherSnowy,
  mdiArrowLeft,
  mdiMoleculeCo2,
  mdiNumeric,
  mdiPump,
  mdiChartLine,
  mdiTune,
  mdiCalculator,
  mdiArrowRightBoldBoxOutline,
  mdiTransmissionTowerImport,
  mdiFloorPlan,
  mdiHomeFloor0,
  mdiHomeFloor1,
  mdiHomeFloor2,
  mdiPlusMinus,
  mdiArrowCollapseVertical,
  mdiArrowExpandVertical,
  mdiExpandAll,
  mdiCollapseAll

} from '@mdi/js';

import '@jamescoyle/svg-icon';

const normalTextColor = css`#bbbbbb`;

const activeColor = css`#00BFFF`;
const inActiveColor = css`#FFFFFF22`;

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
  roomTemperature: {
    LL: 19,
    L: 20,
    H: 23,
    HH: 24
  },
  lowRoomTemperature: {
    LL: 5,
    L: 10,
    H: 20,
    HH: 25
  },
  supplyReturnTemperature: {
    LL: 20,
    L: 40,
    H: 50,
    HH: 60
  },
  brineTemperature: {
    LL: -4,
    L: -2,
    H: 2,
    HH: 4
  },
  waterTemperature: {
    LL: 10,
    L: 30,
    H: 40,
    HH: 60
  },
  kwPower: {
    LL: 0,
    L: 3,
    H: 6,
    HH: 12
  },

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
    noLimit: true,
    LL: 20,
    HH: 60
  }
};


window.autoEntities_cache = window.autoEntities_cache ?? {};
const cache = window.autoEntities_cache;

export class JhomePanel extends LitElement {

  static test = 8;

  static get properties() {
    return {
      hass: { type: Object },
      narrow: { type: Boolean },
      route: { type: Object },
      panel: { type: Object },
      faceplateOpen: { type: Boolean },
      minimizeView: { type: Boolean },
      minimize2Floor: { type: Boolean },
      minimize1Floor: { type: Boolean },
      minimize0Floor: { type: Boolean },
      activeTab: { type: Boolean },
      statistics: { type: Object },
      faceplateE: { type: Object },
      chart: { type: Object }

    };
  }

  constructor() {
    super();
    this.faceplateOpen = false;
    this.minimizeView = true;
    this.minimize2Floor = true;
    this.minimize1Floor = true;
    this.minimize0Floor = true;

    this.faceplateE = {};
    this.chart = {};
    this.activeTab = "graphTab";
    this.statistics = [{
      min: 0,
      max: 0
    }]

  }

  _initialize() {
  }

  firstUpdated(changedProperties) {
    console.log("firstUpdated");

    const options = {

      series: [{
        name: 'sales 0',
        data: []
      },{
        name: 'sales 1',
        data: []
      }],
      chart: {
        id: 'area-datetime',
        type: 'line',
        background: "#666666",

        height: 200,
        zoom: {
          autoScaleYaxis: false
        }
      },

      legend: {
        show: true,
        showForSingleSeries: false,
        showForNullSeries: true,
        showForZeroSeries: true,
        position: 'bottom',
        horizontalAlign: 'center',
        floating: false,
        fontSize: '14px',
        fontFamily: 'Helvetica, Arial',
        fontWeight: 400,
        inverseOrder: false,
        customLegendItems: [],
        offsetX: 0,
        offsetY: 0,
        labels: {
          colors: "#ffffff",
          useSeriesColors: false
        },
      },
      yaxis: {
        show: true,
        forceNiceScale: true,

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
      colors: ['#66DA26', '#2E93fA', '#546E7A', '#E91E63', '#FF9800'],
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
    super.updated();
  }

  connectedCallback() {
    super.connectedCallback()
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

  decimateData(data, samplesInHour) {

    const outData = [];

    const msStep = 60 * 60 * 1000 / samplesInHour;
    let sum = 0;
    let count = 0;
    let prevValue = 0;
    let first = Date.parse(data[0].last_changed);
    for (let i = 0; i < data.length; i++){
      const timeStamp = Date.parse(data[i].last_changed);
      const tempValue = parseFloat(data[i].state);
      const value = isNaN(tempValue) ? prevValue : tempValue;
      prevValue = value;

      if (timeStamp < first + msStep) {
        sum = sum + value;
        count++;
      }
      else {
        outData.push([first, Math.round(sum / count * 10)/10]);
        sum = value;
        count = 1;
        first = first + msStep;
      }
    }

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
      return data.map(d =>this.decimateData(d, samplesInHour));

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


    return data.map(d => {
      return {
        min:  d && d.length ? ss.min(d) : 0,
        max: d && d.length ? ss.max(d) : 0,
        mean: d && d.length ? ss.mean(d) : 0,
        mode: d && d.length ? ss.mode(d) : 0,
        median: d && d.length ? ss.median(d) : 0
      }
    });
  }

  _handleToggleClick(e, stateName) {
    this[stateName] = !this[stateName];

    console.log(this[stateName]);
  }

  _handleSensorClick(e, sensors, deviceName) {
    //console.log(e);
    let width = screen.width;
    let height = screen.height;
    //console.log(width,height );

    const topOffset = screen.height * 0.2;
    const houseHeight = screen.height * 0.8
    this.faceplateOpen = true;
    this.faceplateE = { clientY: e.clientY  > height * 0.5 ? e.clientY - houseHeight * 0.5 - topOffset + 12: e.clientY - topOffset , title: deviceName ? deviceName : sensors[0].name };

    const promise = this.updateData(sensors, 24, 60);

    promise.then((data) => {
      console.log("PROMISE THEN")
      console.log(data)

      if (data && data.length > 0 && data[0].length) {

        console.log("UPDATE CHART");
        console.log(data)

        console.log( data.map((d, i) => {
          return  {
            name: 'sales ' + i,
            data: d
            }

        }))
        this.statistics = this.calculateStatistics(data.map(d => d.map(dd => parseFloat(dd[1]))));


        this.chart.updateSeries(
          data.map((d, i) => {
            return  {
              name: sensors[i].name,
              //data: data.map(a => [Date.parse(a.last_changed), a.state])

              data: d
              }

          })
        )
        console.log("PREYOPT");

        if (data.length === 1 || true) {

          const limits = sensors.map(s => this.getLimits(s));
          console.log("YOPT");

          console.log(limits);
          const yOpt = {
            yaxis: {
              forceNiceScale: true,
              show: true,
              tickAmount: 7,
              min: limits[0].LL,
              max:limits[0].HH,
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
            }
          }
          this.chart.updateOptions(yOpt);

          this.chart.addYaxisAnnotation({
            y: limits[0].HH,
            y2: null,
            fillColor: "#d0342c",

            id: "HH",
            label: {
              text: '',
              style: {
                color: "#fff",
                background: '#00E396'
              }
            }
          }, true);

          this.chart.addYaxisAnnotation({
            y: limits[0].H,
            y2: null,
            fillColor: "#FFBF00",
            id: "H",

            label: {
              text: '',
              style: {
                color: "#fff",
                background: '#00E396'
              }
            }
          }, true);
          this.chart.addYaxisAnnotation({
            y: limits[0].L,
            y2: null,
            fillColor: "#FFBF00",
            id: "L",

            label: {
              text: '',
              style: {
                color: "#fff",
                background: '#00E396'
              }
            }
          }, true);
          this.chart.addYaxisAnnotation({
            y: limits[0].LL,
            y2: null,
            fillColor: "#d0342c",

            id: "LL",

            label: {
              text: '',
              style: {
                color: "#fff",
                background: '#00E396'
              }
            }
          }, true);
        }
        else {
          this.chart.removeAnnotation("HH");
          this.chart.removeAnnotation("H");
          this.chart.removeAnnotation("L");
          this.chart.removeAnnotation("LL");

        }

      }

    });

  }

  _closeFaceplate(e) {
    this.faceplateOpen = false;
  }

  openTab(evt,tabName) {
    this.activeTab = tabName;
  }


  async getAreas(hass) {
    cache.areas =
      cache.areas ?? (await this.hass.callWS({ type: "config/area_registry/list" }));
    return cache.areas;
  }

  async getDevices(hass) {

      return (await this.hass.callWS({ type: "config/device_registry/list" }));
  }

  async getEntities(hass) {

      return (await this.hass.callWS({ type: "config/entity_registry/list" }));

  }

  getLimits(sensor) {

    if (sensor.limits) {
      return sensor.limits;
    }

    let unit = sensor.unit && sensor.unit.length > 0 ? sensor.unit : "";
    let limits = sensor.range ? valueLimits[sensor.range]: valueLimits["noLimit"];

    if (unit === "C") {
      unit = mdiTemperatureCelsius;
      limits = sensor.range ? valueLimits[sensor.range]: valueLimits["temperature"];
    }
    else if (unit === "%") {
      unit = mdiWaterPercent;
      limits = sensor.range ? valueLimits[sensor.range]: valueLimits["percentage"];

    }
    else if (unit === "CO2") {
      unit = mdiMoleculeCo2;
      limits = sensor.range ? valueLimits[sensor.range]: valueLimits["co2"];
    }
    return limits;

  }

  getState = (state) => this.hass.states[state.entityId].state;


  toggleButton = (stateName, state0Icon, state1Icon) => {


    return html`
      <div class="toggle-button" style="height: 20px;width:20px;" @click="${(e) =>  this._handleToggleClick(e, stateName)}">
        <svg-icon type="mdi" size="16" path=${this[stateName] ? state1Icon : state0Icon} ></svg-icon>
      </div>
    `;

  }

  getColor = (val, limitTarget) => {

    const faultColorClass = "fault";
    const alarmColorClass = "alarm";
    const warningColorClass = "warning";
    const normalColorClass = "normal";

    if (!limitTarget || limitTarget.noLimit) {
      return normalColorClass
    }

    if (typeof val !== "number" || isNaN(val)) {
      return faultColorClass;
    }
    else if (val < limitTarget.LL) {
      return alarmColorClass;
    }
    else if (val < limitTarget.L) {
      return warningColorClass;
    }
    else if (val > limitTarget.HH) {
      return alarmColorClass;
    }
    else if (val > limitTarget.H) {
      return warningColorClass;
    }
    else {
      return normalColorClass;
    }
  }

  render() {

   // console.log(this.panel);
   //  console.log(this.getAreas())
   // console.log(this.getEntities())

    console.log( this.hass.states['weather.forecast_home'].attributes);

    const doors = [
      { floor: 0, side: "left" },
      { floor: 1, side: "left" },
      { floor: 1, side: "right" },
    ]

    const showValueWithUnit = (val, unit, valueStatusColor, horizontal, sensors, eventInParent) => {

      return html`
      <div class="sensor ${horizontal}" @click="${(e) => eventInParent ? null : this._handleSensorClick(e, sensors)}">
        <div class="sensor-value ${valueStatusColor}" >
          ${val}
        </div>
        <div class="sensor-unit">
          ${ unit.length > 6
            ? html`<svg-icon type="mdi" size="16" path=${unit} ></svg-icon>`
            : html`<div class="plain-unit">${unit}</div>`
          }
        </div>
      </div>`;
    }

    const showSensor = (sensor, horizontal="", isKilo=false, eventInParent=false) => {

      const value = this.hass.states[sensor.entityId].state * (isKilo ? 0.001 : 1);
      const accuracy = sensor.accuracy > 0 ? sensor.accuracy : 0.1;
      const decimals = sensor.decimals >= 0 ? sensor.decimals : 1;
      const unit = sensor.unit && sensor.unit.length > 0 ? sensor.unit : "";
      const limits = this.getLimits(sensor);
      const valueStatusColor = this.getColor(value, limits)
      const roundedValue = (Math.round(value / accuracy) * accuracy).toFixed(decimals)

      return showValueWithUnit(roundedValue, unit, valueStatusColor, horizontal, [sensor], eventInParent)
    }

    const showCombinedSensor = (sensors, horizontal="", isKilo=false, eventInParent=false) => {

     /* const value = this.hass.states[sensor.entityId].state * (isKilo ? 0.001 : 1);
      const accuracy = sensor.accuracy > 0 ? sensor.accuracy : 0.1;
      const decimals = sensor.decimals >= 0 ? sensor.decimals : 1;
´      const roundedValue = (Math.round(value / accuracy) * accuracy).toFixed(decimals)*/


      const limits = this.getLimits(sensors[0]);

      const unit = sensors[0].unit && sensors[0].unit.length > 0 ? sensors[0].unit : "";

      const roomNumber = sensors.filter(s => !s.excludeFromStatistics).length;

      const averageValue = sensors.filter(s => !s.excludeFromStatistics).reduce((sum, cur) => {
        return sum + parseFloat(this.hass.states[cur.entityId].state);
      }, 0) / roomNumber;

      const valueStatusColor = this.getColor(averageValue, limits)


      const roundedValue = (Math.round(averageValue / 0.5) * 0.5).toFixed(1)


      return html`
      ${ showValueWithUnit(roundedValue, unit, valueStatusColor, horizontal, sensors, eventInParent) }

        <!--div class="combinedx" >
        </div -->
      `;
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
      ${drawSky()}
      <div class="button-row">
       ${JButton(mdiFloorPlan, 24)}
       ${JButton(mdiFloorPlan, 24)}
       ${JButton(mdiFloorPlan, 24)}
       ${JButton(mdiFloorPlan, 24)}
       ${JButton(mdiFloorPlan, 24)}

      </div>

      <div class="roof">
        <svg id="svg-roof" width="100%" height="100%" viewBox="0 0 1000 500" preserveAspectRatio="none">
          <polyline points="0,500 500,8, 1000,500" style="stroke:transparent;stroke-width:14" />
        </svg>
      </div>

    `;

    const JButton = (icon, size) => {

      return html`
      <button class="btn">
          <svg-icon type="mdi" size=${size} path=${icon}} ></svg-icon>
      </button>

      `;


    }
    const SupplyReturnLines = () => {
      const deviceOn = getDeviceStatus(this.getState(this.panel.config.entities.pumpPriority), [10, 20]);
      const iconColor = (deviceOn === "active" ? activeColor : normalTextColor);

      return html`
        <div class="supply-return-lines">
          <div class="column center">
            <div class="column-item">
              <font color=${iconColor}>
                <svg-icon type="mdi" size="14" path=${mdiTemperatureCelsius}} ></svg-icon>
              </font>
            </div>
            <div class="column-item">
              <font color=${supplyColor}>
                <svg-icon type="mdi" size="20" viewBox="0 0 24 24" path=${mdiArrowRightThin} ></svg-icon>
              </font>
            </div>
            <div class="column-item">
              <font color=${returnColor}>
                <svg-icon type="mdi" size="20" viewBox="0 0 24 24" path=${mdiArrowLeftThin} ></svg-icon>
              </font>
            </div>
          </div>
          ${this.panel.config.heatingCircuits.map(c => showCircuitColumn(c, iconColor))}
        </div>
    `;
    }

    const showCircuitColumn = (circuit, iconColor) => {

      return html`
        <div class="column center" @click="${(e) => this._handleSensorClick(e, [circuit.supply,circuit.return ], "Supply-return")}">
          <div class="column-item">
            <font color=${iconColor}>
              <svg-icon type="mdi" size="20" path=${circuit.type === "radiator" ? mdiRadiator : mdiHeatingCoil} ></svg-icon>
            </font>
          </div>
          <div class="column-item">
            ${showSensor(circuit.supply)}
          </div>
          <div class="column-item">
            ${showSensor(circuit.return)}
          </div>
        </div>
      `;
    }

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


      <div class="item" >
        <font color=${pumpLineInColor}>
          <svg-icon type="mdi" size="24" path=${mdiArrowUpThin} ></svg-icon>
        </font>

        <div class="item icon" style="color:normalTextColor">
          <svg-icon type="mdi" size="14" path=${mdiTemperatureCelsius} ></svg-icon>
        </div>

        <font color=${pumpLineOutColor}>
          <svg-icon type="mdi" size="24" path=${mdiArrowDownThin} ></svg-icon>
        </font>
      </div>

      <div class="item half">${showSensor(this.panel.config.entities.brineInLine, "horizontal")}</div>
      <div class="item half">${showSensor(this.panel.config.entities.brineOutLine, "horizontal")}</div>


    </div>
  `;

    const boiler = () => {

      const valt = this.hass.states[this.panel.config.entities.waterTop.entityId].state;
      const valc = this.hass.states[this.panel.config.entities.waterCharge.entityId].state
      const topColor = getLimitedColor(valt, boilerLimits, boilerColors)
      const bottomColor = getLimitedColor(valc, boilerLimits, boilerColors)
      const deviceOn = getDeviceStatus(this.getState(this.panel.config.entities.pumpPriority), [10, 30]);
      const icon = (deviceOn === "active" ? mdiWaterBoiler : mdiWaterBoilerOff);
      const iconColor = (deviceOn === "active" ? activeColor : normalTextColor);

      return html`
      <div class="device ${deviceOn} roundish" >
        <div class="boiler" @click="${(e) => this._handleSensorClick(e, [this.panel.config.entities.waterTop, this.panel.config.entities.waterCharge ], "Boiler")}">
          <div class="column">
            <div class="temp-bar" style="background-image: linear-gradient(${topColor}, ${bottomColor});"></div>
          </div>
          <div class="column wide">
            ${showSensor(this.panel.config.entities.waterTop, "", false, true)}
            <div class="item">
              <div class="item icon" style="color: ${iconColor}">
                <svg-icon type="mdi" size="24" path=${icon} ></svg-icon>
              </div>
              <div class="item icon" style="color:normalTextColor">
                <svg-icon type="mdi" size="14" path=${mdiTemperatureCelsius} ></svg-icon>
              </div>
            </div>
            ${showSensor(this.panel.config.entities.waterCharge, "", false, true)}
          </div>
        </div>
      </div>
    `;
    }

    const showFaceplate = () => {
      const y = this.faceplateE.clientY;

      return html`
        <div class="faceplate" style="display:${this.faceplateOpen ? "block" : "none"};top:${y}px">
          <div class="faceplate-title">
            ${this.faceplateE.title}
            <!-- Tab links -->
            <div class="tab">
              <button class="tablinks ${this.activeTab === "graphTab" ? "active" : ""}" @click="${(e) => this.openTab(e, 'graphTab')}">
                <svg-icon type="mdi" size="14" path=${mdiChartLine} ></svg-icon>
              </button>
              <button class="tablinks ${this.activeTab === "statTab" ? "active" : ""}" @click="${(e) => this.openTab(e, 'statTab')}">
                <svg-icon type="mdi" size="14" path=${mdiCalculator} ></svg-icon>
              </button>
              <button class="tablinks ${this.activeTab === "operateTab" ? "active" : ""}" @click="${(e) => this.openTab(e, 'operateTab')}">
                <svg-icon type="mdi" size="14" path=${mdiTune} ></svg-icon>
              </button>
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

            <div class="stat-table">

              <div class="stat-table-cell">Name</div>

              <div class="stat-table-cell">min</div>
              <div class="stat-table-cell">max</div>
              <div class="stat-table-cell">mean</div>
              <div class="stat-table-cell">mode</div>
              <div class="stat-table-cell">median</div>

              ${this.statistics.map(s => {
                return html`
                  <div class="stat-table-cell">name</div>

                  <div class="stat-table-cell">${Math.round(s.min*10)/10}</div>
                  <div class="stat-table-cell">${Math.round(s.max*10)/10}</div>
                  <div class="stat-table-cell">${Math.round(s.mean*10)/10}</div>
                  <div class="stat-table-cell">${Math.round(s.mode*10)/10}</div>
                  <div class="stat-table-cell">${Math.round(s.median*10)/10}</div>
                `;

              })}
            </div>



          </div>
          <div id="graphTab" class="tabcontent" style="display: ${this.activeTab === "operateTab" ? "block" : "none"}">
            <p>Operations</p>
          </div>
        </div>
      `;
    }

    const pump = () => {

      const deviceOn = getDeviceStatus(this.getState(this.panel.config.entities.pumpPriority), [10]);
      const icon = (deviceOn === "active" ? mdiHeatPump : mdiHeatPumpOutline);
      const iconColor = (deviceOn === "active" ? activeColor : normalTextColor);

      return html`
        <div class="device ${deviceOn}" >
          <div class="pump" @click="${(e) => this._handleSensorClick(e, [this.panel.config.entities.brineInLine, this.panel.config.entities.brineOutLine],"Pump")}">
            <div class="item" style="color: ${iconColor}">
              <div class="buffer-arrow" style="color: ${Math.round(this.getState(this.panel.config.entities.pumpPriority)) === 20 ? activeColor : inActiveColor}">
                <svg-icon type="mdi" size="24" path=${mdiArrowLeftBold} ></svg-icon>
              </div>
              <svg-icon type="mdi" size="32" path=${icon} ></svg-icon>
              <div class="boiler-arrow" style="color: ${Math.round(this.getState(this.panel.config.entities.pumpPriority)) === 30 ? activeColor : inActiveColor}">
                <svg-icon type="mdi" size="24" path=${mdiArrowRightBold} ></svg-icon>
              </div>
            </div>
            ${showSensor(this.panel.config.entities.pumpPower, "", true, false)}
            ${pumpLines()}
          </div>
        </div>
      `;
    }

    const electricity = () => {

      const value = this.hass.states[this.panel.config.entities.totalPower.entityId].state;
      const icon = value > 0 ? mdiTransmissionTowerImport : mdiTransmissionTowerImport;
      const iconColor = value > 0 ? activeColor : normalTextColor;

      return html`
        <div class="electricity">
          <div class="item icon" style="color: ${iconColor}">
            <svg-icon type="mdi" size="24" path=${icon} ></svg-icon>
          </div>
          ${showSensor(this.panel.config.entities.totalPower, "", true)}
        </div>
    `;
    }

    const water = () => {

      const value = this.hass.states[this.panel.config.entities.waterFlow.entityId].state;
      const icon = value > 0 ? mdiWaterPump : mdiWaterPumpOff;
      const iconColor = value > 0 ? activeColor : normalTextColor;

      return html`
        <div class="water">
          <div class="item icon" style="color: ${iconColor}">
            <svg-icon type="mdi" size="24" path=${icon} ></svg-icon>
          </div>
          ${showSensor(this.panel.config.entities.waterFlow)}
        </div>
    `;
    }

    const floor = (floor) => {

      const rooms = this.panel.config.rooms.filter(a => a.floor === floor);
      const roomTemps = rooms.map(a => a.entities[0]);
      const roomNumber = rooms.length;

      const averageValue = rooms.reduce((sum, cur) => {
        return sum + parseFloat(this.hass.states[cur.entities[0].entityId].state);
      }, 0) / roomNumber;

      const minValue = rooms.reduce((min, cur) => {
        const val = parseFloat(this.hass.states[cur.entities[0].entityId].state);
        return min <  val ? min : val;
      }, 100);

      const maxValue = rooms.reduce((max, cur) => {
        const val = parseFloat(this.hass.states[cur.entities[0].entityId].state);
        return max >  val ? max : val;
      }, -100);

      const roundedValue = (Math.round(averageValue / 0.5) * 0.5).toFixed(1)

      const roundedMinValue = (Math.round((averageValue - minValue)/ 0.5) * 0.5).toFixed(1)
      const roundedMaxValue = (Math.round((maxValue - averageValue)/ 0.5) * 0.5).toFixed(1)
      const roundedRange = (Math.round((maxValue - minValue)/ 0.5) * 0.5).toFixed(1)

      const test = (maxValue - minValue) / ((maxValue + minValue) * 0.5);

      const roundedTest = (Math.round((test)/ 0.1) * 0.1).toFixed(1)

      /*const value = this.hass.states[this.panel.config.entities.waterFlow.entityId].state;
      const icon = value > 0 ? mdiWaterPump : mdiWaterPumpOff;
      const iconColor = value > 0 ? activeColor : normalTextColor;*/

      return html`
        ${showCombinedSensor(roomTemps)}
        <div class="floor-value">
          <svg-icon type="mdi" size="16" path=${mdiArrowExpandVertical} ></svg-icon>
          ${roundedRange}
        </div>
    `;
    }


    const radiatorLine = (floor, line) => html`
      ${this.panel.config.rooms.filter(a => a.line === line && a.floor === floor).map(room => showRoom(room))}
    `;

    const drawHouse = () => html`
      <div class="house">
        <div class="floor second" @click="${(e) =>  this._handleToggleClick(e, 'minimize2Floor')}">
          <!-- div class=floor-button-holder>
            ${this.toggleButton("minimize2Floor", mdiCollapseAll, mdiExpandAll)}
            <div class="floor-sign"><svg-icon type="mdi" size="32" path=${mdiHomeFloor2} ></svg-icon></div>

          </div -->

          ${this.minimize2Floor ? floor(2) : radiatorLine(2, 1)}
          ${this.minimize2Floor ? null : radiatorLine(2, 2)}
        </div>
        <div class="floor first" @click="${(e) =>  this._handleToggleClick(e, 'minimize1Floor')}">
          <!-- div class=floor-button-holder>
            ${this.toggleButton("minimize1Floor", mdiCollapseAll, mdiExpandAll)}
            <div class="floor-sign"><svg-icon type="mdi" size="32" path=${mdiHomeFloor1} ></svg-icon></div>

          </div -->

          ${this.minimize1Floor ? floor(1) : radiatorLine(1, 1)}
          ${this.minimize1Floor ? null : radiatorLine(1, 2)}
        </div>
        <div class="floor basement" @click="${(e) =>  this._handleToggleClick(e, 'minimize0Floor')}">
          <!--div class=floor-button-holder>
            ${this.toggleButton("minimize0Floor", mdiCollapseAll, mdiExpandAll)}
            <div class="floor-sign"><svg-icon type="mdi" size="32" path=${mdiHomeFloor0} ></svg-icon></div>

          </div -->
          <div class="basement-rooms">


            ${this.minimize0Floor ? floor(0) : radiatorLine(0, 2)}</div>
          <div class="boiler-room">
            <div class="column">
            <!-- Water -->
              ${boiler()}
            </div>
            <div class="column">
            <!-- Pump -->
              ${pump()}
            </div>
            <div class="column">
              <!-- Heating -->
              ${SupplyReturnLines()}
            </div>
            <div class="column">
            <!-- Utilities -->
              ${water()}
              ${electricity()}
            </div>
          </div> <!-- BOILER ROOM -->
        </div> <!-- BASEMENT -->
      ${showFaceplate()}
      </div> <!-- HOUSE -->
    `;
    const drawSky = (sky) => {

      /*mdiWeathersunny,
      mdiWeatherCloudy,
      mdiWeatherPartlyCloudy,
        mdiWeatherSnowy,*/

      const icons = {
        snowy: mdiWeatherSnowy,
        cloudy: mdiWeatherCloudy,
        sunny: mdiWeatherSunny
      }
      const color = "#cccccc";
      const icon = icons[this.hass.states['weather.forecast_home'].attributes.forecast[0].condition];
      const icon2 = icons[this.hass.states['weather.forecast_home'].attributes.forecast[1].condition];
      const temp = this.hass.states['weather.forecast_home'].attributes.temperature;
      const temp2 = this.hass.states['weather.forecast_home'].attributes.forecast[1].temperature;

      return html`
        <div class="sky">
          <div class="temp-bar-horizontal">
            <div>${temp}</div><div>${temp2}</div>
          </div>
          <div class="weather-bar-horizontal">
            <font color=${color}>
                <svg-icon type="mdi" size="28" path=${icon} ></svg-icon>
            </font>
            <font color=${color}>
              <svg-icon type="mdi" size="28" path=${icon2} ></svg-icon>
            </font>
          </div>
        </div>
      `;

    }

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
      </div>
    `;
    }

    return html`
      <div class="main" data-theme=${currentThemeName} >
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
        color: var(--text-color, #efefef);
        font-size: 3vw;

        --warning-background-color: #FFBF00df;
        --warning-text-color: #666666;

        --alarm-background-color: #d0342cdf;
        --alarm-text-color: #eeeeee;

        --fault-background-color: #e300ff;
        --fault-text-color: #eeeeee;

      }

      .main{
        width: 100%;
        height: 100vh;
        display: flex;
        flex-wrap: wrap;
        background-color: var(--theme-background-color, #113366);
        padding-top: 12px;
      }
      /*         --theme-background-color: #113366;
      --house-color: #ffffff22;

*/
      .main[data-theme='dark']{
        --house-color: #ffffff22;
        --theme-background-color: transparent;
        --unit-color: #cccccc;
        --value-color: #efefef;
        --title-color: #dddddd;
        --value-dark-color: #333333;
        --text-color: #efefef;
        --room-border-color: #333333ff;
        --passive-icon-color: #999999;

      }
      .main[data-theme='light']{
        --house-color: #ffffff11;
        --theme-background-color: transparent;
        --unit-color: #666666;
        --value-color: #333333;
        --title-color: #333333;
        --value-dark-color: #333333;
        --text-color: #efefef;
        --room-border-color: #cccccc;
        --passive-icon-color: #cccccc;

      }


      /* Style buttons */

      .toggle-button{
        background-color: #ffffff; /* Blue background */
        color: black; /* White text */
        padding: 2px 2px; /* Some padding */
        border: 1px solid #bbbbbb;
        border-radius: 3px;
      }
      .floor-button-holder {
        display: flex;
        flex-wrap: wrap;
        position: absolute;
        justify-content: center;
        width: 25px;
        top: 0;
        left: 0;
      }
      .btn {
        background-color: #333399; /* Blue background */
        border: none; /* Remove borders */
        color: white; /* White text */
        padding: 2px 2px; /* Some padding */
        margin: 2px;
        font-size: 24px; /* Set a font size */
        width: 28px;
        height: 28px;

        cursor: pointer; /* Mouse pointer on hover */
      }



      /* Darker background on mouse-over */
      .btn:hover {
        background-color: RoyalBlue;
      }


      .floor-sign {
        justify-self: left;
        color: var(--passive-icon-color);
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

      .stat-table {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
      }
      .stat-table-cell {
        flex: 1 1 16%;
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
        fill: var(--house-color);
      }
      .button-row {
        position: absolute;
        left: 0;
        width: 100%;
        bottom: 0;
        display: flex;
        justify-content: center;
      }
      .sky {
        position: absolute;
        right: 0;
        top: 0;
        width: 25%;
        display: flex;
        flex-wrap: wrap;
        justify-content: end;
        font-size: 4vw;
        padding-right: 6px;
      }
      .temp-bar-horizontal {
        display: flex;
        flex: 0 0 100%;
        align-content: center;
        justify-content: space-between;
        padding: 2px;
        width: 100%;
      }
      .weather-bar-horizontal {
        display: flex;
        flex: 0 0 100%;
        align-content: center;
        justify-content: space-between;
        padding: 2px;
      }
      #svg-roof {
        vertical-align:top;
      }

      .floor-value {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        align-content: center;
        font-size: 4.5vw;

      }

      .floor {
        position: relative;

        padding: 0px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        background-color:  var(--house-color, #ffffff22);
        align-items: flex-start;
        align-content: center;
        margin-top: 12px;
        padding-left: 25px;
        min-height: 10vh;

      }
      .floor.first {
        align-items: center;
      }
      .floor.second {
        align-items: center;
      }
      .floor.basement {
        justify-content: center;
        flex-wrap: wrap;
        padding-bottom: 6px;
        padding-left: 0;
        padding-right: 0;
      }

      .room {
        /*min-height: 4vh;*/
        padding: 8px;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        border: 1px solid var(--room-border-color);
        background-color: #ffffff22;
        /*margin: 3px;
        border-radius: 3px;*/
        flex: 0 1;
        max-width: 40%;
      }

      .basement-rooms {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid #ffffff44;
        padding-bottom: 6px;
        align-content: center;
        min-height: 10vh;

      }
      .room-name {
        font-size: 3vw;
        font-weight: bold;
        margin-right: 3px;
        color: var(--title-color);
      }

      .sensor {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        font-weight: bold;
        border-radius: 6px;
        padding: 1px;
        padding-left: 3px;
        padding-right: 3px;
        flex: 0 1;
        border: 1px solid #999999;
        background-color: #00000033;
        margin-right: 3px;
        margin-left: 3px;
        border-radius: 3px 3px 8px 8px;
      }

      .combined .sensor {
        border-top: 1px solid #999999;
        padding: 0;
        padding-top: 1px;

      }
      .sensor.horizontal {
        flex-wrap: nowrap;
        margin-right: 0;
        margin-left: 0;
        padding-left: 1px;
        padding-right: 1px;
      }

      .device {
        border: 1px solid #cccccc;
        border-radius: 3px;
        padding: 3px;
        margin-left: 5px;
        margin-right: 5px;
        background-color: #ffaa3344;
      }

      .device.roundish {
        border-radius: 999em 999em 999em 999em;
        background-color: #00bbff44;
      }

      .device.active {
        border-color: #cccccc;

      }

      .device.inactive {
        border-color: ${normalTextColor};
      }

      .fault{
        background-color: var(--fault-background-color) !important;
        color: var(--fault-text-color) !important;

      }
      .alarm {
        background-color: var(--alarm-background-color) !important;
        color: var(--alarm-text-color) !important;
      }

      .warning {
        background-color: var(--warning-background-color) !important;
        color: var(--warning-text-color) !important;
      }

      .normal {
        background-color: transparent !important;
        color: #333333;
      }

      .pump {
        cursor: pointer;
        width: 21vw;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
      }

      .faceplate {
        position: absolute;
        background-color: var(--value-dark-color);
        width: 96%;
        height: auto;
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
        width: 24px;
        font-weight: bold;
        color: #ffffff;

      }

      .boiler {
        /*width: 45px;*/
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: center;
        padding-top: 16px;
        padding-bottom: 16px;
      }

      .electricity {
          min-height: 5vh;
          padding: 3px;
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-between;
          border: 1px solid ${normalTextColor};
          margin-bottom: 5px;
          margin-left: 5px;

          border-radius: 3px;
          flex: 0 1;
          background-color: #aa111133;

        }

        .water {
          min-height: 5vh;
          padding: 3px;
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-between;
          border: 1px solid ${normalTextColor};
          margin-bottom: 5px;
          margin-left: 5px;

          border-radius: 3px;
          flex: 0 1;
          background-color: #ffffff33;

        }

      .column-item {
        margin-top: 3px;
        margin-bottom: 3px;
      }
      .item {
        display: flex;
        justify-content: center;

        flex: 0 1 100%;
        text-align: center;
        color: var(--value-color);
      }

      .item.icon {
        padding-top: 3px;
      }

      .item.half {
        flex: 0 1 50%;
        text-align: center;
        font-size: 3vw;
      }

      .supply-return-lines {
        flex: 1 0;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-items: center;
        border: 1px dashed #999999;
        margin-left: 5px;
        margin-right: 5px;
        background-color: #00aa6633;

      }

      .plain-unit {
        font-size: 3vw;
        width: auto;
      }
      .sensor-unit {
          text-align: center;
          border-radius: 50%;
          width: auto;
          font-size: 3vw;

          color: var(--unit-color);
      }
      .sensor-value {
        text-align: center;
        font-size: 4.5vw;
        color: var(--value-color);
        padding-left: 2px;
        padding-right: 2px;
        border-radius: 3px;
      }

      .sensor.horizontal .sensor-value {
        font-size: 3.8vw;
      }

      .boiler-room {
        flex:  1 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: flex-start;
        padding-top: 6px;

      }
      .column {
        flex: 0 1;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: flex-start;

      }

      .column.wide {
        flex: 1 0;
      }

      .column.center {
        align-items: center;
        align-content: space-between;
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

      .buffer-arrow {
          flex: 0 1;
      }

      .boiler-arrow {
        flex: 0 1;
      }


      .temp-bar {
        height: 60px;
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
        flex: 0 0 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: start;
        align-items: center;
        background-color: transparent;
        padding: 0px;
        margin-top: 3px;
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

    `];
  }
}
