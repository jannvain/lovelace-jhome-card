
import "https://unpkg.com/wired-card@2.1.0/lib/wired-card.js?module";
import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

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

    const temps = this.panel.config.roomTemperatures.reduce((res, cur) => res + '<div style="color:#2222ff">' + cur.roomName + '</div>', '')

    const x = 200;
    const svgWidth = 1000;
    const svgHeight = 1000;

    const centerX = svgWidth / 2;
    const upY = 250;
    const topMargin = 10;
    const houseWidth = svgWidth * 0.70;
    const wallHeight = 650;

    const bottomFloorHeight = 0.33 * wallHeight;
    const firstFloorHeight = 0.33 * wallHeight;
    const secondFloorHeight = 0.33 * wallHeight;


    const sensorValue = (val) => html`<div class="room"><div class="sensor-name">${val.roomName}</div><div class="sensor-value">${this.hass.states[val.entityId].state}</div></div>`;


    return html`
      <wired-card elevation="2">
      ARMED
      <div class="house">

        <div class="roof">
          <svg id="svg-roof" width="100%" height="204" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="none">
            <polyline points="0,1000 500,8, 1000,1000" style="fill:none;stroke:#339933;stroke-width:8" />
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
            <div class="buffer"> </div>
            <div class="pump"> </div>
            <div class="boiler"> </div>
          </div>

        </div>
      </div>
        <p>The screen is${this.narrow ? "" : " not"} narrow.</p>
      </wired-card>
    `;
  }

  static get styles() {
    return css`
      :host {
        background-color: #fafafa;
        padding: 16px;
        display: block;
      }
      .house {
        padding: 0;
      }
      .floors {
        padding: 0;
        border: 3px solid #339933;
      }
      .roof {
        width: 100%;
        padding: 0;
        margin:0;
        border: 0;
      }
      #svg-roof {
        vertical-align:top;
      }
      .floor {
        padding: 3px;
        display: flex;
        flex-wrap: wrap;
      }
      .floor:nth-child(even) {
        background-color: #f3f3f3;

      }
      .floor:nth-child(odd) {

      }
      .floor.first {
        border-bottom: 3px solid #339933;

      }
      .floor.second {
        border-bottom: 3px solid #339933;
      }
      .floor.basement {

      }

      .room {
        flex: 33%;
        border: 1px solid #333333;
        padding: 3px;
        margin: 3px;
      }
      .sensor-value {
        display: inline-block;
        font-weight: bold;
        width: 30%
        text-align: right;
      }
      .sensor-name {
        display: inline-block;
        width: 30%

      }
      .pump {
        height: 60px;
        width: 60px;
        background-color: #55aa55;
        flex: 0 0 25%;
        padding: 3px;
        margin: 3px;

      }
      .buffer {
        height: 60px;
        width: 60px;
        background-color: #6699ff;
        flex: 0 0 25%;
        padding: 3px;
        margin: 3px;

      }
      .boiler {
        height: 60px;
        width: 60px;
        background-color: #6611aa;
        flex: 0 0 25%;
        padding: 3px;
        margin: 3px;

      }

      .radiator-line {
        background: #f9f9f9;
        padding: 6px;
        flex: 0 0 33%;
        margin: 6px;
      }
      .radiator-lines{
        display: flex;
        justify-content: space-between;
        width: 100%;

      }

      wired-card {
        background-color: white;
        padding: 16px;
        display: block;
        font-size: 18px;
        max-width: 600px;
        margin: 0 auto;
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

