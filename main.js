import * as THREE from 'three'
import '/three-utils.js'
import { DeviceOrientationControls } from '/libs/DeviceOrientationControls.js'
import '/main.scss'

let camera, scene, renderer, controls;

const dom = {};
dom.overlay = document.querySelector('#overlay');
dom.container = document.querySelector('#app');
dom.splashscreen = document.querySelector('#splashscreen');

dom.splashscreen.querySelector('#enterBtn').onclick = () => {
    controls.connect()
    dom.splashscreen.classList.add("hide")
}

dom.container.querySelector('.overlay__closeBtn').onclick = () => {
    dom.overlay.classList.remove("show")
}

scene = new THREE.Scene();
addCube("#popup-1", 0, 0, -100, 10)
addCube("#popup-2", 20, 0, -100, 10)
addCube("#popup-3", 50, 0, 100, 10)

const raycaster = new THREE.Raycaster();

var animate = function () {

    window.requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);

};

camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);

controls = new DeviceOrientationControls(camera);

const geometry = new THREE.SphereGeometry(500, 16, 8);
geometry.scale(- 1, 1, 1);

const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = 0;
dom.container.appendChild(renderer.domElement);

window.addEventListener('resize', () => {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}, false);

renderer.domElement.addEventListener('click', (event) => {


    const { width, height, top, left } = renderer.domElement.getBoundingClientRect()
    const pointer = new THREE.Vector2(); // center of the screen
    pointer.x = ((event.clientX - left) / width) * 2 - 1;
    pointer.y = - ((event.clientY - top) / height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects(scene.children, false);
    const popupElem = getPopupsFromHit(intersects)[0]

    if (popupElem) {
        dom.overlay.querySelectorAll(".popup").forEach(popup => popup.classList.remove("show"))
        popupElem.classList.toggle("show")
        dom.overlay.classList.toggle("show")
    }

}, false);

animate();

function addCube(selector, x, y, z, size) {
    var geometry = new THREE.BoxGeometry(size, size, size, 1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ wireframe: true });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.userData.hitElement = document.querySelector(selector);
    scene.add(mesh);
}

function getPopupsFromHit(intersects) {
    return intersects.map(intersect => intersect.object.userData.hitElement).filter(Boolean)
}