import PubSub from "./pubSub.js";

export default class Store {
  constructor(params) {
    this.actions = {};
    this.mutations = {};
    this.status = "resting";
    this.events = new PubSub();

    if (params.hasOwnProperty("actions")) {
      this.actions = params.actions;
    }

    if (params.hasOwnProperty("mutations")) {
      self.mutations = params.mutations;
    }

    this.state = new Proxy(params.state || {}, {
      set: function (state, key, value) {
        state[key] = value;

        console.log(`stateChange: ${key}: ${value}`);

        this.events.publish("stateChange", this.state);

        if (this.status !== "mutation") {
          console.warn(`You should use a mutation to set ${key}`);
        }

        this.status = "resting";

        return true;
      },
    });
  }

  dispatch(actionKey, payload) {
    if (typeof this.actions[actionKey] !== "function") {
      console.error(`Action "${actionKey} doesn't exist.`);
      return false;
    }

    console.groupCollapsed(`ACTION: ${actionKey}`);

    this.status = "action";

    this.actions[actionKey](this, payload);

    console.groupEnd();

    return true;
  }
}
