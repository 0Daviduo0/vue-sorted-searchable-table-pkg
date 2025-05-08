<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 v-if="title" class="text-base font-semibold text-gray-900">
          {{ title }}
        </h1>
        <p v-if="description" class="mt-2 text-sm text-gray-700">
          {{ description }}
        </p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <slot name="header-actions">
          <button
            v-if="showAddButton"
            @click="$emit('add-item')"
            type="button"
            class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {{ addLabel }}
          </button>
        </slot>
      </div>
    </div>

    <div
      v-if="
        props.searchable && (searchableFields.length > 0 || props.searchAll)
      "
      class="mt-6 mb-4"
    >
      <label
        :for="`table-search-input-${_uid}`"
        class="block text-sm font-medium leading-6 text-gray-900"
      >
      </label>
      <div class="mt-2">
        <div
          class="flex rounded-md bg-white shadow-sm ring-none border border-gray-300"
        >
          <div class="relative grid shrink-0 grid-cols-1">
            <select
              v-model="searchSelectedKey"
              :id="`search-field-select-${_uid}`"
              name="search-field-select"
              aria-label="Campo di ricerca"
              class="col-start-1 row-start-1 block w-full rounded-l-md border-0 outline-0 bg-transparent py-1.5 pl-3 pr-7 text-gray-500 focus:ring-none focus:bg-gray-100 sm:text-sm sm:leading-6"
            >
              <option v-if="props.searchAll" value="search">
                Cerca ovunque
              </option>
              <option
                v-for="field in searchableFields"
                :key="field.key"
                :value="field.key"
              >
                {{ field.label }}
              </option>
            </select>
            
          </div>
          <input
            type="text"
            name="table-search-input"
            :id="`table-search-input-${_uid}`"
            v-model="searchQueryInput"
            class="block min-w-0 flex-1 rounded-r-md border-0 bg-transparent py-1.5 pl-3 pr-3 text-gray-900 placeholder:text-gray-400 focus:ring-none sm:text-sm sm:leading-6"
            :placeholder="searchInputPlaceholder"
          />
        </div>
      </div>
    </div>

    <div class="mt-8 flow-root">
      <div
        :class="[
          '-mx-4 -my-2 sm:-mx-6 lg:-mx-8',
          props.tableMaxHeight ? '' : 'overflow-x-auto',
        ]"
        :style="
          props.tableMaxHeight
            ? {
                maxHeight: props.tableMaxHeight,
                overflowY: 'auto',
                overflowX: 'auto',
              }
            : {}
        "
      >
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table class="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th
                  v-for="column in columns"
                  :key="column.key"
                  scope="col"
                  :class="[
                    'py-3.5 text-left text-sm font-semibold text-gray-900',
                    column.headerClass || '',
                    column.key === (columns[0] && columns[0].key)
                      ? 'pl-4 pr-3 sm:pl-0'
                      : 'px-3',
                    props.tableMaxHeight
                      ? 'sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-95 backdrop-blur-sm'
                      : '',
                  ]"
                  @click="column.sortable ? toggleSort(column.key) : null"
                  :style="column.sortable ? 'cursor: pointer;' : {}"
                >
                  <a
                    href="#"
                    class="group inline-flex items-center"
                    @click.prevent
                  >
                    <span>{{ column.label }}</span>
                    <span
                      v-if="column.sortable"
                      :class="[
                        'ml-2 flex-none rounded', // Classi base per lo span dell'icona
                        // Applica sfondi e colori del testo solo se è la colonna di ordinamento attiva
                        displaySortKey === column.key
                          ? (props.tableMaxHeight
                              ? 'bg-gray-200 text-gray-900' // Stile colonna attiva, con altezza massima tabella
                              : 'bg-gray-100 text-gray-900 group-hover:bg-gray-200') // Stile colonna attiva, senza altezza massima
                          : '' // Nessuna classe aggiuntiva se non è la colonna di ordinamento attiva, lo span sarà vuoto
                      ]"
                    >
                      <template v-if="displaySortKey === column.key">
                        <ChevronUpIcon
                          v-if="displaySortDirection === 'asc'"
                          class="size-5"
                          aria-hidden="true"
                        />
                        <ChevronDownIcon
                          v-else class="size-5"
                          aria-hidden="true"
                        />
                      </template>
                      </span>
                    </a>
                </th>
                <th
                  v-if="
                    $slots['row-actions-header'] || showDefaultActionsHeader
                  "
                  scope="col"
                  :class="[
                    'relative py-3.5 pl-3 pr-0',
                    props.tableMaxHeight
                      ? 'sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-95 backdrop-blur-sm'
                      : '',
                  ]"
                >
                  <slot name="row-actions-header">
                    <span class="sr-only">Azioni</span>
                  </slot>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-if="isLoading">
                <td
                  :colspan="
                    columns.length +
                    ($slots['row-actions-cell'] || showDefaultActionsHeader
                      ? 1
                      : 0)
                  "
                  class="whitespace-nowrap px-3 py-4 text-sm text-center text-gray-500"
                >
                  Caricamento dati...
                </td>
              </tr>
              <tr v-else-if="!processedItems.length && !isLoading">
                <td
                  :colspan="
                    columns.length +
                    ($slots['row-actions-cell'] || showDefaultActionsHeader
                      ? 1
                      : 0)
                  "
                  class="whitespace-nowrap px-3 py-4 text-sm text-center text-gray-500"
                >
                  {{ emptyStateMessage }}
                </td>
              </tr>
              <tr v-for="item in processedItems" :key="item[itemKeyField]">
                <td
                  v-for="column in columns"
                  :key="column.key"
                  :class="[
                    'whitespace-nowrap py-4 text-sm',
                    column.cellClass || '',
                    column.key === (columns[0] && columns[0].key)
                      ? 'pl-4 pr-3 font-medium text-gray-900 sm:pl-0'
                      : 'px-3 text-gray-500',
                  ]"
                >
                  <slot
                    :name="`cell-${column.key}`"
                    :item="item"
                    :value="item[column.key]"
                  >
                    {{
                      item[column.key] === null ||
                      typeof item[column.key] === "undefined"
                        ? "---"
                        : item[column.key]
                    }}
                  </slot>
                </td>
                <td
                  v-if="$slots['row-actions-cell'] || showDefaultActionsHeader"
                  class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-0"
                >
                  <slot name="row-actions-cell" :item="item"> </slot>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, getCurrentInstance } from "vue";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/vue/20/solid";

const props = defineProps({
  title: String,
  description: String,
  items: { type: Array, required: true },
  columns: { type: Array, required: true },
  itemKeyField: { type: String, required: true },
  showAddButton: { type: Boolean, default: true },
  addLabel: { type: String, default: "Aggiungi elemento" },
  isLoading: { type: Boolean, default: false },
  emptyStateMessage: { type: String, default: "Nessun elemento trovato." },
  initialSortKey: { type: String, default: null },
  initialSortDirection: { type: String, default: "asc" },
  externalSort: { type: Boolean, default: false },
  showDefaultActionsHeader: { type: Boolean, default: false },
  tableMaxHeight: { type: String, default: null },
  searchable: { type: Boolean, default: true },
  searchAll: { type: Boolean, default: false }, // Nuova prop per "Cerca ovunque"
  searchDebounceTime: { type: Number, default: 1000 },
});

const emit = defineEmits(["add-item", "sort-change", "search"]);

// Genera un ID univoco per il componente (per ID interni nel template)
const instance = getCurrentInstance();
const _uid = instance
  ? String(instance.uid)
  : Math.random().toString(36).substring(2, 9);

// --- Logica Ordinamento ---
const internalSortKeyRef = ref(props.initialSortKey);
const internalSortDirectionRef = ref(props.initialSortDirection);
watch(
  () => [props.initialSortKey, props.initialSortDirection],
  ([newKey, newDir]) => {
    if (!props.externalSort) {
      internalSortKeyRef.value = newKey;
      internalSortDirectionRef.value = newDir;
    }
  }
);
const displaySortKey = computed(() =>
  props.externalSort ? props.initialSortKey : internalSortKeyRef.value
);
const displaySortDirection = computed(() =>
  props.externalSort
    ? props.initialSortDirection
    : internalSortDirectionRef.value
);

function toggleSort(columnKey) {
  if (props.externalSort) {
    let newDirection = "asc";
    if (props.initialSortKey === columnKey) {
      newDirection = props.initialSortDirection === "asc" ? "desc" : "asc";
    }
    emit("sort-change", { key: columnKey, direction: newDirection });
  } else {
    if (internalSortKeyRef.value === columnKey) {
      internalSortDirectionRef.value =
        internalSortDirectionRef.value === "asc" ? "desc" : "asc";
    } else {
      internalSortKeyRef.value = columnKey;
      internalSortDirectionRef.value = "asc";
    }
  }
}
const processedItems = computed(() => {
  if (props.externalSort || !internalSortKeyRef.value) return props.items;
  return [...props.items].sort((a, b) => {
    const valA = a[internalSortKeyRef.value];
    const valB = b[internalSortKeyRef.value];
    let comparison = 0;
    const aIsNull = valA === null || typeof valA === "undefined";
    const bIsNull = valB === null || typeof valB === "undefined";
    if (aIsNull && bIsNull) comparison = 0;
    else if (aIsNull) comparison = -1;
    else if (bIsNull) comparison = 1;
    else {
      if (typeof valA === "string" && typeof valB === "string")
        comparison = valA.localeCompare(valB);
      else if (typeof valA === "number" && typeof valB === "number")
        comparison = valA - valB;
      else {
        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        if (strA < strB) comparison = -1;
        if (strA > strB) comparison = 1;
      }
    }
    return internalSortDirectionRef.value === "asc" ? comparison : -comparison;
  });
});
// --- Fine Logica Ordinamento ---

// --- Logica Ricerca ---
const searchSelectedKey = ref(null);
const searchQueryInput = ref("");
let searchDebounceTimer = null;

const searchableFields = computed(() => {
  return props.columns
    .filter((col) => col.isSearchableField !== false)
    .map((col) => ({ key: col.key, label: col.label }));
});

const searchInputLabel = computed(() => {
  if (!searchSelectedKey.value) return "Ricerca";
  if (searchSelectedKey.value === "search") return "Ricerca Globale";
  const field = searchableFields.value.find(
    (f) => f.key === searchSelectedKey.value
  );
  return `Ricerca in "${field?.label || searchSelectedKey.value}"`;
});

const searchInputPlaceholder = computed(() => {
  if (searchSelectedKey.value === "search") return "Cerca ovunque...";
  const selectedField = searchableFields.value.find(
    (f) => f.key === searchSelectedKey.value
  );
  return `Cerca in ${selectedField?.label || "seleziona campo"}...`;
});

function initializeSearchKey() {
  if (props.searchable) {
    if (props.searchAll) {
      searchSelectedKey.value = "search";
    } else if (searchableFields.value.length > 0) {
      searchSelectedKey.value = searchableFields.value[0].key;
    } else {
      searchSelectedKey.value = null; // Nessuna opzione di ricerca
    }
  }
}

onMounted(() => {
  initializeSearchKey();
});

watch(
  () => [props.columns, props.searchAll],
  () => {
    const currentKeyStillValid =
      (searchSelectedKey.value === "search" && props.searchAll) ||
      searchableFields.value.some(
        (field) => field.key === searchSelectedKey.value
      );

    if (props.searchable && !currentKeyStillValid) {
      initializeSearchKey(); // Re-inizializza se la chiave corrente non è più valida o le opzioni cambiano
    } else if (!props.searchable) {
      searchSelectedKey.value = null;
    }
  },
  { deep: true, immediate: true }
); // immediate per gestire il caso iniziale

function triggerDebouncedSearch() {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    const query = searchQueryInput.value.trim();
    const key = searchSelectedKey.value;

    if (query === "") {
      emit("search", "");
    } else if (key) {
      // Se key è 'search', il backend si aspetterà un parametro tipo 'search=query'
      // Se key è un campo specifico, sarà 'nomecampo=query'
      emit("search", `${key}=${query}`);
    }
  }, props.searchDebounceTime);
}

watch([searchQueryInput, searchSelectedKey], () => {
  if (props.searchable) {
    triggerDebouncedSearch();
  }
});
</script>
