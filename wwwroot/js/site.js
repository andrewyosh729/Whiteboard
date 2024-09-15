import * as THREE from 'three';
import {MeshLineGeometry, MeshLineMaterial} from 'meshline';

let localId = parseInt(document.getElementById("id").value);
let mouseDown = false;
let currentLocalDrawingData = null;
let MAX_POINTS = 500;

const controlHubConnection = new signalR.HubConnectionBuilder().withUrl("controlHub").build();

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000)
camera.position.z = 1;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let localDot = CreateDot(0xff0000);
scene.add(localDot);

const userDots = new Map();
const userDrawings = new Map();

renderer.setAnimationLoop(animate);

window.addEventListener('resize', onWindowResize);
document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);

document.addEventListener('mousedown', onMouseDown, false);
document.addEventListener('mouseup', onMouseUp, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


async function onMouseUpdate(e) {
    let mouseX = -1 + 2 * e.offsetX / window.innerWidth;
    let mouseY = 1 - 2 * e.offsetY / window.innerHeight;

    localDot.position.x = mouseX;
    localDot.position.y = mouseY;


    if (mouseDown) {
        if (currentLocalDrawingData == null) {
            currentLocalDrawingData = CreateDrawingData();
            scene.add(currentLocalDrawingData.line);

        }
        UpdateDrawing(currentLocalDrawingData, mouseX, mouseY);
    }


    await controlHubConnection.invoke("SendMousePosition", localId, {x: mouseX, y: mouseY})
}

async function onMouseDown() {
    mouseDown = true;
    await controlHubConnection.invoke("SendDrawingStart", localId)
}

async function onMouseUp() {
    mouseDown = false;
    currentLocalDrawingData = null;
    await controlHubConnection.invoke("SendDrawingEnd", localId)
}

controlHubConnection.on("ReceiveDrawingStart", function (id) {
    if (id == localId) {
        return;
    }
    let userDrawing = CreateDrawingData();
    scene.add(userDrawing.line);
    userDrawings.set(id, userDrawing);

})

controlHubConnection.on("ReceiveDrawingEnd", function (id) {
    userDrawings.set(id, null);
})
controlHubConnection.on("ReceiveMousePosition", function (id, mousePosition) {
    // TODO: See if there is a better way to do this with signalR.
    if (id == localId) {
        return;
    }

    if (!userDots.has(id)) {
        let dot = CreateDot(THREE.MathUtils.randInt(0, 0xffffff))
        scene.add(dot);
        userDots.set(id, dot);
    }

    let userDot = userDots.get(id)
    userDot.position.x = mousePosition.x;
    userDot.position.y = mousePosition.y;

    let userDrawing = userDrawings.get(id);
    if (userDrawing != null) {
        UpdateDrawing(userDrawing, mousePosition.x, mousePosition.y);
    }


});

controlHubConnection.start();


function animate() {
    renderer.render(scene, camera);
}

function CreateDot(color) {
    const dotGeometry = new THREE.BufferGeometry();
    dotGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3));
    const dotMaterial = new THREE.PointsMaterial({
        size: 5,
        color: color
    });
    return new THREE.Points(dotGeometry, dotMaterial)
}

function CreateLine() {
    let points = []
    const geometry = new MeshLineGeometry();
    const material = new MeshLineMaterial({lineWidth: .005});
    material.linewidth = 1;
    let line = new THREE.Mesh(geometry, material);
    return {drawingPoints: points, line: line, geometry: geometry};
}

function CreateDrawingData() {

    let lineData = CreateLine();
    return {
        points: lineData.drawingPoints,
        line: lineData.line,
        geometry: lineData.geometry,
        count: 0
    }
}

function UpdateDrawing(drawingData, mouseX, mouseY) {
    drawingData.points.push(mouseX, mouseY,0)
    drawingData.geometry.setPoints(drawingData.points);
    // drawingData.line.geometry.setDrawRange(0, drawingData.count);
    // drawingData.line.geometry.attributes.position.needsUpdate = true;
}
