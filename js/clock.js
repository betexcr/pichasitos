const GameClock = (() => {
  const RENDER_STEP = 1000 / CONST.FPS;
  const LOGIC_STEP = 1000 / CONST.LOGIC_FPS;
  const MAX_CATCHUP_STEPS = 5;
  const MAX_FRAME_DELTA_MS = 250;

  let last = null;
  let renderRemainder = 0;
  let logicRemainder = 0;

  function reset(now) {
    last = now;
    renderRemainder = 0;
    logicRemainder = 0;
  }

  function advance(now, opts) {
    const paused = !!(opts && opts.paused);

    if (last === null) {
      reset(now);
      return { renderSteps: 0, logicSteps: 0 };
    }

    let delta = now - last;
    last = now;
    if (delta > MAX_FRAME_DELTA_MS) delta = RENDER_STEP;
    if (delta < 0) delta = 0;

    renderRemainder += delta;
    let renderSteps = 0;
    while (renderRemainder >= RENDER_STEP && renderSteps < MAX_CATCHUP_STEPS) {
      renderRemainder -= RENDER_STEP;
      renderSteps++;
    }
    if (renderSteps >= MAX_CATCHUP_STEPS) {
      renderRemainder = Math.min(renderRemainder, RENDER_STEP);
    }

    let logicSteps = 0;
    if (!paused) {
      logicRemainder += delta;
      while (logicRemainder >= LOGIC_STEP && logicSteps < MAX_CATCHUP_STEPS) {
        logicRemainder -= LOGIC_STEP;
        logicSteps++;
      }
      if (logicSteps >= MAX_CATCHUP_STEPS) {
        logicRemainder = Math.min(logicRemainder, LOGIC_STEP);
      }
    }

    return { renderSteps, logicSteps };
  }

  return Object.freeze({ advance, reset, RENDER_STEP, LOGIC_STEP });
})();
