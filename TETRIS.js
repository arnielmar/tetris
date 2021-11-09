// ======
// TETRIS
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

// ======================
// UGLY GLOBAL
// ======================
const g_grid = new Grid({
  gridWidth: Math.floor(g_canvas.width / 2),
  gridHeight: g_canvas.height,
  cx: Math.floor(g_canvas.width / 4),
  cy: Math.floor(g_canvas.height / 2)
})

// ======================
// CREATE INITIAL OBJECTS
// ======================

function createInitialObjects() {
	// TODO
	// Viljum við búa til 4 tetris kalla í byrjun?
	// Einn sem byrjar og næstu 3 sem koma

	//Testa að búa til einn í byrjun
	//entityManager.generateObject({})
	createTetro();
}

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
	// Nothing to do here!
	// The event handlers do everything we need for now.
}


// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {

	processDiagnostics();
	entityManager.update(du);
}

// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
var g_useAveVel = true;
var g_renderSpatialDebug = false;

var KEY_MIXED = keyCode('M');;
var KEY_AVE_VEL = keyCode('V');
var KEY_SPATIAL = keyCode('X');

function processDiagnostics() {

	if (eatKey(KEY_MIXED))
		g_allowMixedActions = !g_allowMixedActions;

	if (eatKey(KEY_AVE_VEL)) g_useAveVel = !g_useAveVel;

	if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;
}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {

	drawText(ctx);
	g_grid.drawBoard(g_ctx);
	entityManager.render(ctx);

	if (g_renderSpatialDebug) spatialManager.render(ctx);
}


// =============
// PRELOAD STUFF
// =============
var g_images = {};

function requestPreloads() {

	var requiredImages = {
		blue: "./images/blueTile.png",
		green: "./images/greenTile.png",
		orange: "./images/orangeTile.png",
		purple: "./images/purpleTile.png",
		red: "./images/redTile.png",
		turkish: "./images/turkishTile.png",
		yellow: "./images/yellowTile.png",
    empty: "./images/emptyTile.png"
	};

	imagesPreload(requiredImages, g_images, preloadDone);

}

var g_sprites = {};

function preloadDone() {

  g_sprites.blue = new Sprite(g_images.blue);
  g_sprites.green = new Sprite(g_images.green);
  g_sprites.orange = new Sprite(g_images.orange);
  g_sprites.purple = new Sprite(g_images.purple);
  g_sprites.red = new Sprite(g_images.red);
  g_sprites.turkish = new Sprite(g_images.turkish);
  g_sprites.yellow = new Sprite(g_images.yellow);
  g_sprites.empty = new Sprite(g_images.empty);

	createInitialObjects();

	main.init();
}

// Kick it off
// debugger;
requestPreloads();
g_grid.setUpCanvas(g_ctx);

