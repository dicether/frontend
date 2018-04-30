import BN from 'bn.js';

Audio.prototype.playFromBegin = function () {
    this.currentTime = 0; // tslint:disable-line no-invalid-this
    this.play(); // tslint:disable-line no-invalid-this
};

(BN as any).prototype.max = function(n1: BN, n2: BN) {
    return n1.gt(n2) ? n1 : n2;
};

(BN as any).prototype.min = function(n1: BN, n2: BN) {
    return n1.lt(n2) ? n1 : n2;
};