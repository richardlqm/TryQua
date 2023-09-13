from qm.qua import *
from qua_emulator import run

with program() as prog:
    duration = 20
    play('cw', 'qb1', duration=duration)
    frame_rotation_2pi(0.5, 'qb1')
    play('cw', 'qb1', duration=duration)
    reset_frame('qb1')
    play('cw', 'qb1', duration=duration)
    play('cw', 'qb2', duration=3 * duration)

run(prog)