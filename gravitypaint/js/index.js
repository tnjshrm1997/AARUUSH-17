'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var canvas = undefined,
    ctx = undefined,
    ctxColor = '#1EE4C1',
    rainbow = true;
var body = undefined,
    backgroundColorInput = undefined,
    brushColorInput = undefined,
    rainbowBrushInput = undefined,
    gravityInput = undefined,
    flowInput = undefined,
    clearButton = undefined;
var width = undefined,
    height = undefined;
var particles = [];
var attractor = undefined;
var G = 6,
    V = 10;
var launchParticles = false;
var lastMousePosition = {
  x: width / 2,
  y: height / 2
};
var hue = 0;

/** 
* V2 - A class to create vectors and handle the vector math
**/

var V2 = function () {
  function V2() {
    var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
    var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

    _classCallCheck(this, V2);

    this.x = x;
    this.y = y;
  }

  V2.prototype.set = function set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  };

  V2.prototype.setMag = function setMag(mag) {
    this.mult(mag / this.mag());
    return this;
  };

  V2.prototype.add = function add(vector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  };

  V2.prototype.sub = function sub(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  };

  V2.prototype.mult = function mult(multiplier) {
    this.x *= multiplier;
    this.y *= multiplier;
    return this;
  };

  V2.prototype.mag = function mag() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  };

  V2.prototype.limit = function limit(_limit) {
    var mag = this.mag();
    if (mag > _limit) {
      this.mult(_limit / mag);
    }
  };

  V2.prototype.lerp = function lerp(towards) {
    if (isNaN(towards.x) || isNaN(towards.y)) return;
    this.x += (towards.x - this.x) * 0.2;
    this.y += (towards.y - this.y) * 0.2;
  };

  return V2;
}();

/** 
* PaintParticle - the particle that paints a line to the canvas based on
* last position and current position.
* Its position updates based on the gravitational pull of the attractor
**/

var PaintParticle = function () {
  function PaintParticle() {
    _classCallCheck(this, PaintParticle);

    this.reset();
  }

  PaintParticle.prototype.launch = function launch() {
    this.launchVectors();
    this.attract = true;
    this.life = 0;
    this.alpha = 0.05 + Math.random() * 0.15;
  };

  PaintParticle.prototype.launchVectors = function launchVectors() {
    // position
    var launchVelocity = new V2().set(attractor.emitDirection.x, attractor.emitDirection.y).setMag(5);
    var positionOffset = new V2().set(attractor.emitNormal.x, attractor.emitNormal.y).setMag(-30 + Math.random() * 60);
    this.position.set(attractor.position.x + positionOffset.x, attractor.position.y + positionOffset.y);
    this.prevPosition.set(this.position.x, this.position.y);
    this.velocity.set(launchVelocity.x, launchVelocity.y);
  };

  PaintParticle.prototype.update = function update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(6);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    if (this.attract) this.life++;
    if (this.life > 100) this.alpha -= 0.01;
    if (this.life > 200) this.reset();
  };

  PaintParticle.prototype.attracted = function attracted() {
    var force = new V2(attractor.position.x, attractor.position.y).sub(this.position);
    var d = force.mag();
    d = constrain(d, 1, 30);
    var strength = G / d;
    force.setMag(strength);
    this.acceleration.add(force);
  };

  PaintParticle.prototype.reset = function reset() {
    this.alpha = 0;
    this.position = new V2(-100, -100);
    this.velocity = new V2();
    this.prevPosition = new V2(this.position.x, this.position.y);
    this.acceleration = new V2();
    this.attract = false;
    this.life = 0;
  };

  PaintParticle.prototype.draw = function draw() {
    ctx.beginPath();
    ctx.moveTo(this.prevPosition.x, this.prevPosition.y);
    ctx.lineTo(this.position.x, this.position.y);
    ctx.globalAlpha = this.alpha;
    ctx.stroke();
    this.prevPosition.x = this.position.x;
    this.prevPosition.y = this.position.y;
  };

  return PaintParticle;
}();

/** 
* AttractorEmitter - This class controls the position of the attractor and the
* direction in which new particles should be emitted
**/

var AttractorEmitter = function () {
  function AttractorEmitter(x, y) {
    _classCallCheck(this, AttractorEmitter);

    this.position = new V2(x, y);
    this.emitDirection = new V2(-1, 1);
    this.targetEmitDirection = new V2(this.emitDirection.x, this.emitDirection.y);
    this.emitNormal = new V2(-this.emitDirection.y, this.emitDirection.x);
    this.emitMagnitude = 5;
  }

  AttractorEmitter.prototype.update = function update() {
    this.emitDirection.lerp(this.targetEmitDirection);
    this.emitNormal.set(-this.emitDirection.y, this.emitDirection.x);
  };

  return AttractorEmitter;
}();

/** 
* Event Handlers - mouse up, mouse move, mouse down, resize
**/

function mouseup(e) {
  launchParticles = false;
}

function mousedown(e) {
  launchParticles = true;
}

function mousemove(e) {
  attractor.position.set(e.pageX * 2, e.pageY * 2);
  attractor.targetEmitDirection.set(lastMousePosition.x - e.pageX * 2, lastMousePosition.y - e.pageY * 2);
  lastMousePosition.x = e.pageX * 2;
  lastMousePosition.y = e.pageY * 2;
}

function touchmove(e) {
  attractor.position.set(e.touches[0].pageX * 2, e.touches[0].pageY * 2);
  attractor.targetEmitDirection.set(lastMousePosition.x - e.touches[0].pageX * 2, lastMousePosition.y - e.touches[0].pageY * 2);
  lastMousePosition.x = e.touches[0].pageX * 2;
  lastMousePosition.y = e.touches[0].pageY * 2;
}

function resize() {
  width = canvas.width = window.innerWidth * 2;
  height = canvas.height = window.innerHeight * 2;
  canvas.style.height = height / 2 + 'px';
  canvas.style.width = width / 2 + 'px';
}

function paint() {
  if (rainbow) ctx.strokeStyle = 'hsl(' + hue + ', 50%, 50%)';else ctx.strokeStyle = ctxColor;
  attractor.update();
  if (launchParticles) launchBatch();
  for (var i = 0; i < particles.length; i++) {
    var particle = particles[i];
    if (particle.attract) particle.attracted();
    particle.update();
    particle.draw();
  }
  hue++;
  if (hue == 256) hue = 0;
  requestAnimationFrame(paint);
}

function launchBatch() {
  for (var i = 0; i < V; i++) {
    var p = getParticleFromPool();
    if (p) p.launch();
  }
}

// returns an available particle from the pool
function getParticleFromPool() {
  for (var i = 0, l = particles.length; i < l; i++) {
    if (!particles[i].attract) return particles[i];
  }
  return false;
}

// constrains value n between min and max
function constrain(n, min, max) {
  if (n < min) n = min;
  if (n > max) n = max;
  return n;
}

// create the particle pool
function initParticles() {
  for (var i = 0; i < 2000; i++) {
    particles.push(new PaintParticle(width * 0.5, height * 0.5));
  }
}

function initCanvas() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  ctx.scale(2, 2);
}

function selectElements() {
  body = document.body;
  backgroundColorInput = document.getElementById('background-color');
  brushColorInput = document.getElementById('brush-color');
  rainbowBrushInput = document.getElementById('rainbow');
  gravityInput = document.getElementById('gravity');
  flowInput = document.getElementById('flow');
  clearButton = document.getElementById('clear-button');
}

function addListeners() {
  document.addEventListener('mousemove', mousemove);
  document.addEventListener('touchmove', touchmove);
  canvas.addEventListener('mousedown', mousedown);
  canvas.addEventListener('touchstart', mousedown);
  document.addEventListener('mouseup', mouseup);
  document.addEventListener('touchend', mouseup);
  window.addEventListener('resize', resize);
  backgroundColorInput.addEventListener('change', function () {
    body.style.backgroundColor = backgroundColorInput.value;
  });
  brushColorInput.addEventListener('change', function () {
    ctxColor = brushColorInput.value;
  });
  rainbowBrushInput.addEventListener('change', function () {
    rainbow = rainbowBrushInput.checked;
    brushColorInput.disabled = rainbow;
  });
  gravityInput.addEventListener('change', function () {
    G = gravityInput.value;
  });
  flowInput.addEventListener('change', function () {
    V = flowInput.value;
  });
  clearButton.addEventListener('click', function () {
    ctx.clearRect(0, 0, width, height);
  });
}

function init() {
  initCanvas();
  selectElements();
  resize();
  attractor = new AttractorEmitter(width / 2, height / 2);
  initParticles();
  paint();
  addListeners();
}

init();