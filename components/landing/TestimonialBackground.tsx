'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function TestimonialBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isSmallScreen = window.matchMedia('(max-width: 640px)').matches
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-8, 8, 5, -5, 0.1, 100)
    camera.position.z = 10

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isSmallScreen,
      powerPreference: 'low-power',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmallScreen ? 1 : 1.5))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    const root = new THREE.Group()
    scene.add(root)

    const waveGroups: Array<{ mesh: THREE.Mesh; base: Float32Array; offset: number }> = []
    const waveColors = [0x1959d8, 0x1448b8, 0x0b348d]

    waveColors.forEach((color, index) => {
      const geometry = new THREE.PlaneGeometry(64, 4.4, isSmallScreen ? 40 : 96, 16)
      const position = geometry.attributes.position
      const base = new Float32Array(position.array)

      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.44 - index * 0.06,
        depthWrite: false,
      })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(0, -3.6 + index * 0.27, -1 - index * 0.08)
      mesh.rotation.z = index === 0 ? 0.02 : -0.015
      root.add(mesh)
      waveGroups.push({ mesh, base, offset: index * 1.8 })
    })

    const orbs: Array<{ mesh: THREE.Mesh; speed: number; phase: number; origin: THREE.Vector3 }> = []
    const orbData = [
      { position: [-6.4, 2.8, -0.2], size: 1.5, color: 0x3180ff, opacity: 0.23, speed: 0.18 },
      { position: [6.2, 3.3, -0.3], size: 1.2, color: 0x63a1ff, opacity: 0.18, speed: 0.15 },
      { position: [6.8, -1.4, -0.1], size: 0.7, color: 0x55a6ff, opacity: 0.2, speed: 0.23 },
      { position: [-6.8, -1.3, 0], size: 0.9, color: 0x3f83e8, opacity: 0.16, speed: 0.2 },
    ]

    orbData.forEach((data, index) => {
      const material = new THREE.MeshBasicMaterial({
        color: data.color,
        transparent: true,
        opacity: data.opacity,
        depthWrite: false,
      })
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(data.size, isSmallScreen ? 16 : 24, isSmallScreen ? 12 : 18), material)
      const origin = new THREE.Vector3(...data.position)
      mesh.position.copy(origin)
      root.add(mesh)
      orbs.push({ mesh, speed: data.speed, phase: index * 1.7, origin })
    })

    const particleCount = isSmallScreen ? 70 : 150
    const particlePositions = new Float32Array(particleCount * 3)
    const particlePhases = new Float32Array(particleCount)
    for (let index = 0; index < particleCount; index += 1) {
      particlePositions[index * 3] = (Math.random() - 0.5) * 17
      particlePositions[index * 3 + 1] = (Math.random() - 0.5) * 8.5
      particlePositions[index * 3 + 2] = -0.5 + Math.random() * 0.7
      particlePhases[index] = Math.random() * Math.PI * 2
    }
    const particleGeometry = new THREE.BufferGeometry()
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x83c7ff,
      size: isSmallScreen ? 0.035 : 0.045,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      sizeAttenuation: true,
    })
    const particles = new THREE.Points(particleGeometry, particleMaterial)
    root.add(particles)

    const orbitMaterial = new THREE.LineBasicMaterial({
      color: 0x5fa7ff,
      transparent: true,
      opacity: 0.1,
      depthWrite: false,
    })
    const orbitCurves = [
      new THREE.EllipseCurve(0, 0, 7.1, 2.6, 0, Math.PI * 2, false, 0),
      new THREE.EllipseCurve(0, 0, 5.6, 2.1, 0, Math.PI * 2, false, Math.PI * 0.25),
    ]
    orbitCurves.forEach((curve, index) => {
      const points = curve.getPoints(96)
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), orbitMaterial.clone())
      line.rotation.z = index === 0 ? -0.17 : 0.24
      line.position.z = -0.25
      root.add(line)
    })

    const addLine = (points: THREE.Vector3[], opacity = 0.18) => {
      const material = new THREE.LineBasicMaterial({
        color: 0x69a9ff,
        transparent: true,
        opacity,
        depthWrite: false,
      })
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material)
      line.position.z = 0.4
      root.add(line)
    }

    const cornerCircleMaterial = new THREE.MeshBasicMaterial({
      color: 0x4f93ff,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    })
    const cornerCircles = [
      { x: -8.2, y: 5.1, size: 2.7 },
      { x: 8.2, y: 5.1, size: 1.9 },
      { x: 8.7, y: -1.9, size: 0.9 },
      { x: -6.5, y: -1.6, size: 0.75 },
    ]
    cornerCircles.forEach(({ x, y, size }) => {
      const circle = new THREE.Mesh(new THREE.CircleGeometry(size, 48), cornerCircleMaterial.clone())
      circle.position.set(x, y, -0.55)
      root.add(circle)
    })

    const hatchPoints: THREE.Vector3[] = []
    for (let index = -4; index <= 4; index += 1) {
      hatchPoints.push(new THREE.Vector3(-8.45 + index * 0.18, 1.15, 0.5))
      hatchPoints.push(new THREE.Vector3(-7.55 + index * 0.18, 2.05, 0.5))
    }
    for (let index = 0; index < hatchPoints.length; index += 2) {
      addLine([hatchPoints[index], hatchPoints[index + 1]], 0.24)
    }

    for (let row = 0; row < 6; row += 1) {
      const points: THREE.Vector3[] = []
      for (let column = 0; column < 9; column += 1) {
        points.push(new THREE.Vector3(7.15 + column * 0.2, 1.25 + row * 0.2, 0.5))
      }
      const dotGeometry = new THREE.BufferGeometry().setFromPoints(points)
      const dots = new THREE.Points(
        dotGeometry,
        new THREE.PointsMaterial({ color: 0x72b5ff, size: 0.04, transparent: true, opacity: 0.4 }),
      )
      root.add(dots)
    }

    for (let lineIndex = 0; lineIndex < 7; lineIndex += 1) {
      const points: THREE.Vector3[] = []
      for (let step = 0; step <= 24; step += 1) {
        const x = -9.8 + step * 0.18
        const y = -1.2 - lineIndex * 0.12 + Math.sin(step * 0.18) * 0.18
        points.push(new THREE.Vector3(x, y, 0.45))
      }
      addLine(points, 0.14)
    }

    const pointer = { x: 0, y: 0 }
    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 0.12
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 0.08
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })

    const resize = () => {
      const width = container.clientWidth || container.parentElement?.clientWidth || window.innerWidth
      const height = container.clientHeight || container.parentElement?.clientHeight || 600
      const aspect = width / Math.max(height, 1)
      camera.left = -5 * aspect
      camera.right = 5 * aspect
      camera.top = 5
      camera.bottom = -5
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    resize()

    let animationFrame = 0
    const clock = new THREE.Clock()
    const render = () => {
      const elapsed = reducedMotion ? 0 : clock.getElapsedTime() * 1.45

      waveGroups.forEach(({ mesh, base, offset }, waveIndex) => {
        const position = mesh.geometry.attributes.position
        for (let index = 0; index < position.count; index += 1) {
          const baseX = base[index * 3]
          const baseY = base[index * 3 + 1]
          const wave = Math.sin(baseX * 0.72 + elapsed * (0.35 + waveIndex * 0.08) + offset) * 0.18
          const secondaryWave = Math.cos(baseX * 0.31 - elapsed * 0.24 + baseY) * 0.1
          position.setY(index, baseY + wave + secondaryWave)
        }
        position.needsUpdate = true
      })

      orbs.forEach(({ mesh, speed, phase, origin }) => {
        const circleSpeed = speed * 3.5
        mesh.position.x = origin.x + Math.sin(elapsed * circleSpeed + phase) * 0.3
        mesh.position.y = origin.y + Math.cos(elapsed * circleSpeed * 1.15 + phase) * 0.22
      })

      const positions = particleGeometry.attributes.position.array as Float32Array
      for (let index = 0; index < particleCount; index += 1) {
        positions[index * 3 + 1] += reducedMotion ? 0 : Math.sin(elapsed * 0.12 + particlePhases[index]) * 0.0008
      }
      particleGeometry.attributes.position.needsUpdate = true

      root.rotation.x += (pointer.y - root.rotation.x) * 0.01
      root.rotation.y += (pointer.x - root.rotation.y) * 0.01
      renderer.render(scene, camera)

      if (!reducedMotion) animationFrame = window.requestAnimationFrame(render)
    }
    render()

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('pointermove', onPointerMove)
      resizeObserver.disconnect()
      root.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
          object.geometry.dispose()
          const material = object.material
          if (Array.isArray(material)) material.forEach((item) => item.dispose())
          else material.dispose()
        }
      })
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    />
  )
}
