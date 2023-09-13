from qua_emulator import qua
from qm.qua import *

with qua():
    qb1 = 'qb3'
    qb2 = 'qb4'
    duration = 250
    align(qb1, qb2)
    reset_phase(qb1)
    reset_phase(qb2)
    update_frequency(qb1, 1e6)
    update_frequency(qb2, 1e6)
    play('cw', qb2, duration=3 * duration)
    play('cw', qb1, duration=duration)
    update_frequency(qb1, 5e6)
    play('cw', qb1, duration=duration)
    update_frequency(qb1, 1e6)
    play('cw', qb1, duration=duration)
