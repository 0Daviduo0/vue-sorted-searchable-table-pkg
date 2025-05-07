import { getCurrentInstance as Q, ref as w, watch as $, computed as v, onMounted as X, createElementBlock as n, openBlock as i, createElementVNode as r, createCommentVNode as d, toDisplayString as y, renderSlot as S, unref as f, withDirectives as R, createVNode as Y, Fragment as p, renderList as D, vModelSelect as J, vModelText as O, normalizeStyle as F, normalizeClass as x, withModifiers as W, createBlock as M, createTextVNode as Z } from "vue";
import { ChevronDownIcon as B, ChevronUpIcon as _ } from "@heroicons/vue/20/solid";
const ee = { class: "px-4 sm:px-6 lg:px-8" }, te = { class: "sm:flex sm:items-center" }, le = { class: "sm:flex-auto" }, ae = {
  key: 0,
  class: "text-base font-semibold text-gray-900"
}, se = {
  key: 1,
  class: "mt-2 text-sm text-gray-700"
}, ie = { class: "mt-4 sm:ml-16 sm:mt-0 sm:flex-none" }, re = {
  key: 0,
  class: "mt-6 mb-4"
}, ne = ["for"], oe = { class: "mt-2" }, ce = { class: "flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600" }, ue = { class: "relative grid shrink-0 grid-cols-1" }, de = ["id"], ye = {
  key: 0,
  value: "search"
}, he = ["value"], me = ["id", "placeholder"], fe = { class: "mt-8 flow-root" }, ge = { class: "inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8" }, ve = { class: "min-w-full divide-y divide-gray-300" }, be = ["onClick"], pe = { class: "divide-y divide-gray-200 bg-white" }, xe = { key: 0 }, ke = ["colspan"], we = { key: 1 }, Se = ["colspan"], De = {
  key: 0,
  class: "relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-0"
}, Ae = {
  __name: "Table",
  props: {
    title: String,
    description: String,
    items: { type: Array, required: !0 },
    columns: { type: Array, required: !0 },
    itemKeyField: { type: String, required: !0 },
    showAddButton: { type: Boolean, default: !0 },
    addLabel: { type: String, default: "Aggiungi elemento" },
    isLoading: { type: Boolean, default: !1 },
    emptyStateMessage: { type: String, default: "Nessun elemento trovato." },
    initialSortKey: { type: String, default: null },
    initialSortDirection: { type: String, default: "asc" },
    externalSort: { type: Boolean, default: !1 },
    showDefaultActionsHeader: { type: Boolean, default: !1 },
    tableMaxHeight: { type: String, default: null },
    searchable: { type: Boolean, default: !0 },
    searchAll: { type: Boolean, default: !1 },
    // Nuova prop per "Cerca ovunque"
    searchDebounceTime: { type: Number, default: 1e3 }
  },
  emits: ["add-item", "sort-change", "search"],
  setup(s, { emit: b }) {
    const e = s, A = b, H = Q(), C = H ? String(H.uid) : Math.random().toString(36).substring(2, 9), h = w(e.initialSortKey), g = w(e.initialSortDirection);
    $(
      () => [e.initialSortKey, e.initialSortDirection],
      ([t, a]) => {
        e.externalSort || (h.value = t, g.value = a);
      }
    );
    const z = v(
      () => e.externalSort ? e.initialSortKey : h.value
    ), U = v(
      () => e.externalSort ? e.initialSortDirection : g.value
    );
    function E(t) {
      if (e.externalSort) {
        let a = "asc";
        e.initialSortKey === t && (a = e.initialSortDirection === "asc" ? "desc" : "asc"), A("sort-change", { key: t, direction: a });
      } else
        h.value === t ? g.value = g.value === "asc" ? "desc" : "asc" : (h.value = t, g.value = "asc");
    }
    const N = v(() => e.externalSort || !h.value ? e.items : [...e.items].sort((t, a) => {
      const l = t[h.value], o = a[h.value];
      let u = 0;
      const K = l === null || typeof l > "u", L = o === null || typeof o > "u";
      if (K && L) u = 0;
      else if (K) u = -1;
      else if (L) u = 1;
      else if (typeof l == "string" && typeof o == "string")
        u = l.localeCompare(o);
      else if (typeof l == "number" && typeof o == "number")
        u = l - o;
      else {
        const V = String(l).toLowerCase(), q = String(o).toLowerCase();
        V < q && (u = -1), V > q && (u = 1);
      }
      return g.value === "asc" ? u : -u;
    })), c = w(null), k = w("");
    let T = null;
    const m = v(() => e.columns.filter((t) => t.isSearchableField !== !1).map((t) => ({ key: t.key, label: t.label }))), j = v(() => {
      if (!c.value) return "Ricerca";
      if (c.value === "search") return "Ricerca Globale";
      const t = m.value.find(
        (a) => a.key === c.value
      );
      return `Ricerca in "${(t == null ? void 0 : t.label) || c.value}"`;
    }), G = v(() => {
      if (c.value === "search") return "Cerca ovunque...";
      const t = m.value.find(
        (a) => a.key === c.value
      );
      return `Cerca in ${(t == null ? void 0 : t.label) || "seleziona campo"}...`;
    });
    function I() {
      e.searchable && (e.searchAll ? c.value = "search" : m.value.length > 0 ? c.value = m.value[0].key : c.value = null);
    }
    X(() => {
      I();
    }), $(
      () => [e.columns, e.searchAll],
      () => {
        const t = c.value === "search" && e.searchAll || m.value.some(
          (a) => a.key === c.value
        );
        e.searchable && !t ? I() : e.searchable || (c.value = null);
      },
      { deep: !0, immediate: !0 }
    );
    function P() {
      clearTimeout(T), T = setTimeout(() => {
        const t = k.value.trim(), a = c.value;
        t === "" ? A("search", "") : a && A("search", `${a}=${t}`);
      }, e.searchDebounceTime);
    }
    return $([k, c], () => {
      e.searchable && P();
    }), (t, a) => (i(), n("div", ee, [
      r("div", te, [
        r("div", le, [
          s.title ? (i(), n("h1", ae, y(s.title), 1)) : d("", !0),
          s.description ? (i(), n("p", se, y(s.description), 1)) : d("", !0)
        ]),
        r("div", ie, [
          S(t.$slots, "header-actions", {}, () => [
            s.showAddButton ? (i(), n("button", {
              key: 0,
              onClick: a[0] || (a[0] = (l) => t.$emit("add-item")),
              type: "button",
              class: "block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            }, y(s.addLabel), 1)) : d("", !0)
          ])
        ])
      ]),
      e.searchable && (m.value.length > 0 || e.searchAll) ? (i(), n("div", re, [
        r("label", {
          for: `table-search-input-${f(C)}`,
          class: "block text-sm font-medium leading-6 text-gray-900"
        }, y(j.value), 9, ne),
        r("div", oe, [
          r("div", ce, [
            r("div", ue, [
              R(r("select", {
                "onUpdate:modelValue": a[1] || (a[1] = (l) => c.value = l),
                id: `search-field-select-${f(C)}`,
                name: "search-field-select",
                "aria-label": "Campo di ricerca",
                class: "col-start-1 row-start-1 block w-full appearance-none rounded-l-md border-0 bg-transparent py-1.5 pl-3 pr-7 text-gray-500 focus:ring-0 sm:text-sm sm:leading-6"
              }, [
                e.searchAll ? (i(), n("option", ye, " Cerca ovunque ")) : d("", !0),
                (i(!0), n(p, null, D(m.value, (l) => (i(), n("option", {
                  key: l.key,
                  value: l.key
                }, y(l.label), 9, he))), 128))
              ], 8, de), [
                [J, c.value]
              ]),
              Y(f(B), {
                class: "pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-400",
                "aria-hidden": "true"
              })
            ]),
            R(r("input", {
              type: "text",
              name: "table-search-input",
              id: `table-search-input-${f(C)}`,
              "onUpdate:modelValue": a[2] || (a[2] = (l) => k.value = l),
              class: "block min-w-0 flex-1 rounded-r-md border-0 bg-transparent py-1.5 pl-3 pr-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6",
              placeholder: G.value
            }, null, 8, me), [
              [O, k.value]
            ])
          ])
        ])
      ])) : d("", !0),
      r("div", fe, [
        r("div", {
          class: x([
            "-mx-4 -my-2 sm:-mx-6 lg:-mx-8",
            e.tableMaxHeight ? "" : "overflow-x-auto"
          ]),
          style: F(
            e.tableMaxHeight ? {
              maxHeight: e.tableMaxHeight,
              overflowY: "auto",
              overflowX: "auto"
            } : {}
          )
        }, [
          r("div", ge, [
            r("table", ve, [
              r("thead", null, [
                r("tr", null, [
                  (i(!0), n(p, null, D(s.columns, (l) => (i(), n("th", {
                    key: l.key,
                    scope: "col",
                    class: x([
                      "py-3.5 text-left text-sm font-semibold text-gray-900",
                      l.headerClass || "",
                      l.key === (s.columns[0] && s.columns[0].key) ? "pl-4 pr-3 sm:pl-0" : "px-3",
                      e.tableMaxHeight ? "sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-95 backdrop-blur-sm" : ""
                    ]),
                    onClick: (o) => l.sortable ? E(l.key) : null,
                    style: F(l.sortable ? "cursor: pointer;" : {})
                  }, [
                    r("a", {
                      href: "#",
                      class: "group inline-flex items-center",
                      onClick: a[3] || (a[3] = W(() => {
                      }, ["prevent"]))
                    }, [
                      r("span", null, y(l.label), 1),
                      l.sortable ? (i(), n("span", {
                        key: 0,
                        class: x([
                          "ml-2 flex-none rounded",
                          z.value === l.key ? e.tableMaxHeight ? "bg-gray-200 text-gray-900" : "bg-gray-100 text-gray-900 group-hover:bg-gray-200" : "text-gray-400 invisible group-hover:visible group-focus:visible"
                        ])
                      }, [
                        z.value === l.key ? (i(), n(p, { key: 0 }, [
                          U.value === "asc" ? (i(), M(f(_), {
                            key: 0,
                            class: "size-5",
                            "aria-hidden": "true"
                          })) : (i(), M(f(B), {
                            key: 1,
                            class: "size-5",
                            "aria-hidden": "true"
                          }))
                        ], 64)) : (i(), M(f(B), {
                          key: 1,
                          class: "size-5",
                          "aria-hidden": "true"
                        }))
                      ], 2)) : d("", !0)
                    ])
                  ], 14, be))), 128)),
                  t.$slots["row-actions-header"] || s.showDefaultActionsHeader ? (i(), n("th", {
                    key: 0,
                    scope: "col",
                    class: x([
                      "relative py-3.5 pl-3 pr-0",
                      e.tableMaxHeight ? "sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-95 backdrop-blur-sm" : ""
                    ])
                  }, [
                    S(t.$slots, "row-actions-header", {}, () => [
                      a[4] || (a[4] = r("span", { class: "sr-only" }, "Azioni", -1))
                    ])
                  ], 2)) : d("", !0)
                ])
              ]),
              r("tbody", pe, [
                s.isLoading ? (i(), n("tr", xe, [
                  r("td", {
                    colspan: s.columns.length + (t.$slots["row-actions-cell"] || s.showDefaultActionsHeader ? 1 : 0),
                    class: "whitespace-nowrap px-3 py-4 text-sm text-center text-gray-500"
                  }, " Caricamento dati... ", 8, ke)
                ])) : !N.value.length && !s.isLoading ? (i(), n("tr", we, [
                  r("td", {
                    colspan: s.columns.length + (t.$slots["row-actions-cell"] || s.showDefaultActionsHeader ? 1 : 0),
                    class: "whitespace-nowrap px-3 py-4 text-sm text-center text-gray-500"
                  }, y(s.emptyStateMessage), 9, Se)
                ])) : d("", !0),
                (i(!0), n(p, null, D(N.value, (l) => (i(), n("tr", {
                  key: l[s.itemKeyField]
                }, [
                  (i(!0), n(p, null, D(s.columns, (o) => (i(), n("td", {
                    key: o.key,
                    class: x([
                      "whitespace-nowrap py-4 text-sm",
                      o.cellClass || "",
                      o.key === (s.columns[0] && s.columns[0].key) ? "pl-4 pr-3 font-medium text-gray-900 sm:pl-0" : "px-3 text-gray-500"
                    ])
                  }, [
                    S(t.$slots, `cell-${o.key}`, {
                      item: l,
                      value: l[o.key]
                    }, () => [
                      Z(y(l[o.key] === null || typeof l[o.key] > "u" ? "---" : l[o.key]), 1)
                    ])
                  ], 2))), 128)),
                  t.$slots["row-actions-cell"] || s.showDefaultActionsHeader ? (i(), n("td", De, [
                    S(t.$slots, "row-actions-cell", { item: l })
                  ])) : d("", !0)
                ]))), 128))
              ])
            ])
          ])
        ], 6)
      ])
    ]));
  }
}, Me = {
  install: (s, b) => {
    const e = (b == null ? void 0 : b.componentName) || "Table";
    s.component(e, Ae);
  }
};
export {
  Ae as Table,
  Me as default
};
