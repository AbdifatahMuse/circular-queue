'use strict'

var EventEmitter = require('events').EventEmitter;
var util = require('util');

function CircularQueue (maxSize) {

  if (typeof maxSize !== 'number' || maxSize < 1) {
    throw new Error('please specify maxSize');
  }

  Object.defineProperties(this, {
    'maxSize': {
      get: function () {
        return maxSize;
      }
    },
    'size': {
      get: function () {
        return this._size;
      }
    }
  });

  this._items = [];
  this._head = 0;
  this._size = 0;
};

util.inherits(CircularQueue, EventEmitter);

CircularQueue.prototype._rotate = function () {

  var removedItem = this._items[this._head];

  if ((this._head + 1) === this.maxSize) {
    this._head = 0;
  }
  else {
    this._head++;
  }

  return removedItem;
};

CircularQueue.prototype.isFull = function () {
  return this.size === this.maxSize;
};

CircularQueue.prototype.isEmpty = function () {
  return this.size === 0;
};

CircularQueue.prototype.offer = function (item) {
  var tailIndex;

  if (this.isFull()) {
    this.emit('evict', this._rotate());
  }
  else {
    this._size++;
  }

  tailIndex = (this._head + (this.size - 1)) % this.maxSize;

  this._items[tailIndex] = item;
};

CircularQueue.prototype.peek = function () {
  return this._items[this._head];
};

CircularQueue.prototype.poll = function () {
  if (!this.isEmpty()) {
    this._size--;
    return this._rotate();
  }
};

module.exports = CircularQueue;

