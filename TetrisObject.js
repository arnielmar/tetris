// ===================
// TETRIS OBJECT STUFF
// ===================

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function TetrisObject(descr) {

  // Common inherited setup logic from Entity
  this.setup(descr);

  this.rememberResets();

  // Default sprite, if not otherwise specified
  //this.sprite = this.sprite || g_sprites.TetrisObject;

  // Set normal drawing scale, and warp state off
  this._scale = 1;
};

TetrisObject.prototype = new Entity();

TetrisObject.prototype.rememberResets = function () {
  // Remember my reset positions
  this.reset_cx = this.cx;
  this.reset_cy = this.cy;
  this.reset_rotation = this.rotation;
};

TetrisObject.prototype.KEY_ROTATE = 'W'.charCodeAt(0);  // Snúa kalli
TetrisObject.prototype.KEY_DOWN = 'S'.charCodeAt(0);   // Niður með kall
TetrisObject.prototype.KEY_LEFT = 'A'.charCodeAt(0);  // Færa kall til vinstri
TetrisObject.prototype.KEY_RIGHT = 'D'.charCodeAt(0);  // Færa kall til hægri

TetrisObject.prototype.KEY_SWITCH = 'C'.charCodeAt(0);  // Geyma kall

// Initial, inheritable, default values
TetrisObject.prototype.rotation = 0;
TetrisObject.prototype.cx = g_canvas.width / 2;   // Byrjar í miðjunni
TetrisObject.prototype.cy = 0;                  // Efst uppi
TetrisObject.prototype.velX = 0;                // TODO
TetrisObject.prototype.velY = 0;                // TODO
TetrisObject.prototype.launchVel = 2;
TetrisObject.prototype.numSubSteps = 1;

TetrisObject.prototype.update = function (du) {

  // TODO - Á kannski heima annarsstaðar
  if (keys[this.KEY_LEFT]) {
    // TODO - Færa kall til vinstri
  }
  if (keys[this.KEY_RIGHT]) {
    // TODO - Færa kall til hægri
  }

  spatialManager.unregister(this);
  if (this._isDeadNow) {
    return entityManager.KILL_ME_NOW;
  }

  // Perform movement substeps
  var steps = this.numSubSteps;
  var dStep = du / steps;
  for (var i = 0; i < steps; ++i) {
    this.computeSubStep(dStep);
  }

  if (this.isColliding()) {
    // TODO - this.stop()????
  } else {
    spatialManager.register(this);
  }

};

TetrisObject.prototype.computeSubStep = function (du) {

  // TODO - Þurfum við þetta?
};

TetrisObject.prototype.applyAccel = function (accelX, accelY, du) {

  // u = original velocity
  var oldVelX = this.velX;
  var oldVelY = this.velY;

  // v = u + at
  this.velX += accelX * du;
  this.velY += accelY * du;

  // v_ave = (u + v) / 2
  var aveVelX = (oldVelX + this.velX) / 2;
  var aveVelY = (oldVelY + this.velY) / 2;

  // Decide whether to use the average or not (average is best!)
  var intervalVelX = g_useAveVel ? aveVelX : this.velX;
  var intervalVelY = g_useAveVel ? aveVelY : this.velY;

  // s = s + v_ave * t
  var nextX = this.cx + intervalVelX * du;
  var nextY = this.cy + intervalVelY * du;

  // s = s + v_ave * t
  this.cx += du * intervalVelX;
  this.cy += du * intervalVelY;
};

TetrisObject.prototype.getRadius = function () {
  return (this.sprite.width / 2) * 0.9;
};

TetrisObject.prototype.render = function (ctx) {
  var origScale = this.sprite.scale;
  // pass my scale into the sprite, for drawing
  this.sprite.scale = this._scale;
  this.sprite.drawWrappedCentredAt(
    ctx, this.cx, this.cy, this.rotation
  );
  this.sprite.scale = origScale;
};
