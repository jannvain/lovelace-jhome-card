
import {
  LitElement,
  html,
  css
} from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

import {unsafeHTML} from 'https://unpkg.com/lit-html@2.4.0/directives/unsafe-html.js?module';

const faultColor = css`#e300ff`;
const alarmColor = css`#ff0033`;
const warningColor = css`#FFBF00`;
const normalColor = css`#cccccc`;
const houseOutlineColor = "#a0a0a0";
const hocolor = css`#a0a0a0`;

const celciusSymbol = "C";

/*  &#8451;  &#x2103;
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
    const roofHeight = houseWidth * 0.5;
    const bottomFloorHeight = 0.33 * wallHeight;
    const firstFloorHeight = 0.33 * wallHeight;
    const secondFloorHeight = 0.33 * wallHeight;

    const faultColorClass = "fault";
    const alarmColorClass = "alarm";
    const warningColorClass = "warning";
    const normalColorClass = "normal";

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
      <div class="roof">
        <svg id="svg-roof" width="100%" height="100%" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="none">
          <polyline points="0,500 500,8, 1000,500" style="fill:#fefefe;stroke:${houseOutlineColor};stroke-width:14" />
        </svg>
      </div>
    `;

    const radiatorLine = (floor, line, pfix) => html`
      <div class="radiator-line">
        ${this.panel.config.roomTemperatures.filter(a => a.line === line && a.floor === floor).map(n => sensorValue(n, (line === 1 ? "left" : "right") + pfix, celciusSymbol))}
      </div>
  `;

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
            <div class="radiator-lines">
              ${radiatorLine(0, 1, " b")}
              ${radiatorLine(0, 2, " b")}
            </div>

            <div class="boiler-room">

              <div class="buffer-lines">
                <div class="item-line" >${sensorValue2(this.panel.config.entities.supplyLine)} C</div>
                <div class="arrow red">&larr;</div>

                <div class="item-line" >${sensorValue2(this.panel.config.entities.returnLine)} C</div>
                <div class="arrow blue">&rarr;</div>
              </div>
              <div class="buffer">
                <div class="item" >Buffer</div>
              </div>
              <div class="pump">
                  <div class="item" >Pump</div>
                  <div class="item" >${sensorValue2(this.panel.config.entities.pumpPower)} w</div>
                  <div class="item" >Heating</div>

              </div>
              <div class="boiler">
                <div class="item" >${sensorValue2(this.panel.config.entities.waterTop)} C</div>
                <div class="item" >Boiler</div>
                <div class="item" >${sensorValue2(this.panel.config.entities.waterCharge)} C</div>

              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const drawCorner = (type) => html`<div class="${type}cor">  </div>`;
    const drawCenter = (type, content) => html`<div class="${type}cen"> ${content} </div>`;
    const drawSide = (type, content) => html`<div class="${type}sid"> ${content} </div>`;

    return html`

      <div class="main">
        ${drawCorner("t")}
        ${drawCenter("t", drawRoofOutline())}
        ${drawCorner("t")}
        ${drawSide("m")}
        ${drawCenter("m", drawHouse())}
        ${drawSide("m")}
        ${drawCorner("b")}
        ${drawCenter("b", "")}
        ${drawCorner("b")}
      </div> `;

  }

  static get styles() {
    return css`
      :host {
        background-color: #fafafa;
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
      }

      .tcor, .tcen {
        height: 25vh;
      }

      .mcen, .msid {
        height: 60vh;
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
        border: 6px solid ${hocolor};
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
      }
      .floor:nth-child(even) {
        background-color: #fefefe;

      }
      .floor:nth-child(odd) {
        background-color: #f0f0f0;

      }
      .floor.first {
        border-bottom: 6px solid ${hocolor};

      }
      .floor.second {
        border-bottom: 6px solid ${hocolor};
      }
      .floor.virtual {
        border-bottom: 6px solid ${hocolor};
      }
      .floor.basement {
          justify-content: center;

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
        width: 3.5vw;
        height: 3.5vw;
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
        width: 100%;
        padding: 6px;
        padding-top: 12px;
        display: flex;
        flex-wrap: wrap;
      }
      .pump {
        height: 80px;
        width: 80px;
        font-size: 14px;
        border: 1px solid #3333ff;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;

        border-radius: 3px;
        background-color: #aaffff;
        /*flex: 0 0 25%;*/
        padding: 3px;
        margin: 3px;

      }
      .buffer {
        height: 80px;
        width: 80px;
        border: 1px solid #3333ff;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;

        background-color: #66ccff;
        padding: 3px;
        margin: 3px;
        border-radius: 50%;

      }
      .buffer-lines {
        height: 80px;
        width: 80px;
        border: 0px solid #3333ff;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;

        background-color: #transparent;
        padding: 3px;
        margin: 3px;

      }

      .boiler {
        height: 80px;
        width: 80px;
        border: 1px solid #3333ff;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;

        background-color: #aa6666;
        padding: 3px;
        margin: 3px;
        border-radius: 30%;
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
    `;
  }
}
customElements.define("Jhome-panel", JhomePanel);


/*
import {
  css,
  CSSResult,
  html,
  LitElement,
  // property,
  //customElement,
  TemplateResult,
  PropertyValues,
} from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap, StyleInfo } from 'lit-html/directives/style-map.js';

customElements.define("jhome-panel", FloorplanPanel);


//@customElement('jhome-panel')
export class FloorplanPanel extends LitElement {
  @property({ type: Object }) public hass!: HomeAssistant;
  @property({ type: Boolean }) public narrow!: boolean;
  @property({ type: Object }) public panel!: FloorplanPanelInfo;

  @property({ type: Boolean }) public showSideBar!: boolean;
  @property({ type: Boolean }) public showAppHeader!: boolean;

  @property({ type: String }) public examplespath!: string;
  @property({ type: Boolean }) public isDemo!: boolean;
  @property({ type: Function }) public notify!: (message: string) => void;

  styles: StyleInfo = { height: 'calc(100vh)' };

  static appHeaderHeight = 64;

  protected render(): TemplateResult {
    return html`
      <ha-app-layout>

        <app-header fixed slot="header" ?hidden=${!this.showAppHeader}>
          <app-toolbar>
            <ha-menu-button .hass=${this.hass} .narrow=${
      this.narrow
    }"></ha-menu-button>
            <div main-title>${this.panel?.title}</div>
          </app-toolbar>
        </app-header>

        <div class="content" style=${styleMap(this.styles)}>
          <floorplan-element .examplespath=${this.examplespath} .hass=${
      this.hass
    }
          ._config=${this.panel?.config?.config} .isDemo=${
      this.isDemo
    } .notify=${this.notify}>
          </floorplan-element>
        </div>

      </ha-app-layout>
    `;
  }

  static get styles(): CSSResult {
    return css`
      :host .content,
      :host .content floorplan-element {
        display: flex;
        flex-flow: column;
        flex: 1;
        min-height: 0;
      }

      [hidden] {
        display: none !important;
      }
    `;
  }

  get appHeaderHeight(): number {
    if (this.isDemo) return 0;
    return this.showAppHeader ? FloorplanPanel.appHeaderHeight : 0;
  }

  update(changedProperties: PropertyValues): void {
    if (this.panel) {
      this.showSideBar = this.panel.config.show_side_bar !== false;
      this.showAppHeader =
        this.panel.config.show_app_header !== false && !this.isDemo;

      if (this.hass && this.panel.config.show_side_bar === false) {
        this.hass.dockedSidebar = 'always_hidden';
      }

      this.styles = { height: `calc(100vh - ${this.appHeaderHeight}px)` };
    }

    super.update(changedProperties);
  }
}
*/

