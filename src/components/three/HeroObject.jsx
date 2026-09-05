import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function HeroObject() {
  const mountRef = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const W = mount.clientWidth;
    const H = mount.clientHeight;

    // ── Renderer ──────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    mount.appendChild(renderer.domElement);

    // ── Scene & Camera ────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // ── Lights ────────────────────────────────────────
    // Key: bright electric blue from front-right
    const keyLight = new THREE.PointLight(0x35c4ea, 90, 35);
    keyLight.position.set(5, 4, 6);
    // Rim: deep blue from behind-left
    const rimLight = new THREE.PointLight(0x3d9fd1, 70, 32);
    rimLight.position.set(-6, -1, -4);
    // Top fill: steel blue
    const fillLight = new THREE.PointLight(0x65d9f5, 35, 25);
    fillLight.position.set(0, 6, 2);
    // Subtle front bounce
    const bounceLight = new THREE.PointLight(0x65d9f5, 18, 15);
    bounceLight.position.set(0, -3, 5);
    // Ambient
    const ambient = new THREE.AmbientLight(0x070b10, 1.4);
    scene.add(keyLight, rimLight, fillLight, bounceLight, ambient);

    // ── Master rig ────────────────────────────────────
    const rig = new THREE.Group();
    scene.add(rig);

    // ── MATERIALS ─────────────────────────────────────
    const matBody = new THREE.MeshStandardMaterial({ color: 0x1a3a50, metalness: 0.82, roughness: 0.22, emissive: 0x0a2030, emissiveIntensity: 0.18 });
    const matBlue = new THREE.MeshStandardMaterial({ color: 0x3d9fd1, metalness: 0.9, roughness: 0.15, emissive: 0x0d3348, emissiveIntensity: 0.2 });
    const matElectric = new THREE.MeshStandardMaterial({ color: 0x35c4ea, metalness: 0.85, roughness: 0.12, emissive: 0x0a3a48, emissiveIntensity: 0.3 });
    const matDark = new THREE.MeshStandardMaterial({ color: 0x0a1520, metalness: 0.65, roughness: 0.38 });
    const matSlate = new THREE.MeshStandardMaterial({ color: 0x5d8fa8, metalness: 0.85, roughness: 0.18, emissive: 0x112838, emissiveIntensity: 0.22 });
    const matGlass = new THREE.MeshStandardMaterial({ color: 0x1e5a78, metalness: 0.0, roughness: 0.04, transparent: true, opacity: 0.88, emissive: 0x0d3a52, emissiveIntensity: 0.45 });
    const matGlow = new THREE.MeshStandardMaterial({ color: 0x65d9f5, metalness: 0.4, roughness: 0.08, emissive: 0x35c4ea, emissiveIntensity: 1.2 });

    // ── CAMERA BODY ───────────────────────────────────
    const bodyGroup = new THREE.Group();
    rig.add(bodyGroup);

    // Main rectangular body
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.8, 1.4), matBody);
    bodyGroup.add(body);

    // Top ridge
    const ridge = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.28, 1.0), matSlate);
    ridge.position.set(0, 1.04, 0);
    bodyGroup.add(ridge);

    // Viewfinder bump top-right
    const viewfinder = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.38, 0.55), matBody);
    viewfinder.position.set(0.72, 1.25, 0);
    bodyGroup.add(viewfinder);

    // Grip on right side
    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.9, 1.3), new THREE.MeshStandardMaterial({ color: 0x1c3448, metalness: 0.72, roughness: 0.32 }));
    grip.position.set(1.66, -0.05, 0);
    bodyGroup.add(grip);

    // Front plate
    const frontPlate = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.8, 0.08), matSlate);
    frontPlate.position.set(0, 0, 0.74);
    bodyGroup.add(frontPlate);

    // Edge trim lines (horizontal)
    [-0.75, 0.75].forEach(y => {
      const trim = new THREE.Mesh(new THREE.BoxGeometry(2.82, 0.04, 1.44), matElectric);
      trim.position.set(0, y, 0);
      bodyGroup.add(trim);
    });

    // ── LENS SYSTEM ───────────────────────────────────
    const lensGroup = new THREE.Group();
    lensGroup.position.set(-0.45, 0.05, 0.74);
    bodyGroup.add(lensGroup);

    // Outer lens barrel
    const barrel1 = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.55, 48), matSlate);
    barrel1.rotation.x = Math.PI / 2;
    lensGroup.add(barrel1);

    // Mid barrel
    const barrel2 = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.35, 48), matBody);
    barrel2.rotation.x = Math.PI / 2;
    barrel2.position.z = 0.38;
    lensGroup.add(barrel2);

    // Focus ring with grooves
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const groove = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.55), matElectric);
      groove.position.set(Math.cos(angle) * 0.74, Math.sin(angle) * 0.74, 0);
      groove.rotation.z = angle;
      lensGroup.add(groove);
    }

    // Inner lens element (glass)
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.12, 48), matGlass);
    lens.rotation.x = Math.PI / 2;
    lens.position.z = 0.56;
    lensGroup.add(lens);

    // Lens inner glow ring
    const lensGlow = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.04, 12, 48), matGlow);
    lensGlow.position.z = 0.58;
    lensGroup.add(lensGlow);

    // Lens center reflector
    const lensCore = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.08, 32), matGlow);
    lensCore.rotation.x = Math.PI / 2;
    lensCore.position.z = 0.6;
    lensGroup.add(lensCore);

    // ── BUTTONS & DIALS ───────────────────────────────
    // Mode dial on top
    const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.18, 32), matBlue);
    dial.position.set(-0.5, 1.05, 0.18);
    bodyGroup.add(dial);

    // Shutter button
    const shutterBase = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.1, 24), matSlate);
    shutterBase.position.set(0.85, 1.05, 0.18);
    bodyGroup.add(shutterBase);
    const shutterBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.08, 24), matElectric);
    shutterBtn.position.set(0.85, 1.15, 0.18);
    bodyGroup.add(shutterBtn);

    // Small indicator lights
    [[-0.9, 0.78, 0.79], [-0.65, 0.78, 0.79]].forEach(([x, y, z], i) => {
      const light = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 12), i === 0 ? matGlow : matElectric);
      light.position.set(x, y, z);
      bodyGroup.add(light);
    });

    // ── FILM STRIP ────────────────────────────────────
    const filmGroup = new THREE.Group();
    filmGroup.position.set(0, -1.65, 0.2);
    rig.add(filmGroup);

    // Film base strip
    const filmStrip = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.55, 0.06), matBody);
    filmGroup.add(filmStrip);

    // Film frames
    for (let i = 0; i < 5; i++) {
      const frame = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.34, 0.08), matDark);
      frame.position.set(-1.44 + i * 0.74, 0, 0);
      filmGroup.add(frame);
      // Frame border glow
      const frameBorder = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.38, 0.05), matBlue);
      frameBorder.position.set(-1.44 + i * 0.74, 0, -0.02);
      filmGroup.add(frameBorder);
    }

    // Sprocket holes top & bottom
    for (let i = 0; i < 8; i++) {
      [-0.22, 0.22].forEach(y => {
        const hole = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.09, 0.1), matDark);
        hole.position.set(-1.65 + i * 0.48, y, 0.04);
        filmGroup.add(hole);
      });
    }

    // ── ORBITING LIGHT RINGS ──────────────────────────
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.025, 8, 96), new THREE.MeshStandardMaterial({ color: 0x35c4ea, emissive: 0x35c4ea, emissiveIntensity: 1.8, metalness: 0.2, roughness: 0.1 }));
    ring1.rotation.x = Math.PI / 2.2;
    ring1.rotation.z = 0.3;
    rig.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.9, 0.015, 8, 96), new THREE.MeshStandardMaterial({ color: 0x3d9fd1, emissive: 0x3d9fd1, emissiveIntensity: 1.2, metalness: 0.2, roughness: 0.1, transparent: true, opacity: 0.7 }));
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.y = 0.5;
    rig.add(ring2);

    // ── FLOATING PARTICLES ────────────────────────────
    const ptGeo = new THREE.BufferGeometry();
    const ptCount = 180;
    const ptPos = new Float32Array(ptCount * 3);
    for (let i = 0; i < ptCount; i++) {
      ptPos[i * 3]     = (Math.random() - 0.5) * 14;
      ptPos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      ptPos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3;
    }
    ptGeo.setAttribute("position", new THREE.BufferAttribute(ptPos, 3));
    const particles = new THREE.Points(ptGeo, new THREE.PointsMaterial({ color: 0x7899aa, size: 0.035, transparent: true, opacity: 0.5 }));
    scene.add(particles);

    // ── POINTER ───────────────────────────────────────
    const onPointerMove = (e) => {
      const rect = mount.getBoundingClientRect();
      pointer.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // ── ANIMATION ─────────────────────────────────────
    let raf, t = 0;
    const animate = () => {
      t += reduced ? 0.001 : 0.007;

      // Camera body gentle float + tilt
      bodyGroup.rotation.y = Math.sin(t * 0.4) * 0.12;
      bodyGroup.position.y = Math.sin(t * 0.6) * 0.06;

      // Lens barrel slow rotate
      barrel1.rotation.z = t * 0.3;
      barrel2.rotation.z = -t * 0.2;
      dial.rotation.y = t * 0.8;

      // Film strip wave
      filmGroup.position.y = -1.65 + Math.sin(t * 0.9) * 0.04;
      filmGroup.rotation.z = Math.sin(t * 0.5) * 0.025;

      // Orbiting rings
      ring1.rotation.z = t * 0.25;
      ring2.rotation.z = -t * 0.18;
      ring1.rotation.y = t * 0.1;

      // Lens glow pulse
      lensGlow.material.emissiveIntensity = 0.3 + Math.abs(Math.sin(t * 2)) * 0.5;
      lensCore.material.emissiveIntensity = 0.5 + Math.abs(Math.sin(t * 3)) * 0.6;

      // Particles drift
      particles.rotation.y = t * 0.025;
      particles.rotation.x = t * 0.01;

      // Mouse parallax on rig
      rig.rotation.y += (pointer.current.x * 0.28 - rig.rotation.y) * 0.04;
      rig.rotation.x += (pointer.current.y * -0.15 - rig.rotation.x) * 0.04;

      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    // ── RESIZE ────────────────────────────────────────
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ── CLEANUP ───────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          Array.isArray(obj.material)
            ? obj.material.forEach(m => m.dispose())
            : obj.material.dispose();
        }
      });
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}
