"use strict";

class ReactiveComponent {
  constructor(template, { data, methods }, mountTarget) {
    this.template = template;
    this.mountTarget = document.getElementById(mountTarget);
    this.template = this.template.bind(this);

    for (let field in data) {
      this[`_${field}`] = data[field];
      Object.defineProperty(this, `${field}`, {
        get: function () {
          return this[`_${field}`];
        },
        set: function (val) {
          this[`_${field}`] = val;
          this.render();
        },
      });
    }

    for (let method in methods) {
      this[`${method}`] = methods[method];
      this[`${method}`] = this[`${method}`].bind(this);
    }
    this.render();
  }

  render() {
    this.mountTarget.innerHTML = this.template();
  }
}

let component = new ReactiveComponent(
  function template() {
    return `<h1>${this.someData}</h1> 
            <button type="button" onclick="component.randomSomeData()">randomData</button> 
            <div>counter: ${this.counter}</div>
            <button onclick="component.increment()">Increment</button>
            <button onclick="component.decrement()">DecrementAsync</button>`;
  },
  {
    data: {
      someData: "someData",
      counter: 0,
    },
    methods: {
      changeSomeData(val) {
        this.someData = val;
      },
      randomSomeData() {
        this.someData = Math.floor(Math.random() * 100);
      },
      increment() {
        this.counter++
      },
      decrement() {
        setTimeout(() => {
          this.counter--
        }, 500)
      }
    },
  },
  "app"
);

setTimeout(() => {
  component.changeSomeData("somethingElse");
}, 500);
