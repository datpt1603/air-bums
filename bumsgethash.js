let bf = {};

function tm(e, t) {
    function r(Y, X) {
        return Y << X | Y >>> 32 - X
    }
    function n(Y, X) {
        var R, V, z, te, $e;
        return z = Y & 2147483648,
        te = X & 2147483648,
        R = Y & 1073741824,
        V = X & 1073741824,
        $e = (Y & 1073741823) + (X & 1073741823),
        R & V ? $e ^ 2147483648 ^ z ^ te : R | V ? $e & 1073741824 ? $e ^ 3221225472 ^ z ^ te : $e ^ 1073741824 ^ z ^ te : $e ^ z ^ te
    }
    function a(Y, X, R) {
        return Y & X | ~Y & R
    }
    function o(Y, X, R) {
        return Y & R | X & ~R
    }
    function i(Y, X, R) {
        return Y ^ X ^ R
    }
    function s(Y, X, R) {
        return X ^ (Y | ~R)
    }
    function l(Y, X, R, V, z, te, $e) {
        return Y = n(Y, n(n(a(X, R, V), z), $e)),
        n(r(Y, te), X)
    }
    function c(Y, X, R, V, z, te, $e) {
        return Y = n(Y, n(n(o(X, R, V), z), $e)),
        n(r(Y, te), X)
    }
    function u(Y, X, R, V, z, te, $e) {
        return Y = n(Y, n(n(i(X, R, V), z), $e)),
        n(r(Y, te), X)
    }
    function f(Y, X, R, V, z, te, $e) {
        return Y = n(Y, n(n(s(X, R, V), z), $e)),
        n(r(Y, te), X)
    }
    function d(Y) {
        for (var X, R = Y.length, V = R + 8, z = (V - V % 64) / 64, te = (z + 1) * 16, $e = Array(te - 1), Oe = 0, P = 0; P < R; )
            X = (P - P % 4) / 4,
            Oe = P % 4 * 8,
            $e[X] = $e[X] | Y.charCodeAt(P) << Oe,
            P++;
        return X = (P - P % 4) / 4,
        Oe = P % 4 * 8,
        $e[X] = $e[X] | 128 << Oe,
        $e[te - 2] = R << 3,
        $e[te - 1] = R >>> 29,
        $e
    }
    function v(Y) {
        var X = "", R = "", V, z;
        for (z = 0; z <= 3; z++)
            V = Y >>> z * 8 & 255,
            R = "0" + V.toString(16),
            X = X + R.substr(R.length - 2, 2);
        return X
    }
    function m(Y) {
        Y = Y.replace(/\r\n/g, "\n");
        for (var X = "", R = 0; R < Y.length; R++) {
            var V = Y.charCodeAt(R);
            V < 128 ? X += String.fromCharCode(V) : V > 127 && V < 2048 ? (X += String.fromCharCode(V >> 6 | 192),
            X += String.fromCharCode(V & 63 | 128)) : (X += String.fromCharCode(V >> 12 | 224),
            X += String.fromCharCode(V >> 6 & 63 | 128),
            X += String.fromCharCode(V & 63 | 128))
        }
        return X
    }
    var p = Array(), h, w, S, b, y, $, _, T, E, C = 7, D = 12, A = 17, I = 22, F = 5, re = 9, oe = 14, H = 20, se = 4, pe = 11, q = 16, K = 23, L = 6, G = 10, J = 15, ge = 21;
    for (e = m(e),
    p = d(e),
    $ = 1732584193,
    _ = 4023233417,
    T = 2562383102,
    E = 271733878,
    h = 0; h < p.length; h += 16)
        w = $,
        S = _,
        b = T,
        y = E,
        $ = l($, _, T, E, p[h + 0], C, 3614090360),
        E = l(E, $, _, T, p[h + 1], D, 3905402710),
        T = l(T, E, $, _, p[h + 2], A, 606105819),
        _ = l(_, T, E, $, p[h + 3], I, 3250441966),
        $ = l($, _, T, E, p[h + 4], C, 4118548399),
        E = l(E, $, _, T, p[h + 5], D, 1200080426),
        T = l(T, E, $, _, p[h + 6], A, 2821735955),
        _ = l(_, T, E, $, p[h + 7], I, 4249261313),
        $ = l($, _, T, E, p[h + 8], C, 1770035416),
        E = l(E, $, _, T, p[h + 9], D, 2336552879),
        T = l(T, E, $, _, p[h + 10], A, 4294925233),
        _ = l(_, T, E, $, p[h + 11], I, 2304563134),
        $ = l($, _, T, E, p[h + 12], C, 1804603682),
        E = l(E, $, _, T, p[h + 13], D, 4254626195),
        T = l(T, E, $, _, p[h + 14], A, 2792965006),
        _ = l(_, T, E, $, p[h + 15], I, 1236535329),
        $ = c($, _, T, E, p[h + 1], F, 4129170786),
        E = c(E, $, _, T, p[h + 6], re, 3225465664),
        T = c(T, E, $, _, p[h + 11], oe, 643717713),
        _ = c(_, T, E, $, p[h + 0], H, 3921069994),
        $ = c($, _, T, E, p[h + 5], F, 3593408605),
        E = c(E, $, _, T, p[h + 10], re, 38016083),
        T = c(T, E, $, _, p[h + 15], oe, 3634488961),
        _ = c(_, T, E, $, p[h + 4], H, 3889429448),
        $ = c($, _, T, E, p[h + 9], F, 568446438),
        E = c(E, $, _, T, p[h + 14], re, 3275163606),
        T = c(T, E, $, _, p[h + 3], oe, 4107603335),
        _ = c(_, T, E, $, p[h + 8], H, 1163531501),
        $ = c($, _, T, E, p[h + 13], F, 2850285829),
        E = c(E, $, _, T, p[h + 2], re, 4243563512),
        T = c(T, E, $, _, p[h + 7], oe, 1735328473),
        _ = c(_, T, E, $, p[h + 12], H, 2368359562),
        $ = u($, _, T, E, p[h + 5], se, 4294588738),
        E = u(E, $, _, T, p[h + 8], pe, 2272392833),
        T = u(T, E, $, _, p[h + 11], q, 1839030562),
        _ = u(_, T, E, $, p[h + 14], K, 4259657740),
        $ = u($, _, T, E, p[h + 1], se, 2763975236),
        E = u(E, $, _, T, p[h + 4], pe, 1272893353),
        T = u(T, E, $, _, p[h + 7], q, 4139469664),
        _ = u(_, T, E, $, p[h + 10], K, 3200236656),
        $ = u($, _, T, E, p[h + 13], se, 681279174),
        E = u(E, $, _, T, p[h + 0], pe, 3936430074),
        T = u(T, E, $, _, p[h + 3], q, 3572445317),
        _ = u(_, T, E, $, p[h + 6], K, 76029189),
        $ = u($, _, T, E, p[h + 9], se, 3654602809),
        E = u(E, $, _, T, p[h + 12], pe, 3873151461),
        T = u(T, E, $, _, p[h + 15], q, 530742520),
        _ = u(_, T, E, $, p[h + 2], K, 3299628645),
        $ = f($, _, T, E, p[h + 0], L, 4096336452),
        E = f(E, $, _, T, p[h + 7], G, 1126891415),
        T = f(T, E, $, _, p[h + 14], J, 2878612391),
        _ = f(_, T, E, $, p[h + 5], ge, 4237533241),
        $ = f($, _, T, E, p[h + 12], L, 1700485571),
        E = f(E, $, _, T, p[h + 3], G, 2399980690),
        T = f(T, E, $, _, p[h + 10], J, 4293915773),
        _ = f(_, T, E, $, p[h + 1], ge, 2240044497),
        $ = f($, _, T, E, p[h + 8], L, 1873313359),
        E = f(E, $, _, T, p[h + 15], G, 4264355552),
        T = f(T, E, $, _, p[h + 6], J, 2734768916),
        _ = f(_, T, E, $, p[h + 13], ge, 1309151649),
        $ = f($, _, T, E, p[h + 4], L, 4149444226),
        E = f(E, $, _, T, p[h + 11], G, 3174756917),
        T = f(T, E, $, _, p[h + 2], J, 718787259),
        _ = f(_, T, E, $, p[h + 9], ge, 3951481745),
        $ = n($, w),
        _ = n(_, S),
        T = n(T, b),
        E = n(E, y);
    return t == 32 ? (v($) + v(_) + v(T) + v(E)).toLowerCase() : (v(_) + v(T)).toLowerCase()
}

bf.hex_md5_32 = function(e) {
    return tm(e, 32)
}

function getHashByTime(collectSeqNo, collectAmount) {
    const hashKey = "7be2a16a82054ee58398c5edb7ac4a5a";
    return bf.hex_md5_32(collectAmount + (collectSeqNo + "") + hashKey).toString()
}

module.exports = {
    getHashByTime
}