"use strict";

class ReactiveComponent {
  constructor(
    template,
    { data, methods, mounted, beforeDestroy },
    mountTarget
  ) {
    this.template = template;
    this.mountTarget = document.getElementById(mountTarget);
    this.mounted = mounted;
    this.template = this.template.bind(this);
    this.beforeDestroy = beforeDestroy;

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
    this.mounted();
  }

  render() {
    this.mountTarget.innerHTML = this.template();
  }
  destroy() {
    this.mountTarget.innerHTML = "";
    this.beforeDestroy();
    // this = '';
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
        this.counter++;
      },
      decrement() {
        setTimeout(() => {
          this.counter--;
        }, 500);
      },
    },
    mounted() {
      setTimeout(() => {
        this.changeSomeData("somethingElse");
      }, 500);
      setTimeout(() => {
        this.destroy;
      }, 1000)
    },
    beforeDestroy() {
      alert("destoryed");
    },
  },
  "app"
);
