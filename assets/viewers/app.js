import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

// Archivo FBX principal.
const MODEL_URL = '/cnc/assets/viewers/cnc.fbx';

// Carpeta donde están el FBX y sus texturas exportadas por SolidWorks/Visualize.
// Si dejas todo junto, puede quedarse como './'
const ASSET_BASE_PATH = './';

// Ajustes de encuadre inicial.
const INITIAL_ZOOM = 1;      // menor = más cerca, mayor = más lejos
const INITIAL_Z_OFFSET = 1;  // desplaza la vista en Z

const viewerEl = document.getElementById('viewer');
const statusEl = document.getElementById('status');
const overlayEl = document.getElementById('overlay');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf7e8e4);

const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 5000);
camera.position.set(2.8, 1.8, 4.2);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
viewerEl.appendChild(renderer.domElement);
renderer.domElement.addEventListener('contextmenu', (event) => event.preventDefault());

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = true;
controls.screenSpacePanning = true;
controls.dampingFactor = 0.08;
controls.target.set(0, 0.7, 0);
controls.mouseButtons = {
  LEFT: THREE.MOUSE.ROTATE,
  MIDDLE: THREE.MOUSE.DOLLY,
  RIGHT: THREE.MOUSE.PAN,
};
controls.update();

scene.add(new THREE.AmbientLight(0xffffff, 1.9));

const hemi = new THREE.HemisphereLight(0xffffff, 0x20232a, 1.1);
hemi.position.set(0, 20, 0);
scene.add(hemi);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
dirLight.position.set(6, 10, 8);
scene.add(dirLight);

let modelRoot = null;
let mixer = null;
const clock = new THREE.Clock();

window.addEventListener('resize', resizeRenderer);
resizeRenderer();
animate();
loadFBX(MODEL_URL);

function loadFBX(url) {
  setStatus('Cargando FBX y texturas...');

  const manager = new THREE.LoadingManager();
  manager.setURLModifier((rawUrl) => remapAssetUrl(rawUrl));

  const loader = new FBXLoader(manager);
  loader.setResourcePath(ASSET_BASE_PATH);

  loader.load(
    url,
    (object) => {
      disposeModel();

      modelRoot = object;
      scene.add(modelRoot);

      centerAndFrame(modelRoot);
      normalizeMaterials(modelRoot);

      if (object.animations?.length) {
        mixer = new THREE.AnimationMixer(object);
        mixer.clipAction(object.animations[0]).play();
      } else {
        mixer = null;
      }

      overlayEl.classList.add('hidden');
      setStatus(`Zoom-Rotate-Pan`);
    },
    undefined,
    (error) => {
      console.error(error);
      setStatus('No se pudo cargar el FBX');
      overlayEl.textContent = 'No se pudo cargar el modelo';
    }
  );
}

function remapAssetUrl(rawUrl) {
  if (!rawUrl) return rawUrl;

  const safeUrl = String(rawUrl).trim();
  if (/^(blob:|data:|https?:)/i.test(safeUrl)) return safeUrl;

  const noQuery = safeUrl.split('?')[0].split('#')[0];
  const normalized = noQuery.replace(/\\/g, '/');
  const fileName = decodeURIComponent(normalized.split('/').pop() || normalized);

  return `${fileName}`;
}

function getFileName(url) {
  return String(url).replace(/\\/g, '/').split('/').pop() || 'FBX';
}

function disposeModel() {
  if (!modelRoot) return;

  scene.remove(modelRoot);
  modelRoot.traverse((child) => {
    if (!child.isMesh) return;
    child.geometry?.dispose?.();

    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.filter(Boolean).forEach((material) => {
      for (const key of Object.keys(material)) {
        const value = material[key];
        if (value && typeof value === 'object' && value.isTexture) value.dispose?.();
      }
      material.dispose?.();
    });
  });

  modelRoot = null;
  mixer = null;
}

function centerAndFrame(object) {
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());

  object.position.x -= center.x;
  object.position.y -= box.min.y;
  object.position.z -= center.z;

  const framedBox = new THREE.Box3().setFromObject(object);
  const framedSize = framedBox.getSize(new THREE.Vector3());
  const framedCenter = framedBox.getCenter(new THREE.Vector3());
  const maxDim = Math.max(framedSize.x, framedSize.y, framedSize.z) || 1;

  const fov = THREE.MathUtils.degToRad(camera.fov);
  let distance = (maxDim / 2) / Math.tan(fov / 2);
  distance *= INITIAL_ZOOM;

  camera.position.set(
    framedCenter.x + distance * 0.45,
    framedCenter.y + distance * 0.28,
    framedCenter.z + distance * 0.9 + INITIAL_Z_OFFSET
  );
  camera.near = Math.max(maxDim / 1000, 0.01);
  camera.far = Math.max(maxDim * 40, 1000);
  camera.updateProjectionMatrix();

  controls.target.set(framedCenter.x, framedCenter.y, framedCenter.z);
  controls.update();
}

function normalizeMaterials(object) {
  object.traverse((child) => {
    if (!child.isMesh) return;

    child.castShadow = false;
    child.receiveShadow = false;

    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.filter(Boolean).forEach((material) => {
      if ('side' in material) material.side = THREE.DoubleSide;

      if (material.map) {
        material.map.colorSpace = THREE.SRGBColorSpace;
        material.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
      }

      if (material.emissiveMap) {
        material.emissiveMap.colorSpace = THREE.SRGBColorSpace;
      }

      ['normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'alphaMap', 'bumpMap'].forEach((key) => {
        if (material[key]) {
          material[key].anisotropy = renderer.capabilities.getMaxAnisotropy();
        }
      });

      material.needsUpdate = true;
    });
  });
}

function setStatus(message) {
  statusEl.textContent = message;
}

function resizeRenderer() {
  const width = viewerEl.clientWidth;
  const height = viewerEl.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  controls.update();
  renderer.render(scene, camera);
}
