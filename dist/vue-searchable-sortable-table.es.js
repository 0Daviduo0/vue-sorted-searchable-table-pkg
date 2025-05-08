import { getCurrentInstance as Q, ref as w, watch as $, computed as g, onMounted as X, createElementBlock as o, openBlock as i, createElementVNode as r, createCommentVNode as d, toDisplayString as m, renderSlot as S, unref as b, withDirectives as V, Fragment as p, renderList as D, vModelSelect as Y, vModelText as j, normalizeStyle as R, normalizeClass as x, withModifiers as J, createBlock as M, createTextVNode as O } from "vue";
import { ChevronUpIcon as W, ChevronDownIcon as F } from "@heroicons/vue/20/solid";
const Z = { class: "px-4 sm:px-6 lg:px-8" }, _ = { class: "sm:flex sm:items-center" }, ee = { class: "sm:flex-auto" }, te = {
  key: 0,
  class: "text-base font-semibold text-gray-900"
}, le = {
  key: 1,
  class: "mt-2 text-sm text-gray-700"
}, ae = { class: "mt-4 sm:ml-16 sm:mt-0 sm:flex-none" }, se = {
  key: 0,
  class: "mt-6 mb-4"
}, ie = ["for"], re = { class: "mt-2" }, oe = { class: "flex rounded-md bg-white shadow-sm ring-none border border-gray-300" }, ne = { class: "relative grid shrink-0 grid-cols-1" }, ce = ["id"], ue = {
  key: 0,
  value: "search"
}, de = ["value"], ye = ["id", "placeholder"], he = { class: "mt-8 flow-root" }, me = { class: "inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8" }, fe = { class: "min-w-full divide-y divide-gray-300" }, ge = ["onClick"], be = { class: "divide-y divide-gray-200 bg-white" }, ve = { key: 0 }, pe = ["colspan"], xe = { key: 1 }, ke = ["colspan"], we = {
  key: 0,
  class: "relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-0"
}, Se = {
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
  setup(s, { emit: v }) {
    const e = s, A = v, B = Q(), C = B ? String(B.uid) : Math.random().toString(36).substring(2, 9), y = w(e.initialSortKey), f = w(e.initialSortDirection);
    $(
      () => [e.initialSortKey, e.initialSortDirection],
      ([t, a]) => {
        e.externalSort || (y.value = t, f.value = a);
      }
    );
    const H = g(
      () => e.externalSort ? e.initialSortKey : y.value
    ), U = g(
      () => e.externalSort ? e.initialSortDirection : f.value
    );
    function E(t) {
      if (e.externalSort) {
        let a = "asc";
        e.initialSortKey === t && (a = e.initialSortDirection === "asc" ? "desc" : "asc"), A("sort-change", { key: t, direction: a });
      } else
        y.value === t ? f.value = f.value === "asc" ? "desc" : "asc" : (y.value = t, f.value = "asc");
    }
    const z = g(() => e.externalSort || !y.value ? e.items : [...e.items].sort((t, a) => {
      const l = t[y.value], n = a[y.value];
      let u = 0;
      const N = l === null || typeof l > "u", I = n === null || typeof n > "u";
      if (N && I) u = 0;
      else if (N) u = -1;
      else if (I) u = 1;
      else if (typeof l == "string" && typeof n == "string")
        u = l.localeCompare(n);
      else if (typeof l == "number" && typeof n == "number")
        u = l - n;
      else {
        const L = String(l).toLowerCase(), q = String(n).toLowerCase();
        L < q && (u = -1), L > q && (u = 1);
      }
      return f.value === "asc" ? u : -u;
    })), c = w(null), k = w("");
    let T = null;
    const h = g(() => e.columns.filter((t) => t.isSearchableField !== !1).map((t) => ({ key: t.key, label: t.label })));
    g(() => {
      if (!c.value) return "Ricerca";
      if (c.value === "search") return "Ricerca Globale";
      const t = h.value.find(
        (a) => a.key === c.value
      );
      return `Ricerca in "${(t == null ? void 0 : t.label) || c.value}"`;
    });
    const G = g(() => {
      if (c.value === "search") return "Cerca ovunque...";
      const t = h.value.find(
        (a) => a.key === c.value
      );
      return `Cerca in ${(t == null ? void 0 : t.label) || "seleziona campo"}...`;
    });
    function K() {
      e.searchable && (e.searchAll ? c.value = "search" : h.value.length > 0 ? c.value = h.value[0].key : c.value = null);
    }
    X(() => {
      K();
    }), $(
      () => [e.columns, e.searchAll],
      () => {
        const t = c.value === "search" && e.searchAll || h.value.some(
          (a) => a.key === c.value
        );
        e.searchable && !t ? K() : e.searchable || (c.value = null);
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
    }), (t, a) => (i(), o("div", Z, [
      r("div", _, [
        r("div", ee, [
          s.title ? (i(), o("h1", te, m(s.title), 1)) : d("", !0),
          s.description ? (i(), o("p", le, m(s.description), 1)) : d("", !0)
        ]),
        r("div", ae, [
          S(t.$slots, "header-actions", {}, () => [
            s.showAddButton ? (i(), o("button", {
              key: 0,
              onClick: a[0] || (a[0] = (l) => t.$emit("add-item")),
              type: "button",
              class: "block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            }, m(s.addLabel), 1)) : d("", !0)
          ])
        ])
      ]),
      e.searchable && (h.value.length > 0 || e.searchAll) ? (i(), o("div", se, [
        r("label", {
          for: `table-search-input-${b(C)}`,
          class: "block text-sm font-medium leading-6 text-gray-900"
        }, null, 8, ie),
        r("div", re, [
          r("div", oe, [
            r("div", ne, [
              V(r("select", {
                "onUpdate:modelValue": a[1] || (a[1] = (l) => c.value = l),
                id: `search-field-select-${b(C)}`,
                name: "search-field-select",
                "aria-label": "Campo di ricerca",
                class: "col-start-1 row-start-1 block w-full rounded-l-md border-0 outline-0 bg-transparent py-1.5 pl-3 pr-7 text-gray-500 focus:ring-none focus:bg-gray-100 sm:text-sm sm:leading-6"
              }, [
                e.searchAll ? (i(), o("option", ue, " Cerca ovunque ")) : d("", !0),
                (i(!0), o(p, null, D(h.value, (l) => (i(), o("option", {
                  key: l.key,
                  value: l.key
                }, m(l.label), 9, de))), 128))
              ], 8, ce), [
                [Y, c.value]
              ])
            ]),
            V(r("input", {
              type: "text",
              name: "table-search-input",
              id: `table-search-input-${b(C)}`,
              "onUpdate:modelValue": a[2] || (a[2] = (l) => k.value = l),
              class: "block min-w-0 flex-1 rounded-r-md border-0 bg-transparent py-1.5 pl-3 pr-3 text-gray-900 placeholder:text-gray-400 focus:ring-none sm:text-sm sm:leading-6",
              placeholder: G.value
            }, null, 8, ye), [
              [j, k.value]
            ])
          ])
        ])
      ])) : d("", !0),
      r("div", he, [
        r("div", {
          class: x([
            "-mx-4 -my-2 sm:-mx-6 lg:-mx-8",
            e.tableMaxHeight ? "" : "overflow-x-auto"
          ]),
          style: R(
            e.tableMaxHeight ? {
              maxHeight: e.tableMaxHeight,
              overflowY: "auto",
              overflowX: "auto"
            } : {}
          )
        }, [
          r("div", me, [
            r("table", fe, [
              r("thead", null, [
                r("tr", null, [
                  (i(!0), o(p, null, D(s.columns, (l) => (i(), o("th", {
                    key: l.key,
                    scope: "col",
                    class: x([
                      "py-3.5 text-left text-sm font-semibold text-gray-900",
                      l.headerClass || "",
                      l.key === (s.columns[0] && s.columns[0].key) ? "pl-4 pr-3 sm:pl-0" : "px-3",
                      e.tableMaxHeight ? "sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-95 backdrop-blur-sm" : ""
                    ]),
                    onClick: (n) => l.sortable ? E(l.key) : null,
                    style: R(l.sortable ? "cursor: pointer;" : {})
                  }, [
                    r("a", {
                      href: "#",
                      class: "group inline-flex items-center",
                      onClick: a[3] || (a[3] = J(() => {
                      }, ["prevent"]))
                    }, [
                      r("span", null, m(l.label), 1),
                      l.sortable ? (i(), o("span", {
                        key: 0,
                        class: x([
                          "ml-2 flex-none rounded",
                          H.value === l.key ? e.tableMaxHeight ? "bg-gray-200 text-gray-900" : "bg-gray-100 text-gray-900 group-hover:bg-gray-200" : "text-gray-400 invisible group-hover:visible group-focus:visible"
                        ])
                      }, [
                        H.value === l.key ? (i(), o(p, { key: 0 }, [
                          U.value === "asc" ? (i(), M(b(W), {
                            key: 0,
                            class: "size-5",
                            "aria-hidden": "true"
                          })) : (i(), M(b(F), {
                            key: 1,
                            class: "size-5",
                            "aria-hidden": "true"
                          }))
                        ], 64)) : (i(), M(b(F), {
                          key: 1,
                          class: "size-5",
                          "aria-hidden": "true"
                        }))
                      ], 2)) : d("", !0)
                    ])
                  ], 14, ge))), 128)),
                  t.$slots["row-actions-header"] || s.showDefaultActionsHeader ? (i(), o("th", {
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
              r("tbody", be, [
                s.isLoading ? (i(), o("tr", ve, [
                  r("td", {
                    colspan: s.columns.length + (t.$slots["row-actions-cell"] || s.showDefaultActionsHeader ? 1 : 0),
                    class: "whitespace-nowrap px-3 py-4 text-sm text-center text-gray-500"
                  }, " Caricamento dati... ", 8, pe)
                ])) : !z.value.length && !s.isLoading ? (i(), o("tr", xe, [
                  r("td", {
                    colspan: s.columns.length + (t.$slots["row-actions-cell"] || s.showDefaultActionsHeader ? 1 : 0),
                    class: "whitespace-nowrap px-3 py-4 text-sm text-center text-gray-500"
                  }, m(s.emptyStateMessage), 9, ke)
                ])) : d("", !0),
                (i(!0), o(p, null, D(z.value, (l) => (i(), o("tr", {
                  key: l[s.itemKeyField]
                }, [
                  (i(!0), o(p, null, D(s.columns, (n) => (i(), o("td", {
                    key: n.key,
                    class: x([
                      "whitespace-nowrap py-4 text-sm",
                      n.cellClass || "",
                      n.key === (s.columns[0] && s.columns[0].key) ? "pl-4 pr-3 font-medium text-gray-900 sm:pl-0" : "px-3 text-gray-500"
                    ])
                  }, [
                    S(t.$slots, `cell-${n.key}`, {
                      item: l,
                      value: l[n.key]
                    }, () => [
                      O(m(l[n.key] === null || typeof l[n.key] > "u" ? "---" : l[n.key]), 1)
                    ])
                  ], 2))), 128)),
                  t.$slots["row-actions-cell"] || s.showDefaultActionsHeader ? (i(), o("td", we, [
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
}, Ce = {
  install: (s, v) => {
    const e = (v == null ? void 0 : v.componentName) || "Table";
    s.component(e, Se);
  }
};
export {
  Se as Table,
  Ce as default
};
