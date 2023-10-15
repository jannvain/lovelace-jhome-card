
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
    return html`
      <wired-card elevation="2">

        <div> OUTSIDE LINE in 6.7C, LINE out -2.3C   outside temp 10C</div>
        <div style="margin-left:200px"> |</div>
        <div style="margin-left:200px"> |</div>
        <div style="margin-left:200px"> v</div>

        <svg width="100%" height="100%" viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid meet">
          <rect x="50" width=${x} height=${x} style="fill:rgb(200,200,200);stroke-width:3;stroke:rgb(0,0,0)" />
          <rect x=${50+x + 20} width=${x} height=${x} style="fill:rgb(200,200,200);stroke-width:3;stroke:rgb(0,0,0)" />
          <rect x=${50+2*x + 40} width=${x} height=${x} style="fill:rgb(200,200,200);stroke-width:3;stroke:rgb(0,0,0)" />
          <text text-anchor="middle" x=${50+x*0.5} y="25" fill="#000000">Boiler</text>
          <text text-anchor="middle" x=${50+x*1.5+20} y="25" fill="#000000">Pump</text>
          <text text-anchor="middle" x=${50+x*2.5+40} y="25" fill="#000000">Buffer</text>

          </svg>

          <div style="margin-left:200px"> |</div>
          <div style="margin-left:200px"> |</div>
          <div style="margin-left:200px"> v</div>
      <div class="radiator-lines">
        <div class="radiator-line">
          <div> Radiator Line 1 </div>
          <div> ${this.panel.config.roomTemperatures.filter(a => a.line === 1).map((cur) => html`<div>${cur.roomName} ${this.hass.states[cur.entityId].state}</div>`)}
          </div>
        </div>

        <div class="radiator-line">
          <div> Radiator Line 2 </div>
          <div> ${this.panel.config.roomTemperatures.filter(a => a.line === 2).map((cur) => html`<div>${cur.roomName} ${this.hass.states[cur.entityId].state}</div>`)}
          </div>
        </div>

        <div class="radiator-line">
        <div> Hot water </div>
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
      .radiator-line {
        background: #aaaaaa;
        padding: 6px;
        flex: 33%;
        margin: 6px;
      }
      .radiator-lines{
        display: flex;
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

