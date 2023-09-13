from qm.qua import *
from qua_emulator import run

with program() as prog:
    qb1 = 'qb1'
    qb2 = 'qb2'
    duration = 20
    # update_frequency(qb1, 1e6)
    # update_frequency(qb2, 1e6)
    play('cw', qb1, duration=duration)
    frame_rotation_2pi(0.5, qb1)
    play('cw', qb1, duration=duration)
    reset_frame(qb1)
    play('cw', qb1, duration=duration)
    play('cw', qb2, duration=3 * duration)

run(prog)