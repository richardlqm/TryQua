from qm.qua import *
from qua_emulator import run

with program() as prog:
    play('pi', 'qb1')
    play('pi', 'qb2')

run(prog)