import "./style.css"

import * as avr8js from 'avr8js';
import { loadBlink } from './arduino-blink';

const LEDs = []

// AVR8js
const program = new Uint16Array(16384);
loadBlink(program);

const cpu = new avr8js.CPU(program);
const timer0 = new avr8js.AVRTimer(cpu, avr8js.timer0Config);
const portB = new avr8js.AVRIOPort(cpu, avr8js.portBConfig);
portB.addListener(() => {
  LEDs[0].powered = portB.pinState(LEDs[0].pin) === avr8js.PinState.High;
  if (LEDs[0].powered) {
    LEDs[0].element.classList.toggle("powered")
  }
});

function runCode() {
  for (let i = 0; i < 50000; i++) {
    avr8js.avrInstruction(cpu);
    cpu.tick();
  }
  setTimeout(runCode, 0);
}

const init = () => {
  const LEDElements = document.querySelectorAll(".led")

  for (const e of LEDElements) {
    LEDs.push({
      powered: false,
      pin: 5,
      element: e
    })
  }

  runCode();
}

document.addEventListener('DOMContentLoaded', init)