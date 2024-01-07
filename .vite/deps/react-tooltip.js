import {
  arrow,
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift
} from "./chunk-ZTOO6GNK.js";
import {
  require_react
} from "./chunk-JBG67EE7.js";
import {
  __commonJS,
  __toESM
} from "./chunk-UV5CTPV7.js";

// node_modules/classnames/index.js
var require_classnames = __commonJS({
  "node_modules/classnames/index.js"(exports, module) {
    (function() {
      "use strict";
      var hasOwn = {}.hasOwnProperty;
      function classNames() {
        var classes = "";
        for (var i2 = 0; i2 < arguments.length; i2++) {
          var arg = arguments[i2];
          if (arg) {
            classes = appendClass(classes, parseValue(arg));
          }
        }
        return classes;
      }
      function parseValue(arg) {
        if (typeof arg === "string" || typeof arg === "number") {
          return arg;
        }
        if (typeof arg !== "object") {
          return "";
        }
        if (Array.isArray(arg)) {
          return classNames.apply(null, arg);
        }
        if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes("[native code]")) {
          return arg.toString();
        }
        var classes = "";
        for (var key in arg) {
          if (hasOwn.call(arg, key) && arg[key]) {
            classes = appendClass(classes, key);
          }
        }
        return classes;
      }
      function appendClass(value, newClass) {
        if (!newClass) {
          return value;
        }
        if (value) {
          return value + " " + newClass;
        }
        return value + newClass;
      }
      if (typeof module !== "undefined" && module.exports) {
        classNames.default = classNames;
        module.exports = classNames;
      } else if (typeof define === "function" && typeof define.amd === "object" && define.amd) {
        define("classnames", [], function() {
          return classNames;
        });
      } else {
        window.classNames = classNames;
      }
    })();
  }
});

// node_modules/react-tooltip/dist/react-tooltip.min.mjs
var import_react = __toESM(require_react(), 1);
var import_classnames = __toESM(require_classnames(), 1);
var h = "react-tooltip-core-styles";
var w = "react-tooltip-base-styles";
var b = { core: false, base: false };
function S({ css: e2, id: t2 = w, type: o2 = "base", ref: l2 }) {
  var r2, n2;
  if (!e2 || "undefined" == typeof document || b[o2])
    return;
  if ("core" === o2 && "undefined" != typeof process && (null === (r2 = null === process || void 0 === process ? void 0 : process.env) || void 0 === r2 ? void 0 : r2.REACT_TOOLTIP_DISABLE_CORE_STYLES))
    return;
  if ("base" !== o2 && "undefined" != typeof process && (null === (n2 = null === process || void 0 === process ? void 0 : process.env) || void 0 === n2 ? void 0 : n2.REACT_TOOLTIP_DISABLE_BASE_STYLES))
    return;
  "core" === o2 && (t2 = h), l2 || (l2 = {});
  const { insertAt: c2 } = l2;
  if (document.getElementById(t2))
    return void console.warn(`[react-tooltip] Element with id '${t2}' already exists. Call \`removeStyle()\` first`);
  const i2 = document.head || document.getElementsByTagName("head")[0], s2 = document.createElement("style");
  s2.id = t2, s2.type = "text/css", "top" === c2 && i2.firstChild ? i2.insertBefore(s2, i2.firstChild) : i2.appendChild(s2), s2.styleSheet ? s2.styleSheet.cssText = e2 : s2.appendChild(document.createTextNode(e2)), b[o2] = true;
}
function E({ type: e2 = "base", id: t2 = w } = {}) {
  if (!b[e2])
    return;
  "core" === e2 && (t2 = h);
  const o2 = document.getElementById(t2);
  "style" === (null == o2 ? void 0 : o2.tagName) ? null == o2 || o2.remove() : console.warn(`[react-tooltip] Failed to remove 'style' element with id '${t2}'. Call \`injectStyle()\` first`), b[e2] = false;
}
var g = (e2, t2, o2) => {
  let l2 = null;
  return function(...r2) {
    const n2 = () => {
      l2 = null, o2 || e2.apply(this, r2);
    };
    o2 && !l2 && (e2.apply(this, r2), l2 = setTimeout(n2, t2)), o2 || (l2 && clearTimeout(l2), l2 = setTimeout(n2, t2));
  };
};
var _ = "DEFAULT_TOOLTIP_ID";
var A = { anchorRefs: /* @__PURE__ */ new Set(), activeAnchor: { current: null }, attach: () => {
}, detach: () => {
}, setActiveAnchor: () => {
} };
var O = (0, import_react.createContext)({ getTooltipData: () => A });
var T = ({ children: t2 }) => {
  const [n2, c2] = (0, import_react.useState)({ [_]: /* @__PURE__ */ new Set() }), [i2, s2] = (0, import_react.useState)({ [_]: { current: null } }), a2 = (e2, ...t3) => {
    c2((o2) => {
      var l2;
      const r2 = null !== (l2 = o2[e2]) && void 0 !== l2 ? l2 : /* @__PURE__ */ new Set();
      return t3.forEach((e3) => r2.add(e3)), { ...o2, [e2]: new Set(r2) };
    });
  }, u = (e2, ...t3) => {
    c2((o2) => {
      const l2 = o2[e2];
      return l2 ? (t3.forEach((e3) => l2.delete(e3)), { ...o2 }) : o2;
    });
  }, d = (0, import_react.useCallback)((e2 = _) => {
    var t3, o2;
    return { anchorRefs: null !== (t3 = n2[e2]) && void 0 !== t3 ? t3 : /* @__PURE__ */ new Set(), activeAnchor: null !== (o2 = i2[e2]) && void 0 !== o2 ? o2 : { current: null }, attach: (...t4) => a2(e2, ...t4), detach: (...t4) => u(e2, ...t4), setActiveAnchor: (t4) => ((e3, t5) => {
      s2((o3) => {
        var l2;
        return (null === (l2 = o3[e3]) || void 0 === l2 ? void 0 : l2.current) === t5.current ? o3 : { ...o3, [e3]: t5 };
      });
    })(e2, t4) };
  }, [n2, i2, a2, u]), p = (0, import_react.useMemo)(() => ({ getTooltipData: d }), [d]);
  return import_react.default.createElement(O.Provider, { value: p }, t2);
};
function k(e2 = _) {
  return (0, import_react.useContext)(O).getTooltipData(e2);
}
var L = ({ tooltipId: t2, children: o2, className: l2, place: r2, content: n2, html: s2, variant: a2, offset: u, wrapper: d, events: p, positionStrategy: v, delayShow: m, delayHide: f }) => {
  const { attach: h2, detach: w2 } = k(t2), b2 = (0, import_react.useRef)(null);
  return (0, import_react.useEffect)(() => (h2(b2), () => {
    w2(b2);
  }), []), import_react.default.createElement("span", { ref: b2, className: (0, import_classnames.default)("react-tooltip-wrapper", l2), "data-tooltip-place": r2, "data-tooltip-content": n2, "data-tooltip-html": s2, "data-tooltip-variant": a2, "data-tooltip-offset": u, "data-tooltip-wrapper": d, "data-tooltip-events": p, "data-tooltip-position-strategy": v, "data-tooltip-delay-show": m, "data-tooltip-delay-hide": f }, o2);
};
var C = "undefined" != typeof window ? import_react.useLayoutEffect : import_react.useEffect;
var R = (e2) => {
  if (!(e2 instanceof HTMLElement || e2 instanceof SVGElement))
    return false;
  const t2 = getComputedStyle(e2);
  return ["overflow", "overflow-x", "overflow-y"].some((e3) => {
    const o2 = t2.getPropertyValue(e3);
    return "auto" === o2 || "scroll" === o2;
  });
};
var x = (e2) => {
  if (!e2)
    return null;
  let t2 = e2.parentElement;
  for (; t2; ) {
    if (R(t2))
      return t2;
    t2 = t2.parentElement;
  }
  return document.scrollingElement || document.documentElement;
};
var N = async ({ elementReference: e2 = null, tooltipReference: t2 = null, tooltipArrowReference: o2 = null, place: l2 = "top", offset: r2 = 10, strategy: n2 = "absolute", middlewares: c2 = [offset(Number(r2)), flip({ fallbackAxisSideDirection: "start" }), shift({ padding: 5 })], border: i2 }) => {
  if (!e2)
    return { tooltipStyles: {}, tooltipArrowStyles: {}, place: l2 };
  if (null === t2)
    return { tooltipStyles: {}, tooltipArrowStyles: {}, place: l2 };
  const s2 = c2;
  return o2 ? (s2.push(arrow({ element: o2, padding: 5 })), computePosition(e2, t2, { placement: l2, strategy: n2, middleware: s2 }).then(({ x: e3, y: t3, placement: o3, middlewareData: l3 }) => {
    var r3, n3;
    const c3 = { left: `${e3}px`, top: `${t3}px`, border: i2 }, { x: s3, y: a2 } = null !== (r3 = l3.arrow) && void 0 !== r3 ? r3 : { x: 0, y: 0 }, u = null !== (n3 = { top: "bottom", right: "left", bottom: "top", left: "right" }[o3.split("-")[0]]) && void 0 !== n3 ? n3 : "bottom", d = i2 && { borderBottom: i2, borderRight: i2 };
    let p = 0;
    if (i2) {
      const e4 = `${i2}`.match(/(\d+)px/);
      p = (null == e4 ? void 0 : e4[1]) ? Number(e4[1]) : 1;
    }
    return { tooltipStyles: c3, tooltipArrowStyles: { left: null != s3 ? `${s3}px` : "", top: null != a2 ? `${a2}px` : "", right: "", bottom: "", ...d, [u]: `-${4 + p}px` }, place: o3 };
  })) : computePosition(e2, t2, { placement: "bottom", strategy: n2, middleware: s2 }).then(({ x: e3, y: t3, placement: o3 }) => ({ tooltipStyles: { left: `${e3}px`, top: `${t3}px` }, tooltipArrowStyles: {}, place: o3 }));
};
var $ = { tooltip: "core-styles-module_tooltip__3vRRp", fixed: "core-styles-module_fixed__pcSol", arrow: "core-styles-module_arrow__cvMwQ", noArrow: "core-styles-module_noArrow__xock6", clickable: "core-styles-module_clickable__ZuTTB", show: "core-styles-module_show__Nt9eE", closing: "core-styles-module_closing__sGnxF" };
var j = { tooltip: "styles-module_tooltip__mnnfp", arrow: "styles-module_arrow__K0L3T", dark: "styles-module_dark__xNqje", light: "styles-module_light__Z6W-X", success: "styles-module_success__A2AKt", warning: "styles-module_warning__SCK0X", error: "styles-module_error__JvumD", info: "styles-module_info__BWdHW" };
var I = ({ forwardRef: t2, id: r2, className: n2, classNameArrow: s2, variant: u = "dark", anchorId: d, anchorSelect: p, place: v = "top", offset: m = 10, events: h2 = ["hover"], openOnClick: w2 = false, positionStrategy: b2 = "absolute", middlewares: S2, wrapper: E2, delayShow: _2 = 0, delayHide: A2 = 0, float: O2 = false, hidden: T2 = false, noArrow: L2 = false, clickable: R2 = false, closeOnEsc: I2 = false, closeOnScroll: B2 = false, closeOnResize: z2 = false, openEvents: D2, closeEvents: q, globalCloseEvents: H, imperativeModeOnly: M, style: W, position: P, afterShow: F, afterHide: K, content: U, contentWrapperRef: V, isOpen: X, setIsOpen: Y, activeAnchor: G, setActiveAnchor: Z, border: J, opacity: Q, arrowColor: ee, role: te = "tooltip" }) => {
  var oe;
  const le = (0, import_react.useRef)(null), re = (0, import_react.useRef)(null), ne = (0, import_react.useRef)(null), ce = (0, import_react.useRef)(null), ie = (0, import_react.useRef)(null), [se, ae] = (0, import_react.useState)(v), [ue, de] = (0, import_react.useState)({}), [pe, ve] = (0, import_react.useState)({}), [me, fe] = (0, import_react.useState)(false), [ye, he] = (0, import_react.useState)(false), [we, be] = (0, import_react.useState)(null), Se = (0, import_react.useRef)(false), Ee = (0, import_react.useRef)(null), { anchorRefs: ge, setActiveAnchor: _e } = k(r2), Ae = (0, import_react.useRef)(false), [Oe, Te] = (0, import_react.useState)([]), ke = (0, import_react.useRef)(false), Le = w2 || h2.includes("click"), Ce = Le || (null == D2 ? void 0 : D2.click) || (null == D2 ? void 0 : D2.dblclick) || (null == D2 ? void 0 : D2.mousedown), Re = D2 ? { ...D2 } : { mouseenter: true, focus: true, click: false, dblclick: false, mousedown: false };
  !D2 && Le && Object.assign(Re, { mouseenter: false, focus: false, click: true });
  const xe = q ? { ...q } : { mouseleave: true, blur: true, click: false, dblclick: false, mouseup: false };
  !q && Le && Object.assign(xe, { mouseleave: false, blur: false });
  const Ne = H ? { ...H } : { escape: I2 || false, scroll: B2 || false, resize: z2 || false, clickOutsideAnchor: Ce || false };
  M && (Object.assign(Re, { mouseenter: false, focus: false, click: false, dblclick: false, mousedown: false }), Object.assign(xe, { mouseleave: false, blur: false, click: false, dblclick: false, mouseup: false }), Object.assign(Ne, { escape: false, scroll: false, resize: false, clickOutsideAnchor: false })), C(() => (ke.current = true, () => {
    ke.current = false;
  }), []);
  const $e = (e2) => {
    ke.current && (e2 && he(true), setTimeout(() => {
      ke.current && (null == Y || Y(e2), void 0 === X && fe(e2));
    }, 10));
  };
  (0, import_react.useEffect)(() => {
    if (void 0 === X)
      return () => null;
    X && he(true);
    const e2 = setTimeout(() => {
      fe(X);
    }, 10);
    return () => {
      clearTimeout(e2);
    };
  }, [X]), (0, import_react.useEffect)(() => {
    if (me !== Se.current)
      if (ie.current && clearTimeout(ie.current), Se.current = me, me)
        null == F || F();
      else {
        const e2 = ((e3) => {
          const t3 = e3.match(/^([\d.]+)(m?s?)$/);
          if (!t3)
            return 0;
          const [, o2, l2] = t3;
          return "s" !== l2 && "ms" !== l2 ? 0 : Number(o2) * ("ms" === l2 ? 1 : 1e3);
        })(getComputedStyle(document.body).getPropertyValue("--rt-transition-show-delay"));
        ie.current = setTimeout(() => {
          he(false), be(null), null == K || K();
        }, e2 + 25);
      }
  }, [me]);
  const je = (e2 = _2) => {
    ne.current && clearTimeout(ne.current), ne.current = setTimeout(() => {
      $e(true);
    }, e2);
  }, Ie = (e2 = A2) => {
    ce.current && clearTimeout(ce.current), ce.current = setTimeout(() => {
      Ae.current || $e(false);
    }, e2);
  }, Be = (e2) => {
    var t3;
    if (!e2)
      return;
    const o2 = null !== (t3 = e2.currentTarget) && void 0 !== t3 ? t3 : e2.target;
    if (!(null == o2 ? void 0 : o2.isConnected))
      return Z(null), void _e({ current: null });
    _2 ? je() : $e(true), Z(o2), _e({ current: o2 }), ce.current && clearTimeout(ce.current);
  }, ze = () => {
    R2 ? Ie(A2 || 100) : A2 ? Ie() : $e(false), ne.current && clearTimeout(ne.current);
  }, De = ({ x: e2, y: t3 }) => {
    var o2;
    const l2 = { getBoundingClientRect: () => ({ x: e2, y: t3, width: 0, height: 0, top: t3, left: e2, right: e2, bottom: t3 }) };
    N({ place: null !== (o2 = null == we ? void 0 : we.place) && void 0 !== o2 ? o2 : v, offset: m, elementReference: l2, tooltipReference: le.current, tooltipArrowReference: re.current, strategy: b2, middlewares: S2, border: J }).then((e3) => {
      Object.keys(e3.tooltipStyles).length && de(e3.tooltipStyles), Object.keys(e3.tooltipArrowStyles).length && ve(e3.tooltipArrowStyles), ae(e3.place);
    });
  }, qe = (e2) => {
    if (!e2)
      return;
    const t3 = e2, o2 = { x: t3.clientX, y: t3.clientY };
    De(o2), Ee.current = o2;
  }, He = (e2) => {
    var t3;
    if (!me)
      return;
    const o2 = e2.target;
    if (null === (t3 = le.current) || void 0 === t3 ? void 0 : t3.contains(o2))
      return;
    [document.querySelector(`[id='${d}']`), ...Oe].some((e3) => null == e3 ? void 0 : e3.contains(o2)) || ($e(false), ne.current && clearTimeout(ne.current));
  }, Me = g(Be, 50, true), We = g(ze, 50, true), Pe = (0, import_react.useCallback)(() => {
    var e2, t3;
    const o2 = null !== (e2 = null == we ? void 0 : we.position) && void 0 !== e2 ? e2 : P;
    o2 ? De(o2) : O2 ? Ee.current && De(Ee.current) : (null == G ? void 0 : G.isConnected) && N({ place: null !== (t3 = null == we ? void 0 : we.place) && void 0 !== t3 ? t3 : v, offset: m, elementReference: G, tooltipReference: le.current, tooltipArrowReference: re.current, strategy: b2, middlewares: S2, border: J }).then((e3) => {
      ke.current && (Object.keys(e3.tooltipStyles).length && de(e3.tooltipStyles), Object.keys(e3.tooltipArrowStyles).length && ve(e3.tooltipArrowStyles), ae(e3.place));
    });
  }, [me, G, U, W, v, null == we ? void 0 : we.place, m, b2, P, null == we ? void 0 : we.position, O2]);
  (0, import_react.useEffect)(() => {
    var e2, t3;
    const o2 = new Set(ge);
    Oe.forEach((e3) => {
      o2.add({ current: e3 });
    });
    const l2 = document.querySelector(`[id='${d}']`);
    l2 && o2.add({ current: l2 });
    const r3 = () => {
      $e(false);
    }, n3 = x(G), c2 = x(le.current);
    Ne.scroll && (window.addEventListener("scroll", r3), null == n3 || n3.addEventListener("scroll", r3), null == c2 || c2.addEventListener("scroll", r3));
    let i2 = null;
    Ne.resize ? window.addEventListener("resize", r3) : G && le.current && (i2 = autoUpdate(G, le.current, Pe, { ancestorResize: true, elementResize: true, layoutShift: true }));
    const s3 = (e3) => {
      "Escape" === e3.key && $e(false);
    };
    Ne.escape && window.addEventListener("keydown", s3), Ne.clickOutsideAnchor && window.addEventListener("click", He);
    const a2 = [], u2 = (e3) => {
      me && (null == e3 ? void 0 : e3.target) === G || Be(e3);
    }, p2 = (e3) => {
      me && (null == e3 ? void 0 : e3.target) === G && ze();
    }, v2 = ["mouseenter", "mouseleave", "focus", "blur"], m2 = ["click", "dblclick", "mousedown", "mouseup"];
    Object.entries(Re).forEach(([e3, t4]) => {
      t4 && (v2.includes(e3) ? a2.push({ event: e3, listener: Me }) : m2.includes(e3) && a2.push({ event: e3, listener: u2 }));
    }), Object.entries(xe).forEach(([e3, t4]) => {
      t4 && (v2.includes(e3) ? a2.push({ event: e3, listener: We }) : m2.includes(e3) && a2.push({ event: e3, listener: p2 }));
    }), O2 && a2.push({ event: "mousemove", listener: qe });
    const y2 = () => {
      Ae.current = true;
    }, h3 = () => {
      Ae.current = false, ze();
    };
    return R2 && !Ce && (null === (e2 = le.current) || void 0 === e2 || e2.addEventListener("mouseenter", y2), null === (t3 = le.current) || void 0 === t3 || t3.addEventListener("mouseleave", h3)), a2.forEach(({ event: e3, listener: t4 }) => {
      o2.forEach((o3) => {
        var l3;
        null === (l3 = o3.current) || void 0 === l3 || l3.addEventListener(e3, t4);
      });
    }), () => {
      var e3, t4;
      Ne.scroll && (window.removeEventListener("scroll", r3), null == n3 || n3.removeEventListener("scroll", r3), null == c2 || c2.removeEventListener("scroll", r3)), Ne.resize ? window.removeEventListener("resize", r3) : null == i2 || i2(), Ne.clickOutsideAnchor && window.removeEventListener("click", He), Ne.escape && window.removeEventListener("keydown", s3), R2 && !Ce && (null === (e3 = le.current) || void 0 === e3 || e3.removeEventListener("mouseenter", y2), null === (t4 = le.current) || void 0 === t4 || t4.removeEventListener("mouseleave", h3)), a2.forEach(({ event: e4, listener: t5 }) => {
        o2.forEach((o3) => {
          var l3;
          null === (l3 = o3.current) || void 0 === l3 || l3.removeEventListener(e4, t5);
        });
      });
    };
  }, [G, Pe, ye, ge, Oe, D2, q, H, Le]), (0, import_react.useEffect)(() => {
    var e2, t3;
    let o2 = null !== (t3 = null !== (e2 = null == we ? void 0 : we.anchorSelect) && void 0 !== e2 ? e2 : p) && void 0 !== t3 ? t3 : "";
    !o2 && r2 && (o2 = `[data-tooltip-id='${r2}']`);
    const l2 = new MutationObserver((e3) => {
      const t4 = [], l3 = [];
      e3.forEach((e4) => {
        if ("attributes" === e4.type && "data-tooltip-id" === e4.attributeName) {
          e4.target.getAttribute("data-tooltip-id") === r2 && t4.push(e4.target);
        }
        if ("childList" === e4.type) {
          if (G) {
            const t5 = [...e4.removedNodes].filter((e5) => 1 === e5.nodeType);
            if (o2)
              try {
                l3.push(...t5.filter((e5) => e5.matches(o2))), l3.push(...t5.flatMap((e5) => [...e5.querySelectorAll(o2)]));
              } catch (e5) {
              }
            t5.some((e5) => {
              var t6;
              return !!(null === (t6 = null == e5 ? void 0 : e5.contains) || void 0 === t6 ? void 0 : t6.call(e5, G)) && (he(false), $e(false), Z(null), ne.current && clearTimeout(ne.current), ce.current && clearTimeout(ce.current), true);
            });
          }
          if (o2)
            try {
              const l4 = [...e4.addedNodes].filter((e5) => 1 === e5.nodeType);
              t4.push(...l4.filter((e5) => e5.matches(o2))), t4.push(...l4.flatMap((e5) => [...e5.querySelectorAll(o2)]));
            } catch (e5) {
            }
        }
      }), (t4.length || l3.length) && Te((e4) => [...e4.filter((e5) => !l3.includes(e5)), ...t4]);
    });
    return l2.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-tooltip-id"] }), () => {
      l2.disconnect();
    };
  }, [r2, p, null == we ? void 0 : we.anchorSelect, G]), (0, import_react.useEffect)(() => {
    Pe();
  }, [Pe]), (0, import_react.useEffect)(() => {
    if (!(null == V ? void 0 : V.current))
      return () => null;
    const e2 = new ResizeObserver(() => {
      setTimeout(() => Pe());
    });
    return e2.observe(V.current), () => {
      e2.disconnect();
    };
  }, [U, null == V ? void 0 : V.current]), (0, import_react.useEffect)(() => {
    var e2;
    const t3 = document.querySelector(`[id='${d}']`), o2 = [...Oe, t3];
    G && o2.includes(G) || Z(null !== (e2 = Oe[0]) && void 0 !== e2 ? e2 : t3);
  }, [d, Oe, G]), (0, import_react.useEffect)(() => () => {
    ne.current && clearTimeout(ne.current), ce.current && clearTimeout(ce.current);
  }, []), (0, import_react.useEffect)(() => {
    var e2;
    let t3 = null !== (e2 = null == we ? void 0 : we.anchorSelect) && void 0 !== e2 ? e2 : p;
    if (!t3 && r2 && (t3 = `[data-tooltip-id='${r2}']`), t3)
      try {
        const e3 = Array.from(document.querySelectorAll(t3));
        Te(e3);
      } catch (e3) {
        Te([]);
      }
  }, [r2, p, null == we ? void 0 : we.anchorSelect]);
  const Fe = null !== (oe = null == we ? void 0 : we.content) && void 0 !== oe ? oe : U, Ke = me && Object.keys(ue).length > 0;
  return (0, import_react.useImperativeHandle)(t2, () => ({ open: (e2) => {
    if (null == e2 ? void 0 : e2.anchorSelect)
      try {
        document.querySelector(e2.anchorSelect);
      } catch (t3) {
        return void console.warn(`[react-tooltip] "${e2.anchorSelect}" is not a valid CSS selector`);
      }
    be(null != e2 ? e2 : null), (null == e2 ? void 0 : e2.delay) ? je(e2.delay) : $e(true);
  }, close: (e2) => {
    (null == e2 ? void 0 : e2.delay) ? Ie(e2.delay) : $e(false);
  }, activeAnchor: G, place: se, isOpen: Boolean(ye && !T2 && Fe && Ke) })), ye && !T2 && Fe ? import_react.default.createElement(E2, { id: r2, role: te, className: (0, import_classnames.default)("react-tooltip", $.tooltip, j.tooltip, j[u], n2, `react-tooltip__place-${se}`, $[Ke ? "show" : "closing"], Ke ? "react-tooltip__show" : "react-tooltip__closing", "fixed" === b2 && $.fixed, R2 && $.clickable), onTransitionEnd: (e2) => {
    ie.current && clearTimeout(ie.current), me || "opacity" !== e2.propertyName || (he(false), be(null), null == K || K());
  }, style: { ...W, ...ue, opacity: void 0 !== Q && Ke ? Q : void 0 }, ref: le }, Fe, import_react.default.createElement(E2, { className: (0, import_classnames.default)("react-tooltip-arrow", $.arrow, j.arrow, s2, L2 && $.noArrow), style: { ...pe, background: ee ? `linear-gradient(to right bottom, transparent 50%, ${ee} 50%)` : void 0 }, ref: re })) : null;
};
var B = ({ content: t2 }) => import_react.default.createElement("span", { dangerouslySetInnerHTML: { __html: t2 } });
var z = (e2, t2) => !("CSS" in window && "supports" in window.CSS) || window.CSS.supports(e2, t2);
var D = import_react.default.forwardRef(({ id: t2, anchorId: l2, anchorSelect: r2, content: n2, html: s2, render: a2, className: u, classNameArrow: d, variant: p = "dark", place: v = "top", offset: m = 10, wrapper: f = "div", children: h2 = null, events: w2 = ["hover"], openOnClick: b2 = false, positionStrategy: S2 = "absolute", middlewares: E2, delayShow: g2 = 0, delayHide: _2 = 0, float: A2 = false, hidden: O2 = false, noArrow: T2 = false, clickable: L2 = false, closeOnEsc: C2 = false, closeOnScroll: R2 = false, closeOnResize: x2 = false, openEvents: N2, closeEvents: $2, globalCloseEvents: j2, imperativeModeOnly: D2 = false, style: q, position: H, isOpen: M, disableStyleInjection: W = false, border: P, opacity: F, arrowColor: K, setIsOpen: U, afterShow: V, afterHide: X, role: Y = "tooltip" }, G) => {
  const [Z, J] = (0, import_react.useState)(n2), [Q, ee] = (0, import_react.useState)(s2), [te, oe] = (0, import_react.useState)(v), [le, re] = (0, import_react.useState)(p), [ne, ce] = (0, import_react.useState)(m), [ie, se] = (0, import_react.useState)(g2), [ae, ue] = (0, import_react.useState)(_2), [de, pe] = (0, import_react.useState)(A2), [ve, me] = (0, import_react.useState)(O2), [fe, ye] = (0, import_react.useState)(f), [he, we] = (0, import_react.useState)(w2), [be, Se] = (0, import_react.useState)(S2), [Ee, ge] = (0, import_react.useState)(null), [_e, Ae] = (0, import_react.useState)(null), Oe = (0, import_react.useRef)(W), { anchorRefs: Te, activeAnchor: ke } = k(t2), Le = (e2) => null == e2 ? void 0 : e2.getAttributeNames().reduce((t3, o2) => {
    var l3;
    if (o2.startsWith("data-tooltip-")) {
      t3[o2.replace(/^data-tooltip-/, "")] = null !== (l3 = null == e2 ? void 0 : e2.getAttribute(o2)) && void 0 !== l3 ? l3 : null;
    }
    return t3;
  }, {}), Ce = (e2) => {
    const t3 = { place: (e3) => {
      var t4;
      oe(null !== (t4 = e3) && void 0 !== t4 ? t4 : v);
    }, content: (e3) => {
      J(null != e3 ? e3 : n2);
    }, html: (e3) => {
      ee(null != e3 ? e3 : s2);
    }, variant: (e3) => {
      var t4;
      re(null !== (t4 = e3) && void 0 !== t4 ? t4 : p);
    }, offset: (e3) => {
      ce(null === e3 ? m : Number(e3));
    }, wrapper: (e3) => {
      var t4;
      ye(null !== (t4 = e3) && void 0 !== t4 ? t4 : f);
    }, events: (e3) => {
      const t4 = null == e3 ? void 0 : e3.split(" ");
      we(null != t4 ? t4 : w2);
    }, "position-strategy": (e3) => {
      var t4;
      Se(null !== (t4 = e3) && void 0 !== t4 ? t4 : S2);
    }, "delay-show": (e3) => {
      se(null === e3 ? g2 : Number(e3));
    }, "delay-hide": (e3) => {
      ue(null === e3 ? _2 : Number(e3));
    }, float: (e3) => {
      pe(null === e3 ? A2 : "true" === e3);
    }, hidden: (e3) => {
      me(null === e3 ? O2 : "true" === e3);
    }, "class-name": (e3) => {
      ge(e3);
    } };
    Object.values(t3).forEach((e3) => e3(null)), Object.entries(e2).forEach(([e3, o2]) => {
      var l3;
      null === (l3 = t3[e3]) || void 0 === l3 || l3.call(t3, o2);
    });
  };
  (0, import_react.useEffect)(() => {
    J(n2);
  }, [n2]), (0, import_react.useEffect)(() => {
    ee(s2);
  }, [s2]), (0, import_react.useEffect)(() => {
    oe(v);
  }, [v]), (0, import_react.useEffect)(() => {
    re(p);
  }, [p]), (0, import_react.useEffect)(() => {
    ce(m);
  }, [m]), (0, import_react.useEffect)(() => {
    se(g2);
  }, [g2]), (0, import_react.useEffect)(() => {
    ue(_2);
  }, [_2]), (0, import_react.useEffect)(() => {
    pe(A2);
  }, [A2]), (0, import_react.useEffect)(() => {
    me(O2);
  }, [O2]), (0, import_react.useEffect)(() => {
    Se(S2);
  }, [S2]), (0, import_react.useEffect)(() => {
    Oe.current !== W && console.warn("[react-tooltip] Do not change `disableStyleInjection` dynamically.");
  }, [W]), (0, import_react.useEffect)(() => {
    "undefined" != typeof window && window.dispatchEvent(new CustomEvent("react-tooltip-inject-styles", { detail: { disableCore: "core" === W, disableBase: W } }));
  }, []), (0, import_react.useEffect)(() => {
    var e2;
    const o2 = new Set(Te);
    let n3 = r2;
    if (!n3 && t2 && (n3 = `[data-tooltip-id='${t2}']`), n3)
      try {
        document.querySelectorAll(n3).forEach((e3) => {
          o2.add({ current: e3 });
        });
      } catch (e3) {
        console.warn(`[react-tooltip] "${n3}" is not a valid CSS selector`);
      }
    const c2 = document.querySelector(`[id='${l2}']`);
    if (c2 && o2.add({ current: c2 }), !o2.size)
      return () => null;
    const i2 = null !== (e2 = null != _e ? _e : c2) && void 0 !== e2 ? e2 : ke.current, s3 = new MutationObserver((e3) => {
      e3.forEach((e4) => {
        var t3;
        if (!i2 || "attributes" !== e4.type || !(null === (t3 = e4.attributeName) || void 0 === t3 ? void 0 : t3.startsWith("data-tooltip-")))
          return;
        const o3 = Le(i2);
        Ce(o3);
      });
    }), a3 = { attributes: true, childList: false, subtree: false };
    if (i2) {
      const e3 = Le(i2);
      Ce(e3), s3.observe(i2, a3);
    }
    return () => {
      s3.disconnect();
    };
  }, [Te, ke, _e, l2, r2]), (0, import_react.useEffect)(() => {
    (null == q ? void 0 : q.border) && console.warn("[react-tooltip] Do not set `style.border`. Use `border` prop instead."), P && !z("border", `${P}`) && console.warn(`[react-tooltip] "${P}" is not a valid \`border\`.`), (null == q ? void 0 : q.opacity) && console.warn("[react-tooltip] Do not set `style.opacity`. Use `opacity` prop instead."), F && !z("opacity", `${F}`) && console.warn(`[react-tooltip] "${F}" is not a valid \`opacity\`.`);
  }, []);
  let Re = h2;
  const xe = (0, import_react.useRef)(null);
  if (a2) {
    const t3 = a2({ content: null != Z ? Z : null, activeAnchor: _e });
    Re = t3 ? import_react.default.createElement("div", { ref: xe, className: "react-tooltip-content-wrapper" }, t3) : null;
  } else
    Z && (Re = Z);
  Q && (Re = import_react.default.createElement(B, { content: Q }));
  const Ne = { forwardRef: G, id: t2, anchorId: l2, anchorSelect: r2, className: (0, import_classnames.default)(u, Ee), classNameArrow: d, content: Re, contentWrapperRef: xe, place: te, variant: le, offset: ne, wrapper: fe, events: he, openOnClick: b2, positionStrategy: be, middlewares: E2, delayShow: ie, delayHide: ae, float: de, hidden: ve, noArrow: T2, clickable: L2, closeOnEsc: C2, closeOnScroll: R2, closeOnResize: x2, openEvents: N2, closeEvents: $2, globalCloseEvents: j2, imperativeModeOnly: D2, style: q, position: H, isOpen: M, border: P, opacity: F, arrowColor: K, setIsOpen: U, afterShow: V, afterHide: X, activeAnchor: _e, setActiveAnchor: (e2) => Ae(e2), role: Y };
  return import_react.default.createElement(I, { ...Ne });
});
"undefined" != typeof window && window.addEventListener("react-tooltip-inject-styles", (e2) => {
  e2.detail.disableCore || S({ css: `:root{--rt-color-white:#fff;--rt-color-dark:#222;--rt-color-success:#8dc572;--rt-color-error:#be6464;--rt-color-warning:#f0ad4e;--rt-color-info:#337ab7;--rt-opacity:0.9;--rt-transition-show-delay:0.15s;--rt-transition-closing-delay:0.15s}.core-styles-module_tooltip__3vRRp{position:absolute;top:0;left:0;pointer-events:none;opacity:0;will-change:opacity}.core-styles-module_fixed__pcSol{position:fixed}.core-styles-module_arrow__cvMwQ{position:absolute;background:inherit}.core-styles-module_noArrow__xock6{display:none}.core-styles-module_clickable__ZuTTB{pointer-events:auto}.core-styles-module_show__Nt9eE{opacity:var(--rt-opacity);transition:opacity var(--rt-transition-show-delay)ease-out}.core-styles-module_closing__sGnxF{opacity:0;transition:opacity var(--rt-transition-closing-delay)ease-in}`, type: "core" }), e2.detail.disableBase || S({ css: `
.styles-module_tooltip__mnnfp{padding:8px 16px;border-radius:3px;font-size:90%;width:max-content}.styles-module_arrow__K0L3T{width:8px;height:8px}[class*='react-tooltip__place-top']>.styles-module_arrow__K0L3T{transform:rotate(45deg)}[class*='react-tooltip__place-right']>.styles-module_arrow__K0L3T{transform:rotate(135deg)}[class*='react-tooltip__place-bottom']>.styles-module_arrow__K0L3T{transform:rotate(225deg)}[class*='react-tooltip__place-left']>.styles-module_arrow__K0L3T{transform:rotate(315deg)}.styles-module_dark__xNqje{background:var(--rt-color-dark);color:var(--rt-color-white)}.styles-module_light__Z6W-X{background-color:var(--rt-color-white);color:var(--rt-color-dark)}.styles-module_success__A2AKt{background-color:var(--rt-color-success);color:var(--rt-color-white)}.styles-module_warning__SCK0X{background-color:var(--rt-color-warning);color:var(--rt-color-white)}.styles-module_error__JvumD{background-color:var(--rt-color-error);color:var(--rt-color-white)}.styles-module_info__BWdHW{background-color:var(--rt-color-info);color:var(--rt-color-white)}`, type: "base" });
});
export {
  D as Tooltip,
  T as TooltipProvider,
  L as TooltipWrapper,
  E as removeStyle
};
/*! Bundled license information:

classnames/index.js:
  (*!
  	Copyright (c) 2018 Jed Watson.
  	Licensed under the MIT License (MIT), see
  	http://jedwatson.github.io/classnames
  *)

react-tooltip/dist/react-tooltip.min.mjs:
  (*
  * React Tooltip
  * {@link https://github.com/ReactTooltip/react-tooltip}
  * @copyright ReactTooltip Team
  * @license MIT
  *)
*/
//# sourceMappingURL=react-tooltip.js.map
