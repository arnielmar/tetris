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

	//createGrid();

	g_grid.drawBoard(g_ctx);
	entityManager.render(ctx);

	if (g_renderSpatialDebug) spatialManager.render(ctx);
}


// =============
// PRELOAD STUFF
// =============
// TODO - Breytti þessu ekki eins og er, þurfum að skipta um myndir hér ef við
//        ætlum að nota sprites.
var g_images = {};

function requestPreloads() {

	var requiredImages = {
		ship: "https://notendur.hi.is/~pk/308G/images/ship.png",
		ship2: "https://notendur.hi.is/~pk/308G/images/ship_2.png",
		rock: "https://notendur.hi.is/~pk/308G/images/rock.png"
	};

	imagesPreload(requiredImages, g_images, preloadDone);

}

var g_sprites = {};

function preloadDone() {


	/*g_sprites.ship = new Sprite(g_images.ship);
	g_sprites.ship2 = new Sprite(g_images.ship2);
	g_sprites.rock = new Sprite(g_images.rock);

	g_sprites.bullet = new Sprite(g_images.ship);
	g_sprites.bullet.scale = 0.25;

	entityManager.init();
	createInitialObjectss();
	*/
	createInitialObjects();

	main.init();
}

// Kick it off
// debugger;
g_grid.setUpCanvas(g_ctx);
requestPreloads();
