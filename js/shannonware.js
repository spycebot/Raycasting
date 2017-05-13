/*
	JavaScript for Raycasting Exercise
	09 May 2017
*/

var renderer, scene, camera; /* stats;
var particles, uniforms;
var PARTICLE_SIZE = 20; */
var raycaster, intersects;
var mouse, INTERSECTED;
//var showTetrahedronLabel = false;
//var fire = 3 ;
var testahedron;
var raycastTargets = new Array();//tetrahedron;
var addIndex, removeIndex;


function init() {
	container = document.getElementById( 'container' );
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = 0;	// Originally 50
	ambientLight = new THREE.AmbientLight( 0x404040 );

	light = new THREE.DirectionalLight( 0xffffff, 0.7 );
	light.position.set( -800, 900, 300 );
	scene.add( ambientLight );
	scene.add( light );
	var testGeometry = new THREE.TetrahedronGeometry(10);
	var material = new THREE.MeshLambertMaterial( { color: 0xffffff , wireframe: false }); //0x00ff00 } );
	//var ka = 0.2;
	//material.ambient.setRGB(material.color.r * ka, material.color.g * ka, material.color.b * ka );
	material.ambient = new THREE.Color(0.5, 0.5, 0.5);
	/*
	tetrahedron = new THREE.Mesh( testGeometry, material );
	tetrahedron.name = "Pauling" + Date();
	scene.add( tetrahedron );
	*/
	addIndex = 0;
	testahedron = addPlatonicSolid();
	console.log("init() testahedron.name: " + testahedron.name);
	//console.log("Testahedron position: " + printV3(testahedron.position) );

	/*
		Renderer at the end if function init.
	*/
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.body.addEventListener('touchstart', function(e){
		//alert(e.changedTouches[0].pageX) // alert pageX coordinate of touch point
		// REVISIT $("#container").add("<div id=\"geometryName\">Tetrahedron</div>");
	}, false);
	window.addEventListener( 'resize', onWindowResize, false );
}

function animate() {
	testahedron.rotation.x += 0.01;
}

function render() {
	requestAnimationFrame( render );
	animate();
	raycaster.setFromCamera( mouse, camera );
	// TypeError: object.raycast is not a function
	/*
		To replace what is below
	*/
	for (var i = 0 ; i < raycastTargets.length; i++) {
		var testSubject = raycastTargets[i];
		intersects = raycaster.intersectObject( testSubject );
		switch (intersects.length) {
			case 0:
				//if ($("#guiSelection").text() != "Waiting...") {
				//	$("#guiSelection").text("Waiting...");
				//}

			break;
			case 1:
				console.log("In render, intersects.length is 1, and testSubject is: " + testSubject.name);
				//console.log("intersects[0]: " + typeof 4);
				if ($("#guiSelection").text() != testSubject.name ) { 	//"[[target.name]]"
					$("#guiSelection").text(testSubject.name);								// "[[target.name]]"
					testahedron = testSubject; // User indicates the selected solid.
				}

			break;
			default:
				if ($("#guiSelection").text() != "Raycast error.") {
					$("#guiSelection").text("Raycast error.");
				}

			break;
		}

	}

	updateGUI();

	renderer.setViewport( 0, 0, window.innerWidth, window.innerHeight );
	renderer.render( scene, camera );
	
}

function printV3(target) {
	var returnString = "(" + target.x.toFixed(2) + ", " + target.y.toFixed(2) + ", " + target.z.toFixed(2) + ")";
	return returnString;
}

function radiansToDegrees(target) {
	var returnVector = new THREE.Vector3;
	var conversionFactor = 57.2958;
	returnVector.x = (target.x * conversionFactor) % 360 ;
	returnVector.y = (target.y * conversionFactor) % 360 ;
	returnVector.z = (target.z * conversionFactor) % 360 ;
	return returnVector;
}

function onDocumentMouseMove( event ) {
	event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onWindowResize(event) {
	//SCREEN_WIDTH = window.innerWidth;
	//SCREEN_HEIGHT = window.innerHeight;
	aspect = 1;
	recalculateGUI();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	updateCameras();
	console.log("onWindowResize complete.") ;
}

function updateGUI() {
	if ($("#showMoreButton").attr("value") == "Less <") {
		// OK console.log("updateGUI allowed. Rotation: " + printV3(tetrahedron.rotation));
		// console.log("Rotation label text: " + $("div.rotationLabel").text() + " in jQuery when Less <");
		$("#positionLabel").text("Position: " + printV3(testahedron.position));
		$("#rotationLabel").text("Rotation: " + printV3(radiansToDegrees(testahedron.rotation)));
		/* I can neither write nor set to the dif that I know is in the live document. */
	}
}

function addPlatonicSolid() {
	var material = new THREE.MeshLambertMaterial( { color: 0xffffff , wireframe: false });
	var geo, mesh;
	var geoPosition = new THREE.Vector3(0, 0, 0);
	material.ambient = new THREE.Color(0.5, 0.5, 0.5);
	console.log("addPlatonicSolid new addIndex: " + addIndex );
	camera.position.z += 50;
	// tetrahedron, cube, octahedron, dodecahedron,  icosahedron
	switch (addIndex) {
		case 0:
			geo = new THREE.TetrahedronGeometry(10);
			geo.name = "Tetrahedron" ;
		break;
		case 1:
			geo = new THREE.BoxGeometry(10, 10, 10);
			//geoPosition = (20, 20, 0);
			geoPosition.x = 10 ;
			geoPosition.y = 10 ;
			geo.name = "Cube" ;
		break;
		case 2:
			geo = new THREE.OctahedronGeometry(10);
			//geoPosition = (20, 20, 0);
			geoPosition.x = 20 ;
			geoPosition.y = 20 ;
			geo.name = "Octahedron" ;
		break;
		case 3:
			geo = new THREE.DodecahedronGeometry(10);
			//geoPosition = (20, 20, 0);
			geoPosition.x = 30 ;
			geoPosition.y = 30 ;
			geo.name = "Dodecahedron" ;
		break;
		case 4:
			geo = new THREE.IcosahedronGeometry(10);
			//geoPosition = (20, 20, 0);
			geoPosition.x = 40 ;
			geoPosition.y = 40 ;
			geo.name = "Icosahedron" ;
		break;
		default:

		break;
	}
	mesh = new THREE.Mesh( geo, material );
	//mesh.name = "My Test";
	//try { mesh.position = geoPosition; } catch (e) { console.log ("Position assign catch: " + e) ; }
	mesh.position.x = geoPosition.x ; // not my preferred solution
	mesh.position.y = geoPosition.y ;
	mesh.name = geo.name;
	scene.add(mesh);
	console.log("addPlatonicSolid() geoPosition: " + printV3(geoPosition) + ". geo.name: " + geo.name + ", geo.type: " + geo.type );
	console.log("addPlatonicSolid() mesh.position: " + printV3(mesh.position) + ", mesh.name: " + mesh.name + ", mesh.type: " + mesh.type );
	addIndex = (addIndex + 1) % 5;
	raycastTargets.push(mesh);
	return mesh;
}

function recalculateGUI() {
	$("body").css({"font-size" : (window.innerWidth + window.innerHeight)/40});
	$("input").css({"font-size" : (window.innerWidth + window.innerHeight)/20, "height" : "40px"}); //??!!

}

try {
	init();
	animate();
	render();
	console.log("End of try block reached.");
} catch(e) {
	$("#guiRoot").text("Error: " + e).css({"color" : "gray"});
	console.log("Error: " + e);
}

$(function() {
	recalculateGUI();
	$("#guiRoot").text(" ")
		.append("<div id=\"guiSelection\">Waiting...</div>")
		.append("<input type=\"button\" value=\"More >\" id=\"showMoreButton\" />")
		.append("<div id=\"moreGroup\">\n<div id=\"positionLabel\">Position:</div>\n<div id=\"rotationLabel\">Rotation:</div><input type=\"button\" value=\"Add\" id=\"addPlatonicSolidButton\" />\n<input type=\"button\" value=\"Remove\" id=\"removePlatonicSolidButton\" />")
		/*.append("")
		.append("")*/
		.append("\n</div>"); // <-- must always be the last thing in moreGroup"); 
	$("#moreGroup").hide();
	$("#showMoreButton").click(function() {
			//console.log("showMoreButton clicked! Value: " + $("#showMoreButton").attr("value"));
			// console.log("div.rotationLabel text: " + $("#rotationLabel").text() + " at click of showMoreButton.");
			if ($("#showMoreButton").attr("value") == "More >") { $("#showMoreButton").attr("value", "Less <") }
				else $("#showMoreButton").attr("value", "More >");
			$("#moreGroup").slideToggle('fast'); 
		});
	$("#addPlatonicSolidButton").click(function() {
		console.log("addPlatonicSolidButton clicked!");
		testahedron = addPlatonicSolid();
	})
	console.log("div.rotationLabel text: " + $("#rotationLabel").text() + " at end of jQuery.");
	console.log("End of jQuery reached.");
});