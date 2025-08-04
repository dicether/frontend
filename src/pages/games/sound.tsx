import click from "assets/sound/click.wav";
import lose from "assets/sound/lose.wav";
import win from "assets/sound/win.wav";

export default {
    win: new Audio(win),
    lose: new Audio(lose),
    menuUp: new Audio(click),
    menuDown: new Audio(click),
    tileSelect: new Audio(click),
    tileHit: new Audio(win),
    tileMiss: new Audio(click),
    plinkoResult: new Audio(win),
};
