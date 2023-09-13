from qm.qua import *
from qua_emulator import run

with program() as prog:
    a = declare(fixed)
    with for_(a, 0.0, a < 1.0, a + 0.1):
        play('gauss' * amp(a), 'qb1')
        play('cw' * amp(a), 'qb2')
        wait(20)

run(prog)