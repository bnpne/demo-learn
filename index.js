(window.R = {}),
  (R.iLerp = (t, s, e) => R.Clamp((e - t) / (s - t), 0, 1)),
  (R.Lerp = (t, s, e) => t * (1 - e) + s * e),
  (R.Damp = (t, s, e) => R.Lerp(t, s, 1 - Math.exp(Math.log(1 - e) * RD))),
  (R.Remap = (t, s, e, i, r) => R.Lerp(e, i, R.iLerp(t, s, r))),
  (R.M = class {
    constructor(t) {
      R.BM(this, ["gRaf", "run", "uSvg", "uLine", "uProp"]),
        (this.v = this.vInit(t)),
        (this.r = new R.RafR(this.run));
    }
    vInit(s) {
      const r = {
        el: R.Select.el(s.el),
        e: {
          curve: s.e || "linear",
        },
        d: {
          origin: s.d || 0,
          curr: 0,
        },
        delay: s.delay || 0,
        cb: s.cb || !1,
        r: s.r || 2,
        prog: 0,
        progE: 0,
        elapsed: 0,
      };
      (r.elL = r.el.length),
        R.Has(s, "update")
          ? (r.up = (t) => {
              s.update(r);
            })
          : R.Has(s, "svg")
          ? (r.up = this.uSvg)
          : R.Has(s, "line")
          ? (r.up = this.uLine)
          : (r.up = this.uProp);
      var e = s.p || !1,
        t = s.svg || !1,
        h = s.line || !1;
      let i = !1;
      if (e) {
        (r.prop = {}), (r.propI = []);
        var a = Object.keys(e);
        r.propL = a.length;
        let t = r.propL;
        for (; t--; ) {
          var n = a[t],
            n =
              ((r.prop[t] = {
                name: n,
                origin: {
                  start: e[n][0],
                  end: e[n][1],
                },
                curr: e[n][0],
                start: e[n][0],
                end: e[n][1],
                unit: e[n][2] || "%",
              }),
              n.charAt(0)),
            o = "r" === n && i ? "r2" : n;
          (i = "r" === n), (r.propI[o] = t);
        }
      } else if (t)
        (r.svg = {
          type: t.type,
          attr: "polygon" === t.type ? "points" : "d",
          end: t.end,
          originArr: {},
          arr: {},
          val: [],
        }),
          (r.svg.start = t.start || R.Ga(r.el[0], r.svg.attr)),
          (r.svg.curr = r.svg.start),
          (r.svg.originArr.start = R.Svg.split(r.svg.start)),
          (r.svg.originArr.end = R.Svg.split(r.svg.end)),
          (r.svg.arr.start = r.svg.originArr.start),
          (r.svg.arr.end = r.svg.originArr.end),
          (r.svg.arrL = r.svg.arr.start.length);
      else if (h) {
        r.line = {
          dashed: h.dashed,
          coeff: {
            start: R.Is.def(h.start) ? (100 - h.start) / 100 : 1,
            end: R.Is.def(h.end) ? (100 - h.end) / 100 : 0,
          },
          shapeL: [],
          origin: {
            start: [],
            end: [],
          },
          curr: [],
          start: [],
          end: [],
        };
        for (let i = 0; i < r.elL; i++) {
          var l = h.elWL || r.el[i];
          r.line.shapeL[i] = R.Svg.shapeL(l);
          let t;
          if (r.line.dashed) {
            var p = r.line.dashed;
            let s = 0;
            var c = p.split(/[\s,]/),
              d = c.length;
            for (let t = 0; t < d; t++) s += parseFloat(c[t]) || 0;
            let e = "";
            var v = Math.ceil(r.line.shapeL[i] / s);
            for (let t = 0; t < v; t++) e += p + " ";
            t = e + "0 " + r.line.shapeL[i];
          } else t = r.line.shapeL[i];
          (r.el[i].style.strokeDasharray = t),
            (r.line.origin.start[i] = r.line.coeff.start * r.line.shapeL[i]),
            (r.line.origin.end[i] = r.line.coeff.end * r.line.shapeL[i]),
            (r.line.curr[i] = r.line.origin.start[i]),
            (r.line.start[i] = r.line.origin.start[i]),
            (r.line.end[i] = r.line.origin.end[i]);
        }
      }
      return r;
    }
    play(t) {
      this.pause(), this.vUpd(t), this.delay.run();
    }
    pause() {
      this.r.stop(), this.delay && this.delay.stop();
    }
    vUpd(t) {
      var s = t || {},
        e = R.Has(s, "reverse") ? "start" : "end";
      if (R.Has(this.v, "prop")) {
        let t = this.v.propL;
        for (; t--; )
          (this.v.prop[t].end = this.v.prop[t].origin[e]),
            (this.v.prop[t].start = this.v.prop[t].curr),
            R.Has(s, "p") &&
              R.Has(s.p, this.v.prop[t].name) &&
              (R.Has(s.p[this.v.prop[t].name], "newEnd") &&
                (this.v.prop[t].end = s.p[this.v.prop[t].name].newEnd),
              R.Has(s.p[this.v.prop[t].name], "newStart")) &&
              (this.v.prop[t].start = s.p[this.v.prop[t].name].newStart);
      } else if (R.Has(this.v, "svg"))
        R.Has(s, "svg") && R.Has(s.svg, "start")
          ? (this.v.svg.arr.start = s.svg.start)
          : (this.v.svg.arr.start = R.Svg.split(this.v.svg.curr)),
          R.Has(s, "svg") && R.Has(s.svg, "end")
            ? (this.v.svg.arr.end = s.svg.end)
            : (this.v.svg.arr.end = this.v.svg.originArr[e]);
      else if (R.Has(this.v, "line")) {
        for (let t = 0; t < this.v.elL; t++)
          this.v.line.start[t] = this.v.line.curr[t];
        if (R.Has(s, "line") && R.Has(s.line, "end")) {
          this.v.line.coeff.end = (100 - s.line.end) / 100;
          for (let t = 0; t < this.v.elL; t++)
            this.v.line.end[t] = this.v.line.coeff.end * this.v.line.shapeL[t];
        } else
          for (let t = 0; t < this.v.elL; t++)
            this.v.line.end[t] = this.v.line.origin[e][t];
      }
      (this.v.d.curr = R.Has(s, "d")
        ? s.d
        : R.R(this.v.d.origin - this.v.d.curr + this.v.elapsed)),
        (this.v.e.curve = s.e || this.v.e.curve),
        (this.v.e.calc = R.Is.str(this.v.e.curve)
          ? R.Ease[this.v.e.curve]
          : R.Ease4(this.v.e.curve)),
        (this.v.delay = (R.Has(s, "delay") ? s : this.v).delay),
        (this.v.cb = (R.Has(s, "cb") ? s : this.v).cb),
        (this.v.prog = this.v.progE = 0 === this.v.d.curr ? 1 : 0),
        (this.delay = new R.Delay(this.gRaf, this.v.delay));
    }
    gRaf() {
      this.r.run();
    }
    run(t) {
      1 === this.v.prog
        ? (this.pause(), this.v.up(), this.v.cb && this.v.cb())
        : ((this.v.elapsed = R.Clamp(t, 0, this.v.d.curr)),
          (this.v.prog = R.Clamp(this.v.elapsed / this.v.d.curr, 0, 1)),
          (this.v.progE = this.v.e.calc(this.v.prog)),
          this.v.up());
    }
    uProp() {
      var t = this.v.prop,
        s = this.v.propI;
      let e = this.v.propL;
      for (; e--; ) t[e].curr = this.lerp(t[e].start, t[e].end);
      var i = R.Has(s, "x") ? t[s.x].curr + t[s.x].unit : 0,
        r = R.Has(s, "y") ? t[s.y].curr + t[s.y].unit : 0,
        i = i + r === 0 ? 0 : "translate3d(" + i + "," + r + ",0)",
        r = R.Has(s, "r") ? t[s.r].name + "(" + t[s.r].curr + "deg)" : 0,
        h = R.Has(s, "r2") ? t[s.r2].name + "(" + t[s.r2].curr + "deg)" : 0,
        a = R.Has(s, "s") ? t[s.s].name + "(" + t[s.s].curr + ")" : 0,
        n =
          i + r + h + a === 0
            ? 0
            : [i, r, h, a].filter((t) => 0 !== t).join(" "),
        o = R.Has(s, "o") ? t[s.o].curr : -1;
      let l = this.v.elL;
      for (; l-- && !R.Is.und(this.v.el[l]); )
        0 !== n && (this.v.el[l].style.transform = n),
          0 <= o && (this.v.el[l].style.opacity = o);
    }
    uSvg() {
      var s = this.v.svg;
      s.currTemp = "";
      for (let t = 0; t < s.arrL; t++)
        (s.val[t] = isNaN(s.arr.start[t])
          ? s.arr.start[t]
          : this.lerp(s.arr.start[t], s.arr.end[t])),
          (s.currTemp += s.val[t] + " "),
          (s.curr = s.currTemp.trim());
      for (let t = 0; t < this.v.elL && !R.Is.und(this.v.el[t]); t++)
        this.v.el[t].setAttribute(s.attr, s.curr);
    }
    uLine() {
      var s = this.v.line;
      for (let t = 0; t < this.v.elL; t++) {
        var e = this.v.el[t].style;
        (s.curr[t] = this.lerp(s.start[t], s.end[t])),
          (e.strokeDashoffset = s.curr[t]),
          0 === this.v.prog && (e.opacity = 1);
      }
    }
    lerp(t, s) {
      return R.R(R.Lerp(t, s, this.v.progE), this.v.r);
    }
  }),
  (R.TL = class {
    constructor() {
      (this._ = []), (this.d = 0);
    }
    from(t) {
      (this.d += R.Has(t, "delay") ? t.delay : 0),
        (t.delay = this.d),
        this._.push(new R.M(t));
    }
    play(t) {
      this.run("play", t);
    }
    pause() {
      this.run("pause");
    }
    run(t, s) {
      let e = 0;
      for (var i = this._.length, r = s || void 0; e < i; )
        this._[e][t](r), e++;
    }
  }),
  (R.BM = (t, s) => {
    let e = s.length;
    for (; e--; ) t[s[e]] = t[s[e]].bind(t);
  }),
  (R.Clamp = (t, s, e) => (t < s ? s : e < t ? e : t)),
  (R.Clone = (t) => JSON.parse(JSON.stringify(t))),
  (R.Delay = class {
    constructor(t, s) {
      (this.cb = t),
        (this.d = s),
        R.BM(this, ["loop"]),
        (this.r = new R.RafR(this.loop));
    }
    run() {
      0 === this.d ? this.cb() : this.r.run();
    }
    stop() {
      this.r.stop();
    }
    loop(t) {
      t = R.Clamp(t, 0, this.d);
      1 === R.Clamp(t / this.d, 0, 1) && (this.stop(), this.cb());
    }
  }),
  (R.Dist = (t, s) => Math.sqrt(t * t + s * s)),
  (R.Ease = {
    linear: (t) => t,
    i1: (t) => 1 - Math.cos(t * (0.5 * Math.PI)),
    o1: (t) => Math.sin(t * (0.5 * Math.PI)),
    io1: (t) => -0.5 * (Math.cos(Math.PI * t) - 1),
    i2: (t) => t * t,
    o2: (t) => t * (2 - t),
    io2: (t) => (t < 0.5 ? 2 * t * t : (4 - 2 * t) * t - 1),
    i3: (t) => t * t * t,
    o3: (t) => --t * t * t + 1,
    io3: (t) =>
      t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    i4: (t) => t * t * t * t,
    o4: (t) => 1 - --t * t * t * t,
    io4: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),
    i5: (t) => t * t * t * t * t,
    o5: (t) => 1 + --t * t * t * t * t,
    io5: (t) =>
      t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
    i6: (t) => (0 === t ? 0 : 2 ** (10 * (t - 1))),
    o6: (t) => (1 === t ? 1 : 1 - 2 ** (-10 * t)),
    io6: (t) =>
      0 === t || 1 === t
        ? t
        : (t /= 0.5) < 1
        ? 0.5 * 2 ** (10 * (t - 1))
        : 0.5 * (2 - 2 ** (-10 * --t)),
  }),
  (R.r0 = (t, s) => 1 - 3 * s + 3 * t),
  (R.r1 = (t, s) => 3 * s - 6 * t),
  (R.r2 = (t, s, e) => ((R.r0(s, e) * t + R.r1(s, e)) * t + 3 * s) * t),
  (R.r3 = (t, s, e) => 3 * R.r0(s, e) * t * t + 2 * R.r1(s, e) * t + 3 * s),
  (R.r4 = (t, s, e, i, r) => {
    let h,
      a,
      n = 0;
    for (
      ;
      (a = s + 0.5 * (e - s)),
        0 < (h = R.r2(a, i, r) - t) ? (e = a) : (s = a),
        1e-7 < Math.abs(h) && ++n < 10;

    );
    return a;
  }),
  (R.r5 = (s, e, i, r) => {
    for (let t = 0; t < 4; ++t) {
      var h = R.r3(e, i, r);
      if (0 === h) return e;
      e -= (R.r2(e, i, r) - s) / h;
    }
    return e;
  }),
  (R.Ease4 = (t) => {
    const h = t[0],
      s = t[1],
      a = t[2],
      e = t[3];
    let n = new Float32Array(11);
    if (h !== s || a !== e)
      for (let t = 0; t < 11; ++t) n[t] = R.r2(0.1 * t, h, a);
    return (t) =>
      (h === s && a === e) || 0 === t || 1 === t
        ? t
        : R.r2(
            (function (t) {
              let s = 0;
              for (var e = 1; 10 !== e && n[e] <= t; ++e) s += 0.1;
              --e;
              var i = (t - n[e]) / (n[e + 1] - n[e]),
                i = s + 0.1 * i,
                r = R.r3(i, h, a);
              return 0.001 <= r
                ? R.r5(t, i, h, a)
                : 0 === r
                ? i
                : R.r4(t, r, r + 0.1, h, a);
            })(t),
            s,
            e
          );
  }),
  (R.Fetch = (s) => {
    var t = "json" === s.type;
    const e = t ? "json" : "text";
    var i = {
      method: t ? "POST" : "GET",
      headers: new Headers({
        "Content-type": t ? "application/x-www-form-urlencoded" : "text/html",
      }),
      mode: "same-origin",
    };
    t && (i.body = s.body),
      fetch(s.url, i)
        .then((t) => {
          if (t.ok) return t[e]();
          s.error && s.error();
        })
        .then((t) => {
          s.success(t);
        });
  }),
  (R.Has = (t, s) => t.hasOwnProperty(s)),
  (R.Is = {
    str: (t) => "string" == typeof t,
    obj: (t) => t === Object(t),
    arr: (t) => t.constructor === Array,
    def: (t) => void 0 !== t,
    und: (t) => void 0 === t,
  }),
  (R.Mod = (t, s) => ((t % s) + s) % s),
  (R.Pad = (t, s) => ("000" + t).slice(-s)),
  (R.PCurve = (t, s, e) => {
    return ((s + e) ** (s + e) / (s ** s * e ** e)) * t ** s * (1 - t) ** e;
  }),
  (R.R = (t, s) => {
    s = R.Is.und(s) ? 100 : 10 ** s;
    return Math.round(t * s) / s;
  }),
  (R.Select = {
    el: (t) => {
      let s = [];
      var e;
      return (
        R.Is.str(t)
          ? ((e = t.substring(1)),
            "#" === t.charAt(0) ? (s[0] = R.G.id(e)) : (s = R.G.class(e)))
          : (s[0] = t),
        s
      );
    },
    type: (t) => ("#" === t.charAt(0) ? "id" : "class"),
    name: (t) => t.substring(1),
  }),
  (R.L = (t, s, e, i) => {
    var r = document,
      h = R.Select.el(t),
      a = h.length;
    let n = e;
    var t = "wheel",
      o = "mouse",
      l = [o + "Wheel", o + "move", "touchmove", "touchstart"],
      p = -1 !== l.indexOf(e) && {
        passive: !1,
      },
      c =
        (e === l[0]
          ? (n =
              "on" + t in r
                ? t
                : R.Is.def(r.onmousewheel)
                ? o + t
                : "DOMMouseScroll")
          : "focusOut" === e && (n = R.Snif.isFirefox ? "blur" : "focusout"),
        "a" === s ? "add" : "remove");
    for (let t = 0; t < a; t++) h[t][c + "EventListener"](n, i, p);
  });
const Tab = class {
  constructor() {
    (this._ = []),
      (this.pause = 0),
      R.BM(this, ["v"]),
      R.L(document, "a", "visibilitychange", this.v);
  }
  add(t) {
    this._.push(t);
  }
  v() {
    var t = performance.now();
    let s,
      e,
      i =
        ((e = document.hidden
          ? ((this.pause = t), "stop")
          : ((s = t - this.pause), "start")),
        this._.length);
    for (; i--; ) this._[i][e](s);
  }
};
R.Tab = new Tab();
let RD = 0;
const FR = 1e3 / 60,
  Raf =
    ((R.Raf = class {
      constructor() {
        (this._ = []),
          (this.on = !0),
          R.BM(this, ["loop", "tOff", "tOn"]),
          R.Tab.add({
            stop: this.tOff,
            start: this.tOn,
          }),
          this.raf();
      }
      tOff() {
        this.on = !1;
      }
      tOn(t) {
        this.t = null;
        let s = this.l();
        for (; s--; ) this._[s].sT += t;
        this.on = !0;
      }
      add(t) {
        this._.push(t);
      }
      remove(t) {
        let s = this.l();
        for (; s--; ) if (this._[s].id === t) return void this._.splice(s, 1);
      }
      loop(s) {
        if (this.on) {
          this.t || (this.t = s), (RD = (s - this.t) / FR), (this.t = s);
          let t = this.l();
          for (; t--; ) {
            var e,
              i = this._[t];
            R.Is.def(i) && (i.sT || (i.sT = s), (e = s - i.sT), i.cb(e));
          }
        }
        this.raf();
      }
      raf() {
        requestAnimationFrame(this.loop);
      }
      l() {
        return this._.length;
      }
    }),
    new R.Raf());
let RafId = 0;
(R.RafR = class {
  constructor(t) {
    (this.cb = t), (this.on = !1), (this.id = RafId), RafId++;
  }
  run() {
    this.on ||
      (Raf.add({
        id: this.id,
        cb: this.cb,
      }),
      (this.on = !0));
  }
  stop() {
    this.on && (Raf.remove(this.id), (this.on = !1));
  }
}),
  (R.Rand = {
    range: (t, s, e) => R.R(Math.random() * (s - t) + t, e),
    uniq: (s) => {
      var e = [];
      for (let t = 0; t < s; t++) e[t] = t;
      let t = s;
      for (var i, r; t--; )
        (i = ~~(Math.random() * (t + 1))),
          (r = e[t]),
          (e[t] = e[i]),
          (e[i] = r);
      return e;
    },
  }),
  (R.Snif = {
    uA: navigator.userAgent.toLowerCase(),
    get iPadIOS13() {
      return "MacIntel" === navigator.platform && 1 < navigator.maxTouchPoints;
    },
    get isMobile() {
      return /mobi|android|tablet|ipad|iphone/.test(this.uA) || this.iPadIOS13;
    },
    get isFirefox() {
      return -1 < this.uA.indexOf("firefox");
    },
  }),
  (R.Svg = {
    shapeL: (i) => {
      var t, s, e, r;
      if ("circle" === i.tagName) return 2 * R.Ga(i, "r") * Math.PI;
      if ("line" === i.tagName)
        return (
          (t = R.Ga(i, "x1")),
          (s = R.Ga(i, "x2")),
          (e = R.Ga(i, "y1")),
          (r = R.Ga(i, "y2")),
          Math.sqrt((s -= t) * s + (r -= e) * r)
        );
      if ("polyline" !== i.tagName) return i.getTotalLength();
      {
        let s = 0,
          e = 0;
        var h = i.points.numberOfItems;
        for (let t = 0; t < h; t++) {
          var a = i.points.getItem(t);
          0 < t && (s += R.Dist(a.x - e.x, a.y - e.y)), (e = a);
        }
        return s;
      }
    },
    split: (t) => {
      var s = [],
        e = t.split(" "),
        i = e.length;
      for (let t = 0; t < i; t++) {
        var r = e[t].split(","),
          h = r.length;
        for (let t = 0; t < h; t++) {
          var a = r[t],
            a = isNaN(a) ? a : +a;
          s.push(a);
        }
      }
      return s;
    },
  }),
  (R.Timer = class {
    constructor(t) {
      this._ = new R.Delay(t.cb, t.delay);
    }
    run() {
      this._.stop(), this._.run();
    }
  }),
  (R.Une = (t, s, e) => 0 !== R.R(Math.abs(t - s), e)),
  (R.Cr = (t) => document.createElement(t)),
  (R.g = (t, s, e) => {
    return (t || document)["getElement" + s](e);
  }),
  (R.G = {
    id: (t, s) => R.g(s, "ById", t),
    class: (t, s) => R.g(s, "sByClassName", t),
    tag: (t, s) => R.g(s, "sByTagName", t),
  }),
  (R.Ga = (t, s) => t.getAttribute(s)),
  (R.index = (s, e) => {
    var i = e.length;
    for (let t = 0; t < i; t++) if (s === e[t]) return t;
    return -1;
  }),
  (R.Index = {
    list: (t) => R.index(t, t.parentNode.children),
    class: (t, s, e) => R.index(t, R.G.class(s, e)),
  }),
  (R.PD = (t) => {
    t.cancelable && t.preventDefault();
  }),
  (R.RO = class {
    constructor() {
      (this.eT = R.Snif.isMobile ? "orientationchange" : "resize"),
        (this.tick = !1),
        (this._ = []),
        R.BM(this, ["fn", "gRaf", "run"]),
        (this.t = new R.Timer({
          delay: 40,
          cb: this.gRaf,
        })),
        (this.r = new R.RafR(this.run)),
        R.L(window, "a", this.eT, this.fn);
    }
    add(t) {
      this._.push(t);
    }
    remove(t) {
      let s = this._.length;
      for (; s--; ) if (this._[s].id === t) return void this._.splice(s, 1);
    }
    fn(t) {
      (this.e = t), this.t.run();
    }
    gRaf() {
      this.tick || ((this.tick = !0), this.r.run());
    }
    run() {
      let t = 0;
      for (var s = this._.length; t < s; ) this._[t].cb(this.e), t++;
      this.r.stop(), (this.tick = !1);
    }
  });
const Ro = new R.RO();
let RoId = 0;
function Router(t) {
  var s = _A,
    e = s.config.routes[t],
    i = s.route.new,
    r = s.route.old;
  (s.route.old = i),
    (s.route.new = {
      url: t,
      page: e,
    }),
    (s.is[i.page] = !1),
    (s.is[e] = !0),
    r.page && (s.was[r.page] = !1),
    (s.was[i.page] = !0);
}
(R.ROR = class {
  constructor(t) {
    (this.cb = t), (this.id = RoId), RoId++;
  }
  on() {
    Ro.add({
      id: this.id,
      cb: this.cb,
    });
  }
  off() {
    Ro.remove(this.id);
  }
}),
  (R.O = (t, s) => {
    t.style.opacity = s;
  }),
  (R.pe = (t, s) => {
    t.style.pointerEvents = s;
  }),
  (R.PE = {
    all: (t) => {
      R.pe(t, "all");
    },
    none: (t) => {
      R.pe(t, "none");
    },
  }),
  (R.T = (t, s, e, i) => {
    i = R.Is.und(i) ? "%" : i;
    t.style.transform = "translate3d(" + s + i + "," + e + i + ",0)";
  });
class Win {
  constructor(t) {
    (_A.win = {
      w: 0,
      h: 0,
    }),
      (this.d = t),
      R.BM(this, ["resize"]),
      new R.ROR(this.resize).on(),
      this.resize();
  }
  resize() {
    var t = _A,
      s = innerWidth,
      e = innerHeight,
      i =
        ((t.win = {
          w: s,
          h: e,
        }),
        (t.winSemi = {
          w: 0.5 * s,
          h: 0.5 * e,
        }),
        (t.winRatio = {
          wh: s / e,
          hw: e / s,
        }),
        t.config.psd[this.d]),
      i =
        ((t.psd = {
          h: i.h,
          w: i.w,
        }),
        (t.winWpsdW = s / t.psd.w),
        (t.winHpsdH = e / t.psd.h),
        (t.isOverPsd = t.winRatio.wh > t.psd.w / t.psd.h),
        t.isOverPsd ? t.winHpsdH : t.winWpsdW);
    (t.lSize = 720 * i),
      (t.tr = {
        y: -150 * t.winHpsdH,
      });
  }
}
class Rotate {
  constructor() {
    (this.inDom = !1),
      R.BM(this, ["resize"]),
      new R.ROR(this.resize).on(),
      this.resize();
  }
  resize() {
    var t = 1 < _A.winRatio.wh;
    t && !this.inDom ? this.a() : !t && this.inDom && this.r();
  }
  a() {
    (this.iW = R.Cr("div")), (this.iW.className = "_i-w");
    var t = R.Cr("div");
    (t.className = "_i"),
      (t.textContent = "PLEASE ROTATE YOUR DEVICE"),
      this.iW.appendChild(t),
      document.body.prepend(this.iW),
      (this.inDom = !0);
  }
  r() {
    this.iW.parentNode.removeChild(this.iW), (this.inDom = !1);
  }
}
class Ctrl {
  constructor(t) {
    var s = _A;
    s.is[404] ||
      ((s.mutating = !0),
      (s.page = {}),
      (s.fromBack = !1),
      (this.transitionM = t.transition.mutation),
      (this.device = t.device),
      R.BM(this, ["eD"]),
      new Win(this.device),
      "m" === this.device && new Rotate(),
      (s.e = new t.engine()),
      this.onPopstate(),
      R.L(document.body, "a", "click", this.eD),
      new t.transition.intro((t) => {
        this.intro(t);
      }));
  }
  onPopstate() {
    const s = document,
      e = "complete";
    let i = s.readyState !== e;
    (onload = (t) => {
      setTimeout((t) => {
        i = !1;
      }, 0);
    }),
      (onpopstate = (t) => {
        i && s.readyState === e && (R.PD(t), t.stopImmediatePropagation());
        t = _A;
        R.Is.und(t.config.routes) ||
          (t.mutating
            ? this.hPS()
            : ((t.mutating = !0), this.out(location.pathname, "back")));
      });
  }
  eD(t) {
    var s,
      e,
      i = _A;
    let r = t.target,
      h = !1,
      a = !1;
    for (; r; ) {
      var n = r.tagName;
      if ("A" === n) {
        h = !0;
        break;
      }
      if (("INPUT" === n || "BUTTON" === n) && "submit" === r.type) {
        a = !0;
        break;
      }
      r = r.parentNode;
    }
    h
      ? ((e = (s = r.href).substring(0, 3)),
        r.hasAttribute("target") ||
          "mai" === e ||
          "tel" === e ||
          (R.PD(t), i.mutating) ||
          ((e = s.replace(/^.*\/\/[^/]+/, "")) !== i.route.new.url &&
            ((i.mutating = !0), this.out(e, r))))
      : a && R.PD(t);
  }
  intro(s) {
    const e = _A;
    let t = e.route.new.url + "?device=" + this.device;
    e.config.p && ((t += "&token=" + e.config.p), this.hPS()),
      R.Fetch({
        url: t,
        type: "html",
        success: (t) => {
          t = JSON.parse(t);
          (e.config.routes = t.routes),
            (e.data = t.data),
            (this.cache = t.cache),
            this.add(document.body, "afterbegin", t.body),
            (this.main = R.G.id("m")),
            (this.transitionM = new this.transitionM()),
            s();
        },
      });
  }
  out(t, s) {
    Router(t);
    t = _A;
    (t.target = s),
      (t.fromBack = "back" === s),
      (t.page.update = (t) => {
        this.in();
      }),
      this.transitionM.out();
  }
  in() {
    var t = _A;
    const s = this.cache[t.route.new.url];
    (document.title = s.title),
      "back" !== t.target && this.hPS(),
      (t.page.insertNew = (t) => {
        this.add(this.main, "beforeend", s.html);
      }),
      (t.page.removeOld = (t) => {
        var s = this.main.children[0];
        s.parentNode.removeChild(s);
      }),
      this.transitionM.in();
  }
  add(t, s, e) {
    t.insertAdjacentHTML(s, e);
  }
  hPS() {
    var t = _A.route.new.url;
    history.pushState(
      {
        page: t,
      },
      "",
      t
    );
  }
}
class SVirtual {
  constructor(t) {
    (this.cbFn = t.cb),
      (this.isOn = !1),
      (this.isFF = R.Snif.isFirefox),
      R.BM(this, ["fn"]);
    var s = ["mouseWheel", "keydown"];
    for (let t = 0; t < 2; t++) R.L(document, "a", s[t], this.fn);
  }
  init(t) {
    this.v = t.v;
  }
  on() {
    (this.tick = !1), (this.isOn = !0);
  }
  off() {
    this.isOn = !1;
  }
  resize() {
    this.spaceGap = _A.win.h - 40;
  }
  fn(t) {
    (this.e = t),
      (this.eT = t.type),
      (this.eK = t.key),
      ("keydown" === this.eT && "Tab" !== this.eK) || R.PD(t),
      this.isOn && !this.tick && ((this.tick = !0), this.run());
  }
  run() {
    var t = this.eT;
    "wheel" === t ? this.w() : "keydown" === t && this.key();
  }
  w() {
    var t,
      s = this.e;
    let e = s.wheelDeltaY || -1 * s.deltaY;
    this.v &&
      ((t = s.wheelDeltaX || -1 * s.deltaX),
      (e = Math.abs(t) >= Math.abs(e) ? t : e)),
      this.isFF && 1 === s.deltaMode ? (e *= 0.75) : (e *= 0.556),
      (this.s = -e),
      this.cb();
  }
  key() {
    var s = this.eK,
      e = "ArrowUp" === s || "ArrowLeft" === s,
      i = " " === s;
    if (e || "ArrowDown" === s || "ArrowRight" === s || i) {
      let t = 100;
      e
        ? (t *= -1)
        : i && ((s = this.e.shiftKey ? -1 : 1), (t = this.spaceGap * s)),
        (this.s = t),
        this.cb();
    } else this.tick = !1;
  }
  cb() {
    this.cbFn(this.s), (this.tick = !1);
  }
}
class MM {
  constructor(t) {
    (this.cb = t.cb),
      (this.el = R.Has(t, "el") ? R.Select.el(t.el)[0] : document),
      R.BM(this, ["run"]);
  }
  on() {
    this.l("a");
  }
  off() {
    this.l("r");
  }
  l(t) {
    R.L(this.el, t, "mousemove", this.run);
  }
  run(t) {
    this.cb(t.pageX, t.pageY, t);
  }
}
class Timer {
  constructor() {
    (this.on = !1),
      (this._ = new R.Timer({
        delay: 300,
        cb: (t) => {
          this.on = !1;
        },
      }));
  }
  run() {
    this._.run(), this.on || (_A.e.p.remove(), (this.on = !0));
  }
}
class S {
  constructor() {
    (this.rqd = !1),
      (this.min = 0),
      (this.isDown = !1),
      (this.isDrag = !1),
      (this.prev = 0),
      R.BM(this, ["sFn", "sUp", "move", "down", "up"]),
      (this.scrollV = new SVirtual({
        cb: this.sFn,
      })),
      (this.mm = new MM({
        cb: this.move,
      }));
  }
  intro() {
    var t = _A,
      t = ((this._ = {}), t.config.routes),
      s = Object.keys(t),
      e = s.length;
    for (let t = 0; t < e; t++) {
      var i = s[t];
      this._[i] = {
        curr: 0,
        targ: 0,
      };
    }
  }
  init() {
    var t = _A;
    (this.isHo = t.is.ho),
      (this.isSe = t.is.se),
      this.scrollV.init({
        v: this.isSe,
      }),
      (this.url = t.route.new.url),
      this.sUpAll(0),
      this.isSe && (this.seClicked = !1),
      (this.timer = new Timer()),
      this.resize();
  }
  resize() {
    var t;
    this.isSe && (this.seClicked = !1),
      this.scrollV.resize(),
      this.isSe
        ? ((t = _A.e.se),
          (this.max = t.gl.max),
          (t = t.gl._.s[t.index].x),
          this.sUpAll(t))
        : ((t = (t = R.G.class("p"))[t.length - 1]),
          (this.max = Math.max(t.offsetHeight - _A.win.h, 0)),
          this.sUpAll(this.clamp(this._[this.url].targ)));
  }
  sFn(t) {
    this.isDown ||
      _A.e.ho.gl.isIn ||
      (this.isSe && (this.seClicked = !1),
      this.sUp(this.clamp(this._[this.url].targ + t)),
      this.timer.run());
  }
  sUp(t) {
    this._[this.url].targ = t;
  }
  down(t) {
    t.ctrlKey
      ? R.PD(t)
      : ((this.isDown = !0),
        (this.isDrag = !1),
        (t = "touchstart" === t.type ? t.changedTouches[0] : t),
        (this.start = this.isSe ? t.pageX : t.pageY),
        (this.targ = this._[this.url].targ),
        (this.targPrev = this.targ));
  }
  move(t, s, e) {
    R.PD(e),
      this.isDown &&
        ((e = this.isSe ? t : s),
        (this.isDrag = 6 < Math.abs(e - this.start)),
        _A.e.ho.gl.isIn ||
          (e > this.prev && this.targ === this.min
            ? (this.start = e - (this.targPrev - this.min) / 2)
            : e < this.prev &&
              this.targ === this.max &&
              (this.start = e - (this.targPrev - this.max) / 2),
          (this.prev = e),
          (this.targ = 2 * -(e - this.start) + this.targPrev),
          (this.targ = this.clamp(this.targ)),
          this.sUp(this.targ),
          this.isDrag && this.isSe && (this.seClicked = !1),
          this.isDrag && this.timer.run()));
  }
  up(t) {
    var s;
    this.isDown &&
      ((this.isDown = !1),
      this.isDrag ||
        2 === t.button ||
        ((t = _A),
        this.isSe
          ? ((this.seClicked = !1),
            -1 < (s = t.e.se.gl).over && ((this.seClicked = !0), s.click()))
          : this.isHo &&
            ((s = t.e.ho.gl).isIn
              ? s.clickOut()
              : -1 < s.over && s.clickIn())));
  }
  loop() {
    var t = this.url;
    (this.rqd = R.Une(this._[t].curr, this._[t].targ, 3)),
      this.rqd &&
        (this._[t].curr = R.Damp(this._[t].curr, this._[t].targ, 0.09));
  }
  sUpAll(t) {
    var s = this.url;
    (this._[s].targ = t),
      (this._[s].curr = t),
      (this.targ = t),
      (this.targPrev = t);
  }
  clamp(t) {
    return R.R(R.Clamp(t, this.min, this.max));
  }
  l(t) {
    var s = document;
    R.L(s, t, "mousedown", this.down),
      R.L(s, t, "touchstart", this.down),
      R.L(s, t, "mouseup", this.up),
      R.L(s, t, "touchend", this.up);
  }
  on() {
    this.scrollV.on(), this.mm.on(), this.l("a");
  }
  off() {
    this.scrollV.off(), this.mm.off(), this.l("r");
  }
}
class C {
  constructor() {
    (this._ = [-1, -1]),
      R.BM(this, ["move"]),
      (this.mm = new MM({
        cb: this.move,
      }));
  }
  move(t, s) {
    this._ = [t, s];
  }
  run() {
    this.mm.on();
  }
}
class P {
  constructor() {
    this.on = !1;
  }
  intro() {
    this.c = R.G.id("_c");
  }
  add() {
    this.on || ((this.on = !0), R.T(this.c, 0, 0));
  }
  remove() {
    this.on && ((this.on = !1), R.T(this.c, -110, 0));
  }
}
class SInter {
  constructor(t) {
    var s = _A,
      s = ((this.arr = []), (this.arrL = 0), s.route.new),
      s = ((this.url = s.url), R.G.class("p")),
      e = s[s.length - 1].children,
      i = e.length;
    for (let t = 0; t < i; t++) {
      var r = e[t];
      r.classList.contains("_ns") ||
        ((this.arr[this.arrL] = {
          dom: r,
          inside: {},
        }),
        this.arrL++);
    }
    this.resize();
  }
  resize() {
    const s = _A;
    var e = s.e.s._[this.url].curr,
      i = s.win.h;
    for (let t = 0; t < this.arrL; t++) {
      const s = this.arr[t];
      this.draw(s, -e);
      var r = s.dom.getBoundingClientRect().top - e - i,
        h = Math.min(r, 0) + s.dom.offsetHeight + i;
      (s.inside.start = r), (s.inside.end = h + Math.max(r, 0)), (s.isOut = !1);
    }
    this.run();
  }
  run() {
    var s = _A.e.s._[this.url].curr;
    for (let t = 0; t < this.arrL; t++) {
      var e = this.arr[t];
      s > e.inside.start && s <= e.inside.end
        ? (e.isOut && (e.isOut = !1), this.draw(e, s))
        : e.isOut || ((e.isOut = !0), this.draw(e, s));
    }
  }
  draw(t, s) {
    R.T(t.dom, 0, R.R(-s), "px");
  }
}
class Active {
  constructor() {
    this.page = ["ab", "ho", "se"];
  }
  intro() {
    (this.un = R.G.class("un", R.G.id("n"))), this.up();
  }
  up() {
    var t = _A,
      s = t.route.old.page,
      s = (s && this.upC(s, "remove"), t.route.new.page);
    this.upC(s, "add");
  }
  upC(t, s) {
    t = this.page.indexOf(t);
    -1 < t &&
      (R.PE["add" === s ? "none" : "all"](this.un[t].parentNode),
      this.un[t].classList[s]("fx"));
  }
}
class Obj {
  constructor(t) {
    var s = t.index,
      e = t.delay;
    (this.propArr = t.prop),
      (this.propArrL = this.propArr.length),
      (this.prop = []),
      (this.prog = {
        show: {
          start: s * e,
          end: 1 - (t.length - 1 - s) * e,
        },
        hide: {
          start: 0,
          end: 1,
        },
      }),
      (this.curr = []);
    for (let t = 0; t < this.propArrL; t++) {
      var i = this.propArr[t];
      (this.curr[t] = i[1]),
        (this.prop[t] = {
          round: "y" === i[0] || "x" === i[0] ? 3 : 6,
        });
    }
  }
  prepare(s) {
    this.isShow = s.isShow;
    var e = s.isRunning;
    for (let t = 0; t < this.propArrL; t++) {
      var i = this.propArr[t],
        r = i[1],
        h = i[2];
      "opacity" === i[0]
        ? this.isShow
          ? ((this.prop[t].start = e ? this.curr[t] : r),
            (this.prop[t].end = h))
          : ((this.prop[t].start = this.curr[t]), (this.prop[t].end = r))
        : this.isShow
        ? ((this.prop[t].start = e ? this.curr[t] : r), (this.prop[t].end = 0))
        : ((this.prop[t].start = this.curr[t]),
          (this.prop[t].end = s.propEndIsEnd ? h : r));
    }
    var t = this.isShow && !e ? this.prog.show : this.prog.hide;
    (this.prog.start = t.start), (this.prog.end = t.end);
  }
  loop(t) {
    var s = t.el,
      e = t.elL,
      i = [0, 0],
      r = R.Remap(this.prog.start, this.prog.end, 0, 1, t.prog),
      h = t.rEase(r);
    let a = "",
      n = "";
    for (let t = 0; t < this.propArrL; t++) {
      var o = this.propArr[t][0],
        l = this.prop[t];
      (this.curr[t] = R.R(R.Lerp(l.start, l.end, h), l.round)),
        "y" === o
          ? (i[1] = this.curr[t])
          : "x" === o
          ? (i[0] = this.curr[t])
          : "rotateX" === o
          ? (a = " rotateX(" + this.curr[t] + "deg)")
          : "opacity" === o && (n = this.curr[t]);
    }
    for (let t = 0; t < e; t++) {
      var p = s[t].style;
      (p.transform = "translate3d(" + i[0] + "%," + i[1] + "%,0)" + a),
        "" !== n && (p.opacity = n);
    }
  }
}
class ObjArr {
  constructor(t) {
    (this.a = _A), (this.delay = t.delay);
    var s = t.el,
      e = t.descendant,
      i = t.prop,
      r = t.indexStart,
      h =
        ((this.random = t.random),
        (this.length = t.length),
        (this.element = []),
        (this.elementL = []),
        (this.obj = []),
        (this.objL = s.length),
        (this.randUniq = []),
        t.objLength);
    for (let t = 0; t < this.objL; t++)
      (this.element[t] = 2 === e ? s[t].children : [s[t]]),
        (this.elementL[t] = this.element[t].length),
        (this.obj[t] = new Obj({
          index: r + t,
          length: h,
          delay: this.delay,
          prop: i,
        })),
        (this.randUniq[t] = t);
  }
  prepare(s) {
    !s.isRunning && this.random && (this.randUniq = R.Rand.uniq(this.objL));
    for (let t = 0; t < this.objL; t++) this.obj[t].prepare(s);
  }
  loop(t) {
    var s = t.prog,
      e = t.rEase;
    for (let t = 0; t < this.objL; t++)
      this.obj[t].loop({
        el: this.element[this.randUniq[t]],
        elL: this.elementL[t],
        prog: s,
        rEase: e,
      });
  }
}
class Anima {
  constructor(t) {
    (this.a = _A), (this.delay = t.delay || 0);
    var s = t.lineStartTogether || !1,
      e = t.descendant,
      i = t.random || !1;
    let r = t.el;
    R.Is.und(r.length) && (r = [r]), (this.lineL = r.length);
    var h = t.prop,
      t =
        ((this.start = h[0][1]), (this.objLength = this.lineL), r[0].children);
    0 < e && 1 === this.lineL && 1 < t.length && (this.objLength = t.length),
      (this.line = []);
    let a = 0;
    for (let t = 0; t < this.lineL; t++) {
      var n = 0 === e ? [r[t]] : r[t].children;
      (this.line[t] = new ObjArr({
        length: this.lineL,
        objLength: this.objLength,
        indexStart: a,
        descendant: e,
        el: n,
        prop: h,
        delay: this.delay,
        random: i,
      })),
        s || (a += this.line[t].objL);
    }
  }
  motion(t) {
    R.Is.def(this.letterAnim) && this.letterAnim.pause();
    var s = "show" === t.action,
      e = t.d;
    const i = R.Ease[t.e],
      r = this.line,
      h = this.lineL;
    var a = r[0].obj[0].curr[0];
    let n = !1,
      o =
        (s ||
          (n =
            (this.start < 0 && 0 < a) ||
            (0 < this.start && a < 0) ||
            Math.abs(a) < Math.abs(0.3 * this.start)),
        t.delay);
    s && this.isRunning && (o = 0);
    for (let t = 0; t < h; t++)
      r[t].prepare({
        isShow: s,
        isRunning: this.isRunning,
        propEndIsEnd: n,
      });
    a = s ? 1 - (this.objLength - 1) * this.delay : 1;
    return (
      (this.letterAnim = new R.M({
        delay: o,
        d: e / a,
        update: (t) => {
          var s = t.prog;
          for (let t = 0; t < h; t++)
            r[t].loop({
              prog: s,
              rEase: i,
            });
        },
        cb: (t) => {
          this.isRunning = !1;
        },
      })),
      {
        play: (t) => {
          (this.isRunning = !0), this.letterAnim.play();
        },
      }
    );
  }
}
let Fx$4 = class {
  intro() {
    var t = R.G.class("y-w", R.G.id("n"));
    this.y = new Anima({
      descendant: 1,
      el: t,
      prop: [["y", 110, -110]],
      delay: 0.05,
    });
  }
  show(t) {
    var s = _A,
      t = t.delay,
      s = s.t.d.show;
    const e = this.y.motion({
      action: "show",
      d: s,
      e: "o6",
      delay: t,
    });
    return {
      play: (t) => {
        e.play();
      },
    };
  }
};
class Nav {
  constructor() {
    (this.active = new Active()), (this.fx = new Fx$4());
  }
  intro() {
    this.active.intro(), this.fx.intro();
  }
}
let GL$1 = class {
    init() {
      var t = _A,
        t =
          ((this.url = t.route.new.url),
          (this.n = R.G.id("n")),
          (this.nR = R.G.id("n-r")),
          (this.nA = R.G.tag("a", this.n)),
          (this.nAL = this.nA.length),
          (this.li = R.G.id("ho-l").children),
          (this.sail = R.G.id("ho-s")),
          t.rgl._[this.url]);
      if (
        ((this.s = t.plane.small),
        (this.l = t.plane.large),
        (this.texL = t.planeL.small),
        R.Is.und(this.ty))
      ) {
        this.ty = [];
        for (let t = 0; t < this.texL; t++) this.ty[t] = 0;
      }
      (this.isIn = !1), (this.inIndex = -1), this.resize();
    }
    resize() {
      var s = _A,
        t = s.win.h,
        e = s.win.w,
        e = 1e3 < e ? 1 : e / 1e3,
        i = s.winWpsdW,
        r = this.n.offsetHeight,
        h = 8 * i,
        a = ((this.columnL = 12), Math.ceil(this.texL / this.columnL));
      let n;
      n =
        1 === a
          ? this.texL - 1
          : (o = this.texL - this.columnL * (a - 1)) < this.columnL - 6
          ? this.columnL - 1 + 6 * (a - 2)
          : o - 1 + 6 * (a - 1);
      var o = s.t.d.show,
        a = 1 - 0.006 * n;
      (this.showD = o / a), (this.showProg = []);
      for (let t = 0; t < this.texL; t++) {
        var l = Math.floor(t / this.columnL),
          l = (t % this.columnL) + 6 * l;
        this.showProg[t] = {
          start: R.R(0.006 * l, 4),
          end: R.R(1 - 0.006 * (n - l), 4),
        };
      }
      (o = 16 * e), (this.liTextAreaH = 24 * e), (a = 42 * i), (e = 104 * i);
      const p = 16 * i,
        c = this.liTextAreaH + (16 * e) / 9 + a,
        d = {
          x: h,
          y: o + 100 * i + a + this.liTextAreaH,
        };
      (this.w = e),
        (this.wMargeX = this.w + p),
        (this.y = []),
        (this.x = []),
        (this.h = []);
      for (let t = 0; t < this.texL; t++)
        (this.y[t] = d.y + Math.floor(t / this.columnL) * c),
          (this.h[t] = this.w * this.s[t].media.ratio.hw),
          (this.x[t] = d.x + (t % this.columnL) * this.wMargeX);
      this.yShow = t - this.y[0] + r;
      for (let t = 0; t < this.texL; t++) {
        var v = this.li[t].children[0];
        R.O(v, 1),
          s.intro &&
            (R.T(v, 0, this.yShow, "px"), (this.s[t].move.ease.y = this.yShow));
      }
      for (let t = 0; t < this.texL; t++) {
        var u = this.s[t].move.lerp;
        (u.x = this.x[t]), (u.w = this.w), (u.h = this.h[t]);
      }
      var g = s.lSize;
      for (let e = 0; e < this.texL; e++) {
        var m = this.s[e].media.ratio;
        let t = g,
          s = g;
        1 < m.wh ? (s = g * m.hw) : (t = g * m.wh);
        m = this.l[e].move.lerp;
        (m.x = h),
          (m.y = h),
          (m.w = t),
          (m.h = s),
          (m.o = e === this.inIndex ? 1 : 0);
      }
      (this.cNavH = t - r), this.texSet();
    }
    overFn() {
      var t = _A.e,
        s = t.c._,
        e = s[0],
        i = s[1],
        r = t.s.timer.on;
      if (((this.over = -1), !this.isIn)) {
        if (i <= this.cNavH)
          for (let t = 0; t < this.texL; t++) {
            var h = this.s[t].move.lerp,
              a = h.y - this.liTextAreaH,
              n = this.liTextAreaH + h.h;
            if (e >= h.x && e <= h.x + h.w && a <= i && i <= a + n && !r) {
              this.over = t;
              break;
            }
          }
        -1 === this.over ? t.p.remove() : r || t.p.add();
      }
    }
    clickIn() {
      (this.isIn = !0), (this.inIndex = this.over), _A.e.p.remove();
      for (let t = 0; t < this.nAL; t++)
        R.PE.none(this.nA[t]), R.O(this.nA[t], 0);
      for (let t = 0; t < this.texL; t++) this.s[t].move.lerp.o = 0;
      R.O(this.sail, 1),
        (this.l[this.inIndex].move.lerp.o = 1),
        (this.nR.textContent = this.li[this.inIndex].children[0].textContent);
    }
    clickOut() {
      for (let t = 0; t < this.texL; t++) this.s[t].move.lerp.o = 1;
      (this.l[this.inIndex].move.lerp.o = 0),
        R.O(this.sail, 0),
        (this.nR.textContent = "CATALOGUED WORK");
      for (let t = 0; t < this.nAL; t++)
        R.O(this.nA[t], 1), R.PE.all(this.nA[t]);
      (this.isIn = !1), (this.inIndex = -1);
    }
    loop() {
      this.texSet(), this.overFn();
    }
    texSet() {
      var s = _A.e.s._[this.url].curr;
      for (let t = 0; t < this.texL; t++) this.s[t].move.lerp.y = this.y[t] - s;
    }
    hide() {
      const h = _A,
        a = h.t.e.o2,
        n = h.t.e.io.front,
        o = h.t.e.io.back;
      var t = h.t.d.tr;
      R.Is.def(this.anim) && this.anim.pause();
      const l = [];
      for (let t = 0; t < this.texL; t++) {
        var s = this.s[t].move.ease;
        (s.maskBT = 0), (s.color = 0), (l[t] = s.y);
      }
      return (
        (this.anim = new R.M({
          d: t,
          update: (t) => {
            var s = a(t.prog),
              e = n(t.prog),
              i = o(t.prog);
            for (let t = 0; t < this.texL; t++) {
              var r = this.s[t].move.ease,
                r =
                  ((r.color = R.Lerp(0, 1, s)),
                  (r.y = R.Lerp(l[t], h.tr.y, i)),
                  (r.maskBT = R.Lerp(0, 1, e)),
                  R.Lerp(this.ty[t], 0, i));
              R.T(this.li[t].children[0], 0, r, "px");
            }
          },
        })),
        {
          play: (t) => {
            this.anim.play();
          },
        }
      );
    }
    show(t) {
      const i = _A.t.e.o6;
      R.Is.def(this.anim) && this.anim.pause();
      for (let t = 0; t < this.texL; t++) {
        var s = this.s[t].move.ease;
        (s.maskBT = 0),
          (s.color = 0),
          (s.y = this.yShow),
          R.T(this.li[t].children[0], 0, this.yShow, "px");
      }
      return (
        (this.anim = new R.M({
          d: this.showD,
          delay: t.delay,
          update: (s) => {
            for (let t = 0; t < this.texL; t++) {
              var e = i(
                R.iLerp(this.showProg[t].start, this.showProg[t].end, s.prog)
              );
              (this.ty[t] = R.Lerp(this.yShow, 0, e)),
                (this.s[t].move.ease.y = this.ty[t]),
                R.T(this.li[t].children[0], 0, this.ty[t], "px");
            }
          },
        })),
        {
          play: (t) => {
            this.anim.play();
          },
        }
      );
    }
  },
  Fx$3 = class {
    init() {
      var t = R.G.class("y-w", R.G.id("ho-h"));
      this.nav = R.G.id("ho-n");
      this.hero = new Anima({
        descendant: 1,
        el: t,
        prop: [["y", 110, -110]],
        delay: 0.03,
      });
    }
    show(t) {
      var s = _A,
        t = t.delay,
        s = s.t.d.show;
      const e = this.hero.motion({
          action: "show",
          d: s,
          e: "o6",
          delay: t,
        }),
        i = new R.Delay((t) => {
          R.T(this.nav, 0, 0);
        }, t);
      return (
        R.T(this.nav, 0, 110),
        {
          play: (t) => {
            i.run(), e.play();
          },
        }
      );
    }
  };
class Ho {
  constructor() {
    (this.fx = new Fx$3()), (this.gl = new GL$1());
  }
  init() {
    (this.rqd = _A.is.ho), this.rqd && (this.fx.init(), this.gl.init());
  }
  resize() {
    this.rqd && this.gl.resize();
  }
  loop() {
    this.rqd && this.gl.loop();
  }
}
let Fx$2 = class {
  init() {
    var t = R.G.id("a-t"),
      t = R.G.class("y-w", t),
      s = R.G.id("a-0"),
      s = R.G.class("y-w", s),
      e = R.G.id("a-1").children,
      i = R.G.class("y-w", e[0]),
      e = R.G.class("y-w", e[1]),
      r = [["y", 110, -110]];
    (this.title = new Anima({
      descendant: 1,
      el: t,
      prop: r,
      delay: 0.04,
    })),
      (this.a0 = new Anima({
        descendant: 1,
        el: s,
        prop: r,
        delay: 0.06,
      })),
      (this.a10 = new Anima({
        descendant: 1,
        el: i,
        prop: r,
        delay: 0.06,
      })),
      (this.a11 = new Anima({
        descendant: 1,
        el: e,
        prop: r,
        delay: 0.06,
      }));
  }
  show(t) {
    var s = _A,
      t = t.delay,
      s = s.t.d.show;
    const e = this.title.motion({
        action: "show",
        d: s,
        e: "o6",
        delay: t,
      }),
      i = this.a0.motion({
        action: "show",
        d: s,
        e: "o6",
        delay: t + 200,
      }),
      r = this.a10.motion({
        action: "show",
        d: s,
        e: "o6",
        delay: t + 300,
      }),
      h = this.a11.motion({
        action: "show",
        d: s,
        e: "o6",
        delay: t + 400,
      });
    return {
      play: (t) => {
        e.play(), i.play(), r.play(), h.play();
      },
    };
  }
};
class Ab {
  constructor() {
    this.fx = new Fx$2();
  }
  init() {
    (this.rqd = _A.is.ab), this.rqd && this.fx.init();
  }
}
class GL {
  constructor() {
    this._ = {
      s: [],
      l: [],
    };
  }
  initBS() {
    var s = _A,
      t =
        ((this.url = s.route.new.url),
        (this.n = R.G.id("n")),
        s.rgl._[this.url]);
    (this.s = t.plane.small),
      (this.l = t.plane.large),
      (this.texL = t.planeL.small),
      (this.texMax = this.texL - 1),
      (this.o = []);
    for (let t = 0; t < this.texL; t++) {
      var e = t === s.e.se.index ? 1 : 0;
      this.o[t] = {
        curr: e,
        targ: e,
      };
    }
    this.resizeBS();
  }
  resizeBS() {
    var t = _A,
      i = t.win.h,
      s = t.winWpsdW,
      r = this.n.offsetHeight,
      h = 10 * s,
      a = ((this.sMargeSemi = 0.5 * h), 70 * s),
      n = 8 * s,
      o = Math.min(t.lSize, i - r - a - h);
    let l = 0;
    for (let e = (this.max = 0); e < this.texL; e++) {
      e === this.texMax && (this.max = R.R(l));
      var p = this.s[e].media.ratio,
        c = a * p.wh;
      (this._.s[e] = {
        y: 0,
        h: a,
        w: c,
        x: l,
      }),
        (l += c + h);
      let t = o,
        s = o;
      1 < p.wh ? (s = o * p.hw) : (t = o * p.wh);
      c = i - s - r;
      this._.l[e] = {
        y: c,
        h: s,
        w: t,
        x: n,
      };
    }
    this.lYShow = [];
    for (let t = 0; t < this.texL; t++) {
      var e = this.s[t].move.lerp,
        e =
          ((e.y = this._.s[t].y),
          (e.w = this._.s[t].w),
          (e.h = this._.s[t].h),
          this.l[t].move.lerp),
        d = this._.l[t].h;
      (e.x = this._.l[t].x),
        (e.y = this._.l[t].y),
        (e.w = this._.l[t].w),
        (e.h = d),
        (this.lYShow[t] = d + r);
    }
    if (((this.sYShow = -(a + h)), t.intro)) {
      var v = ["s", "l"];
      for (let t = 0; t < 2; t++) {
        var u = v[t],
          g = 0 === t;
        for (let t = 0; t < this.texL; t++)
          this[u][t].move.ease.y = g ? this.sYShow : this.lYShow[t];
      }
    }
  }
  initAS() {
    this.resizeAS();
  }
  resizeAS() {
    this.texSet();
  }
  overFn() {
    var t = _A.e,
      s = t.c._,
      e = s[0],
      i = s[1],
      s = t.s.timer.on;
    this.over = -1;
    for (let t = 0; t < this.texL; t++) {
      var r = this.s[t].move.lerp,
        h = e >= r.x && e <= r.x + r.w,
        r = i >= r.y && i <= r.y + r.h;
      if (h && r) {
        this.over = t;
        break;
      }
    }
    -1 === this.over ? t.p.remove() : s || t.p.add();
  }
  click() {
    var t = _A,
      s = t.e.se;
    (t.e.s._[this.url].targ = s.gl._.s[this.over].x),
      s.index !== this.over &&
        ((this.o[s.index].targ = 0),
        (this.o[this.over].targ = 1),
        (s.index = this.over));
  }
  loop() {
    this.texSet(), this.overFn();
  }
  texSet() {
    var t = _A,
      s = t.e.s._[this.url].curr,
      e = t.e.se,
      t = t.e.s.seClicked;
    let i = 0;
    for (let t = this.texMax; -1 < t; t--)
      if (this._.s[t].x - this.sMargeSemi < s) {
        i = t;
        break;
      }
    t ||
      (i !== e.index &&
        ((this.o[e.index].targ = 0),
        (this.o[e.index].curr = 0),
        (this.o[i].targ = 1),
        (e.index = i)));
    for (let t = 0; t < this.texL; t++)
      (this.s[t].move.lerp.x = this._.s[t].x - s),
        (this.o[t].curr = R.Damp(this.o[t].curr, this.o[t].targ, 0.7)),
        (this.l[t].move.lerp.o = this.o[t].curr);
  }
  hide() {
    const a = _A,
      n = a.t.e.o2,
      o = a.t.e.io.front,
      l = a.t.e.io.back;
    var t = a.t.d.tr;
    const p = ["s", "l"],
      c = (this.pause(), {});
    for (let t = 0; t < 2; t++) {
      var s = p[t];
      c[s] = [];
      for (let t = 0; t < this.texL; t++) {
        var e = this[s][t].move.ease;
        (e.maskBT = 0), (e.color = 0), (c[s][t] = e.y);
      }
    }
    return (
      (this.aHide = new R.M({
        d: t,
        update: (t) => {
          var s = n(t.prog),
            e = o(t.prog),
            i = l(t.prog);
          for (let t = 0; t < 2; t++) {
            var r = p[t];
            for (let t = 0; t < this.texL; t++) {
              var h = this[r][t].move.ease;
              (h.color = R.Lerp(0, 1, s)),
                (h.y = R.Lerp(c[r][t], a.tr.y, i)),
                (h.maskBT = R.Lerp(0, 1, e));
            }
          }
        },
      })),
      {
        play: (t) => {
          this.aHide.play();
        },
      }
    );
  }
  show(t) {
    var s = _A,
      e = t.delay;
    const i = s.t.e.o6;
    var r = s.t.d.show,
      h = s.e.se.index,
      a = ["s", "l"];
    this.pause();
    for (let t = 0; t < 2; t++) {
      var n = a[t],
        o = "s" === n;
      for (let t = 0; t < this.texL; t++) {
        var l = this[n][t].move.ease;
        (l.maskBT = 0),
          (l.color = 0),
          (l.y = o ? this.sYShow : this.lYShow[t]),
          o || (l.ty = 0.4);
      }
    }
    this.sShow = [];
    for (let s = 0; s < this.texL; s++) {
      var p = 16 * Math.abs((s - (h % this.texL) + this.texL) % this.texL);
      this.sShow[s] = new R.M({
        d: r,
        delay: e + 300 + p,
        update: (t) => {
          this.s[s].move.ease.y = R.Lerp(this.sYShow, 0, i(t.prog));
        },
      });
    }
    return (
      (this.lShow = new R.M({
        d: r,
        delay: e,
        update: (t) => {
          var s = i(t.prog);
          for (let t = 0; t < this.texL; t++) {
            var e = this.l[t].move.ease;
            (e.y = R.Lerp(this.lYShow[t], 0, s)), (e.ty = R.Lerp(0.4, 0, s));
          }
        },
      })),
      {
        play: (t) => {
          this.lShow.play();
          for (let t = 0; t < this.texL; t++) this.sShow[t].play();
        },
      }
    );
  }
  pause() {
    if ((R.Is.def(this.aHide) && this.aHide.pause(), R.Is.def(this.sShow))) {
      this.lShow.pause();
      for (let t = 0; t < this.texL; t++) this.sShow[t].pause();
    }
  }
}
class Se {
  constructor() {
    this.gl = new GL();
  }
  initBS() {
    (this.rqd = _A.is.se), this.rqd && ((this.index = 0), this.gl.initBS());
  }
  initAS() {
    this.rqd && this.gl.initAS();
  }
  resizeBS() {
    this.rqd && this.gl.resizeBS();
  }
  resizeAS() {
    this.rqd && this.gl.resizeAS();
  }
  loop() {
    this.rqd && this.gl.loop();
  }
}
class E {
  constructor() {
    var t = _A,
      s = {
        front: R.Ease4([0.76, 0, 0.2, 1]),
        back: R.Ease4([0.71, 0, 0.25, 1]),
      },
      e = R.Ease4([0.16, 1, 0.3, 1]),
      i = R.Ease4([0.5, 1, 0.89, 1]);
    (t.t = {
      d: {
        tr: 1e3,
        max: 2e3,
        show: 1300,
        hide: 500,
      },
      e: {
        o6: e,
        o2: i,
        io: {
          front: s.front,
          back: s.back,
        },
      },
    }),
      R.BM(this, ["resize", "loop"]),
      (this.raf = new R.RafR(this.loop)),
      (this.s = new S()),
      (this.c = new C()),
      (this.p = new P()),
      (this.nav = new Nav()),
      (this.ho = new Ho()),
      (this.ab = new Ab()),
      (this.se = new Se());
  }
  intro() {
    this.s.intro(), this.p.intro(), this.nav.intro();
  }
  init() {
    this.se.initBS(),
      this.s.init(),
      (this.sInter = new SInter()),
      this.se.initAS(),
      this.ho.init(),
      this.ab.init();
  }
  resize() {
    this.se.resizeBS(),
      this.s.resize(),
      this.sInter.resize(),
      this.ho.resize(),
      this.se.resizeAS();
  }
  run() {
    new R.ROR(this.resize).on(), this.raf.run(), this.c.run();
  }
  on() {
    this.s.on();
  }
  loop() {
    var t = _A;
    this.s.loop(),
      this.ho.loop(),
      this.se.loop(),
      t.e.s.rqd && this.sInter.run();
  }
  off() {
    this.s.off();
  }
}
class Page {
  constructor(t) {
    const s = _A;
    var t = t.intro,
      e = s.is,
      i = s.was;
    const r = [];
    var h = s.config.isLocal ? 0 : 600;
    (t
      ? (r.push(
          s.e.nav.fx.show({
            delay: h,
          })
        ),
        e.ho
          ? (r.push(
              s.e.ho.gl.show({
                delay: h,
              })
            ),
            r.push(
              s.e.ho.fx.show({
                delay: 300 + h,
              })
            ))
          : e.ab
          ? r.push(
              s.e.ab.fx.show({
                delay: h,
              })
            )
          : e.se &&
            r.push(
              s.e.se.gl.show({
                delay: h,
              })
            ),
        new R.Delay((t) => {
          (s.intro = !1), s.e.on(), R.PE.none(R.G.id("lo")), (s.mutating = !1);
        }, h))
      : (i.ho ? r.push(s.e.ho.gl.hide()) : i.se && r.push(s.e.se.gl.hide()),
        e.ho
          ? (r.push(
              s.e.ho.gl.show({
                delay: 480,
              })
            ),
            r.push(
              s.e.ho.fx.show({
                delay: 700,
              })
            ))
          : e.ab
          ? r.push(
              s.e.ab.fx.show({
                delay: 600,
              })
            )
          : e.se &&
            r.push(
              s.e.se.gl.show({
                delay: 480,
              })
            ),
        new R.Delay((t) => {
          s.e.on();
        }, 1e3).run(),
        new R.Delay((t) => {
          s.page.removeOld(), (s.mutating = !1);
        }, s.t.d.show))
    ).run();
    const a = r.length;
    return {
      play: (t) => {
        for (let t = 0; t < a; t++) r[t].play();
      },
    };
  }
}
let Fx$1 = class {
  constructor() {
    var t = new Page({
        intro: !0,
      }),
      s = R.G.class("lo-y", R.G.id("lo")),
      e = new R.TL();
    for (let t = 0; t < 2; t++)
      e.from({
        el: s[t],
        p: {
          y: [0, -100],
        },
        d: 700,
        e: "i4",
      });
    e.from({
      el: s[2],
      p: {
        y: [0, -110],
      },
      d: 700,
      e: "i4",
    }),
      t.play(),
      e.play();
  }
};
function create() {
  var t = new Float32Array(16);
  return (t[0] = 1), (t[5] = 1), (t[10] = 1), (t[15] = 1), t;
}
function identity(t) {
  return (
    (t[0] = 1),
    (t[1] = 0),
    (t[2] = 0),
    (t[3] = 0),
    (t[4] = 0),
    (t[5] = 1),
    (t[6] = 0),
    (t[7] = 0),
    (t[8] = 0),
    (t[9] = 0),
    (t[10] = 1),
    (t[11] = 0),
    (t[12] = 0),
    (t[13] = 0),
    (t[14] = 0),
    (t[15] = 1),
    t
  );
}
function invert(t, s) {
  var e = s[0],
    i = s[1],
    r = s[2],
    h = s[3],
    a = s[4],
    n = s[5],
    o = s[6],
    l = s[7],
    p = s[8],
    c = s[9],
    d = s[10],
    v = s[11],
    u = s[12],
    g = s[13],
    R = s[14],
    s = s[15],
    m = d * s,
    f = R * v,
    w = o * s,
    y = R * l,
    x = o * v,
    b = d * l,
    A = r * s,
    L = R * h,
    _ = r * v,
    S = d * h,
    M = r * l,
    T = o * h,
    I = p * g,
    E = u * c,
    O = a * g,
    D = u * n,
    k = a * c,
    G = p * n,
    P = e * g,
    F = u * i,
    H = e * c,
    N = p * i,
    C = e * n,
    z = a * i,
    B = m * n + y * c + x * g - (f * n + w * c + b * g),
    U = f * i + A * c + S * g - (m * i + L * c + _ * g),
    g = w * i + L * n + M * g - (y * i + A * n + T * g),
    i = b * i + _ * n + T * c - (x * i + S * n + M * c),
    n = 1 / (e * B + a * U + p * g + u * i);
  return (
    (t[0] = n * B),
    (t[1] = n * U),
    (t[2] = n * g),
    (t[3] = n * i),
    (t[4] = n * (f * a + w * p + b * u - (m * a + y * p + x * u))),
    (t[5] = n * (m * e + L * p + _ * u - (f * e + A * p + S * u))),
    (t[6] = n * (y * e + A * a + T * u - (w * e + L * a + M * u))),
    (t[7] = n * (x * e + S * a + M * p - (b * e + _ * a + T * p))),
    (t[8] = n * (I * l + D * v + k * s - (E * l + O * v + G * s))),
    (t[9] = n * (E * h + P * v + N * s - (I * h + F * v + H * s))),
    (t[10] = n * (O * h + F * l + C * s - (D * h + P * l + z * s))),
    (t[11] = n * (G * h + H * l + z * v - (k * h + N * l + C * v))),
    (t[12] = n * (O * d + G * R + E * o - (k * R + I * o + D * d))),
    (t[13] = n * (H * R + I * r + F * d - (P * d + N * R + E * r))),
    (t[14] = n * (P * o + z * R + D * r - (C * R + O * r + F * o))),
    (t[15] = n * (C * d + k * r + N * o - (H * o + z * d + G * r))),
    t
  );
}
function perspective(t, s, e, i, r) {
  var s = 1 / Math.tan(0.5 * s),
    h = 1 / (i - r);
  return (
    (t[0] = s / e),
    (t[1] = 0),
    (t[2] = 0),
    (t[3] = 0),
    (t[4] = 0),
    (t[5] = s),
    (t[6] = 0),
    (t[7] = 0),
    (t[8] = 0),
    (t[9] = 0),
    (t[10] = (r + i) * h),
    (t[11] = -1),
    (t[12] = 0),
    (t[13] = 0),
    (t[14] = 2 * r * i * h),
    (t[15] = 0),
    t
  );
}
function multiplyFn(t, s) {
  return multiply(t, t, s);
}
function multiply(t, s, e) {
  var i = e[0],
    r = e[1],
    h = e[2],
    a = e[3],
    n = e[4],
    o = e[5],
    l = e[6],
    p = e[7],
    c = e[8],
    d = e[9],
    v = e[10],
    u = e[11],
    g = e[12],
    R = e[13],
    m = e[14],
    e = e[15],
    f = s[0],
    w = s[1],
    y = s[2],
    x = s[3],
    b = s[4],
    A = s[5],
    L = s[6],
    _ = s[7],
    S = s[8],
    M = s[9],
    T = s[10],
    I = s[11],
    E = s[12],
    O = s[13],
    D = s[14],
    s = s[15];
  return (
    (t[0] = i * f + r * b + h * S + a * E),
    (t[1] = i * w + r * A + h * M + a * O),
    (t[2] = i * y + r * L + h * T + a * D),
    (t[3] = i * x + r * _ + h * I + a * s),
    (t[4] = n * f + o * b + l * S + p * E),
    (t[5] = n * w + o * A + l * M + p * O),
    (t[6] = n * y + o * L + l * T + p * D),
    (t[7] = n * x + o * _ + l * I + p * s),
    (t[8] = c * f + d * b + v * S + u * E),
    (t[9] = c * w + d * A + v * M + u * O),
    (t[10] = c * y + d * L + v * T + u * D),
    (t[11] = c * x + d * _ + v * I + u * s),
    (t[12] = g * f + R * b + m * S + e * E),
    (t[13] = g * w + R * A + m * M + e * O),
    (t[14] = g * y + R * L + m * T + e * D),
    (t[15] = g * x + R * _ + m * I + e * s),
    t
  );
}
function translateFn(t, s) {
  return translate(t, t, s);
}
function translate(t, s, e) {
  var i,
    r,
    h,
    a,
    n,
    o,
    l,
    p,
    c,
    d,
    v,
    u,
    g = e[0],
    R = e[1],
    e = e[2];
  return (
    s === t
      ? ((t[12] = s[0] * g + s[4] * R + s[8] * e + s[12]),
        (t[13] = s[1] * g + s[5] * R + s[9] * e + s[13]),
        (t[14] = s[2] * g + s[6] * R + s[10] * e + s[14]),
        (t[15] = s[3] * g + s[7] * R + s[11] * e + s[15]))
      : ((i = s[0]),
        (r = s[1]),
        (h = s[2]),
        (a = s[3]),
        (n = s[4]),
        (o = s[5]),
        (l = s[6]),
        (p = s[7]),
        (c = s[8]),
        (d = s[9]),
        (v = s[10]),
        (u = s[11]),
        (t[0] = i),
        (t[1] = r),
        (t[2] = h),
        (t[3] = a),
        (t[4] = n),
        (t[5] = o),
        (t[6] = l),
        (t[7] = p),
        (t[8] = c),
        (t[9] = d),
        (t[10] = v),
        (t[11] = u),
        (t[12] = i * g + n * R + c * e + s[12]),
        (t[13] = r * g + o * R + d * e + s[13]),
        (t[14] = h * g + l * R + v * e + s[14]),
        (t[15] = a * g + p * R + u * e + s[15])),
    t
  );
}
function scaleFn(t, s) {
  return scale(t, t, s);
}
function scale(t, s, e) {
  var i = e[0],
    r = e[1],
    e = e[2];
  return (
    (t[0] = s[0] * i),
    (t[1] = s[1] * i),
    (t[2] = s[2] * i),
    (t[3] = s[3] * i),
    (t[4] = s[4] * r),
    (t[5] = s[5] * r),
    (t[6] = s[6] * r),
    (t[7] = s[7] * r),
    (t[8] = s[8] * e),
    (t[9] = s[9] * e),
    (t[10] = s[10] * e),
    (t[11] = s[11] * e),
    (t[12] = s[12]),
    (t[13] = s[13]),
    (t[14] = s[14]),
    (t[15] = s[15]),
    t
  );
}
class Cam {
  constructor() {
    (this.aspect = 1),
      (this.state = {
        x: null,
      }),
      (this.projectionM4 = create()),
      (this.camM4 = create());
  }
  resize(t) {
    var s = _A,
      e = s.rgl,
      t = (t && (this.aspect = t.aspect), Math.PI),
      s =
        ((this.projectionM4 = perspective(
          this.projectionM4,
          (t / 180) * 45,
          this.aspect,
          1,
          2e3
        )),
        s.winSemi);
    this.posOrigin = {
      x: s.w,
      y: -s.h,
      z: s.h / Math.tan((45 * t) / 360),
    };
    for (let t = 0; t < e.pgmL; t++)
      e.pgm[e.pgmType[t]].uniform.d.value = this.projectionM4;
    this.render({
      x: null,
    });
  }
  render(t) {
    return (
      this.state.x !== t.x &&
        ((this.state.x = t.x),
        (this.camM4 = identity(this.camM4)),
        (this.camM4 = translateFn(this.camM4, [
          this.posOrigin.x + t.x,
          this.posOrigin.y + t.y,
          this.posOrigin.z + t.z,
        ])),
        (this.viewM4 = invert(this.camM4, this.camM4))),
      this.viewM4
    );
  }
}
class Ren {
  constructor() {
    (this.gl = _A.rgl.gl),
      (this.first = !0),
      (this.state = {
        pgmCurr: null,
        viewport: {
          x: 0,
          w: 0,
          h: 0,
        },
        framebuffer: null,
        face: null,
      }),
      this.blend();
    var s = this.gl.getExtension("OES_vertex_array_object"),
      e = ["create", "bind"];
    this.vertexArray = {};
    for (let t = 0; t < 2; t++) {
      var i = e[t];
      this.vertexArray[i] = s[i + "VertexArrayOES"].bind(s);
    }
    (this.size = {
      w: 0,
      h: 0,
    }),
      (this.cam = new Cam()),
      (this.roRqd = !1);
  }
  viewport(t, s) {
    var e = this.state.viewport;
    (e.w === t && e.h === s) ||
      ((e.w = t), (e.h = s), this.gl.viewport(0, 0, t, s));
  }
  framebuffer(t) {
    this.state.framebuffer !== t &&
      ((this.state.framebuffer = t),
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, t));
  }
  face(t) {
    this.state.face !== t &&
      ((this.state.face = t),
      this.gl.enable(this.gl.CULL_FACE),
      this.gl.cullFace(this.gl[t]));
  }
  blend() {
    var t = this.gl;
    this.gl.enable(t.BLEND),
      this.gl.blendFuncSeparate(
        t.SRC_ALPHA,
        t.ONE_MINUS_SRC_ALPHA,
        t.ONE,
        t.ONE_MINUS_SRC_ALPHA
      );
  }
  resize() {
    var t = _A,
      s = t.win,
      e = this.gl,
      i = ((this.dpr = 600 < s.w ? 1.5 : 3), s.w * this.dpr),
      s = s.h * this.dpr;
    (e.canvas.width = i),
      (e.canvas.height = s),
      (this.size.w === i && this.size.h === s) ||
        (this.cam.resize({
          aspect: e.canvas.width / e.canvas.height,
        }),
        t.rgl.clear(),
        (this.size.w = i),
        (this.size.h = s),
        (this.roRqd = !0));
  }
  render(s) {
    var t = _A,
      e = Object.keys(s),
      i = e.length,
      r = ((t.rgl.rqd = !1), t.route.new.url),
      h = R.Is.def(s[r]),
      t = t.route.old.url,
      a = R.Is.def(s[t]);
    if (this.first) for (let t = 0; t < i; t++) s[e[t]].moving();
    else a && s[t].moving(), h && s[r].moving();
    if (this.first) for (let t = 0; t < i; t++) s[e[t]].draw();
    else a && s[t].draw(), h && s[r].draw();
    this.first && (this.first = !1), this.roRqd && (this.roRqd = !1);
  }
}
class Pgm {
  constructor(t) {
    var s = _A.rgl,
      s =
        ((this.gl = s.gl),
        (this.ren = s.ren),
        (this.uniform = t.uniform),
        (this.pts = t.pts),
        (this.name = t.name),
        (this.fbo = R.Is.def(t.fbo)),
        (this.pgm = this.crP()),
        this.uniform);
    (s.d = {
      type: "Matrix4fv",
    }),
      (s.e = {
        type: "Matrix4fv",
      }),
      this.getL(s, "Uniform");
  }
  crP() {
    var s = this.gl,
      e = [
        this.crS(
          "precision highp float;attribute vec2 p;attribute vec2 u;varying vec2 b;varying vec2 c;uniform vec2 s;uniform vec2 w;uniform float f;uniform mat4 d;uniform mat4 e;void main(){vec4 p=e*vec4(p.x,p.y,0.,1);gl_Position=d*p;b=(u-.5/s)+.5;b.y+=f;c=(p.xy/w)+.5;}",
          s.VERTEX_SHADER
        ),
        this.crS(
          "precision highp float;uniform sampler2D a;varying vec2 b;varying vec2 c;uniform float g;uniform vec2 h;uniform float o;void main(){gl_FragColor=vec4(mix(texture2D(a,b).rgb,vec3(.0),g*.8),step(h[0],c.y)*step(h[1],c.y)*o);}",
          s.FRAGMENT_SHADER
        ),
      ],
      i = s.createProgram();
    for (let t = 0; t < 2; t++) s.attachShader(i, e[t]);
    s.linkProgram(i);
    for (let t = 0; t < 2; t++) s.deleteShader(e[t]);
    return i;
  }
  crS(t, s) {
    s = this.gl.createShader(s);
    return this.gl.shaderSource(s, t), this.gl.compileShader(s), s;
  }
  getL(t, s) {
    for (const e in t)
      R.Has(t, e) &&
        (t[e].location = this.gl["get" + s + "Location"](this.pgm, e));
  }
  setUniform() {
    for (const r in this.uniform) {
      var t, s, e, i;
      R.Has(this.uniform, r) &&
        ((s = (t = this.uniform[r]).location),
        (i = "uniform" + (e = t.type || "1i")),
        "Matrix" === e.substring(0, 6)
          ? this.gl[i](s, !1, t.value)
          : this.gl[i](s, t.value));
    }
  }
  run() {
    (this.texIndex = -1),
      this.ren.state.pgmCurr !== this.name &&
        (this.gl.useProgram(this.pgm), (this.ren.state.pgmCurr = this.name));
  }
}
class Geo {
  constructor(t) {
    var s = _A.rgl;
    (this.gl = s.gl),
      (this.ren = s.ren),
      (this.pgm = t.pgm),
      (this.mode = t.mode),
      (this.face = t.face),
      (this.attrib = t.attrib),
      this.ren.vertexArray.bind(null),
      this.pgm.getL(this.attrib, "Attrib"),
      (this.modelM4 = create());
  }
  setVAO() {
    var t = this.ren;
    (this.vao = t.vertexArray.create()),
      t.vertexArray.bind(this.vao),
      this.setAttrib(),
      t.vertexArray.bind(null);
  }
  setAttrib() {
    var t,
      s,
      e,
      i = this.gl;
    for (const r in this.attrib)
      R.Has(this.attrib, r) &&
        ((t = this.attrib[r]),
        (s = "index" === r),
        (e = t.data.constructor) === Float32Array
          ? (t.type = i.FLOAT)
          : e === Uint16Array
          ? (t.type = i.UNSIGNED_SHORT)
          : (t.type = i.UNSIGNED_INT),
        (t.count = t.data.length / t.size),
        (t.target = s ? i.ELEMENT_ARRAY_BUFFER : i.ARRAY_BUFFER),
        (t.normalize = !1),
        i.bindBuffer(t.target, i.createBuffer()),
        i.bufferData(t.target, t.data, i.STATIC_DRAW),
        s ||
          (i.enableVertexAttribArray(t.location),
          i.vertexAttribPointer(
            t.location,
            t.size,
            t.type,
            t.normalize,
            0,
            0
          )));
  }
  draw(t) {
    var s = this.gl,
      e = this.ren,
      s =
        (e.framebuffer(null),
        e.viewport(s.canvas.width, s.canvas.height),
        e.face(this.face),
        this.pgm.run(),
        (this.modelM4 = identity(this.modelM4)),
        e.cam.render({
          x: 0,
          y: 0,
          z: 0,
        })),
      e = multiplyFn(this.modelM4, s),
      s = t.move,
      i = s.lerp,
      s = s.ease,
      r = i.x,
      h = i.y + s.y,
      a = i.w,
      n = i.h,
      o = i.scale,
      r =
        ((e = scaleFn(translateFn(e, [r, -h, 0]), [a, n, 1])),
        this.pgm.uniform);
    let l = 1,
      p = t.media.ratio.wh / (a / n);
    p < 1 && ((l = 1 / p), (p = 1)),
      (r.s.value = [p * o, l * o]),
      (r.g.value = s.color),
      (r.h.value[0] = s.maskBT),
      (r.f.value = s.ty),
      (r.o.value = i.o),
      (r.e.value = e),
      this.pgm.setUniform();
    var c = this.attrib.u.tex,
      d = c.length;
    for (let t = 0; t < d; t++) this.tex(c[t]);
    this.drawGL();
  }
  tex(t) {
    var s = this.gl,
      e = this.pgm;
    (e.texIndex = e.texIndex + 1),
      s.activeTexture(s["TEXTURE" + e.texIndex]),
      s.bindTexture(s.TEXTURE_2D, t);
  }
  drawGL() {
    var t = this.attrib.index;
    this.ren.vertexArray.bind(this.vao),
      this.gl.drawElements(this.gl[this.mode], t.count, t.type, 0);
  }
}
function Img(t) {
  var s = {
    mode: "TRIANGLE_STRIP",
  };
  const e = t.h,
    i = t.v,
    r = e - 1,
    h = i - 1,
    a = 1 / r,
    n = 1 / h;
  var o = [];
  let l = 0;
  for (let t = 0; t < i; t++) {
    var p = t * n - 1;
    for (let t = 0; t < e; t++) (o[l++] = t * a), (o[l++] = p);
  }
  s.pos = o;
  var c = [];
  let d = 0;
  var v = i - 1,
    u = i - 2,
    g = e - 1;
  for (let s = 0; s < v; s++) {
    var R = e * s,
      m = R + e;
    for (let t = 0; t < e; t++) {
      var f = m + t;
      (c[d++] = R + t),
        (c[d++] = f),
        t === g && s < u && ((c[d++] = f), (c[d++] = e * (s + 1)));
    }
  }
  s.index = c;
  var w = [];
  let y = 0;
  for (let t = 0; t < i; t++) {
    var x = 1 - t / h;
    for (let t = 0; t < e; t++) (w[y++] = t / r), (w[y++] = x);
  }
  return (s.uv = w), s;
}
class PImg {
  constructor(t) {
    var s = _A,
      e =
        ((this.pgm = t.p),
        (this._ = {
          lerp: {
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            scale: 1,
            o: 1,
          },
          ease: {
            y: 0,
            ty: 0,
            maskBT: 0,
            margeB: 0,
            color: 0,
          },
        }),
        {
          lerp: ["scale", "o"],
          ease: ["ty", "maskBT", "margeB", "color"],
        }),
      i = ((this.data = Img(this.pgm.pts)), Object.keys(this._)),
      r = i.length;
    let h = 0;
    this.all = [];
    for (let t = 0; t < r; t++) {
      var a = i[t],
        n = Object.keys(this._[a]),
        o = n.length;
      for (let t = 0; t < o; t++) {
        var l = n[t];
        (this.all[h] = {
          type: a,
          prop: l,
          r: e[a].includes(l) ? 6 : 3,
        }),
          h++;
      }
    }
    (this.allL = h), (this.lerp = []);
    var p = Object.keys(this._.lerp),
      c = p.length;
    for (let t = 0; t < c; t++) {
      var d = p[t];
      this.lerp[t] = {
        prop: d,
        r: e.lerp.includes(d) ? 6 : 2,
      };
    }
    const v = s.rgl.tex;
    (this.tex = {
      large: v.large,
    }),
      (this.tex.small = "/" === t.url ? v.smallHo : v.smallSe),
      (this.texName = Object.keys(this.tex)),
      (this.texNameL = this.texName.length),
      (this.plane = {}),
      (this.planeL = {});
    for (let t = 0; t < this.texNameL; t++) {
      var u = this.texName[t];
      const v = this.tex[u];
      var g = v.length;
      this.set(u, v, g);
    }
  }
  set(s, e, t) {
    var i = this._,
      r = this.data;
    (this.planeL[s] = t), (this.plane[s] = []);
    for (let t = 0; t < this.planeL[s]; t++) {
      var h = e[t],
        a = h.element,
        n = a.width,
        o = a.height,
        a = {
          move: R.Clone(i),
          save: R.Clone(i),
          visible: !1,
          out: !0,
          tex: h,
          media: {
            obj: a,
            dim: {
              w: n,
              h: o,
            },
            ratio: {
              wh: n / o,
              hw: o / n,
            },
          },
          geo: new Geo({
            type: "tex",
            pgm: this.pgm,
            mode: r.mode,
            face: "FRONT",
            attrib: {
              p: {
                size: 2,
                data: new Float32Array(r.pos),
              },
              index: {
                size: 1,
                data: new Uint16Array(r.index),
              },
              u: {
                size: 2,
                tex: h.attrib,
                data: new Float32Array(r.uv),
              },
            },
          }),
        };
      a.geo.setVAO(), (this.plane[s][t] = a);
    }
  }
  moving() {
    var e = _A,
      i = e.win.w,
      r = e.win.h,
      t = e.e.s.rqd,
      s = e.rgl.ren.roRqd,
      h = t || s;
    for (let t = 0; t < this.texNameL; t++) {
      var a = this.texName[t],
        n = this.plane[a];
      for (let t = 0; t < this.planeL[a]; t++) {
        var o = n[t];
        let s = h;
        if (!s)
          for (let t = 0; t < this.allL; t++) {
            var l = this.all[t],
              p = l.type,
              c = l.prop;
            if (R.Une(o.move[p][c], o.save[p][c], l.r)) {
              s = !0;
              break;
            }
          }
        for (let t = 0; t < this.allL; t++) {
          var d = this.all[t],
            v = d.type,
            d = d.prop;
          o.save[v][d] = o.move[v][d];
        }
        var u = o.save.lerp,
          g = o.save.ease,
          m = u.x,
          f = u.y + g.y,
          w = u.w,
          y = u.h,
          u = 0 < u.o && 0 < y && 0 < w && g.maskBT < 1;
        (o.visible = m < i && 0 < m + w && f < r && 0 < f + y && u),
          e.rgl.rqd || (s && o.visible && (e.rgl.rqd = !0));
      }
    }
  }
  draw() {
    var s = _A.rgl.rqd;
    for (let t = 0; t < this.texNameL; t++) {
      var e = this.texName[t],
        i = this.plane[e];
      for (let t = 0; t < this.planeL[e]; t++) {
        var r = i[t];
        r.visible && s
          ? (r.out && (r.out = !1), r.geo.draw(r))
          : r.visible || r.out || ((r.out = !0), r.geo.draw(r));
      }
    }
  }
}
class RGL {
  constructor() {
    (this._ = {}),
      (this.tex = {}),
      (this.rqd = !1),
      (this.gl = R.G.id("_r").getContext("webgl", {
        antialias: !0,
        alpha: !0,
      })),
      R.BM(this, ["resize", "loop"]),
      (this.raf = new R.RafR(this.loop));
  }
  load() {
    this.ren = new Ren();
    var t = {};
    (t.basic = new Pgm({
      name: "basic",
      pts: {
        h: 2,
        v: 2,
      },
      uniform: {
        s: {
          type: "2fv",
          value: [1, 1],
        },
        g: {
          type: "1f",
          value: 0,
        },
        h: {
          type: "2fv",
          value: [0, 0],
        },
        o: {
          type: "1f",
          value: 1,
        },
        f: {
          type: "1f",
          value: 1,
        },
        w: {
          type: "2fv",
          value: [0, 0],
        },
      },
    })),
      (this.pgm = t),
      (this.pgmType = Object.keys(this.pgm)),
      (this.pgmL = this.pgmType.length);
  }
  intro() {
    (this.n = R.G.id("n")),
      (this._["/"] = new PImg({
        p: this.pgm.basic,
        url: "/",
      })),
      (this._["/selected"] = new PImg({
        p: this.pgm.basic,
        url: "/selected",
      }));
  }
  run() {
    new R.ROR(this.resize).on(), this.resize(), this.raf.run();
  }
  resize() {
    var t = _A.win,
      s = this.pgm.basic.uniform;
    (s.w.value = [t.w, t.h]),
      (s.h.value[1] = this.n.offsetHeight / t.h),
      this.ren.resize();
  }
  loop() {
    this.ren.render(this._);
  }
  clear() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
}
class Tex {
  constructor(t) {
    var s = _A.rgl.gl,
      e = s.createTexture();
    s.bindTexture(s.TEXTURE_2D, e);
    let i;
    R.Is.def(t.data)
      ? ((i = "NEAREST"),
        s.texImage2D(
          s.TEXTURE_2D,
          0,
          s.RGB,
          t.data.vert,
          t.data.hori,
          0,
          s.RGB,
          s.FLOAT,
          new Float32Array(t.data.arr)
        ))
      : R.Is.def(t.fbo)
      ? ((i = "LINEAR"),
        s.texImage2D(
          s.TEXTURE_2D,
          0,
          s.RGBA,
          t.fbo.w,
          t.fbo.h,
          0,
          s.RGBA,
          s.FLOAT,
          null
        ))
      : ((i = "LINEAR"),
        s.texImage2D(s.TEXTURE_2D, 0, s.RGBA, s.RGBA, s.UNSIGNED_BYTE, t.obj));
    var r = ["S", "T", "MIN", "MAG"];
    for (let t = 0; t < 4; t++) {
      var h = t < 2 ? "WRAP_" + r[t] : r[t] + "_FILTER",
        a = t < 2 ? "CLAMP_TO_EDGE" : i;
      s.texParameteri(s.TEXTURE_2D, s["TEXTURE_" + h], s[a]);
    }
    return e;
  }
}
class Load {
  constructor(t) {
    var e = _A,
      i =
        ((this.cb = t),
        (this.dom = R.G.class("lo-y", R.G.id("lo-t"))[0]),
        (this.no = 0),
        (this.prevNo = 0),
        R.BM(this, ["loop"]),
        (this.raf = new R.RafR(this.loop)),
        (this.texL = 0),
        e.data),
      r = Object.keys(i),
      h = r.length,
      a = i[r[0]].length;
    for (let t = 0; t < h; t++) e.rgl.tex[r[t]] = [];
    for (let s = 0; s < a; s++)
      for (let t = 0; t < h; t++) {
        var n = r[t],
          o =
            ((e.rgl.tex[n][s] = {
              type: "img",
              attrib: [],
            }),
            i[n][s]),
          l = o.length;
        for (let t = 0; t < l; t++)
          this.imgSet({
            src: o[t],
            element: n,
            index: s,
            attrib: t,
          }),
            this.texL++;
      }
    this.raf.run();
  }
  imgSet(t) {
    const s = _A;
    var e = t.src;
    const i = t.element,
      r = t.index,
      h = t.attrib,
      a = new Image();
    (a.onload = (t) => {
      0 === h && (s.rgl.tex[i][r].element = a),
        (s.rgl.tex[i][r].attrib[h] = new Tex({
          obj: a,
        })),
        this.no++;
    }),
      (a.crossOrigin = "anonymous"),
      (a.src = e);
  }
  loop() {
    this.no !== this.prevNo &&
      ((this.prevNo = this.no),
      (this.dom.textContent = Math.floor(this.no / 3))),
      this.no === this.texL && (this.raf.stop(), this.cb());
  }
}
class Intro {
  constructor(t) {
    const s = _A;
    (s.intro = !0),
      t((t) => {
        (s.rgl = new RGL()),
          new Load((t) => {
            this.cb();
          }),
          s.rgl.load();
      });
  }
  cb() {
    var t = _A;
    t.rgl.intro(), t.e.intro(), t.e.init(), t.rgl.run(), t.e.run(), new Fx$1();
  }
}
class Fx {
  in() {
    const i = _A;
    var t = new Page({
        intro: !1,
      }),
      s = R.G.class("p"),
      e = s[0],
      s = s[1];
    const r = e.style,
      h = R.G.class("co", e)[0].style,
      a = R.G.class("bg", s)[0].style,
      n = i.t.e.o2,
      o = i.t.e.io.front,
      l = i.t.e.io.back;
    (e = i.t.d.tr),
      (s = new R.M({
        d: e,
        update: (t) => {
          var s = n(t.prog),
            e = o(t.prog),
            t = l(t.prog),
            s = R.Lerp(0, 1, s),
            t = R.Lerp(0, i.tr.y, t),
            e = R.Lerp(i.win.h, 0, e);
          (h.opacity = s),
            (r.transform = "translate3d(0, " + t + "px, 0)"),
            (a.transform = "translate3d(0, " + e + "px, 0)");
        },
      }));
    t.play(), s.play();
  }
}
class Mutation {
  constructor() {
    this.mutationFx = new Fx();
  }
  out() {
    var t,
      s = _A;
    "ho" === s.route.old.page && (t = s.e.ho.gl).isIn && t.clickOut(),
      s.e.off(),
      s.e.nav.active.up(),
      s.page.update();
  }
  in() {
    var t = _A;
    t.page.insertNew(), t.e.init(), this.mutationFx.in();
  }
}
class Grid {
  constructor(t) {
    (this.col = t), (this.inDom = !1);
    t = document;
    R.BM(this, ["key"]), R.L(t, "a", "keydown", this.key);
  }
  key(t) {
    "Escape" === t.code && this.inDom
      ? this.click({
          escape: !0,
        })
      : "KeyG" === t.code &&
        t.shiftKey &&
        this.click({
          escape: !1,
        });
  }
  click(t) {
    this.inDom
      ? t.escape || "o" === this.gW.className
        ? this.remove()
        : (this.gW.className = "o")
      : this.add();
  }
  remove() {
    this.gW.parentNode.removeChild(this.gW), (this.inDom = !1);
  }
  add() {
    (this.gW = R.Cr("div")), (this.gW.id = "_g-w");
    var s = R.Cr("div"),
      e = ((s.id = "_g"), []);
    for (let t = 0; t < this.col; t++)
      (e[t] = R.Cr("div")), s.appendChild(e[t]);
    this.gW.appendChild(s), document.body.prepend(this.gW), (this.inDom = !0);
  }
}
R.O(R.G.id("lo-t"), 1),
  R.O(R.G.id("lo-b"), 1),
  new Grid(12),
  new Ctrl({
    device: "d",
    engine: E,
    transition: {
      intro: Intro,
      mutation: Mutation,
    },
  });
