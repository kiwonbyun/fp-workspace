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

console.log(_.map([1, 2, 3], (v) => v * 2));
console.log(_.map({ a: 3, b: 2, c: 1 }, (v) => v * 2));
