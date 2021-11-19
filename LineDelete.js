"use strict";

LineDelete.prototype = new Entity();

function LineDelete(descr) {
  for (var property in descr) {
    this[property] = descr[property];
  }
}

LineDelete.prototype.cellSprites = [];

LineDelete.prototype.cellWidth = 0;
LineDelete.prototype.cellHeight = 0;
LineDelete.prototype.cellPadding = 0;
LineDelete.prototype.numColumns = 0;

LineDelete.prototype.startX = 0;
LineDelete.prototype.startY = 0;

LineDelete.prototype.shrinkSpeed = 0.02;
LineDelete.prototype.currentScale = 1;

LineDelete.prototype.update = function (du) {
  if (this.currentScale < 0.1) {
    this.kill();
    g_grid.ongoingAnimation = false;
    createTetro(1, null, false);
    GET_NEXT_TETROMINO = true;
    g_grid.dropLines();
    return entityManager.KILL_ME_NOW;
  }

  for (var i = 0; i < this.cellSprites.length; i++) {
    this.cellSprites[i].scale = this.currentScale - (this.shrinkSpeed * du);
  }

  this.currentScale = this.currentScale - (this.shrinkSpeed * du);
}

LineDelete.prototype.render = function (ctx) {
  for (var i = 0; i < this.cellSprites.length; i++) {
    this.cellSprites[i].drawCenteredAt(
      ctx,
      this.startX + (this.cellWidth / 2) + (this.cellWidth * i) + (this.cellPadding * i),
      this.startY + (this.cellHeight / 2) + this.cellPadding);
  }
}
