// Context help for each control, written from the MiniNova User Guide v1.01.
// Each entry is [guide page, text]. Control ids are looked up with their numbers
// replaced by "N" (e.g. "osc-2-wave" -> "osc-N-wave").

// Served from public/docs, so help links work offline and without a third-party server.
// Original: https://downloads.novationmusic.com/novation/synthesisers/mininova
export const GUIDE_URL = `${import.meta.env.BASE_URL}docs/mininova-user-guide-v1.01-en.pdf`;

export const guideLink = page => `${GUIDE_URL}#page=${page}`;

const SYNC = 'Values are note lengths relative to the tempo (T = triplet, D = dotted).';

const help = {
  'tempo': [14, 'Master tempo in BPM, used by everything that syncs to the clock: arpeggiator, gator, delay, chorus, pan and LFO sync. Read-only here: it follows the TEMPO knob or an external MIDI clock.'],

  // Patch and voice
  'patch-category': [9, 'Type of the patch, used by the TYPE/GENRE knob to browse patches and when saving. Doesn\'t change the sound.'],
  'patch-genre': [9, 'Musical genre of the patch, used by the TYPE/GENRE knob to browse patches and when saving. Doesn\'t change the sound.'],
  'voice-polyphony-mode': [21, 'Mono plays one note at a time (last note wins). Mono AG only glides when notes are played legato. Mono 2 re-triggers the envelopes on every key. Poly 1 stacks repeated notes on new voices (louder with long releases); Poly 2 reuses the same voices.'],
  'voice-unison': [20, 'Extra voices played for each note, to thicken the sound. Each one reduces polyphony: with 4, a four-note chord nearly reaches the 18-voice limit.'],
  'voice-unison-detune': [20, 'How much the unison voices are detuned from each other. Only has an effect when Unison is on, from the next note played.'],
  'voice-portamento-rate': [20, 'Glide time from one note to the next: 0 = off, 115 ≈ 1 second. Best in a mono mode; unpredictable with chords. Pre-Glide must be 0 for it to work.'],
  'voice-portamento-mode': [20, 'Shape of the glide: Expo moves fast at first then slows down near the note; Linear moves evenly.'],
  'voice-pre-glide': [21, 'Each note starts up to an octave above (+12) or below (-12) and glides to its pitch, using the Portamento Time. Unlike portamento, it works well with chords.'],
  'voice-keyboard-octave': [9, 'Shifts the keyboard by up to 4 octaves, like the OCTAVE buttons.'],

  // Oscillators
  'osc-N-wave': [16, 'The oscillator\'s waveform: classic analogue shapes (sine, triangle, sawtooth, square, PW and saw/pulse mixes), sampled digital waveforms (basses, electric pianos, clavinet, double reed, string machines, organs, FM and digital bells, digital pad), 36 wavetables or the audio inputs. Each wavetable holds 9 waveforms: Pulse Width / Wave Table index picks one, and modulating it (Mod Matrix destination ON PW/Idx) sweeps through them for evolving timbres. With an audio input selected, the other oscillator parameters have no effect and a key must be held to hear the input.'],
  'osc-N-wtint': [16, 'How smoothly a wavetable moves between its neighbouring waveforms. 127 blends them smoothly; 0 makes each step abrupt. Matters most when the wavetable index is modulated.'],
  'osc-N-pwwti': [16, 'Two jobs depending on the waveform. For pulse waveforms it sets the pulse width (centre = square wave, extremes = thin and metallic). For a wavetable it picks which of its 9 waveforms plays, in steps of about 14 values.'],
  'osc-N-vsync': [15, 'Virtual oscillator sync: a hidden oscillator retriggers this one to add harmonics. Multiples of 16 land on musical harmonics; values in between are more discordant. Great when swept by an LFO.'],
  'osc-N-hardness': [16, 'Reduces the upper harmonics as the value goes down, like a low-pass filter inside the oscillator. Has no effect on a sine wave.'],
  'osc-N-density': [16, 'Stacks up to eight extra copies of the waveform for a thicker sound, without using extra voices. Combine with Density Detune.'],
  'osc-N-densitydetune': [16, 'Detunes the Density copies against each other, adding movement and beating. Only has an effect when Density is above 0.'],
  'osc-N-semitones': [15, 'Coarse tuning of this oscillator in semitones (64 = no change, 76 = one octave up). Only this oscillator moves, unlike keyboard transpose.'],
  'osc-N-cents': [15, 'Fine tuning in cents (1/100 of a semitone). 64 = in tune. Slight detune between oscillators gives a fuller, beating sound.'],
  'osc-N-pitch': [16, 'Pitch wheel range for this oscillator, in semitones (64 = wheel off, 76 = ±1 octave, 66 = ±1 tone). Values below 64 reverse the wheel.'],
  'osc-vibrato-depth': [16, 'Maximum vibrato depth, reached with the mod wheel fully up. Affects all oscillators and needs no LFO.'],
  'osc-vibrato-speed': [17, 'Speed of the mod-wheel vibrato, from slow (0) to very fast (127).'],
  'osc-drift': [17, 'Adds a small, controlled detuning between the oscillators, like an old analogue synth that never stays perfectly in tune.'],
  'osc-phase': [17, 'Where in its cycle each oscillator starts when a key is pressed, in 3° steps (0 = 0°, 119 = 357°). 0° starts them all in step; other values add a click or edge to the attack. 120 = Free, not tied to the key press.'],
  'osc-fixed-note': [17, 'Plays every key at one fixed pitch. Useful for drums and sound effects. Off = normal keyboard.'],

  // Mixer
  'osc-N-level': [17, 'How much of this oscillator goes into the mixer. When several sources are used, keep each around 64 to avoid internal clipping.'],
  'ring-mod-level-N-N': [17, 'Level of a ring modulator in the mix. A ring modulator multiplies two oscillators (Osc 1 or 2 with Osc 3), giving metallic, bell-like sum and difference tones. Try Osc 3 tuned +5, +7 or +12 semitones above.'],
  'noise-level': [17, 'Level of the noise generator in the mix. Turn the oscillators down to hear it alone.'],
  'noise-type': [17, 'Character of the noise: White (full-range hiss) or filtered versions (High, Band, HiBand).'],
  'pre-fx-level': [17, 'Level sent from the mixer into the FX section, even if every FX slot is bypassed. Raise carefully: too much clips the effects.'],
  'fx-wet-level': [28, 'Dry/wet mix of the FX section: how much of the effects\' output, rather than the unprocessed sound, reaches the output.'],
  'post-fx-level': [17, 'Level returned from the FX section. Set up the effects first, then raise this and Pre FX Level carefully.'],

  // Filters
  'filter-routing': [19, 'How the two filters are connected. Bypass: no filter. Single: Filter 1 only. Series: Filter 1 feeds Filter 2. Parallel: both get the same input. Parallel 2: Filter 1 gets Osc 3 + noise, Filter 2 the rest. Drum: like Parallel 2, with Filter 1 also feeding Filter 2.'],
  'filter-balance': [18, 'Mix between the two filters when both are used. -64 = Filter 1 only, 0 = equal, +63 = Filter 2 only.'],
  'filter-freqlink': [20, 'When On, Filter 2\'s frequency follows Filter 1, and Filter 2\'s Frequency becomes an offset from it.'],
  'filter-reslink': [20, 'When On, both filters share the same resonance value.'],
  'filter-N-drive': [18, 'Amount of distortion added just before the filter. The filter frequency therefore shapes how much drive you hear.'],
  'filter-N-drive-type': [18, 'Character of the filter drive: Diode, Valve, Clipper, XOver, Rectify, BitsDown (lower bit depth) or RateDown (lower sample rate).'],
  'filter-N-type': [39, 'LP = low-pass (keeps the lows, darker), HP = high-pass (removes the lows, thinner), BP = band-pass (keeps a band around the frequency, nasal or vocal). The number is the slope in dB/octave: 6 is gentle, 24 is steep. LP6NoRes and HP6NoRes have no resonance. Asymmetric band-passes like BP6/\\12 have a different slope on each side (high-pass side / low-pass side).'],
  'filter-N-track': [18, 'How much the cut-off follows the notes played. 127 = moves 1:1 with pitch (an octave higher note opens the filter an octave); 0 = fixed whatever you play.'],
  'filter-N-resonance': [18, 'Boosts a narrow band around the cut-off frequency, making filter sweeps more pronounced and edgy.'],
  'filter-N-frequency': [18, 'Cut-off frequency (centre frequency for band-pass types). Sweeping it is the classic "hard to soft" synth gesture.'],
  'filter-N-qnormalize': [18, 'Changes the width of the resonance peak, to emulate the response of various classic filters. Has no effect when Resonance is 0.'],
  'filter-N-env2-to-freq': [18, 'How much, and in which direction, Envelope 2 (the filter envelope) sweeps this filter\'s frequency. Positive and negative values sweep in opposite directions.'],

  // Envelopes
  'env-N-attack': [21, 'Time to rise from zero to full level when a key is pressed. 0 = instant, 64 ≈ 250 ms, 127 = over 20 seconds.'],
  'env-N-decay': [21, 'Time to fall from full level to the Sustain level. Only audible when Sustain is below 127.'],
  'env-N-sustain': [21, 'Level held while the key stays down, after attack and decay. Low values give short, percussive sounds.'],
  'env-N-release': [22, 'Time to fade to zero after the key is released. 64 ≈ 360 ms, 127 = over 20 seconds. Long releases can cause voice stealing.'],
  'env-N-trigger': [22, 'Multi re-triggers the full envelope on every note. Single (legato) only triggers it on the first of overlapping notes; needs a mono voice mode.'],
  'env-N-velocity': [22, 'Adds touch sensitivity: with positive values, playing harder gives more effect. 0 = same whatever the velocity; negative values invert it. About +40 feels natural for volume.'],
  'env-N-sustain-rate': [22, 'Makes the sustain level rise (positive) or fall (negative) while the key is held. Flat (centre) keeps it constant. Small values are usually more useful.'],
  'env-N-sustain-time': [23, 'How long the sustain phase lasts while the key is held. The maximum (KeyOff) sustains until release; lower values cut the note automatically.'],
  'env-N-ad-repeats': [22, 'Repeats the attack and decay phases before sustain, for a stuttering start. 0 = no repeats; the maximum repeats as long as the key is held.'],
  'env-N-attack-track': [22, 'Links attack time to the note\'s position on the keyboard. Positive values shorten the attack on higher notes, like a real stringed instrument.'],
  'env-N-decay-track': [22, 'Like Attack Track, but for the decay time.'],
  'env-track-centre': [23, 'Reference note of the Level Track settings, shared by all envelopes: notes above it get a stronger envelope with a positive Level Track, notes below a weaker one. C3 = middle C.'],
  'env-N-level-track': [23, 'Makes the envelope stronger for notes above the Level Track Note and weaker below it (or the reverse with negative values). Use sparingly.'],
  'env-N-attack-slope': [22, 'Shape of the attack: 0 = linear rise; higher values rise faster at first.'],
  'env-N-decay-slope': [22, 'Shape of the decay: 0 = linear fall; higher values fall faster at first.'],
  'env-N-anim-trigger': [22, 'Lets an Animate pad re-trigger this envelope (ReTrig), start it (Trigger) or only allow it while held (Enable). Pads must be in Animate mode.'],
  'env-N-delay': [24, 'Delays the start of the whole envelope after the key is pressed. 60–70 ≈ 1 second, 127 = 10 seconds.'],

  // LFOs
  'lfo-N-waveform': [36, 'Shape of the LFO. Sine, Triangle, Sawtooth and Square are the classic shapes. Rand S/H jumps to a random value every cycle; Time S/H jumps between minimum and maximum for random times; PianoEnv is a curved sawtooth. Seq 1–7 jump between values held for 1/16 of the cycle (step sequences); Altern 1–8 alternate between minimum and maximum for varying times. Chromat to 2511 are melodic sequences (scales, arpeggios, chord progressions): to keep them chromatic on oscillator pitch, set the Mod Matrix depth to ±30 or ±36.'],
  'lfo-N-phase-offset': [25, 'Where the waveform starts when a key is pressed, in 3° steps (0 = 0°, 119 = 357°). Only active when Key Sync is on.'],
  'lfo-N-slew-rate': [25, 'Smooths the sharp edges of the waveform, e.g. turns a square wave\'s jumps into glides.'],
  'lfo-N-delay': [26, 'Time used by the Fade Mode: how long the LFO fades or gates in or out.'],
  'lfo-N-delay-sync': [26, `Syncs the LFO delay time to the tempo. Off = use the Delay value instead. ${SYNC}`],
  'lfo-N-rate': [25, 'Speed of the LFO. 0 stops it (it then holds a fixed offset); most musical effects sit around 40–70.'],
  'lfo-N-rate-sync': [25, `Syncs the LFO speed to the tempo. Off = use the Rate value instead. ${SYNC}`],
  'lfo-N-one-shot': [26, 'When on, the LFO plays a single cycle per note instead of repeating.'],
  'lfo-N-key-sync': [25, 'KeySync restarts the LFO at the Phase Offset on every key press. Freerun lets it run in the background, so each note starts at a different point.'],
  'lfo-N-common-sync': [26, 'Keeps the LFO in phase across all notes of a chord, like early analogue polysynths.'],
  'lfo-N-delay-trigger': [26, 'Multi (re-trigger): every note gets its own delay. Single (legato): only the first of overlapping notes triggers it; needs a mono voice mode.'],
  'lfo-N-fade-mode': [26, 'What the Delay does: Fade In (modulation grows), Gate In (starts after the delay), Fade Out (modulation dies away), Gate Out (stops after the delay).'],

  // Mod matrix
  'mod-N-src-N': [36, 'A modulation source. ModWheel, Express (expression pedal), Velocity and Keyboard (key position) follow your playing; AftTouch only comes from external MIDI, the keyboard doesn\'t send it. LFO "+" only raises the destination; "+/-" moves it up and down. Envelopes 1–6 run on every key press (Env Amp and Env Filt also shape volume and filter). AudInEnv follows the level of the audio input. The two sources of a slot are multiplied: if either is at zero there is no modulation, so ModWheel × LFO gives modulation controlled by the wheel. Direct = no source.'],
  'mod-N-anim': [27, 'Makes an Animate pad part of this slot. Alone, the pad drives the destination; with sources set, the pad acts as a switch for them.'],
  'mod-N-depth': [27, 'Amount and direction of the modulation. Nothing happens at 0. With both sources Direct and no pad, Depth becomes a manual offset on the destination.'],
  'mod-N-dest': [37, 'The parameter being modulated: pitch of all or one oscillator, virtual sync, pulse width / wavetable index, hardness, mixer levels, filter drive, frequency, resonance and balance, LFO rates, Amp and Filter envelope decays, FX slot amounts, FX feedback and wet level, chorus, delay and EQ settings, pan, vocoder shift, spread and resonance, Pre FX level and VocalTune pitch shift. LFO rates and envelope decays let one modulation control another. Several slots can target the same destination; their effects add up.'],

  // Effects
  'fx-pan-position': [28, 'Places the dry sound in the stereo field (-64 left, +63 right). Stereo effects like reverb and chorus are added after it.'],
  'fx-pan-rate': [28, 'Speed of the auto-panner. Works best with Pan Position centred.'],
  'fx-pan-sync': [28, `Syncs the auto-panner speed to the tempo. ${SYNC}`],
  'fx-pan-mod-depth': [28, 'How wide the auto-panner swings. 0 turns auto-pan off; 127 = fully left to fully right.'],
  'fx-routing': [28, 'How the five FX slots are connected. R1: all five in parallel, no feedback. R2: slot 1, then slots 2–5 in parallel. R3: 1→2, then 3, 4 and 5 in parallel. R4: 1→2→3, then 4 and 5 in parallel. R5: all five in series (1→2→3→4→5). R6: 1→2, with 3, 4 and 5 in parallel from the input. R7: 1→2→3, with 4 and 5 in parallel. R8: 1→2→3→4, with 5 in parallel. Except in R1 and R2, feedback returns from the end of the series chain to slot 1. In series, order matters: chorus into reverb, distortion before delay…'],
  'fx-feedback': [28, 'Feeds the output of the series chain back into slot 1 (routings R3 to R8; R1 and R2 have no feedback). Creates resonant, metallic or ever-repeating textures; raise carefully.'],
  'fx-N-level': [29, 'Amount for this slot. Its meaning depends on the effect: level (EQ, compressor, chorus, gator), drive amount (distortion) or send/return (delay, reverb). EQ and Gator need 127 for full effect.'],
  'fx-N-select': [39, 'Which effect is loaded in this slot: EQ (3-band), Compres1–2 (compressor), Distort1–2 (overdrive), Delay1–2 (echo), Reverb1–2 (hall and room), Chorus1–4 (chorus or phaser) or Gator (rhythmic gate). Each unit can be used in only one slot at a time.'],
  'eq-bass-frequency': [29, 'Frequency below which Bass Level acts, from ~140 Hz to ~880 Hz.'],
  'eq-bass-level': [29, 'Bass cut or boost (±12 dB with the slot level at 127). 0 = flat.'],
  'eq-mid-frequency': [29, 'Centre frequency of the mid band, from 440 Hz to 2.2 kHz.'],
  'eq-mid-level': [29, 'Mid cut or boost (±12 dB). This is the voice region of the spectrum.'],
  'eq-treble-frequency': [29, 'Frequency above which Treble Level acts, from ~650 Hz to ~4.4 kHz.'],
  'eq-treble-level': [29, 'Treble cut or boost (±12 dB). 0 = flat.'],
  'compres-N-ratio': [29, 'How strongly levels above the threshold are reduced. 1.0 = no compression; 2.0 = halves any rise above the threshold.'],
  'compres-N-treshold': [29, 'Level (in dB below clipping) above which compression starts. Quieter parts are left alone.'],
  'compres-N-attack': [29, 'How fast compression reacts (0.1–100 ms). Slower attacks let the punchy start of a note through.'],
  'compres-N-release': [29, 'How long gain reduction takes to recover after the hold time (25 ms – 1 s).'],
  'compres-N-hold': [29, 'How long gain reduction stays after the signal drops below the threshold (2.5–500 ms). Too short can cause audible pumping.'],
  'compres-N-gain': [30, 'Extra make-up gain for heavily compressed sounds.'],
  'distort-N-type': [30, 'Distortion character: Diode, Valve, Clipper (digital overload), XOver (crossover), Rectify, BitsDown (lower bit depth) or RateDown (lower sample rate). Volume varies a lot between types.'],
  'distort-N-compensation': [30, 'Reduces the harshness of Diode and Valve distortion. No effect on other types.'],
  'distort-N-level': [30, 'Output level of the distortion, in dB (-12 to +18).'],
  'delay-N-time': [30, 'Echo time, up to about 700 ms. Changing it while a note plays bends the pitch.'],
  'delay-N-sync': [30, `Syncs the echo time to the tempo. Off = use the Time value instead. ${SYNC}`],
  'delay-N-feedback': [30, 'How much of the echo is fed back for more repeats. 0 = a single echo; 64 ≈ 5 or 6 echoes; maximum keeps repeating for a minute or more.'],
  'delay-N-width': [30, 'Stereo width of the echoes when the L/R ratio splits them between channels.'],
  'delay-N-lr-ratio': [30, 'How echoes are spread between left and right. 1:1 keeps them centred; other ratios put the longer echo on one side and a faster one on the other; OFF on one side keeps all echoes on the other.'],
  'delay-N-slew-rate': [30, 'Smooths changes to the delay time when it is modulated, avoiding clicks and glitches.'],
  'reverb-N-type': [31, 'The space being simulated: chamber, small or large room, small, large or great hall.'],
  'reverb-N-decay': [31, 'Reverb time: roughly the size of the room.'],
  'reverb-N-damping': [31, 'How much the high frequencies are absorbed as the reverb dies away.'],
  'chorus-N-type': [31, 'Chorus (swirling, doubled sound) or Phaser (sweeping "swish").'],
  'chorus-N-rate': [31, 'Speed of the chorus/phaser modulation. Slow rates usually sound best.'],
  'chorus-N-rate-sync': [31, `Syncs the chorus speed to the tempo. ${SYNC}`],
  'chorus-N-feedback': [31, 'Feedback inside the chorus. Phaser mode usually needs more; negative values feed back phase-reversed.'],
  'chrous-N-mod-depth': [31, 'Depth of the chorus/phaser modulation. 0 = no effect.'],
  'chorus-N-delay': [31, 'Base delay of the chorus/phaser. Most audible with high feedback or in Phaser mode.'],
  'gator-on': [31, 'Switches the Gator on or off. The Gator chops the sound rhythmically with a 16-step pattern synced to the tempo. Set its FX slot level to 127.'],
  'gator-key-sync': [31, 'KeySync restarts the pattern on every key press; Freerun lets it run in the background.'],
  'gator-key-latch': [31, 'When on, a key press keeps the gated note sounding until Latch is switched off.'],
  'gator-rate-sync': [31, `Step speed of the gator pattern, relative to the tempo. ${SYNC}`],
  'gator-mode': [39, 'How the two 16-step rows (A = steps 1–16, B = steps 17–32) are played. Mono16: row A. MonoAlt1: A then B (32 steps). MonoAlt2: A, A, B, B. Stereo16: A left and B right at once. SterAlt1: A left + B right, then A right + B left. SterAlt2: like SterAlt1, each pair repeated. Stereo modes need FX pan centred.'],
  'gator-edge-slew': [31, 'Softens the gate edges: higher values fade each step in and out instead of hard cuts.'],
  'gator-hold': [31, 'How long the gate stays open on each step, independent of tempo.'],
  'gator-lr-delay': [31, 'Adds a stereo echo to each gated step: positive values delay it on the right; negative values create a pre-echo.'],
  'gator-level-N': [31, 'Level of this step in the gator pattern (0 = silent, 7 = full). Steps 1–16 and 17–32 form the two pattern rows.'],

  // Arp
  'arp-on': [8, 'Turns the arpeggiator on: held notes are played one after another in a pattern.'],
  'arp-key-latch': [8, 'When on, the arpeggio keeps playing after you release the keys.'],
  'arp-octaves': [15, 'Number of octaves the arpeggio spans. Each extra octave repeats the pattern an octave higher.'],
  'arp-rate-sync': [14, 'Note length of each arp step, relative to the tempo.'],
  'arp-gate': [14, 'Length of each arp note. 64 = half the step; maximum = notes join without gaps.'],
  'arp-mode': [39, 'Order of the held notes: Up (from the lowest), Down (from the highest), Up Down (alternating), Up Down 2 (same, playing the lowest and highest notes twice), Played (in the order you pressed them), Random, or Chord (all held notes together, rhythmically).'],
  'arp-pattern': [15, 'Ptn Edit = your own pattern of up to 8 steps (Length and Steps below). Other patterns are fixed rhythms from the UltraNova.'],
  'arp-swing': [15, 'Shifts every other step for a swung feel. Centre (50) = straight. Ptn Edit only.'],
  'arp-length': [15, 'Number of steps in the edited pattern. Ptn Edit only.'],
  'arp-step-N': [15, 'Whether this step of the edited pattern plays a note. Ptn Edit only.'],

  // Vocoder, Chorder, VocalTune
  'vocoder-on': [33, 'Turns the vocoder on. It needs a modulator signal (mic or audio input) and notes played at the same time.'],
  'vocoder-all-max': [33, 'Normal analyses the modulator for the classic talking-robot sound. AllMax skips the analysis and opens every band: the vocoder becomes a multi-band filter effect, great with Resonance, Shift and Spread.'],
  'vocoder-input': [33, 'Modulator of the vocoder: the audio input, or the output of VocalTune.'],
  'vocoder-freeze': [33, 'Freezes the current analysis of the modulator, so the vocoder keeps that formant (e.g. a sung vowel) without singing. The frozen formant is saved with the patch.'],
  'vocoder-width': [33, 'Stereo width of the vocoder: bands alternate between left and right. 0 = mono, in the centre.'],
  'vocoder-sibilance-type': [34, 'Where sibilance comes from: HighPass filters it from the voice; Noise adds noise to simulate it.'],
  'vocoder-sibilance': [34, 'Amount of sibilance (S and T sounds) in the vocoded signal. More makes words clearer.'],
  'vocoder-spec-shift': [33, 'Shifts the carrier bands up (positive) or down (negative) against the analysis bands, changing the formants.'],
  'vocoder-spec-spread': [34, 'Stretches (positive) or shrinks (negative) the range of carrier bands against the analysis bands.'],
  'vocoder-level': [33, 'Level of the vocoded sound in the output mix. The vocoder imposes the spectrum of the mic (modulator) onto the synth sound (carrier); bright, saw-rich patches work best.'],
  'vocoder-carier-level': [33, 'Level of the plain synth sound (carrier) mixed with the vocoder output.'],
  'vocoder-modulator-level': [33, 'Level of the plain mic or input signal (modulator) mixed with the vocoder output.'],
  'vocoder-resonance': [34, 'Resonance of the vocoder bands: more gives a ringing sound, less a drier one.'],
  'vocoder-decay': [34, 'How quickly the vocoder bands close after the input drops. Short = more intelligible speech; long = more creative effects.'],
  'vocoder-gate-threshold': [34, 'Noise gate on the mic input, in dB below clipping. Raise it to stop background noise triggering the vocoder.'],
  'vocoder-gate-release': [34, 'How long the vocoder gate stays open after you stop singing.'],
  'vocoder-spectrum-level-N': [33, 'Level of this band of the vocoder spectrum. The patch format (shared with the UltraNova) stores more bands than the MiniNova\'s 12 analysis filters.'],
  'vocoder-spectrum-resample': [33, 'Resampling of the stored vocoder spectrum (patch format shared with the UltraNova). Not described in the MiniNova guide.'],
  'chorder-on': [15, 'Turns the Chorder on: each key plays a stored chord of up to 10 notes, with the key as the lowest note. The arpeggiator comes before the Chorder, so whole chords get arpeggiated.'],
  'chorder-transpose': [15, 'Shifts the chord up or down by up to 11 semitones.'],
  'chorder-count': [15, 'Number of notes in the stored chord.'],
  'chorder-key-N': [15, 'One note of the stored chord, relative to the key you play. Chords are normally recorded on the synth (Chord menu > SaveChrd).'],
  'vocal-tune-mode': [32, 'VocalTune pitch-corrects the mic input. Scale Correction snaps to a scale; KBCtrl follows the notes you hold; Pitch applies a fixed shift.'],
  'vocal-tune-insert': [32, 'Where the tuned voice enters: before the filter, after the filter (both only sound while a key is held) or straight into the FX (no key needed).'],
  'vocal-tune-scale-type': [32, 'Scale used by Scale Correction. Played = snap to the notes of the last chord played.'],
  'vocal-tune-scale-key': [32, 'Key of the correction scale (Scale Correction mode, scale other than Played).'],
  'vocal-tune-correction-time': [32, 'How fast the voice is pulled to the target pitch: 0 = slow and natural, 127 = instant robotic effect.'],
  'vocal-tune-level': [32, 'Output level of the tuned voice.'],
  'vocal-tune-vibrato': [32, 'Amount of vibrato added to the tuned voice.'],
  'vocal-tune-vibrato-mod-wheel': [32, 'Extra vibrato added with the mod wheel.'],
  'vocal-tune-vibrato-rate': [32, 'Speed of the VocalTune vibrato.'],
  'vocal-tune-shift': [32, 'Fixed pitch shift of the voice, in semitones (±24).'],
  'vocal-tune-bend': [32, 'Pitch wheel range for the voice, in semitones (±24).'],

  'tweak-N': [15, 'Which parameter this Tweak knob controls on the synth (PERFORM rows 1 and 2). Lets you put the parameters you use most under your fingers.'],
};

// Extra context for envelopes, whose role depends on their number
const envelopeRole = number => {
  if (number === 1) {
    return 'Envelope 1 is the amplitude envelope: it shapes the volume of each note.';
  }
  if (number === 2) {
    return 'Envelope 2 is the filter envelope: raise a filter\'s "Env2 To Freq" to hear it.';
  }
  return `Envelope ${number} only acts once routed in the Mod Matrix (set a slot's source to Env ${number}).`;
};

export const helpFor = id => {
  const key = id.replace(/-\d+(?=-|$)/g, '-N');
  const entry = help[key];
  if (!entry) {
    return null;
  }

  const [page, text] = entry;
  const env = id.match(/^env-(\d+)-/);
  return {
    page,
    text,
    context: env ? envelopeRole(Number(env[1])) : null,
  };
};

// One-line introduction for each tab
export const tabHelp = {
  voice: [20, 'How notes are played: polyphonic or mono, unison voices to thicken the sound, portamento and pre-glide between notes, and the keyboard octave. Also the patch\'s type and genre.'],
  oscillators: [15, 'Three oscillators, a noise source and two ring modulators generate the raw sound; the mixer balances them before the filters.'],
  filters: [17, 'Two multi-mode filters, each with its own drive, shape the tone. Routing sets how they connect; Envelope 2 can sweep them.'],
  envelopes: [21, 'Six envelopes shape each note over time. Env 1 controls volume, Env 2 the filters, Envs 3–6 anything routed in the Mod Matrix.'],
  lfos: [25, 'Three LFOs produce repeating movement. Route them to a destination in the Mod Matrix to hear them.'],
  effects: [27, 'Five effect slots processed after the amp, plus panning. Routing sets how the slots chain; each slot holds one effect.'],
  arp: [14, 'The arpeggiator turns held notes into rhythmic patterns, synced to the tempo.'],
  vocoder: [33, 'Voice features using the mic input: the Vocoder, the Chorder (one key plays a chord) and VocalTune pitch correction.'],
  'mod-matrix': [26, '20 slots, each routing one or two sources (LFOs, envelopes, wheels…) to a destination with a depth. This is where most movement in a patch comes from.'],
  tweaks: [15, 'Assigns parameters to the eight Tweak knobs of the synth\'s PERFORM section.'],
};
