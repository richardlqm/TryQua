from qua_emulator import qua
from qm.qua import *
from qua_emulator.try_qua.try_qua import run

with program() as prog:
    a = declare(fixed)
    with for_(a, 0.0, a < 1.0, a + 0.1):
        play('gauss' * amp(a), 'qb1')
        wait(int(55), 'qb1')
        save(a, 'a')

run(prog)