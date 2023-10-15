class JhomeCard extends HTMLElement {

    config;
    content;

    // required
    setConfig(config) {
        this.config = config;
    }

    set hass(hass) {
        const entityId = this.panel ? this.panel.config.entity : this.config.entity;
        const state = hass.states[entityId];
        const stateStr = state ? state.state : 'unavailable';

        // done once
        if (!this.content) {
            // user makes sense here as every login gets it's own instance
            this.innerHTML = `
                <ha-card header="Hello ${hass.user.name}! NEW VERSION 2.0">
                    <div class="card-content"></div>
                </ha-card>
            `;
            this.content = this.querySelector('div');
        }
        // done repeatedly
        this.content.innerHTML = `
            <p>The ${entityId} is ${stateStr}.</p>
        `;
    }
}

customElements.define('jhome-card', JhomeCard);
