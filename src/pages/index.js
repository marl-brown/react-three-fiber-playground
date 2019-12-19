import React, { useRef, useState, useEffect } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
// import { TrackballControls } from "three/examples/jsm/controls/TrackballControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { Canvas, useFrame, extend, useThree } from "react-three-fiber"
// import { Canvas, extend, useThree, useRender } from "react-three-fiber"
import { useSpring, a } from "react-spring/three"

import "./style.css"


// Wolf by -- Aleksandr Bessarabov
extend({ OrbitControls })

const Person = ({parentRef}) => {
  const [model, setModel] = useState()
  const clock = useRef(new THREE.Clock());
  const mixer = useRef();
  const ref = useRef();

  useEffect(() => {
    new GLTFLoader().load("/ruby_rose/scene.gltf", setModel)
  }, [])

  useEffect(() => {
    if(model && model.scene) {
      mixer.current = new THREE.AnimationMixer(model.scene);
      const action = mixer.current.clipAction(model.animations[0])
      action.play();
  }
  }, [model])

   useFrame(() => {
    if (mixer.current) {
      const delta = clock.current.getDelta() / 2;
      mixer.current.update(delta);
    }

    if (parentRef && parentRef.current) {
      if (parentRef.current.position.x > -10 && parentRef.current.position.x < 0 && ref.current.position.y < -2.0) {
        ref.current.position.y += 0.1
      }

      if (parentRef.current.position.x > 0 && parentRef.current.position.x < 10 && ref.current.position.y > -3.8) {
        ref.current.position.y -= 0.1
      }
    }
   })

  return model ? (
    <primitive object={model.scene} position={[0, -3.8, 0]} scale={[0.05, 0.05, 0.05]} ref={ref} />
  ) : null
}

const SkateBoard = ({parentRef}) => {
  const [model, setModel] = useState()
  const ref = useRef();

  useFrame(() => {
    if (parentRef && parentRef.current) {
      if (parentRef.current.position.x > -10 && parentRef.current.position.x < 10 && ref.current.rotation.x < Math.PI * 2) {
        ref.current.rotation.x += 0.05
      }
    }
    if (parentRef.current.position.x > 10) {
      ref.current.rotation.x = 0
    }
   })


  useEffect(() => {
    new GLTFLoader().load("/skateboard/scene.gltf", setModel)
  }, [])

  return model ? (
    <primitive object={model.scene} position={[1, -4, -0.5]} scale={[1, 1, 1]} ref={ref} />
  ) : null
}

const Group = () => {
  const ref = useRef();

  useFrame(() => {
    if(ref.current.position.x < 20) {
      ref.current.position.x += 0.1
      if (ref.current.position.x > -10 && ref.current.position.x < 0 && ref.current.position.y < 1) {
        ref.current.position.y += 0.1
      }

      if (ref.current.position.x > 0 && ref.current.position.x < 10 && ref.current.position.y > 0) {
        ref.current.position.y -= 0.1
      }
    } else {
      ref.current.position.x = -20
    }
  })

  return (
    <group position={[-20, 0, 0]} ref={ref}>
      <Person parentRef={ref} />
      <SkateBoard parentRef={ref} />
    </group>
  );
}

const Controls = () => {
  const { camera, gl } = useThree();
  const orbitControlsRef = useRef();

  useFrame(() => {
    orbitControlsRef.current.update()
  })

  return (
    <orbitControls
      args={[camera, gl.domElement]}
      ref={orbitControlsRef}
      maxPolarAngle={Math.PI / 2}
      minPolarAngle={Math.PI / 3}
    />
  )
}

const Plane = () => {
  const [model, setModel] = useState()
  useEffect(() => {
    new THREE.TextureLoader().load("/UV-indoor-map/WM_IndoorWood-44_1024.png", setModel)
  }, [])

  console.log(model)

  return (
    <mesh rotation={[Math.PI * 1.5, 0, 0]} position={[0, -5, -10]}>
      <planeBufferGeometry attach="geometry" args={[100, 100]} />
      <meshPhysicalMaterial attach="material" color={'rebeccapurple'} roughness={1} metalness={1}>
        <texture attach="map" image={model} onUpdate={self => model && (self.needsUpdate = true)}/>
      </meshPhysicalMaterial>
    </mesh>
  )
}

export default () => {
  const isBrowser = typeof window !== "undefined"

  return (
  isBrowser ? <Canvas
    camera={{ position: [0, 0, 10]}}
    onCreated={({scene, gl}) => {
      scene.background =  new THREE.Color( 0x8FBCD4 );
      gl.shadowMap.enabled = true
      gl.shadowMap.type = THREE.PCFSoftShadowMap
    }}
  >
    <ambientLight intensity={1} color={'#927575'} />
    <spotLight position={[0, 10, 35]} castShadow intensity={2} />
    <Controls />
    <Group />
    <Plane />
  </Canvas> : null);
}
