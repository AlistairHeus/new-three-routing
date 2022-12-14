import { createBrowserHistory } from "history";
import React, { useRef, useState } from "react";
import { Router, Link, Route, Routes } from "react-router-dom";
import { Canvas, useFrame } from "react-three-fiber";

const history = createBrowserHistory({ window });

export function BrowserRouter({ children, history }) {
  let [state, dispatch] = React.useReducer((_, action) => action, {
    action: history.action,
    location: history.location
  });

  React.useLayoutEffect(() => history.listen(dispatch), [history]);

  return (
    <Router
      children={children}
      action={state.action}
      location={state.location}
      navigator={history}
    />
  );
}

function Box(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef();

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
  });

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={(e) => setActive(!active)}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}
    >
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}

function Scene() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <BrowserRouter history={history}>
        <Routes>
          <Route path="/" element={<Box position={[0, 0, 0]} />} />
          <Route path="/a" element={<Box position={[-1.2, 0, 0]} />} />
          <Route path="/b" element={<Box position={[1.2, 0, 0]} />} />
        </Routes>
      </BrowserRouter>
    </Canvas>
  );
}

export default function App() {
  return (
    <BrowserRouter history={history}>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/a">A</Link>
          </li>
          <li>
            <Link to="/b">B</Link>
          </li>
        </ul>
      </nav>
      <Scene />
    </BrowserRouter>
  );
}
