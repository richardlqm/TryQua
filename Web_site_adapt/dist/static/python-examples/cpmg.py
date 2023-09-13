from qua_emulator import qua
from qm.qua import *

with qua():
    n = declare(int)
    with for_(n, 0, n < 10, n + 1):
        play('pi', 'qb1')
        wait(int(41), 'qb1')
        play('pi', 'qb1')
        wait(int(41), 'qb1')
