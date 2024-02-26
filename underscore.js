const log = console.log;
const testArr = [100, 200, 300];
const testObj = { age: 123, name: 'kwidonw', job: 'developer' };
const _ = {};
const MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

function getLength(list) {
  return list === null ? void 0 : list.length;
}
let isArrayLike = function (list) {
  let length = getLength(list);
  return typeof length === 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
};

_.map = function (data, iteratee) {
  let newList = [];
  if (isArrayLike(data)) {
    for (let i = 0, len = data.length; i < len; i++) {
      newList.push(iteratee(data[i], i, data));
    }
  } else {
    for (let key in data) {
      if (data.hasOwnProperty(key))
        newList.push(iteratee(data[key], key, data));
    }
  }
  return newList;
};

_.map([1, 2, 3], (v) => v * 2);
_.map({ a: 3, b: 2, c: 1 }, (v) => v * 2);

// this를 바인딩하고 싶은 경우, 함수를 호출할때 보조함수에서 해주면된다. 바인딩 하는 로직(부하가 있음)이 굳이 map안에 들어가 있을 필요가 없다.
_.map(
  [1, 2, 3],
  function (v) {
    return v * this;
  }.bind(5)
);

_.identity = function (v) {
  return v;
};
_.idtt = _.identity;

_.values = function (list) {
  return _.map(list, _.identity);
};

// map으로 리스트를 돌면서 값을 꺼내려면 map(list, (v)=>v)라고 써야한다. map은 순회만 하는 함수이기 때문에 iteratee를 넣어서 값을 추출까지 해야하는데
// 그때마다 v=>v를 하면 불편하다.
// _.value는 map에 identity를 조합하여 쉽게 사용한다
// _.values({ a: 1, b: 2 });

// 굳이 왜 똑같은 함수가 다른이름으로 있어야 할까?
// 아마도 함수이름만 보고 개발자의 의도를 표현하려면 똑같은 기능을 하더라도 의도를 나태낼수 있는 이름으로 표현하는게 좋을 것
_.args0 = _.identity;
_.args1 = function (a, b) {
  return b;
};
_.keys = function (list) {
  return _.map(list, _.args1);
};

// _.keys(testArr);
// _.keys(testObj);

_.each = function (data, iteratee) {
  if (isArrayLike(data)) {
    for (let i = 0, len = data.length; i < len; i++) {
      iteratee(data[i], i, data);
    }
  } else {
    for (let key in data) {
      if (data.hasOwnProperty(key)) iteratee(data[key], key, data);
    }
  }
  return data;
};

// _.each([1, 2, 3], log);
// _.each(testObj, log);

function bloop(newData, body) {
  return function (data, iter_predi) {
    let result = newData(data);
    if (isArrayLike(data)) {
      for (let i = 0; i < data.length; i++) {
        body(iter_predi(data[i], i, data), result, data[i]);
      }
    } else {
      for (let i = 0, keys = _.keys(data), len = keys.length; i < len; i++) {
        body(iter_predi(data[keys[i]], keys[i], data), result, data[keys[i]]);
      }
    }
    return result;
  };
}

_.map = bloop(
  () => [],
  (val, obj) => obj.push(val)
);

// log(_.map(testArr, (v) => v * 3));

_.each = bloop(_.idtt, () => {});

// _.each(testObj, log);

_.isObject = function (obj) {
  let type = typeof obj;
  return type === 'function' || (type === 'object' && !!obj);
};

_.keys = function (obj) {
  return _.isObject(obj) ? Object.keys(obj) : [];
};

// console.log(_.keys(testObj));
// console.log(_.keys(testArr));
// console.log(_.keys(10));
// console.log(_.keys(null));

_.oldFilter = function (data, predicate) {
  let result = [];
  for (let i = 0; i < data.length; i++) {
    if (predicate(data[i], i, data)) {
      result.push(data[i]);
    }
  }
  return result;
};

_.array = function () {
  return [];
};

_.filter = bloop(_.array, function (bool, result, val) {
  if (bool) result.push(val);
});

_.toArray = function (list) {
  return Array.isArray(list) ? list : _.values(list);
};

_.rest = function (list, num) {
  return _.toArray(list).slice(num || 1);
};
_.reverse = function (list) {
  return _.toArray(list).reverse();
};

log(_.reverse([1, 2, 3, 4]));
log(_.reverse({ 0: 1, 1: 10, 2: 100, 3: 1000, length: 4 }));
