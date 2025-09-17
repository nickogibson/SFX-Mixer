const SoundDesigner = (() => {

    const soundBlueprints = new Map();



    soundBlueprints.set('Spaceship Engine', {
        defaultParams: { volume: 0.8, pitch: 2, distortion: 0.1, reverb: 3.0, synthType: 'sine' },
        isSustained: true,
        create: (params) => {
            const getCode = () => `const distortion = new Tone.Distortion(${params.distortion.toFixed(2)}).toDestination();
const reverb = new Tone.Reverb(${params.reverb.toFixed(2)}).connect(distortion);
const filter = new Tone.Filter(${params.pitch * 40}, 'lowpass').connect(reverb);
const engineLFO = new Tone.LFO('4n', ${params.pitch * 20}, ${params.pitch * 60}).connect(filter.frequency).start();
const engine = new Tone.MonoSynth({
    oscillator: { type: '${params.synthType}' },
    envelope: { attack: 0.3, decay: 0.1, sustain: 0.7, release: 1.0 }
}).connect(filter);
engine.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
engine.triggerAttack("C${params.pitch > 1 ? params.pitch - 1 : 1}");
`;
            return { getCode, isSustained: true };
        }
    });

    soundBlueprints.set('Healing / Power Up', {
        defaultParams: { volume: 0.7, pitch: 4, distortion: 0.0, reverb: 2.0, synthType: 'sine' },
        create: (params) => {
            const getCode = () => `const reverb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const distortion = new Tone.Distortion(${params.distortion.toFixed(2)}).connect(reverb);
const tremolo = new Tone.Tremolo(6, 0.5).connect(distortion).start();
const synth = new Tone.PolySynth(Tone.FMSynth, {
    harmonicity: 1.5,
    modulationIndex: 10,
    oscillator: { type: '${params.synthType}' },
    envelope: { attack: 0.1, decay: 0.5, sustain: 0.3, release: 1 }
}).connect(tremolo);
synth.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
const now = Tone.now();
const p = ${params.pitch};
synth.triggerAttackRelease(\`C\${p}\`, "8n", now);
synth.triggerAttackRelease(\`E\${p}\`, "8n", now + 0.1);
synth.triggerAttackRelease(\`G\${p}\`, "8n", now + 0.2);
synth.triggerAttackRelease(\`C\${p+1}\`, "8n", now + 0.3);`;
            return { getCode };
        }
    });

    soundBlueprints.set('Alien Drone', {
        defaultParams: { volume: 0.6, pitch: 2, distortion: 0.1, reverb: 4.0, synthType: 'sawtooth' },
        isSustained: true,
        create: (params) => {
            const getCode = () => `const distortion = new Tone.Distortion(${params.distortion.toFixed(2)}).toDestination();
const reverb = new Tone.Reverb(${params.reverb.toFixed(2)}).connect(distortion);
const phaser = new Tone.Phaser({ frequency: 0.5, octaves: 3, baseFrequency: 300 }).connect(reverb);
const drone = new Tone.FMSynth({
    harmonicity: 3,
    modulationIndex: 10,
    envelope: { attack: 2, release: 3 },
    modulation: { type: '${params.synthType}' }
}).connect(phaser);
drone.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
drone.triggerAttack("C${params.pitch}");
phaser.frequency.rampTo(2, 15);
`;
            return { getCode, isSustained: true };
        }
    });

    soundBlueprints.set('Impact', {
        defaultParams: { volume: 0.9, pitch: 2, distortion: 0.1, reverb: 1.0, synthType: 'sine' },
        create: (params) => {
            const getCode = () => `const reverb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const distortion = new Tone.Distortion(${params.distortion.toFixed(2)}).connect(reverb);
const synth = new Tone.MembraneSynth({
    pitchDecay: 0.05, octaves: 2,
    envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.1 }
}).connect(distortion);
synth.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
synth.triggerAttackRelease("C${params.pitch}", "16n");`;
            return { getCode };
        }
    });

    soundBlueprints.set('Electric Zap', {
        defaultParams: { volume: 0.8, pitch: 3, distortion: 0.3, reverb: 1.2, synthType: 'triangle' },
        create: (params) => {
            const getCode = () => `const reverb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const distortion = new Tone.Distortion(${params.distortion.toFixed(2)}).connect(reverb);
const chorus = new Tone.Chorus(4, 2.5, 0.5).connect(distortion).start();
const synth = new Tone.FMSynth({
    oscillator: { type: '${params.synthType}' },
    envelope: { attack: 1, decay: 1, sustain: 0.8, release: 0.5 }
}).connect(chorus);
synth.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
synth.triggerAttackRelease("D${params.pitch}", "2n");`;
            return { getCode };
        }
    });

    soundBlueprints.set('Hyperspace Jump', {
        defaultParams: { volume: 0.9, pitch: 2, distortion: 0.3, reverb: 2.0, synthType: 'sawtooth' },
        create: (params) => {
            const getCode = () => `const reverb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const distortion = new Tone.Distortion(${params.distortion.toFixed(2)}).connect(reverb);
const chorus = new Tone.Chorus(0.5, 2.5, 0.7).connect(distortion).start();
const synth = new Tone.MonoSynth({
    oscillator: { type: '${params.synthType}' },
    filterEnvelope: { attack: 0.1, decay: 0.5, sustain: 0.8, release: 2 }
}).connect(chorus);
synth.volume.value = 0.00;
const now = Tone.now();
synth.triggerAttack("C3", now);
synth.frequency.rampTo("C7", 1.5, now + 0.5);
synth.triggerRelease(now + 2);`;
            return { getCode };
        }
    });

    soundBlueprints.set('Bleep Bloop', {
        defaultParams: { volume: 0.8, pitch: 4, distortion: 0, reverb: 0.2, synthType: 'sine' },
        create: (params) => {
            const getCode = () => `const reverb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const distortion = new Tone.Distortion(${params.distortion.toFixed(2)}).connect(reverb);
const synth = new Tone.MonoSynth({
    oscillator: { type: '${params.synthType}' },
    envelope: { attack: 0, decay: 0.1, sustain: 0, release: 0.2 }
}).connect(distortion);
synth.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
const now = Tone.now();
const p = ${params.pitch};
const sequence = [{ note: \`A\${p}\`, time: 0 }, { note: \`E\${p}\`, time: 0.15 }, { note: \`A\${p}\`, time: 0.3 }, { note: \`C\${p+1}\`, time: 0.45 }];
sequence.forEach(item => { synth.triggerAttackRelease(item.note, "8n", now + item.time); });`;
            return { getCode };
        }
    });

    soundBlueprints.set('Bleep', {
        defaultParams: { volume: 1.0, pitch: 7, distortion: 0, reverb: 1.2, synthType: 'sine' },
        create: (params) => {
            const getCode = () => `const reverb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const comp = new Tone.Compressor(-12, 3).connect(reverb);
const click = new Tone.FMSynth({
    harmonicity: 2, modulationIndex: 20,
    envelope: { attack: 0.001, decay: 0.07, release: 0.01 }
}).connect(comp);
click.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
const rumble = new Tone.NoiseSynth({ noise: { type: "pink" }, envelope: { attack: 0.001, decay: 0.35, sustain: 0 } });
const lp = new Tone.Filter(140, 'lowpass').connect(comp);
rumble.connect(lp);
rumble.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
const now = Tone.now();
click.triggerAttackRelease("C${params.pitch}", "32n", now);
rumble.triggerAttackRelease("8n", now + 0.02);`;
            return { getCode };
        }
    });

    soundBlueprints.set('Force Field Hum', {
        defaultParams: { volume: 0.7, pitch: 2, distortion: 0.0, reverb: 3.0, synthType: 'sawtooth' },
        isSustained: true,
        create: (params) => {
            const getCode = () => `const reverb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const distortion = new Tone.Distortion(${params.distortion.toFixed(2)}).connect(reverb);
const trem = new Tone.Tremolo(5.5, 0.35).start();
const chorus = new Tone.Chorus(0.8, 3, 0.2).start();
const synth = new Tone.AMSynth({
    harmonicity: 0.5,
    oscillator: { type: '${params.synthType}' },
    envelope: { attack: 0.5, decay: 1, sustain: 0.9, release: 0.8 }
});
synth.chain(chorus, trem, distortion);
synth.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
synth.triggerAttack("D${params.pitch}");
`;
            return { getCode, isSustained: true };
        }
    });

    soundBlueprints.set('Notification', {
        defaultParams: { volume: 0.8, pitch: 6, distortion: 0.0, reverb: 1.5, synthType: 'sawtooth' },
        create: (params) => {
            const getCode = () => `const reverb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const distortion = new Tone.Distortion(${params.distortion.toFixed(2)}).connect(reverb);
const phaser = new Tone.Phaser({ frequency: 1.2, octaves: 2, baseFrequency: 400 }).connect(distortion);
const synth = new Tone.Synth({
    oscillator: { type: '${params.synthType}' },
    envelope: { attack: 0.05, decay: 0.3, sustain: 0.2, release: 0.8 }
}).connect(phaser);
synth.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
const now = Tone.now();
synth.triggerAttackRelease("C${params.pitch}", "8n", now);
synth.triggerAttackRelease("G${params.pitch > 1 ? params.pitch - 1 : 1}", "8n", now + 0.15);`;
            return { getCode };
        }
    });

    soundBlueprints.set('Notification 2', {
        defaultParams: { volume: 0.9, pitch: 3, distortion: 0.0, reverb: 0.8, synthType: 'sine' },
        create: (params) => {
            const getCode = () => `const reverb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const distortion = new Tone.Distortion(${params.distortion.toFixed(2)}).connect(reverb);
const comp = new Tone.Compressor(-30, 3).connect(distortion);
const pingPong = new Tone.PingPongDelay("8n", 0.3).connect(comp);
const fm = new Tone.FMSynth({
    harmonicity: 3, modulationIndex: 15,
    oscillator: { type: '${params.synthType}' },
    envelope: { attack: 0.01, decay: 0.4, sustain: 0.1, release: 0.5 }
}).connect(pingPong);
fm.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
const now = Tone.now();
fm.triggerAttackRelease("C${params.pitch}", "16n", now);
fm.triggerAttackRelease("F${params.pitch}", "16n", now + 0.1);`;
            return { getCode };
        }
    });
    
    soundBlueprints.set('Tech Jingle', {
        defaultParams: { volume: 0.7, pitch: 5, distortion: 0, reverb: 1.0, synthType: 'square' },
        create: (params) => {
            const getCode = () => `const reverb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const distortion = new Tone.Distortion(${params.distortion.toFixed(2)}).connect(reverb);
const synth = new Tone.PluckSynth({
    attackNoise: 1,
    dampening: 4000,
    resonance: 0.9
}).connect(distortion);
synth.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
const now = Tone.now();
for (let i = 0; i < 10; i++) {
    const baseMidi = Tone.Frequency("G${params.pitch}").toMidi();
    const randomMidi = baseMidi + Math.random() * 12;
    const noteFreq = Tone.mtof(randomMidi);
    synth.triggerAttackRelease(noteFreq, "32n", now + i * 0.05);
}`;
            return { getCode };
        }
    });

    soundBlueprints.set('Teleport Out', {
        defaultParams: { volume: 0.9, pitch: 4, distortion: 0.0, reverb: 2.5, synthType: 'sine' },
        create: (params) => {
            const getCode = () => `const reverb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const distortion = new Tone.Distortion(${params.distortion.toFixed(2)}).connect(reverb);
const filter = new Tone.Filter({ type: "bandpass", Q: 8 }).connect(distortion);
const noise = new Tone.Noise("pink").connect(filter);
noise.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
const now = Tone.now();
noise.start(now);
filter.frequency.value = ${8000 * (params.pitch / 4)};
filter.frequency.rampTo(${80 * (params.pitch / 4)}, 0.4, now);
noise.stop(now + 0.5);`;
            return { getCode };
        }
    });

    soundBlueprints.set('Tractor Beam', {
        defaultParams: { volume: 0.8, pitch: 2, distortion: 0.1, reverb: 2.2, synthType: 'sawtooth' },
        create: (params) => {
            const getCode = () => `const reverb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const distortion = new Tone.Distortion(${params.distortion.toFixed(2)}).connect(reverb);
const phaser = new Tone.Phaser({ frequency: 0.3, octaves: 2, baseFrequency: 200 }).connect(distortion);
const synth = new Tone.AMSynth({
    oscillator: { type: '${params.synthType}' },
    envelope: { attack: 0.2, decay: 0.8, sustain: 0.7, release: 0.5 }
}).connect(phaser);
synth.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
const now = Tone.now();
synth.triggerAttack("G${params.pitch}", now);
synth.frequency.rampTo("D${params.pitch}", 1.5);
synth.triggerRelease(now + 1.6);`;
            return { getCode };
        }
    });

    soundBlueprints.set('Jingle', {
        defaultParams: { volume: 0.7, pitch: 7, distortion: 0, reverb: 3.0, synthType: 'sine' },
        create: (params) => {
            const getCode = () => `const reverb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const distortion = new Tone.Distortion(${params.distortion.toFixed(2)}).connect(reverb);
const delay = new Tone.PingPongDelay("8n", 0.3).connect(distortion);
const synth = new Tone.Synth({
    oscillator: { type: '${params.synthType}' },
    envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.2 }
}).connect(delay);
synth.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
const now = Tone.now();
const p = ${params.pitch};
synth.triggerAttackRelease(\`A\${p-1}\`, "16n", now);
synth.triggerAttackRelease(\`E\${p}\`, "16n", now + 0.4);
synth.triggerAttackRelease(\`C\${p}\`, "16n", now + 0.8);`;
            return { getCode };
        }
    });

    soundBlueprints.set('Boing', {
        defaultParams: { volume: 0.8, pitch: 5, distortion: 0, reverb: 1.2, synthType: 'sawtooth' },
        create: (params) => {
            const getCode = () => `const reverb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const distortion = new Tone.Distortion(${params.distortion.toFixed(2)}).connect(reverb);
const synth = new Tone.AMSynth({
    oscillator: { type: '${params.synthType}' },
    modulation: { type: 'square' },
    envelope: { attack: 0.005, decay: 0.1, sustain: 0, release: 0.05 }
}).connect(distortion);
synth.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
const now = Tone.now();
synth.triggerAttack("A${params.pitch}", now);
synth.frequency.rampTo("C${params.pitch + 1}", 0.07);
setTimeout(() => synth.frequency.rampTo("G${params.pitch}", 0.07), 80);
setTimeout(() => synth.triggerRelease(), 160);`;
            return { getCode };
        }
    });

 

    soundBlueprints.set('Transformer', {
        defaultParams: { volume: 0.8, pitch: 2, distortion: 0.1, reverb: 3.0, synthType: 'sawtooth' },
        create: (params) => {
            const getCode = () => `const reverb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const distortion = new Tone.Distortion(${params.distortion.toFixed(2)}).connect(reverb);
const phaser = new Tone.Phaser({ frequency: 0.5, octaves: 3, baseFrequency: 800 }).connect(distortion);
const synth = new Tone.MonoSynth({
    oscillator: { type: '${params.synthType}' },
    envelope: { attack: 0.8, decay: 0.3, release: 1.2 },
    filter: { Q: 2, type: "bandpass" }
}).connect(phaser);
synth.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
const metalSynth = new Tone.MetalSynth({ harmonicity: 5.1, modulationIndex: 32, resonance: 4000 }).connect(distortion);
metalSynth.volume.value = ${Tone.gainToDb(params.volume - 0.1).toFixed(2)};
const now = Tone.now();
synth.triggerAttack("C${params.pitch}", now);
synth.frequency.rampTo("C${params.pitch + 4}", 1.5, now);
synth.triggerRelease(now + 1.5);
for (let i = 0; i < 8; i++) { metalSynth.triggerAttackRelease("32n", now + 0.3 + (i * 0.15)); }`;
            return { getCode };
        }
    });

    soundBlueprints.set('Warp Drive', {
        defaultParams: { volume: 0.9, pitch: 2, distortion: 0.1, reverb: 4.0, synthType: 'sawtooth' },
        create: (params) => {
            const getCode = () => `const reverb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const distortion = new Tone.Distortion(${params.distortion.toFixed(2)}).connect(reverb);
const chorus = new Tone.Chorus(4, 2.5, 0.5).connect(distortion);
const synth = new Tone.MonoSynth({
    oscillator: { type: '${params.synthType}' },
    envelope: { attack: 2, decay: 0.1, sustain: 0.8, release: 0.5 },
    filter: { Q: 5, frequency: 100 }
}).connect(chorus);
synth.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
const now = Tone.now();
synth.triggerAttack("C${params.pitch}", now);
synth.filter.frequency.setValueAtTime(100, now); // Stability fix
synth.frequency.exponentialRampTo("C${params.pitch + 4}", 2, now);
synth.filter.frequency.exponentialRampTo(5000, 2, now);
synth.triggerRelease(now + 2.1);`;
            return { getCode };
        }
    });

    soundBlueprints.set('Airlock Hiss', {
        defaultParams: { volume: 0.8, pitch: 2, distortion: 0.0, reverb: 0.5, synthType: 'sine' },
        create: (params) => {
            const getCode = () => `const reverb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const filter = new Tone.Filter(1000, "highpass").connect(reverb);
const noise = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.1, decay: 0.3, sustain: 0.4, release: 0.8 }
}).connect(filter);
noise.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
const membrane = new Tone.MembraneSynth({
    pitchDecay: 0.01, octaves: 1,
    envelope: { attack: 0.001, decay: 0.1, release: 0.1 }
}).toDestination();
membrane.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
const now = Tone.now();
noise.triggerAttackRelease("4n", now);`;
            return { getCode };
        }
    });

    // --- NEW SOUNDS ---
    soundBlueprints.set('Robot Voice', {
        defaultParams: { volume: 0.8, pitch: 4, distortion: 0.1, reverb: 0.5, synthType: 'sawtooth' },
        create: (params) => {
            const getCode = () => `const dist = new Tone.Distortion(${params.distortion.toFixed(2)}).toDestination();
const verb = new Tone.Reverb(${params.reverb.toFixed(2)}).connect(dist);
const synth = new Tone.Synth({
    oscillator: { type: '${params.synthType}' },
    envelope: { attack: 0.05, decay: 0.2, sustain: 0.3, release: 0.5 }
}).connect(verb);
synth.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
synth.triggerAttackRelease("C${params.pitch}", '0.3');
setTimeout(() => synth.triggerAttackRelease("G${params.pitch - 1}", '0.2'), 200);`;
            return { getCode };
        }
    });

    soundBlueprints.set('Shield Recharge', {
        defaultParams: { volume: 0.7, pitch: 3, distortion: 0.0, reverb: 1.0, synthType: 'sine' },
        isSustained: true,
        create: (params) => {
            const getCode = () => `const verb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const oscillator = new Tone.Oscillator({
    type: '${params.synthType}',
    frequency: ${100 * params.pitch},
    volume: ${Tone.gainToDb(params.volume).toFixed(2)}
}).connect(verb);
const lfo = new Tone.LFO('4n', ${100 * (params.pitch/2)}, ${500 * (params.pitch/2)}).connect(oscillator.frequency);
oscillator.start();
lfo.start();
`;
            return { getCode, isSustained: true };
        }
    });


    soundBlueprints.set('Energy Burst', {
        defaultParams: { volume: 0.8, pitch: 4, distortion: 0.4, reverb: 0.5, synthType: 'sine' },
        create: (params) => {
            const getCode = () => `const verb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const dist = new Tone.Distortion(${params.distortion.toFixed(2)}).connect(verb);
const noise = new Tone.Noise('white').connect(dist);
noise.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
noise.start();
setTimeout(() => noise.stop(), 300);
const synth = new Tone.PolySynth(Tone.Synth, { oscillator: {type: '${params.synthType}'}}).connect(dist);
synth.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
synth.triggerAttackRelease(["C${params.pitch}", "G${params.pitch}"], '0.2');`;
            return { getCode };
        }
    });
    
    soundBlueprints.set('Plasma Rifle', {
        defaultParams: { volume: 0.8, pitch: 3, distortion: 0.2, reverb: 0.3, synthType: 'pulse' },
        create: (params) => {
            const getCode = () => `const verb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const dist = new Tone.Distortion(${params.distortion.toFixed(2)}).connect(verb);
const noiseFilter = new Tone.Filter(2000, 'highpass').connect(dist);
const noise = new Tone.Noise('pink').connect(noiseFilter);
noise.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
noise.start();
setTimeout(() => noise.stop(), 400);
const synth = new Tone.Synth({
    oscillator: { type: '${params.synthType}' },
    envelope: { attack: 0, decay: 0.1, sustain: 0, release: 0.2 }
}).connect(dist);
synth.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
synth.triggerAttackRelease("A${params.pitch}", '0.3');
setTimeout(() => synth.triggerAttackRelease("C${params.pitch+2}", '0.1'), 100);`;
            return { getCode };
        }
    });

    soundBlueprints.set('Scanner Sweep', {
        defaultParams: { volume: 0.8, pitch: 4, distortion: 0.0, reverb: 0.2, synthType: 'sine' },
        create: (params) => {
            const getCode = () => `const verb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const oscillator = new Tone.Oscillator({
    frequency: ${100 * params.pitch},
    type: '${params.synthType}'
}).connect(verb);
oscillator.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
const now = Tone.now();
oscillator.frequency.linearRampTo(${500 * params.pitch}, now + 0.5);
oscillator.frequency.linearRampTo(${100 * params.pitch}, now + 1);
oscillator.start(now);
oscillator.stop(now + 1);`;
            return { getCode };
        }
    });

    soundBlueprints.set('Error Beep', {
        defaultParams: { volume: 0.8, pitch: 4, distortion: 0, reverb: 0.4, synthType: 'triangle' },
        create: (params) => {
            const getCode = () => `const verb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const dist = new Tone.Distortion(${params.distortion.toFixed(2)}).connect(verb);
const synth = new Tone.PolySynth(Tone.AMSynth, { oscillator: {type: '${params.synthType}'}}).connect(dist);
synth.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
synth.triggerAttackRelease(["D#${params.pitch}", "G${params.pitch}"], '0.5');
setTimeout(() => synth.triggerAttackRelease(["F${params.pitch-1}", "B${params.pitch-1}"], '0.3'), 300);`;
            return { getCode };
        }
    });
    
    soundBlueprints.set('Wind', {
        defaultParams: { volume: 0.8, pitch: 1, distortion: 0.0, reverb: 2.0, synthType: 'sine' }, // Pitch won't do much here
        isSustained: true,
        create: (params) => {
            const getCode = () => `const verb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const filter = new Tone.Filter(120, "lowpass").connect(verb);
const wind = new Tone.NoiseSynth({
    noise: { type: "brown" },
    envelope: { attack: 4, decay: 2, sustain: 0.8, release: 10 }
}).connect(filter);
wind.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
wind.triggerAttack();
`;
            return { getCode, isSustained: true };
        }
    });

    soundBlueprints.set('Ion Cannon Charge', {
        defaultParams: { volume: 0.9, pitch: 2, distortion: 0.1, reverb: 2.5, synthType: 'sawtooth' },
        create: (params) => {
            const getCode = () => `const verb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const dist = new Tone.Distortion(${params.distortion.toFixed(2)}).connect(verb);
const filter = new Tone.Filter({ frequency: 200, type: "lowpass" }).connect(dist);
const synth = new Tone.MonoSynth({
    oscillator: { type: '${params.synthType}' },
    envelope: { attack: 2, decay: 0.1, sustain: 0.9, release: 0.5 }
}).connect(filter);
synth.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
const now = Tone.now();
filter.frequency.rampTo(${2500 * (params.pitch/2)}, 2, now);
synth.triggerAttackRelease("C${params.pitch}", "2n", now);`;
            return { getCode };
        }
    });

    soundBlueprints.set('Mech Footstep', {
        defaultParams: { volume: 0.9, pitch: 1, distortion: 0.1, reverb: 1.0, synthType: 'sine' },
        create: (params) => {
            const getCode = () => `const verb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const dist = new Tone.Distortion(${params.distortion.toFixed(2)}).connect(verb);
const synth = new Tone.MembraneSynth({
    pitchDecay: 0.05, octaves: 2, oscillator: { type: '${params.synthType}' },
    envelope: { attack: 0.001, decay: 0.4, sustain: 0, release: 0.5 }
}).connect(dist);
synth.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
const metalSynth = new Tone.MetalSynth({
    frequency: 100, envelope: { attack: 0.001, decay: 0.1, release: 0.2 },
    harmonicity: 5.1, modulationIndex: 32
}).connect(dist);
metalSynth.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
synth.triggerAttackRelease("C${params.pitch}", "8n");
setTimeout(() => metalSynth.triggerAttackRelease("16n"), 50);`;
            return { getCode };
        }
    });




    soundBlueprints.set('Crystal', {
        defaultParams: { volume: 0.8, pitch: 5, distortion: 0.0, reverb: 1.5, synthType: 'sine' },
        create: (params) => {
            const getCode = () => `const verb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const crystal = new Tone.FMSynth({
    modulationIndex: 12,
    harmonicity: 2.5,
    modulation: { type: "sine" },
    oscillator: { type: "${params.synthType}" }
}).connect(verb);
crystal.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
crystal.triggerAttackRelease("G${params.pitch}", "4n");`;
            return { getCode };
        }
    });

    soundBlueprints.set('Impact 2', {
        defaultParams: { volume: 0.8, pitch: 3, distortion: 0.1, reverb: 0.2, synthType: 'sine' },
        create: (params) => {
            const getCode = () => `const verb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const dist = new Tone.Distortion(${params.distortion.toFixed(2)}).connect(verb);
const servo = new Tone.MetalSynth({
    frequency: ${120 * Math.pow(2, params.pitch - 3)},
    envelope: { attack: 0.001, decay: 0.1, release: 0.2 },
    harmonicity: 8.5,
    modulationIndex: 40,
    resonance: 600,
    octaves: 1.5
}).connect(dist);
servo.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
servo.triggerAttackRelease("16n");`;
            return { getCode };
        }
    });

    soundBlueprints.set('Data Stream', {
        defaultParams: { volume: 0.7, pitch: 5, distortion: 0, reverb: 0.5, synthType: 'square' },
        isSustained: true,
        create: (params) => {
            const getCode = () => `const verb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const dataStream = new Tone.Synth({
    oscillator: { type: "${params.synthType}" }
}).connect(verb);
dataStream.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
const p = ${params.pitch};
const dataSeq = new Tone.Sequence((time, note) => {
    dataStream.triggerAttackRelease(note, "16n", time);
}, [\`C\${p}\`, \`E\${p}\`, \`G\${p}\`, \`B\${p}\`], "16n").start(0);
Tone.Transport.start();
`;
            return { getCode, isSustained: true };
        }
    });

     soundBlueprints.set('Plasma Core', {
        defaultParams: { volume: 0.9, pitch: 4, distortion: 0.1, reverb: 0.8, synthType: 'sawtooth' },
        create: (params) => {
            const getCode = () => `const verb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const dist = new Tone.Distortion(${params.distortion.toFixed(2)}).connect(verb);
const plasmaCore = new Tone.Synth({
    oscillator: { type: "${params.synthType}" },
    envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 }
}).connect(dist);
plasmaCore.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
const plasmaTail = new Tone.NoiseSynth({
    envelope: { attack: 0.01, decay: 0.4, sustain: 0, release: 0.1 }
}).chain(new Tone.Filter(1200, "bandpass"), dist);
plasmaTail.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
plasmaCore.triggerAttackRelease("G${params.pitch}", "16n");
plasmaTail.triggerAttackRelease("8n");`;
            return { getCode };
        }
    });

    soundBlueprints.set('Impact 3', {
        defaultParams: { volume: 0.9, pitch: 4, distortion: 0.0, reverb: 1.5, synthType: 'sine' },
        create: (params) => {
            const getCode = () => `const verb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const impact = new Tone.MembraneSynth({
    pitchDecay: 0.1,
    octaves: 8,
    envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.1 }
}).connect(verb);
impact.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
impact.triggerAttackRelease("A${params.pitch}", "32n");`;
            return { getCode };
        }
    });

    
    soundBlueprints.set('Cloak Engage', {
        defaultParams: { volume: 0.8, pitch: 5, distortion: 0.1, reverb: 0.35, synthType: 'sawtooth' },
        create: (params) => {
            const getCode = () => `const verb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const dist = new Tone.Distortion(${params.distortion.toFixed(2)}).connect(verb);
const lp = new Tone.Filter({ type: "lowpass", frequency: 8000, Q: 1 }).connect(dist);
const vib = new Tone.Vibrato(7, 0.07).connect(lp);
const duo = new Tone.DuoSynth({
    harmonicity: 1.5,
    voice0: { oscillator: { type: "${params.synthType}" }, envelope: { attack: 0.01, decay: 0.3, sustain: 0.2, release: 0.6 } },
    voice1: { oscillator: { type: "pulse" }, envelope: { attack: 0.01, decay: 0.3, sustain: 0.2, release: 0.6 } }
}).connect(vib);
duo.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
const now = Tone.now();
duo.triggerAttack("G${params.pitch}", now);
duo.frequency.rampTo("G${params.pitch - 3}", 0.7);
lp.frequency.rampTo(1000, 0.7);
duo.triggerRelease(now + 0.7);`;
            return { getCode };
        }
    });

    soundBlueprints.set('Time Ripple', {
        defaultParams: { volume: 0.8, pitch: 4, distortion: 0, reverb: 0.3, synthType: 'sine' },
        create: (params) => {
            const getCode = () => `const verb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const phaser = new Tone.Phaser({ frequency: 0.7, octaves: 3, baseFrequency: 300 }).connect(verb);
const ps = new Tone.PitchShift({ pitch: -5, windowSize: 0.08, delayTime: 0.02, wet: 0.5 }).connect(phaser);
const sin = new Tone.Synth({ oscillator: { type: "${params.synthType}" }, envelope: { attack: 0.03, decay: 0.4, sustain: 0.0, release: 0.8 } }).connect(ps);
sin.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
const now = Tone.now();
const p = ${params.pitch};
sin.triggerAttackRelease(\`A\${p}\`, "8n", now);
sin.triggerAttackRelease(\`E\${p}\`, "8n", now + 0.25);
sin.triggerAttackRelease(\`A\${p-1}\`, "4n", now + 0.5);`;
            return { getCode };
        }
    });

    soundBlueprints.set('Hologram Materialize', {
        defaultParams: { volume: 0.8, pitch: 4, distortion: 0.1, reverb: 0.35, synthType: 'sine' },
        create: (params) => {
            const getCode = () => `const verb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const autoPan = new Tone.AutoPanner({ frequency: 3, depth: 0.7 }).start().connect(verb);
const metal = new Tone.MetalSynth({
    frequency: 300,
    envelope: { attack: 0.02, decay: 1.0, release: 0.2 },
    harmonicity: 3.1,
    modulationIndex: 18,
    resonance: 4000,
    octaves: 2.5
}).connect(autoPan);
metal.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
const now = Tone.now();
metal.triggerAttack(now);
metal.frequency.rampTo(${300 * Math.pow(2, params.pitch - 3)}, 0.5);`;
            return { getCode };
        }
    });
    
    soundBlueprints.set('Falling object', {
        defaultParams: { volume: 0.8, pitch: 5, distortion: 0, reverb: 0.35, synthType: 'sine' },
        create: (params) => {
            const getCode = () => `const verb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const delay = new Tone.PingPongDelay("4n", 0.4).connect(verb);
const sine = new Tone.Synth({
    oscillator: { type: "${params.synthType}" },
    envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.1 }
}).connect(delay);
sine.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
const now = Tone.now();
sine.triggerAttackRelease("A${params.pitch}", "16n", now);`;
            return { getCode };
        }
    });

    soundBlueprints.set('Stasis Field Toggle', {
        defaultParams: { volume: 0.9, pitch: 2, distortion: 0.1, reverb: 0.3, synthType: 'triangle' },
        create: (params) => {
            const getCode = () => `const verb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const hp = new Tone.Filter({ type: "highpass", frequency: 40 }).connect(verb);
const mem = new Tone.MembraneSynth({ pitchDecay: 0.02, octaves: 3, envelope: { attack: 0.001, decay: 0.3, sustain: 0.0, release: 0.2 } }).connect(hp);
mem.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
const rev = new Tone.Synth({ oscillator: { type: "${params.synthType}" }, envelope: { attack: 0.4, decay: 0.1, sustain: 0.0, release: 0.0 } }).connect(hp);
rev.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
const now = Tone.now();
mem.triggerAttackRelease("C${params.pitch}", "16n", now);
rev.triggerAttackRelease("C${params.pitch + 3}", "8n", now);`;
            return { getCode };
        }
    });

    soundBlueprints.set('Wormhole Open', {
        defaultParams: { volume: 0.8, pitch: 2, distortion: 0.1, reverb: 0.4, synthType: 'sine' },
        create: (params) => {
            const getCode = () => `const verb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const pan = new Tone.AutoPanner({ frequency: 1.2, depth: 0.9 }).start().connect(verb);
const ph = new Tone.Phaser({ frequency: 0.5, octaves: 4, baseFrequency: 200 }).connect(pan);
const fm = new Tone.FMSynth({ modulationIndex: 16, envelope: { attack: 0.05, decay: 1.0, sustain: 0.0, release: 0.4 }, oscillator: { type: "${params.synthType}" } }).connect(ph);
fm.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
const now = Tone.now();
fm.triggerAttack("G${params.pitch}", now);
fm.frequency.rampTo("G${params.pitch + 3}", 1.2);
fm.triggerRelease(now + 1.25);`;
            return { getCode };
        }
    });

    soundBlueprints.set('Teleport In', {
        defaultParams: { volume: 0.8, pitch: 5, distortion: 0.0, reverb: 0.35, synthType: 'sine' },
        create: (params) => {
            const getCode = () => `const verb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const shimmer = new Tone.PitchShift({ pitch: +7, wet: 0.5 }).connect(verb);
const ps = new Tone.PluckSynth({ attackNoise: 1.0, dampening: 5200, resonance: 0.96 }).connect(shimmer);
ps.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
const now = Tone.now();
const p = ${params.pitch};
ps.triggerAttackRelease(\`B\${p-1}\`, "16n", now);
ps.triggerAttackRelease(\`E\${p}\`, "16n", now + 0.08);
ps.triggerAttackRelease(\`B\${p}\`, "8n", now + 0.16);`;
            return { getCode };
        }
    });

    soundBlueprints.set('Notification 4', {
        defaultParams: { volume: 0.8, pitch: 5, distortion: 0, reverb: 0.15, synthType: 'sine' },
        create: (params) => {
            const getCode = () => `const verb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const pan = new Tone.AutoPanner({ frequency: 2.5, depth: 0.7 }).start().connect(verb);
const fm = new Tone.FMSynth({ modulationIndex: 10, envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.05 }, oscillator: {type: "${params.synthType}"} }).connect(pan);
fm.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
const now = Tone.now();
for (let i = 0; i < 4; i++) {
    const t = now + i * 0.12;
    const freq = (100 * ${params.pitch}) + i * 100;
    fm.triggerAttackRelease(freq, "32n", t);
}`;
            return { getCode };
        }
    });

    soundBlueprints.set('Knock Knock', {
        defaultParams: { volume: 0.9, pitch: 3, distortion: 0.1, reverb: 0.2, synthType: 'sine' },
        create: (params) => {
            const getCode = () => `const verb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const comp = new Tone.Compressor({ threshold: -24, ratio: 5 }).connect(verb);
const sine = new Tone.Synth({ oscillator: { type: "${params.synthType}" }, envelope: { attack: 0.005, decay: 0.4, sustain: 0.0, release: 0.1 } }).connect(comp);
sine.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
const now = Tone.now();
sine.triggerAttackRelease("C${params.pitch}", "8n", now);
sine.triggerAttackRelease("C${params.pitch}", "8n", now + 0.35);`;
            return { getCode };
        }
    });
	
	
    soundBlueprints.set('Bubble', {
        defaultParams: { volume: 0.8, pitch: 4, distortion: 0, reverb: 0.1, synthType: 'sine' },
        create: (params) => {
            const getCode = () => `const reverb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const synth = new Tone.Synth({
    oscillator: { type: '${params.synthType}' },
    envelope: { attack: 0.01, decay: 0.1, sustain: 0.05, release: 0.2 }
}).connect(reverb);
synth.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
const now = Tone.now();
const freq = Tone.Frequency(\`C\${params.pitch}\`).toFrequency();
synth.triggerAttack(freq, now);
synth.frequency.exponentialRampTo(freq * 1.5, 0.05, now);
synth.triggerRelease(now + 0.1);`;
            return { getCode };
        }
    });
	
   
    soundBlueprints.set('Laser Blast', {
        defaultParams: { volume: 0.8, pitch: 5, distortion: 0.2, reverb: 0.2, synthType: 'triangle' },
        create: (params) => {
            // Pre-calculate the frequency values here, where `params` is in scope.
            const highPitchFreq = Tone.Frequency(`C${params.pitch}`).toFrequency();
            const lowPitchFreq = Tone.Frequency(`A${params.pitch - 2}`).toFrequency();

            const getCode = () => `// A classic laser "pew" sound using a fast pitch drop.
const verb = new Tone.Reverb(0.42).toDestination();
const dist = new Tone.Distortion(0.29).connect(verb);

// The main "pew" sound with a pitch envelope.
const laserSynth = new Tone.Synth({
    oscillator: { type: 'sawtooth' },
    envelope: { attack: 0.001, decay: 0.1, sustain: 0.1, release: 0.2 }
}).connect(dist);
laserSynth.volume.value = -1.94;


const now = Tone.now();

// Trigger the sound using the pre-calculated frequency values.
laserSynth.triggerAttack(523.2511306011972, now);
laserSynth.frequency.exponentialRampTo(220, 0.15, now);
laserSynth.triggerRelease(now + 0.2);`;
            return { getCode };
        }
    });

    soundBlueprints.set('Comm Static', {
        defaultParams: { volume: 0.6, pitch: 4, distortion: 0, reverb: 0.1, synthType: 'sine' },
        isSustained: true,
        create: (params) => {
            const getCode = () => `const verb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const filter = new Tone.AutoFilter({
    frequency: 4,
    depth: 0.8
}).connect(verb).start();
const noise = new Tone.Noise("white").connect(filter);
noise.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
noise.start();
`;
            return { getCode, isSustained: true };
        }
    });

    soundBlueprints.set('Notification 3', {
        defaultParams: { volume: 0.9, pitch: 2, distortion: 0.1, reverb: 0.5, synthType: 'sine' },
        create: (params) => {
            const getCode = () => `const reverb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const dist = new Tone.Distortion(${params.distortion.toFixed(2)}).connect(reverb);
const synth = new Tone.FMSynth({
    harmonicity: 5,
    modulationIndex: 10,
    envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.2 },
    oscillator: {type: "${params.synthType}"}
}).connect(dist);
synth.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
const p = ${params.pitch};
synth.triggerAttackRelease(\`A\${p}\`, "16n");
setTimeout(() => synth.triggerAttackRelease(\`E\${p}\`, "16n"), 50);`;
            return { getCode };
        }
    });

    soundBlueprints.set('Alarm Klaxon', {
        defaultParams: { volume: 0.8, pitch: 4, distortion: 0.1, reverb: 0.8, synthType: 'square' },
        isSustained: true,
        create: (params) => {
            const getCode = () => `const verb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const synth = new Tone.Synth({
    oscillator: { type: "${params.synthType}" },
    envelope: { attack: 0.01, decay: 0.1, sustain: 0.9, release: 0.01 }
}).connect(verb);
synth.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
const p = ${params.pitch};
const loop = new Tone.Loop(time => {
    synth.triggerAttackRelease(\`C\${p}\`, '8n', time);
    synth.triggerAttackRelease(\`G\${p-1}\`, '8n', time + 0.2);
}, 0.4).start(0);
Tone.Transport.start();
`;
            return { getCode, isSustained: true };
        }
    });

    soundBlueprints.set('Data Download', {
        defaultParams: { volume: 0.7, pitch: 6, distortion: 0, reverb: 0.2, synthType: 'square' },
        create: (params) => {
            const getCode = () => `const verb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const synth = new Tone.Synth({
    oscillator: { type: "${params.synthType}" },
    envelope: { attack: 0.001, decay: 0.01, sustain: 0.5, release: 0.001 }
}).connect(verb);
synth.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
for (let i = 0; i < 20; i++) {
    setTimeout(() => {
        const freq = (100 * ${params.pitch}) + Math.random() * 1200;
        synth.triggerAttackRelease(freq, "32n");
    }, i * 30);
}`;
            return { getCode };
        }
    });

    soundBlueprints.set('Quantum Glitch', {
        defaultParams: { volume: 0.8, pitch: 4, distortion: 0.2, reverb: 0.3, synthType: 'sine' },
        create: (params) => {
            const getCode = () => `const verb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const bitCrusher = new Tone.BitCrusher(4).connect(verb);
const synth = new Tone.PolySynth(Tone.Synth, {oscillator: {type: "${params.synthType}"}}).connect(bitCrusher);
synth.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
const p = ${params.pitch};
const notes = [\`C\${p}\`, \`E\${p}\`, \`G#\${p}\`, \`B\${p}\`, \`D#\${p+1}\`];
notes.forEach((note, i) => {
    setTimeout(() => {
        synth.triggerAttackRelease(note, "32n");
    }, i * 50);
});`;
            return { getCode };
        }
    });

    soundBlueprints.set('Portal Open', {
        defaultParams: { volume: 0.8, pitch: 2, distortion: 0.1, reverb: 2.0, synthType: 'sine' },
        create: (params) => {
            const getCode = () => `const reverb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const synth = new Tone.DuoSynth({
    vibratoAmount: 0.5,
    vibratoRate: 5,
    voice0: {
        oscillator: { type: "${params.synthType}" },
        envelope: { attack: 0.5, decay: 0.2, sustain: 0.8, release: 1 }
    },
    voice1: {
        oscillator: { type: "triangle" },
        envelope: { attack: 0.8, decay: 0.2, sustain: 0.9, release: 1.2 }
    }
}).connect(reverb);
synth.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
synth.triggerAttackRelease("E${params.pitch}", "2n");
synth.frequency.rampTo("E${params.pitch + 1}", 1.5);`;
            return { getCode };
        }
    });

    soundBlueprints.set('Cyber Glitch', {
        defaultParams: { volume: 0.8, pitch: 4, distortion: 0.8, reverb: 0.2, synthType: 'square' },
        create: (params) => {
            const getCode = () => `const verb = new Tone.Reverb(${params.reverb.toFixed(2)}).toDestination();
const distortion = new Tone.Distortion(${params.distortion.toFixed(2)}).connect(verb);
const synth = new Tone.Synth({
    oscillator: { type: "${params.synthType}" }
}).connect(distortion);
synth.volume.value = ${Tone.gainToDb(params.volume).toFixed(2)};
const baseFreq = 50 * ${params.pitch};
for (let i = 0; i < 8; i++) {
    setTimeout(() => {
        const freq = [baseFreq*4, baseFreq*8, baseFreq*2, baseFreq*16, baseFreq, baseFreq*32, baseFreq*3, baseFreq*6][i];
        synth.triggerAttackRelease(freq, "64n");
    }, i * 40);
}`;
            return { getCode };
        }
    });

    // --- PUBLIC API ---
    return {
        init: async () => {
            if (Tone.context.state !== 'running') {
                await Tone.start();
                console.log("Audio Context is ready!");
            }
        },
        getSoundNames: () => Array.from(soundBlueprints.keys()).sort(),
        getDefaults: (name) => {
            if (soundBlueprints.has(name)) {
                return soundBlueprints.get(name).defaultParams;
            }
            return null;
        },
        create: (name, params) => {
            if (soundBlueprints.has(name)) {
                return soundBlueprints.get(name).create(params);
            }
            return null;
        }
    };
})();
