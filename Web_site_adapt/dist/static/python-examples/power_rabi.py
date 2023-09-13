from qua_emulator import qua
from qm.qua import *

with qua():
    a = declare(fixed)
    with for_(a, 0.0, a < 1.0, a + 0.1):
        play('gauss' * amp(a), 'qb1')
        wait(int(55), 'qb1')
        save(a, 'a')
