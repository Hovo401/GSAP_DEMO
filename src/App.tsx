// import { useState } from 'react'
import './App.css';
import { gsap } from "gsap";

gsap.to(".box", { rotation: 27, x: 100, duration: 1 });

let tl = gsap.timeline();
tl.to("#green", {duration: 1, x: 786})
  .to("#blue", {duration: 2, x: 786})
  .to("#orange", {duration: 1, x: 786})


function App() {

  return (
    <>
      <div className='bg-black box'>box</div>
      <div id="blue">blue</div>
       
    </>
  )
}

export default App
