# Manual QA checklist (not run in CI)

## Multi-hit combat (M1)
- [ ] Clarisa signature / combos — each swing segment can deal damage
- [ ] Michiquito multi-hit — damage scales with hit count
- [ ] Karen multi-hit

## Fight reliability (M2)
- [ ] Combo-link (A then S in recovery) lands a second hit
- [ ] Round end while dodging → next round is hittable
- [ ] Slow network: "CARGANDO ARENA…" freezes fight logic
- [ ] Interrupt enemy signature mid-animation — no ERROR screen

## Offline / SW
- [ ] Fight loads with poses from network (SW does not permanently cache `/assets/poses/`)
- [ ] Shell still works offline after one visit (index/js/css SWR)