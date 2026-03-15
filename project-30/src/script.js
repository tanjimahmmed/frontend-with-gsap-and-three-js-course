import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import SplitType from 'split-type';
import Lenis from '@studio-freight/lenis'

gsap.registerPlugin(ScrollTrigger);
const loader = new GLTFLoader();

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
// const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );
let crate = null;

loader.load('table.glb', function(gltf) {
    crate = gltf.scene
    crate.position.y = -0.95
    crate.position.z = 2.44
    scene.add(crate)

    const tl = gsap.timeline({
        defaults: {
            ease: 'power3.out',
            onComplete: startScrollAnimation
        }
    })

    const h1Text = new SplitType('h1')
    gsap.set('p.subhead', {yPercent: 100})
    gsap.set('.innerLi', {yPercent: 100})

    tl.to(crate.position, {duration: 2, z: -0.14})
    tl.from(h1Text.chars, {duration: 1, yPercent: 100, stagger: 0.1}, "-=1.7")
    tl.to('p.subhead', {yPercent: 0}, "-=1")

    const detailsT1 = gsap.timeline({
        scrollTrigger: {
            trigger: 'section.details',
            start: 'top bottom',
            end: 'bottom center',
            scrub: true
        }, defaults: {
            ease: 'power2.out',
            duration: 2
        }
    })

    function startScrollAnimation(){
        detailsT1.to(crate.position, {
            x: 0,
            y: 0.06,
            z: 1.25
        })
        detailsT1.to(crate.rotation, {
            x: 1.11,
            y: 0.19,
            z: 0.06
        }, "<")

        gsap.to('.innerLi', {
            scrollTrigger: {
                trigger: '.innerLi',
                start: 'top bottom',
                end: 'bottom center',
                toggleActions: 'play none none reverse'
            },
            yPercent: 0,
            stagger: 0.1
        })
    }


    // Controlling the coffee table
    const crateFolder = gui.addFolder('Crate')
    crateFolder.add(gltf.scene.position, 'x').min(- 3).max(3).step(0.01).name('position x')
    crateFolder.add(gltf.scene.position, 'y').min(- 3).max(3).step(0.01).name('position y')
    crateFolder.add(gltf.scene.position, 'z').min(- 3).max(3).step(0.01).name('position z')

    crateFolder.add(gltf.scene.rotation, 'x').min(- 3).max(3).step(0.01).name('position x')
    crateFolder.add(gltf.scene.rotation, 'y').min(- 3).max(3).step(0.01).name('position y')
    crateFolder.add(gltf.scene.rotation, 'z').min(- 3).max(3).step(0.01).name('position z')
})

// Materials

// const material = new THREE.MeshBasicMaterial()
// material.color = new THREE.Color(0xff0000)

// Mesh
// const sphere = new THREE.Mesh(geometry,material)
// scene.add(sphere)

// Lights

// const ambientLight = new THREE.AmbientLight(0xffcc00, 3)
// scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 3)
pointLight.position.x = 3
pointLight.position.y = -0.87
pointLight.position.z = -1
scene.add(pointLight)

const pointLightFolder = gui.addFolder('Point Light 1')
pointLightFolder.add(pointLight.position, 'x').min(- 3).max(3).step(0.01).name('position x')
pointLightFolder.add(pointLight.position, 'y').min(- 3).max(3).step(0.01).name('position y')
pointLightFolder.add(pointLight.position, 'z').min(- 3).max(3).step(0.01).name('position z')

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // sphere.rotation.y = .5 * elapsedTime
    if(crate){
        crate.rotation.y = .5 * elapsedTime
    }
    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

// smooth scroll

const lenis = new Lenis()

function raf(time) {
lenis.raf(time)
requestAnimationFrame(raf)
}

requestAnimationFrame(raf)