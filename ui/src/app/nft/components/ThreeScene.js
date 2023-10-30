"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

const frontImg = "/coin/front.png";
const backImg = "/coin/back.png";
const whiteImg = "/coin/white.png";
const mainImg = "/coin/main.png";
const fontjson = "/coin/IPAexMincho_Regular.json";
const starFrontImg = "/star/starfront.png";

const ThreeScene = ({ props }) => {
  useEffect(() => {
    const scene = new THREE.Scene();
    const loader = new THREE.TextureLoader();
    scene.background = loader.load("/login/background-modified.png");
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 1.5;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("three-container").appendChild(renderer.domElement);

    const coinGroup = new THREE.Group();

    const edgeGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.02, 64);
    const edgeMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const edgeMesh = new THREE.Mesh(edgeGeometry, edgeMaterial);
    edgeMesh.rotation.z = Math.PI / 2;
    edgeMesh.rotation.y = Math.PI / 2;

    const baseloader = new THREE.TextureLoader();
    const basetexture = baseloader.load(whiteImg);
    basetexture.minFilter = THREE.LinearFilter;
    basetexture.magFilter = THREE.LinearFilter;
    const basegeometry = new THREE.PlaneGeometry();
    const basematerial = new THREE.MeshStandardMaterial({
      map: basetexture,
      transparent: true,
      alphaTest: 0.5,
    });
    const basemesh = new THREE.Mesh(basegeometry, basematerial);

    const colorsGroup = new THREE.Group();

    const color1geometry = new THREE.PlaneGeometry(0.45 / 6, 0.25);
    const color1material = new THREE.MeshStandardMaterial({ color: props.l1 });
    const color1mesh = new THREE.Mesh(color1geometry, color1material);
    color1mesh.position.y = -0.193;
    color1mesh.position.x = 0.188;
    colorsGroup.add(color1mesh);
    const color2geometry = new THREE.PlaneGeometry(0.45 / 6, 0.25);
    const color2material = new THREE.MeshStandardMaterial({ color: props.l2 });
    const color2mesh = new THREE.Mesh(color2geometry, color2material);
    color2mesh.position.y = -0.193;
    color2mesh.position.x = 0.112;
    colorsGroup.add(color2mesh);
    const color3geometry = new THREE.PlaneGeometry(0.45 / 6, 0.25);
    const color3material = new THREE.MeshStandardMaterial({ color: props.l3 });
    const color3mesh = new THREE.Mesh(color3geometry, color3material);
    color3mesh.position.y = -0.193;
    color3mesh.position.x = 0.038;
    colorsGroup.add(color3mesh);
    const color4geometry = new THREE.PlaneGeometry(0.45 / 6, 0.56);
    const color4material = new THREE.MeshStandardMaterial({ color: props.r1 });
    const color4mesh = new THREE.Mesh(color4geometry, color4material);
    color4mesh.position.y = -0.035;
    color4mesh.position.x = -0.038;
    colorsGroup.add(color4mesh);
    const color5geometry = new THREE.PlaneGeometry(0.45 / 6, 0.48);
    const color5material = new THREE.MeshStandardMaterial({ color: props.r2 });
    const color5mesh = new THREE.Mesh(color5geometry, color5material);
    color5mesh.position.y = -0.076;
    color5mesh.position.x = -0.113;
    colorsGroup.add(color5mesh);
    const color6geometry = new THREE.PlaneGeometry(0.45 / 6, 0.35);
    const color6material = new THREE.MeshStandardMaterial({ color: props.r3 });
    const color6mesh = new THREE.Mesh(color6geometry, color6material);
    color6mesh.position.y = -0.093;
    color6mesh.position.x = -0.188;
    colorsGroup.add(color6mesh);

    const frontloader = new THREE.TextureLoader();
    const fronttexture = frontloader.load(frontImg);
    fronttexture.minFilter = THREE.LinearFilter;
    fronttexture.magFilter = THREE.LinearFilter;
    const frontgeometry = new THREE.PlaneGeometry();
    const frontmaterial = new THREE.MeshStandardMaterial({
      map: fronttexture,
      transparent: true,
      alphaTest: 0.5,
    });
    const frontmesh = new THREE.Mesh(frontgeometry, frontmaterial);

    const designloader = new THREE.TextureLoader();
    const designtexture = designloader.load(mainImg);
    designtexture.minFilter = THREE.LinearFilter;
    designtexture.magFilter = THREE.LinearFilter;
    const designgeometry = new THREE.PlaneGeometry();
    const designmaterial = new THREE.MeshStandardMaterial({
      map: designtexture,
      transparent: true,
      alphaTest: 0.5,
    });
    const designmesh = new THREE.Mesh(designgeometry, designmaterial);

    const backloader = new THREE.TextureLoader();
    const backtexture = backloader.load(backImg);
    backtexture.minFilter = THREE.LinearFilter;
    backtexture.magFilter = THREE.LinearFilter;
    const backgeometry = new THREE.PlaneGeometry();
    const backmaterial = new THREE.MeshStandardMaterial({
      map: backtexture,
      transparent: true,
      alphaTest: 0.5,
    });
    const backmesh = new THREE.Mesh(backgeometry, backmaterial);
    backmesh.rotation.y = Math.PI;

    const numLoader = new FontLoader();
    numLoader.load(fontjson, function (font) {
      const numGeometry = new TextGeometry(props.num, {
        font: font,
        size: 0.04,
        height: 0.001,
      });
      const numMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const numMesh = new THREE.Mesh(numGeometry, numMaterial);
      numMesh.position.set(0.25, 0.22, -0.012);
      numMesh.rotation.y = Math.PI;
      coinGroup.add(numMesh);
    });

    const dateLoader = new FontLoader();
    dateLoader.load(fontjson, function (font) {
      const dateGeometry = new TextGeometry(props.date, {
        font: font,
        size: 0.03,
        height: 0.001,
      });
      const dateMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const dateMesh = new THREE.Mesh(dateGeometry, dateMaterial);
      dateMesh.position.set(0.12, -0.18, -0.012);
      dateMesh.rotation.y = Math.PI;
      coinGroup.add(dateMesh);
    });

    const starGroup = new THREE.Group();
    const starFrontloader = new THREE.TextureLoader();
    const starFronttexture = starFrontloader.load(starFrontImg);
    starFronttexture.minFilter = THREE.LinearFilter;
    starFronttexture.magFilter = THREE.LinearFilter;
    const starFrontgeometry = new THREE.PlaneGeometry();
    const starFrontmaterial = new THREE.MeshStandardMaterial({
      map: starFronttexture,
      transparent: true,
      alphaTest: 0.5,
    });
    const starFrontmesh = new THREE.Mesh(starFrontgeometry, starFrontmaterial);
    starFrontmesh.rotation.y = Math.PI;
    starFrontmesh.scale.set(0.3, 0.3, 0);

    starGroup.add(starFrontmesh);

    backmesh.position.z = -0.011;
    frontmesh.position.z = 0.012;
    basemesh.position.z = 0.011;
    designmesh.position.z = 0.012;
    colorsGroup.position.z = 0.0115;
    starGroup.position.z = -0.012;

    coinGroup.add(starGroup);
    coinGroup.add(edgeMesh);
    coinGroup.add(basemesh);
    coinGroup.add(frontmesh);
    coinGroup.add(designmesh);
    coinGroup.add(backmesh);
    coinGroup.add(colorsGroup);
    coinGroup.position.y = -0.2;
    scene.add(coinGroup);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 2, 1);
    pointLight.position.set(0, 0, 1);
    scene.add(pointLight);

    const animate = () => {
      requestAnimationFrame(animate);

      coinGroup.rotation.y += 0.02;

      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return <div id="three-container" />;
};

export default ThreeScene;
