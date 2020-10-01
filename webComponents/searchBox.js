/**
 * You can override the default icons by including <span> or <img>
 * children of <search-box> with slot="left" and slot="right"
 * attributes.
 *
 * <search-box> supports the normal HTML disabled and hidden
 * attributes and also size and placeholder attributes, which have
 * the same meaning for this element as they do for the <input>
 * element.
 *
 * Input events from the internal <input> element bubble up and appear
 * with their target field set to the <search-box> element.
 *
 * The element fires a "search" event with the detail property set
 * to the current input string when the user clicks on the left
 * emoji (the magnifying glass). The "search" event is also
 * dispatched when then internal text field generates a "change"
 * event (when the text has changed and the user types Return or
 * Tab).
 *
 * The element fires a "clear" event when the user clicks on the
 * right emoji (the X). If no handler calss preventDefault() on
 * the event then the element clears the user's input once event
 * dispatch is complete.
 *
 * Note that there are no onsearch and onclear properties or
 * attributes: handlers for the "search" and "clear" events can
 * only be registered with addEventListener().
 */
class SearchBox extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.shadowRoot.append(SearchBox.template.content.cloneNode(true));

    this.input = this.shadowRoot.querySelector("#input");
    let leftSlot = this.shadowRoot.querySelector('slot[name="left"]');
    let rightSlot = this.shadowRoot.querySelector('slot[name="right"]');

    this.input.onfocus = () => {
      this.setAttribute("focused", "");
    };
    this.input.onblur = () => {
      this.removeAttribute("focused");
    };

    leftSlot.onclick = this.input.onchange = (event) => {
      event.stopPropagation();
      if (this.disabled) return;
      this.dispatchEvent(
        new CustomEvent("search", {
          detail: this.input.value,
        })
      );
    };

    rightSlot.onclick = (event) => {
      event.stopPropagation();
      if (this.disabled) return;
      let e = new CustomEvent("clear", { cancelable: true });
      this.dispatchEvent(e);
      if (!e.defaultPrevented) {
        this.input.value = "";
      }
    };
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "disabled") {
      this.input.disabled = newValue !== null;
    } else if (name === "placeholder") {
      this.input.placeholder = newValue;
    } else if (name === "size") {
      this.input.size === newValue;
    } else if (name === "value") {
      this.input.value = newValue;
    }
  }

  get placeholder() {
    return this.getAttribute("placeholder");
  }

  get size() {
    return this.getAttribute("size");
  }

  get value() {
    return this.getAttribute("value");
  }

  get disabled() {
    return this.getAttribute("disabled");
  }

  get hidden() {
    return this.getAttribute("hidden");
  }

  set placeholder(value) {
    this.setAttribute("placeholder", value);
  }

  set size(value) {
    this.setAttribute("size", value);
  }

  set value(text) {
    this.setAttribute("value", text);
  }

  set disabled(value) {
    if (value) {
      this.setAttribute("disabled", "");
    } else {
      this.removeAttribute("disabled");
    }
  }

  set hidden(value) {
    if (value) {
      this.setAttribute("hidden", "");
    } else {
      this.removeAttribute("hidden");
    }
  }
}

SearchBox.observedAttributes = ["disabled", "placeholder", "size", "value"];

SearchBox.template = document.createElement("template");
SearchBox.template.innerHTML = `
  <style>
    :host {
      display: inline-block;
      border: solid black 1px;
      border-radius: 5px;
      padding: 4px 6px;
    }
    :host([hidden]) {
      display: none;
    }
    :host([disabled]) {
      opacity: 0.5;
    }
    :host([focused]) {
      box-shadow: 0 0 2px 2px #6AE;
    }

    input {
      border-width: 0;
      outline: none;
      font: inherit;
      background: inherit;
    }

    slot {
      cursor: default;
      user-select: none;
    }
  </style>
  <div>
    <slot name="left">\u{1f50d}</slot>
    <input type="text" id="input" />
    <slot name="right">\u{2573}</slot>
  </div>
`;

customElements.define("search-box", SearchBox);
