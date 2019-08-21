'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function EventBus() {
  this.eventMap = {};
}

EventBus.prototype.on = function (eventName, callback) {
  if (this.eventMap[eventName] === undefined) {
    this.eventMap[eventName] = [];
  }

  this.eventMap[eventName].push(callback);
};

EventBus.prototype.emit = function (eventName) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var callbacks = this.eventMap[eventName];

  if (callbacks) {
    callbacks.forEach(function (callback) {
      Promise.resolve().then(function () {
        callback.apply(null, args);
      });
    });
  }
};

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var util = {
  debounce: function debounce(fun, delay, immediate) {
    var _this = this;

    var timer = null;
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (timer) {
        clearTimeout(timer);
      } else {
        timer = setTimeout(function () {
          fun.apply(_this, args);
        }, delay);
      }
    };
  },
  throttle: function throttle(fun, delay, immediate) {
    var _this2 = this;

    var flag = false;
    return function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      if (!flag) {
        flag = true;
        setTimeout(function () {
          fun.apply(_this2, args);
          flag = false;
        }, delay);
      }
    };
  },
  memeorize: function memeorize(fun) {
    var _this3 = this;

    var cache = {};
    return function () {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      var key = args.toString();

      if (cache[key]) {
        return cache[key];
      }

      var value = fun.apply(_this3, args);
      cache[key] = value;
      return value;
    };
  },
  log: function log(fun) {
    var _this4 = this;

    return function () {
      var start = new Date().getTime();

      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      var value = fun.apply(_this4, args);
      var end = new Date().getTime();
      console.log('invoke.. time cost:', value);
      return value;
    };
  },
  promisy: function promisy(fun) {
    var _this5 = this;

    return function () {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      return new Promise(function (resolve, reject) {
        try {
          resolve(fun.apply(_this5, args));
        } catch (e) {
          reject(e);
        }
      });
    };
  },
  currying: function currying(fun) {
    function helper(fn) {
      for (var _len6 = arguments.length, arg1 = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
        arg1[_key6 - 1] = arguments[_key6];
      }

      var length = fn.length;
      var self = this;
      return function () {
        for (var _len7 = arguments.length, arg2 = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
          arg2[_key7] = arguments[_key7];
        }

        var arg = arg1.concat(arg2);

        if (arg.length < length) {
          return helper.call.apply(helper, [self, fn].concat(_toConsumableArray(arg)));
        }

        return fn.apply(this, arg);
      };
    }

    return helper(fun);
  },
  flatten: function flatten(array) {
    /*[2,3,[2]] */

    /* [[3,4,5],[2,3],[[3,4],6]] */
    function helper(ary) {
      var ret = [];

      if (Object.prototype.toString.call(array).slice(8, -1) === "Array") {
        ary.forEach(function (item) {
          if (Object.prototype.toString.call(item).slice(8, -1) === "Array") {
            ret = ret.concat(helper(item));
          } else {
            ret.push(item);
          }
        });
      } else {
        ret.push(ary);
      }

      return ret;
    }

    return helper(array);
  },
  timer: function timer(minute, second) {
    var timer = setInterval(function () {
      if (minute === 0 && second === 0) {
        clearInterval(timer);
      } else {
        if (second <= 0) {
          second = 60;
          minute--;
        }

        second--;
        console.log("".concat(minute, ":").concat(second));
      }
    }, 1000);
  },
  formatNumber: function formatNumber(number) {
    if (typeof number !== "number") {
      return null;
    }

    if (isNaN(number)) {
      return null;
    }

    var result = [];
    var tmp = number + "";
    var num = number;
    var suffix = "";

    if (tmp.indexOf(".") !== -1) {
      suffix = tmp.substring(tmp.indexOf(".") + 1);
      num = parseInt(tmp.substring(0, tmp.indexOf(".")));
    }

    while (num > 0) {
      result.unshift(num % 1000);
      num = Math.floor(num / 1000);
    }

    var ret = result.join(",");

    if (suffix !== "") {
      ret += "." + suffix;
    }

    return ret;
  },
  timeEscape: function timeEscape() {
    var timestamp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    if (!timestamp || isNaN(timestamp)) {
      return null;
    }

    var now = new Date().getTime();
    var minute = 60 * 1000;
    var hour = minute * 60;
    var day = hour * 24;
    var week = day * 7;

    if (timestamp >= now) {
      return "error";
    }

    if (timestamp >= now - minute) {
      return "1分钟内";
    }

    if (timestamp >= now - hour) {
      var m = Math.floor((now - timestamp) / minute);
      return "".concat(m, "\u5206\u949F\u524D");
    }

    if (timestamp >= now - day) {
      var h = Math.floor((now - timestamp) / hour);
      return "".concat(h, "\u5C0F\u65F6\u524D");
    }

    if (timestamp >= now - week) {
      var d = Math.floor((now - timestamp) / day);
      return "".concat(d, "\u5929\u524D");
    }

    return new Date(timestamp).toLocaleString();
  }
};

function LazyManAsync(name) {
  return new LazyManFactory(name);
}

function LazyManFactory(name) {
  var _this = this;

  this.tasks = [];
  this.tasks.push(function () {
    return new Promise(function (resolve, reject) {
      console.log("hi", name);
      resolve();
    });
  });
  setTimeout(function () {
    _this.run();
  }, 0);
}

LazyManFactory.prototype.run = function () {
  var _this2 = this;

  if (this.tasks.length === 0) {
    return;
  }

  var task = this.tasks.shift();
  task().then(function () {
    _this2.run();
  })["catch"](function () {
    _this2.run();
  });
};

LazyManFactory.prototype.sleep = function (time) {
  this.tasks.push(function () {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve();
      }, time * 1000);
    });
  });
  return this;
};

LazyManFactory.prototype.eat = function (name) {
  this.tasks.push(function () {
    return new Promise(function (resolve, reject) {
      console.log("eat:", name);
      resolve();
    });
  });
  return this;
};

LazyManFactory.prototype.sleepFirst = function (time) {
  this.tasks.unshift(function () {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve();
      }, time * 1000);
    });
  });
  return this;
};

function LazyMan(name) {
  return new LazyManFactory$1(name);
}

function LazyManFactory$1(name) {
  var _this = this;

  this.name = name;
  this.flag = false;
  this.tasks = [];
  this.tasks.push(function () {
    console.log('hi,', _this.name);

    _this.next();
  });
  setTimeout(function () {
    _this.next();
  }, 0);
}

LazyManFactory$1.prototype.eat = function (sth) {
  var _this2 = this;

  this.tasks.push(function () {
    console.log(_this2.name, ' eat dinner');

    _this2.next();
  });
  return this;
};

LazyManFactory$1.prototype.next = function () {
  var fn = this.tasks.shift();
  fn && fn();
};

LazyManFactory$1.prototype.sleep = function (delay) {
  var _this3 = this;

  this.tasks.push(function () {
    setTimeout(function () {
      _this3.next();
    }, delay * 1000);
  });
  return this;
};

LazyManFactory$1.prototype.sleepFirst = function (delay) {
  var _this4 = this;

  this.tasks.unshift(function () {
    setTimeout(function () {
      _this4.next();
    }, delay * 1000);
  });
  return this;
};

Function.prototype.bind2 = function (context) {
  var self = this;
  var args = [].slice.call(1, arguments);

  function newbind() {
    for (var _len = arguments.length, args2 = new Array(_len), _key = 0; _key < _len; _key++) {
      args2[_key] = arguments[_key];
    }

    return self.apply(this instanceof newbind ? this : context, args.concat(args2));
  }

  function nop() {}

  nop.prototype = this.prototype;
  newbind.prototype = new nop();
  return newbind;
};

var request = {
  sendSeqRequest: function sendSeqRequest() {
    var requests = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var result = [];

    function print(ary) {
      for (var i = 0; i < ary.length; i++) {
        if (!ary[i]) {
          return;
        }

        if (!ary[i].isPrint) {
          ary[i].data.isPrint = true;
          console.log(ary[i].data);
        }
      }
    }

    requests.forEach(function (url, i) {
      fetch(url).then(function (res) {
        result[i].data = res;
        result[i].isPrint = false;
        print(result);
      })["catch"](function (err) {
        result[i].data = err;
        result[i].isPrint = false;
        print(result);
      });
    });
  },
  retryAjax: function retryAjax(url) {
    var retryTimes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    function helper(url, times, err) {
      var num = times;
      console.log("call helper,:", num);

      if (num <= 0) {
        return Promise.reject(err);
      } else {
        return fetch(url).then(function (res) {
          return res;
        })["catch"](function (err) {
          return helper(url, num - 1, err);
        });
      }
    }

    return helper(url, retryTimes);
  },
  request: function request(url, method, params) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open(method, url);

      xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) {
          return;
        }

        if (xhr.state === 200) {
          resolve(xhr.response);
        }
      };

      xhr.addEventListener('error', function (e) {
        reject(error);
      });
      xhr.send(params);
    });
  }
};

function Schedule() {
  var _this = this;

  this.tasks = [];
  this.max = 2;
  setTimeout(function () {
    _this.run();
  }, 0);
}

Schedule.prototype.addTask = function (task) {
  this.tasks.push(task);
};

Schedule.prototype.run = function () {
  var _this2 = this;

  if (this.tasks.length === 0) {
    return;
  }

  var size = Math.min(this.max, this.tasks.length);

  for (var i = 0; i < size; i++) {
    var task = this.tasks.shift();
    this.max--;
    task().then(function (res) {
      _this2.max++;

      _this2.run();
    })["catch"](function (err) {
      _this2.max++;

      _this2.run();
    });
  }
};

exports.EventBus = EventBus;
exports.LazyMan = LazyMan;
exports.LazyManAsync = LazyManAsync;
exports.Schedule = Schedule;
exports.request = request;
exports.util = util;