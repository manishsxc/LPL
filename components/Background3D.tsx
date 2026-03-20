'use client';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function Background3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;
    const w = mount.clientWidth;
    const h = mount.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050A14, 0.035);

    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 200);
    camera.position.set(0, 8, 22);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);

    // --- CRICKET PITCH ---
    const pitchGeo = new THREE.BoxGeometry(3.5, 0.05, 20);
    const pitchMat = new THREE.MeshStandardMaterial({
      color: 0xC8A96E,
      roughness: 0.8,
      metalness: 0.0,
    });
    const pitch = new THREE.Mesh(pitchGeo, pitchMat);
    pitch.position.y = -0.025;
    pitch.receiveShadow = true;
    scene.add(pitch);

    // Pitch crease lines
    const creaseGeo = new THREE.BoxGeometry(3.8, 0.06, 0.05);
    const creaseMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.2 });
    [-7.5, -6.5, 6.5, 7.5].forEach(z => {
      const crease = new THREE.Mesh(creaseGeo, creaseMat);
      crease.position.set(0, 0.005, z);
      scene.add(crease);
    });

    // --- OUTFIELD ---
    const fieldGeo = new THREE.CircleGeometry(50, 64);
    const fieldMat = new THREE.MeshStandardMaterial({
      color: 0x1a4d1a,
      roughness: 0.9,
      metalness: 0.0,
    });
    const field = new THREE.Mesh(fieldGeo, fieldMat);
    field.rotation.x = -Math.PI / 2;
    field.position.y = -0.05;
    field.receiveShadow = true;
    scene.add(field);

    // Field mowing pattern (rings)
    const ringColors = [0x1e5c1e, 0x175417];
    for (let i = 0; i < 10; i++) {
      const ringGeo = new THREE.RingGeometry(i * 5, i * 5 + 2.5, 64);
      const ringMat = new THREE.MeshStandardMaterial({
        color: ringColors[i % 2],
        side: THREE.DoubleSide,
        roughness: 0.9,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = -0.04;
      scene.add(ring);
    }

    // --- STUMPS ---
    const stumpGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.7, 8);
    const stumpMat = new THREE.MeshStandardMaterial({ color: 0xf5deb3, roughness: 0.5 });
    const bailGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.25, 8);
    const bailMat = new THREE.MeshStandardMaterial({ color: 0xf5deb3 });

    const stumpPositions = [-0.22, 0, 0.22];
    [7.5, -7.5].forEach(z => {
      stumpPositions.forEach(x => {
        const stump = new THREE.Mesh(stumpGeo, stumpMat);
        stump.position.set(x, 0.35, z);
        stump.castShadow = true;
        scene.add(stump);
      });
      // Bails
      for (let i = 0; i < 2; i++) {
        const bail = new THREE.Mesh(bailGeo, bailMat);
        bail.rotation.z = Math.PI / 2;
        bail.position.set(-0.11 + i * 0.22, 0.73, z);
        scene.add(bail);
      }
    });

    // --- CRICKET BALL ---
    const ballGeo = new THREE.SphereGeometry(0.18, 32, 32);
    const ballMat = new THREE.MeshStandardMaterial({
      color: 0xcc1111,
      roughness: 0.6,
      metalness: 0.1,
      emissive: 0x330000,
      emissiveIntensity: 0.2,
    });
    const ball = new THREE.Mesh(ballGeo, ballMat);
    ball.castShadow = true;
    ball.position.set(0, 3, 5);
    scene.add(ball);

    // Seam on ball
    const seamGeo = new THREE.TorusGeometry(0.18, 0.01, 8, 32);
    const seamMat = new THREE.MeshStandardMaterial({ color: 0xdddddd });
    const seam = new THREE.Mesh(seamGeo, seamMat);
    seam.rotation.y = Math.PI / 4;
    ball.add(seam);

    // --- CRICKET BAT (simplified) ---
    const bladeGeo = new THREE.BoxGeometry(0.12, 0.65, 0.03);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0xd4a847, roughness: 0.7 });
    const bat = new THREE.Mesh(bladeGeo, bladeMat);
    bat.castShadow = true;
    bat.position.set(-1.5, 1, -6);
    bat.rotation.set(-0.3, 0.4, 0.2);
    scene.add(bat);

    // Handle
    const handleGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.5, 8);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.8 });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.set(-1.5, 1.55, -6);
    handle.rotation.set(0.3, 0, -0.2);
    scene.add(handle);

    // --- BOUNDARY ROPE ---
    const ropeGeo = new THREE.TorusGeometry(28, 0.08, 8, 128);
    const ropeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xaaaaaa,
      emissiveIntensity: 0.3,
    });
    const rope = new THREE.Mesh(ropeGeo, ropeMat);
    rope.rotation.x = Math.PI / 2;
    rope.position.y = 0.05;
    scene.add(rope);

    // --- STADIUM LIGHTS ---
    const lightPositions = [
      { x: 25, y: 25, z: 25 }, { x: -25, y: 25, z: 25 },
      { x: 25, y: 25, z: -25 }, { x: -25, y: 25, z: -25 },
    ];
    lightPositions.forEach(pos => {
      const spotLight = new THREE.SpotLight(0xfffcee, 1.5);
      spotLight.position.set(pos.x, pos.y, pos.z);
      spotLight.target.position.set(0, 0, 0);
      spotLight.castShadow = true;
      spotLight.angle = Math.PI / 6;
      spotLight.penumbra = 0.3;
      scene.add(spotLight);
      scene.add(spotLight.target);

      // Light pole
      const poleGeo = new THREE.CylinderGeometry(0.15, 0.3, pos.y, 8);
      const poleMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.6 });
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.set(pos.x, pos.y / 2, pos.z);
      scene.add(pole);
    });

    // Ambient
    const ambient = new THREE.AmbientLight(0x112244, 1.5);
    scene.add(ambient);

    // --- FLOATING PARTICLES (gold dust) ---
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = Math.random() * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xFFD700,
      size: 0.12,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- ANIMATION ---
    let t = 0;
    let ballPhase = 0; // 0=in air, bowled
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.01;
      ballPhase += 0.015;

      // Ball trajectory (parabolic bowling)
      const bp = (ballPhase % (Math.PI * 2));
      ball.position.x = Math.sin(bp * 0.5) * 0.3;
      ball.position.y = 3 + Math.sin(bp) * 2;
      ball.position.z = 8 - (bp / (Math.PI * 2)) * 18;
      if (ball.position.z < -8) { ballPhase = 0; ball.position.z = 8; }
      ball.rotation.x += 0.05;
      ball.rotation.z += 0.03;

      // Bat swing
      bat.rotation.z = 0.2 + Math.sin(t * 1.5) * 0.4;
      bat.rotation.x = -0.3 + Math.sin(t * 1.2) * 0.2;

      // Particles drift
      particles.rotation.y += 0.0008;
      const pos = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        pos[i] += 0.02;
        if (pos[i] > 20) pos[i] = 0;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Camera gentle sway
      camera.position.x = Math.sin(t * 0.1) * 1.5;
      camera.position.y = 8 + Math.sin(t * 0.07) * 0.5;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      const w2 = mount.clientWidth;
      const h2 = mount.clientHeight;
      camera.aspect = w2 / h2;
      camera.updateProjectionMatrix();
      renderer.setSize(w2, h2);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      style={{ background: 'linear-gradient(180deg, #050A14 0%, #0A1628 100%)' }}
    />
  );
}
