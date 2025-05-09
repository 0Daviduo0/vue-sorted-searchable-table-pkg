import { getCurrentInstance as P, ref as w, watch as $, computed as g, onMounted as Q, createElementBlock as r, openBlock as i, createElementVNode as o, createCommentVNode as u, toDisplayString as f, renderSlot as S, unref as b, withDirectives as q, Fragment as p, renderList as D, vModelSelect as X, vModelText as Y, normalizeStyle as V, normalizeClass as x, withModifiers as j, createBlock as R, createTextVNode as J } from "vue";
import { ChevronUpIcon as O, ChevronDownIcon as W } from "@heroicons/vue/20/solid";
const Z = { class: "px-2 sm:px-4 lg:px-6" }, _ = { class: "sm:flex sm:items-center" }, ee = { class: "sm:flex-auto" }, te = {
  key: 0,
  class: "text-base font-semibold text-gray-900"
}, le = {
  key: 1,
  class: "mt-2 text-sm text-gray-700"
}, ae = { class: "mt-4 sm:ml-16 sm:mt-0 sm:flex-none" }, se = {
  key: 0,
  class: "mt-6 mb-4"
}, ie = ["for"], oe = {
  class: "mt-2 bg-gray-200 rounded-full",
  style: { padding: "2px" }
}, re = { class: "flex rounded-full shadow-sm ring-none overflow-hidden" }, ne = { class: "relative grid shrink-0 grid-cols-1 rounded-full overflow-hidden" }, ce = ["id"], ue = {
  key: 0,
  value: "search"
}, de = ["value"], ye = ["id", "placeholder"], he = { class: "mt-8 flow-root" }, fe = { class: "inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8" }, me = { class: "min-w-full divide-y divide-gray-300" }, ge = ["onClick"], ve = { class: "divide-y divide-gray-200 bg-white" }, be = { key: 0 }, pe = ["colspan"], xe = { key: 1 }, ke = ["colspan"], we = {
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
    const e = s, A = v, M = P(), C = M ? String(M.uid) : Math.random().toString(36).substring(2, 9), y = w(e.initialSortKey), m = w(e.initialSortDirection);
    $(
      () => [e.initialSortKey, e.initialSortDirection],
      ([t, a]) => {
        e.externalSort || (y.value = t, m.value = a);
      }
    );
    const B = g(
      () => e.externalSort ? e.initialSortKey : y.value
    ), F = g(
      () => e.externalSort ? e.initialSortDirection : m.value
    );
    function U(t) {
      if (e.externalSort) {
        let a = "asc";
        e.initialSortKey === t && (a = e.initialSortDirection === "asc" ? "desc" : "asc"), A("sort-change", { key: t, direction: a });
      } else
        y.value === t ? m.value = m.value === "asc" ? "desc" : "asc" : (y.value = t, m.value = "asc");
    }
    const H = g(() => e.externalSort || !y.value ? e.items : [...e.items].sort((t, a) => {
      const l = t[y.value], n = a[y.value];
      let d = 0;
      const K = l === null || typeof l > "u", N = n === null || typeof n > "u";
      if (K && N) d = 0;
      else if (K) d = -1;
      else if (N) d = 1;
      else if (typeof l == "string" && typeof n == "string")
        d = l.localeCompare(n);
      else if (typeof l == "number" && typeof n == "number")
        d = l - n;
      else {
        const I = String(l).toLowerCase(), L = String(n).toLowerCase();
        I < L && (d = -1), I > L && (d = 1);
      }
      return m.value === "asc" ? d : -d;
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
    const E = g(() => {
      if (c.value === "search") return "Cerca ovunque...";
      const t = h.value.find(
        (a) => a.key === c.value
      );
      return `Cerca in ${(t == null ? void 0 : t.label) || "seleziona campo"}...`;
    });
    function z() {
      e.searchable && (e.searchAll ? c.value = "search" : h.value.length > 0 ? c.value = h.value[0].key : c.value = null);
    }
    Q(() => {
      z();
    }), $(
      () => [e.columns, e.searchAll],
      () => {
        const t = c.value === "search" && e.searchAll || h.value.some(
          (a) => a.key === c.value
        );
        e.searchable && !t ? z() : e.searchable || (c.value = null);
      },
      { deep: !0, immediate: !0 }
    );
    function G() {
      clearTimeout(T), T = setTimeout(() => {
        const t = k.value.trim(), a = c.value;
        t === "" ? A("search", "") : a && A("search", `${a}=${t}`);
      }, e.searchDebounceTime);
    }
    return $([k, c], () => {
      e.searchable && G();
    }), (t, a) => (i(), r("div", Z, [
      o("div", _, [
        o("div", ee, [
          s.title ? (i(), r("h1", te, f(s.title), 1)) : u("", !0),
          s.description ? (i(), r("p", le, f(s.description), 1)) : u("", !0)
        ]),
        o("div", ae, [
          S(t.$slots, "header-actions", {}, () => [
            s.showAddButton ? (i(), r("button", {
              key: 0,
              onClick: a[0] || (a[0] = (l) => t.$emit("add-item")),
              type: "button",
              class: "block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            }, f(s.addLabel), 1)) : u("", !0)
          ])
        ])
      ]),
      e.searchable && (h.value.length > 0 || e.searchAll) ? (i(), r("div", se, [
        o("label", {
          for: `table-search-input-${b(C)}`,
          class: "block text-sm font-medium leading-6 text-gray-900"
        }, null, 8, ie),
        o("div", oe, [
          o("div", re, [
            o("div", ne, [
              q(o("select", {
                "onUpdate:modelValue": a[1] || (a[1] = (l) => c.value = l),
                id: `search-field-select-${b(C)}`,
                name: "search-field-select",
                "aria-label": "Campo di ricerca",
                class: "col-start-1 row-start-1 block w-full rounded-l-md border-0 outline-0 bg-transparent py-1.5 pl-3 pr-7 text-gray-500 focus:ring-none focus:bg-gray-100 sm:text-sm sm:leading-6"
              }, [
                e.searchAll ? (i(), r("option", ue, " Cerca ovunque ")) : u("", !0),
                (i(!0), r(p, null, D(h.value, (l) => (i(), r("option", {
                  key: l.key,
                  value: l.key
                }, f(l.label), 9, de))), 128))
              ], 8, ce), [
                [X, c.value]
              ])
            ]),
            q(o("input", {
              type: "text",
              name: "table-search-input",
              id: `table-search-input-${b(C)}`,
              "onUpdate:modelValue": a[2] || (a[2] = (l) => k.value = l),
              class: "block min-w-0 flex-1 rounded-r-full border-0 bg-gray-200 py-1.5 pl-3 pr-3 text-gray-900 placeholder:text-gray-400 focus:ring-none sm:text-sm sm:leading-6",
              placeholder: E.value
            }, null, 8, ye), [
              [Y, k.value]
            ])
          ])
        ])
      ])) : u("", !0),
      o("div", he, [
        o("div", {
          class: x([
            "-mx-4 -my-2 sm:-mx-6 lg:-mx-8",
            e.tableMaxHeight ? "" : "overflow-x-auto"
          ]),
          style: V(
            e.tableMaxHeight ? {
              maxHeight: e.tableMaxHeight,
              overflowY: "auto",
              overflowX: "auto"
            } : {}
          )
        }, [
          o("div", fe, [
            o("table", me, [
              o("thead", null, [
                o("tr", null, [
                  (i(!0), r(p, null, D(s.columns, (l) => (i(), r("th", {
                    key: l.key,
                    scope: "col",
                    class: x([
                      "py-3.5 text-left text-sm font-semibold text-gray-900",
                      l.headerClass || "",
                      l.key === (s.columns[0] && s.columns[0].key) ? "pl-4 pr-3 sm:pl-0" : "px-3",
                      e.tableMaxHeight ? "sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-95 backdrop-blur-sm" : ""
                    ]),
                    onClick: (n) => l.sortable ? U(l.key) : null,
                    style: V(l.sortable ? "cursor: pointer;" : {})
                  }, [
                    o("a", {
                      href: "#",
                      class: "group inline-flex items-center",
                      onClick: a[3] || (a[3] = j(() => {
                      }, ["prevent"]))
                    }, [
                      o("span", null, f(l.label), 1),
                      l.sortable ? (i(), r("span", {
                        key: 0,
                        class: x([
                          "ml-2 flex-none rounded",
                          // Classi base per lo span dell'icona
                          // Applica sfondi e colori del testo solo se è la colonna di ordinamento attiva
                          B.value === l.key ? e.tableMaxHeight ? "bg-gray-200 text-gray-900" : "bg-gray-100 text-gray-900 group-hover:bg-gray-200" : ""
                          // Nessuna classe aggiuntiva se non è la colonna di ordinamento attiva, lo span sarà vuoto
                        ])
                      }, [
                        B.value === l.key ? (i(), r(p, { key: 0 }, [
                          F.value === "asc" ? (i(), R(b(O), {
                            key: 0,
                            class: "size-5",
                            "aria-hidden": "true"
                          })) : (i(), R(b(W), {
                            key: 1,
                            class: "size-5",
                            "aria-hidden": "true"
                          }))
                        ], 64)) : u("", !0)
                      ], 2)) : u("", !0)
                    ])
                  ], 14, ge))), 128)),
                  t.$slots["row-actions-header"] || s.showDefaultActionsHeader ? (i(), r("th", {
                    key: 0,
                    scope: "col",
                    class: x([
                      "relative py-3.5 pl-3 pr-0",
                      e.tableMaxHeight ? "sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-95 backdrop-blur-sm" : ""
                    ])
                  }, [
                    S(t.$slots, "row-actions-header", {}, () => [
                      a[4] || (a[4] = o("span", { class: "sr-only" }, "Azioni", -1))
                    ])
                  ], 2)) : u("", !0)
                ])
              ]),
              o("tbody", ve, [
                s.isLoading ? (i(), r("tr", be, [
                  o("td", {
                    colspan: s.columns.length + (t.$slots["row-actions-cell"] || s.showDefaultActionsHeader ? 1 : 0),
                    class: "whitespace-nowrap px-3 py-4 text-sm text-center text-gray-500"
                  }, " Caricamento dati... ", 8, pe)
                ])) : !H.value.length && !s.isLoading ? (i(), r("tr", xe, [
                  o("td", {
                    colspan: s.columns.length + (t.$slots["row-actions-cell"] || s.showDefaultActionsHeader ? 1 : 0),
                    class: "whitespace-nowrap px-3 py-4 text-sm text-center text-gray-500"
                  }, f(s.emptyStateMessage), 9, ke)
                ])) : u("", !0),
                (i(!0), r(p, null, D(H.value, (l) => (i(), r("tr", {
                  key: l[s.itemKeyField]
                }, [
                  (i(!0), r(p, null, D(s.columns, (n) => (i(), r("td", {
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
                      J(f(l[n.key] === null || typeof l[n.key] > "u" ? "---" : l[n.key]), 1)
                    ])
                  ], 2))), 128)),
                  t.$slots["row-actions-cell"] || s.showDefaultActionsHeader ? (i(), r("td", we, [
                    S(t.$slots, "row-actions-cell", { item: l })
                  ])) : u("", !0)
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
