
import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";



const houseOutlineColor = "#aaaaaa"
const hocolor = css`#aaaaaa`;

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


    let box = document.querySelector('ha-panel-custom');
    //let width = box.offsetWidth;
    //let height = box.offsetHeight;
    console.log(box);

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

    const sensorValue = (val, side) => html`<div class="room ${side}"><div class="sensor-name">${val.name}</div><div class="sensor-value">${this.hass.states[val.entityId].state}</div></div>`;
    const sensorValue2 = (val) => html`<div class="sensor-value">${this.hass.states[val.entityId].state}</div>`;

    const drawRoofOutline = () => html`
      <div class="roof">
        <svg id="svg-roof" width="100%" height="100%" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="none">
          <polyline points="0,500 500,8, 1000,500" style="fill:#fefefe;stroke:${houseOutlineColor};stroke-width:12" />
        </svg>
      </div>
    `;

    const drawHouse = () => html`
      <div class="house">
        <div class="floors">
          <div class="floor second">
            <div class="radiator-lines">
              <div class="radiator-line">
                ${this.panel.config.roomTemperatures.filter(a => a.line === 1 && a.floor === 2).map(n => sensorValue(n, "left"))}
              </div>
              <div class="radiator-line">
                ${this.panel.config.roomTemperatures.filter(a => a.line === 2 && a.floor === 2).map(n => sensorValue(n, "right"))}
              </div>
            </div>
          </div>

          <div class="floor first">
            <div class="radiator-lines">
              <div class="radiator-line">
                ${this.panel.config.roomTemperatures.filter(a => a.line === 1 && a.floor === 1).map(n => sensorValue(n, "left"))}
              </div>
              <div class="radiator-line">
                ${this.panel.config.roomTemperatures.filter(a => a.line === 2 && a.floor === 1).map(n => sensorValue(n, "right"))}
              </div>
            </div>
          </div>

          <div class="floor basement">

            <div class="radiator-lines">
              <div class="radiator-line">
                ${this.panel.config.roomTemperatures.filter(a => a.line === 1 && a.floor === 0).map(n => sensorValue(n, "left b"))}
              </div>
              <div class="radiator-line">
                ${this.panel.config.roomTemperatures.filter(a => a.line === 2 && a.floor === 0).map(n => sensorValue(n, "right b"))}
              </div>
            </div>

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

    return html`
      <div>

      ARMED
      <div class="house">

        <div class="roof">
          <svg id="svg-roof" width="100%" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="none">
            <polyline points="0,500 500,8, 1000,500" style="fill:none;stroke:${houseOutlineColor};stroke-width:10" />
          </svg>
        </div>
        <div class="floors">

          <div class="floor second">
            <div class="radiator-lines">
              <div class="radiator-line">
                ${this.panel.config.roomTemperatures.filter(a => a.line === 1 && a.floor === 2).map(sensorValue)}
              </div>
              <div class="radiator-line">
                ${this.panel.config.roomTemperatures.filter(a => a.line === 2 && a.floor === 2).map(sensorValue)}
              </div>
            </div>
          </div>

          <div class="floor first">
            <div class="radiator-lines">
              <div class="radiator-line">
                ${this.panel.config.roomTemperatures.filter(a => a.line === 1 && a.floor === 1).map(sensorValue)}
              </div>
              <div class="radiator-line">
                ${this.panel.config.roomTemperatures.filter(a => a.line === 2 && a.floor === 1).map(sensorValue)}
              </div>
            </div>
          </div>
          <div class="floor basement">
            <div class="radiator-lines">
              <div class="radiator-line">
                ${this.panel.config.roomTemperatures.filter(a => a.line === 1 && a.floor === 0).map(sensorValue)}
              </div>
              <div class="radiator-line">
                ${this.panel.config.roomTemperatures.filter(a => a.line === 2 && a.floor === 0).map(sensorValue)}
              </div>
            </div>
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
      <div class="ground">
      <div class="ground-lines">

      <div class="arrowv red">&uarr;</div>
      <div class="arrowv blue">&darr;</div>

      <div class="item-ground left" >${sensorValue2(this.panel.config.entities.supplyLine)} C</div>


      <div class="item-ground right" >${sensorValue2(this.panel.config.entities.returnLine)} C</div>


    </div>


      </div>

        <!-- p>The screen is${this.narrow ? "" : " not"} narrow.</p -->
      <div>
    `;
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
      .floors {
        padding: 0;
        border: 5px solid ${hocolor};
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
        border-bottom: 4px solid ${hocolor};

      }
      .floor.second {
        border-bottom: 4px solid ${hocolor};
      }
      .floor.virtual {
        border-bottom: 4px solid ${hocolor};
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
        flex: 33%;
        height: 40px;
        padding: 3px;
        margin: 0px;
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

      .sensor-value {
        display: inline-block;
        font-weight: bold;
        width: 50%
        text-align: right;
        border-radius: 6px;
        background-color: #dddddd;
        padding: 3px;
      }
      .sensor-name {
        display: inline-block;
        width: 50%

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
        flex: 0 0 33%;
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

