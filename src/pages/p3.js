import React, { useRef, useState, useEffect } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { Canvas, useFrame, extend, useThree } from "react-three-fiber"
// import { Canvas, extend, useThree, useRender } from "react-three-fiber"
import { useSpring, a } from "react-spring/three"

import "./style.css"

extend({ OrbitControls })

export default () => {
  const isBrowser = typeof window !== "undefined"

  function Cube() {
    const [isHovered, setIsHovered] = useState(false);
    const ref = useRef()
    const geometry = useRef()
    // useFrame(() => (ref.current.rotation.x += 0.01))
    const props = useSpring({
      scale: isHovered ? [1.5, 1.5, 1.5] : [2, 2, 2]
    })

    useEffect(() => {
      geometry.current.rotateX(45 * Math.PI/180)
      geometry.current.rotateY(45 * Math.PI/180)
      geometry.current.rotateZ(45 * Math.PI/180)
    }, [])

    console.log('useSpring', geometry)

    return (
      <a.mesh
        ref={ref}
        onClick={e => console.log('click')}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
        scale={props.scale}
        position={[0, 0, 0]}
        // rotation={[45 * Math.PI/180, 0, 0]}
        >
        <boxBufferGeometry attach="geometry" args={[1, 1, 1]} ref={geometry} />
        <meshNormalMaterial attach="material" />
      </a.mesh>
    )
  }

  function Pyramid() {
    const [isHovered, setIsHovered] = useState(false);
    const ref = useRef()
    useFrame(() => (ref.current.rotation.x += 0.01))
    const props = useSpring({
      scale: isHovered ? [1.5, 1.5, 1.5] : [1, 1, 1]
    })

    // console.log('conebuffer ', b)

    return (
      <a.mesh
        ref={ref}
        onClick={e => console.log('click')}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
        scale={props.scale}
        position={[-5, -1, 0]}
        // rotation={0, 0, 0}
        >
        <coneBufferGeometry attach="geometry" args={[1, 2, 10]} />
        <meshNormalMaterial attach="material" />
      </a.mesh>
    )
  }

  function Train() {
    const [isHovered, setIsHovered] = useState(false);
    const ref = useRef()

    const { scene } = useThree();

    useEffect(() => {
      console.log(' asdf ', ref.current)
      ref.current.rotateX(Math.PI)
    }, [])
    // useFrame(() => (ref.current.rotateX(Math.PI)))
    // const props = useSpring({
    //   scale: isHovered ? [1.5, 1.5, 1.5] : [1, 1, 1]
    // })

    console.log('train', ref.current)

    return (
      <mesh
        // ref={ref}
        onClick={e => console.log('click')}
        onPointerOver={() => scene.background = new THREE.Color( 0xFFFFFF )}
        onPointerOut={() => scene.background =  new THREE.Color( 0x8FBCD4 )}
        // scale={props.scale}
        position={[-5, 2, 0]}
        // rotation={0, 0, 0}
        >
        <coneBufferGeometry attach="geometry" args={[1, 2, 30]} ref={ref} />
        <meshNormalMaterial attach="material" />
      </mesh>
    )
  }

  const Controls = () => {
    const orbitRef = useRef()
    const { camera, gl } = useThree()

    const resizeCanvas = () => {

      // camera.aspect = 2 / 1; <-- no need to change the aspect ratio as we keep it the same on all screens

      // update the camera's frustum
      camera.updateProjectionMatrix();

      // update the size of the canvas as per
      gl.setSize(window.innerWidth, window.innerWidth / 2);
    }

    useEffect(() => {
      window.addEventListener('resize', resizeCanvas)
      return () => {
        window.removeEventListener('resize', resizeCanvas)
      }
    })

    useFrame(() => {
      orbitRef.current.update()
    })

    console.log('asdf ',camera.aspect)

    return (
      <orbitControls
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
        args={[camera, gl.domElement]}
        ref={orbitRef}
      />
    )
  }


  return (
  isBrowser ? <Canvas
    camera={{ position: [0, 0, 5]}}
    onCreated={({scene}) => {
      scene.background =  new THREE.Color( 0x8FBCD4 );
    }}
  >
    <Controls />
    <Cube />
    <Pyramid />
    <Train />
  </Canvas> : null);
}
