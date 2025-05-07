# Vue Sorted Searchable Table (`@your-npm-scope/vue-sorted-searchable-table`)

Un componente tabella Vue 3 versatile e altamente configurabile, costruito con Tailwind CSS. Include funzionalità di ordinamento (client-side o server-side), ricerca per campo specifico o globale (con debounce), header della tabella "sticky" per lo scrolling verticale interno, e un sistema di slot completo per una facile personalizzazione dell'UI e del rendering delle celle.

## Caratteristiche Principali

* **Ordinamento Flessibile**: Ordinamento per colonna attivabile, con supporto sia per la logica interna al componente sia per l'ordinamento esterno gestito dal server (tramite eventi).
* **Ricerca Avanzata**:
  * Ricerca testuale per campo specifico selezionabile da un dropdown.
  * Opzione "Cerca ovunque" per una ricerca globale (se abilitata).
  * Debounce configurabile per ottimizzare le performance.
* **Header Sticky e Scrolling Verticale**:
  * Possibilità di definire un'altezza massima per la tabella.
  * Se il contenuto eccede l'altezza massima, il corpo della tabella diventa scrollabile mentre l'header (`<thead>`) rimane fisso in cima.
* **Personalizzazione Completa**:
  * Slot per azioni globali nell'header.
  * Slot per azioni per riga e per l'header della colonna azioni.
  * Slot dinamici per il rendering personalizzato di ogni cella dati.
* **Stilizzato con Tailwind CSS**: Richiede che Tailwind CSS sia configurato nel progetto che utilizza il componente.
* **Design Responsivo**: Si adatta a diverse dimensioni di schermo.
* **Messaggi Configurabili**: Per lo stato di caricamento e per quando non ci sono dati.
* **Internazionalizzazione Semplice**: Etichette e messaggi principali passabili come props.

## Installazione

```bash
npm install @your-npm-scope/vue-sorted-searchable-table
# o
yarn add @your-npm-scope/vue-sorted-searchable-table
```

## Dipendenze dell'Utente

Questo componente si affida a `peerDependencies` che devono essere già presenti e configurate nel tuo progetto:

* **`vue`**: `^3.2.0` o superiore
* **`@heroicons/vue`**: `^2.0.0` o superiore (utilizzato per le icone di ordinamento e del dropdown di ricerca). Assicurati di installare la versione corretta (es. `@heroicons/vue/20/solid`).

### IMPORTANTE: Integrazione con Tailwind CSS

Questo componente è interamente stilizzato usando classi di utilità Tailwind CSS. Affinché lo stile funzioni correttamente, il tuo progetto **deve avere Tailwind CSS configurato**.

Inoltre, dovrai assicurarti che le classi Tailwind utilizzate dal componente siano incluse nel processo di "purging" o "tree-shaking" di Tailwind del tuo progetto. Il modo più semplice è aggiungere il percorso ai file del componente (compilati o sorgenti) all'array `content` nel tuo file `tailwind.config.js`:

```javascript
// tailwind.config.js (esempio)
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    // Aggiungi il percorso al componente installato:
    "./node_modules/@your-npm-scope/vue-sorted-searchable-table/dist/**/*.js", // Se il pacchetto espone file JS compilati
    // Oppure, se il pacchetto espone i file .vue sorgente (meglio per il tree-shaking di Tailwind):
    // "./node_modules/@your-npm-scope/vue-sorted-searchable-table/src/**/*.vue", 
  ],
  // ... il resto della tua configurazione Tailwind
}
```

Consulta la documentazione del pacchetto specifico una volta pubblicato per il percorso corretto da includere.

## Utilizzo

Puoi importare il componente e usarlo nei tuoi file `.vue`.

**1. Registrazione Globale (tramite plugin - opzionale):**

Se il pacchetto esporta un plugin (controlla la sua documentazione), puoi registrarlo globalmente:

```javascript
// main.js (o il tuo file di entry point Vue)
import { createApp } from 'vue';
import App from './App.vue';
import VueSortedSearchableTablePlugin from '@your-npm-scope/vue-sorted-searchable-table';

const app = createApp(App);
app.use(VueSortedSearchableTablePlugin /*, { componentName: 'MyCustomTable' } */); // Puoi passare opzioni se il plugin lo supporta
app.mount('#app');
```

**2. Importazione Diretta nel Componente:**

Questo è l'approccio più comune.

```html
<template>
  <div class="container mx-auto p-4">
    <vue-sorted-searchable-table
      :items="tableItems"
      :columns="tableColumns"
      item-key-field="id"
      title="Gestione Utenti"
      description="Elenco degli utenti registrati nel sistema."
      :is-loading="isLoading"
      :searchable="true"
      :search-all="true" 
      search-debounce-time="500"
      table-max-height="70vh"
      :external-sort="true"
      :initial-sort-key="currentSort.key"
      :initial-sort-direction="currentSort.direction"
      @sort-change="handleSortChange"
      @search="handleSearchQuery"
      @add-item="handleAddNewItem"
      empty-state-message="Nessun utente trovato per i criteri specificati."
      add-label="Nuovo Utente"
    >
      <template #header-actions>
        <button @click="exportData" class="ml-4 px-3 py-2 text-sm font-semibold text-white bg-green-600 rounded-md shadow-sm hover:bg-green-500">
          Esporta Dati
        </button>
      </template>

      <template #row-actions-cell="{ item }">
        <a href="#" @click.prevent="viewItemDetails(item)" class="text-indigo-600 hover:text-indigo-900">
          Dettagli
        </a>
        <a href="#" @click.prevent="deleteItem(item)" class="ml-4 text-red-600 hover:text-red-900">
          Elimina
        </a>
      </template>

      <template #cell-status="{ value }">
        <span :class="getStatusClass(value)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
          {{ value }}
        </span>
      </template>

      <template #cell-registratoIl="{ value }">
        <span>{{ formatDate(value) }}</span>
      </template>
    </vue-sorted-searchable-table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
// Assumendo che il componente sia esportato come 'VueSortedSearchableTable' o un nome simile
import { VueSortedSearchableTable } from '@your-npm-scope/vue-sorted-searchable-table'; 

const isLoading = ref(false);
const tableItems = ref([
  { id: 'u001', nome: 'Mario Rossi', email: 'mario.rossi@example.com', status: 'Attivo', registratoIl: '2023-01-15T10:00:00Z' },
  { id: 'u002', nome: 'Laura Bianchi', email: 'laura.bianchi@example.com', status: 'Inattivo', registratoIl: '2023-02-20T14:30:00Z' },
  { id: 'u003', nome: 'Luca Verdi', email: 'luca.verdi@example.com', status: 'Sospeso', registratoIl: '2022-12-05T08:15:00Z' },
  // ...altri dati
]);

const tableColumns = ref([
  { key: 'nome', label: 'Nome Completo', sortable: true, isSearchableField: true },
  { key: 'email', label: 'Indirizzo Email', sortable: true, isSearchableField: true },
  { key: 'status', label: 'Stato', sortable: true, isSearchableField: true, cellClass: 'text-center' },
  { key: 'registratoIl', label: 'Data Registrazione', sortable: true, headerClass: 'text-left' },
]);

const currentSort = ref({ key: 'nome', direction: 'asc' });
const currentSearchTerm = ref(''); // Potresti voler memorizzare qui il termine di ricerca per logica complessa

function handleSortChange(sortParams) {
  console.log('Sort requested:', sortParams);
  currentSort.value = sortParams;
  // Qui implementeresti la logica per ricaricare i dati dal backend con i nuovi parametri di ordinamento
  // Esempio: fetchData({ sort: sortParams.key, direction: sortParams.direction, search: currentSearchTerm.value });
  alert(`Ordinamento cambiato: ${sortParams.key} - ${sortParams.direction}`);
}

function handleSearchQuery(searchPayload) {
  console.log('Search payload received:', searchPayload);
  // searchPayload è una stringa: '' (reset), 'search=query', o 'fieldKey=query'
  // Qui implementeresti la logica per ricaricare i dati dal backend con i parametri di ricerca
  // Esempio: fetchData({ search: searchPayload, sort: currentSort.value.key, ... });
  currentSearchTerm.value = searchPayload; // Aggiorna il termine di ricerca corrente
  alert(`Ricerca per: ${searchPayload}`);
}

function handleAddNewItem() {
  console.log('Add new item action triggered');
  alert('Azione Aggiungi Nuovo Elemento');
}

function exportData() {
  console.log('Export data action triggered');
  alert('Esporta Dati');
}

function viewItemDetails(item) {
  console.log('View details for:', item);
  alert(`Dettagli per: ${item.nome}`);
}

function deleteItem(item) {
  console.log('Delete item:', item);
  if (confirm(`Sei sicuro di voler eliminare ${item.nome}?`)) {
    alert(`${item.nome} eliminato (simulazione).`);
    // tableItems.value = tableItems.value.filter(i => i.id !== item.id); // Esempio per rimozione client-side
  }
}

function getStatusClass(status) {
  if (status === 'Attivo') return 'bg-green-100 text-green-800';
  if (status === 'Inattivo') return 'bg-yellow-100 text-yellow-800';
  if (status === 'Sospeso') return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-800';
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('it-IT', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}
</script>
```

## API del Componente

### Props

| Prop                     | Tipo    | Default                  | Descrizione                                                                                                                                                              |
| :----------------------- | :------ | :----------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`                  | String  | `undefined`              | Titolo opzionale visualizzato sopra la tabella.                                                                                                                            |
| `description`            | String  | `undefined`              | Descrizione opzionale visualizzata sotto il titolo.                                                                                                                        |
| `items`                  | Array   | `[]` ( **richiesto** )   | Array di oggetti che rappresentano le righe della tabella.                                                                                                                |
| `columns`                | Array   | `[]` ( **richiesto** )   | Array di oggetti che definiscono le colonne. Vedi "Struttura Oggetto Colonna" sotto.                                                                                   |
| `itemKeyField`           | String  | `undefined` (**richiesto**)| Nome della proprietà univoca in ogni oggetto `item` (usato internamente per `:key` nel `v-for`).                                                                         |
| `showAddButton`          | Boolean | `true`                   | Mostra o nasconde il pulsante di default "Aggiungi elemento" (viene ignorato se lo slot `header-actions` è utilizzato).                                                 |
| `addLabel`               | String  | `'Aggiungi elemento'`    | Etichetta per il pulsante di default "Aggiungi elemento".                                                                                                                  |
| `isLoading`              | Boolean | `false`                  | Se `true`, mostra un messaggio di caricamento nel corpo della tabella e disabilita alcune interazioni (come la ricerca o l'ordinamento).                                 |
| `emptyStateMessage`      | String  | `'Nessun elemento trovato.'`| Messaggio visualizzato quando l'array `items` è vuoto e `isLoading` è `false`.                                                                                             |
| `initialSortKey`         | String  | `null`                   | Chiave della colonna per l'ordinamento iniziale. Se `externalSort` è `true`, questa prop dovrebbe riflettere lo stato di ordinamento corrente gestito dal componente padre. |
| `initialSortDirection`   | String  | `'asc'`                  | Direzione dell'ordinamento iniziale (`'asc'` o `'desc'`). Come `initialSortKey` se `externalSort` è `true`.                                                                 |
| `externalSort`           | Boolean | `false`                  | Se `true`, l'ordinamento non viene eseguito internamente; viene invece emesso l'evento `sort-change` per la gestione da parte del componente padre.                         |
| `showDefaultActionsHeader`| Boolean | `false`                 | Se `true`, mostra un'intestazione per la colonna delle azioni anche se lo slot `row-actions-header` non è fornito.                                                          |
| `tableMaxHeight`         | String  | `null`                   | Altezza massima CSS per la tabella (es. `'400px'`, `'60vh'`). Se impostata, abilita lo scrolling verticale interno e l'header (`<thead>`) diventa sticky.                  |
| `searchable`             | Boolean | `true`                   | Abilita o disabilita la funzionalità di ricerca integrata (input e dropdown).                                                                                             |
| `searchAll`              | Boolean | `false`                  | Se `true` e `searchable` è `true`, aggiunge l'opzione "Cerca ovunque" al dropdown dei campi di ricerca.                                                                   |
| `searchDebounceTime`     | Number  | `1000`                   | Tempo di attesa (in millisecondi) dopo che l'utente smette di digitare prima che l'evento `search` venga emesso.                                                          |

#### Struttura Oggetto Colonna (per la prop `columns`)

Ogni oggetto nell'array `columns` definisce una colonna della tabella e può avere le seguenti proprietà:

| Proprietà           | Tipo    | Richiesto | Default | Descrizione                                                                                                 |
| :------------------ | :------ | :-------- | :------ | :---------------------------------------------------------------------------------------------------------- |
| `key`               | String  | Sì        |         | La chiave univoca per accedere al valore corrispondente nell'oggetto `item` (es. `item[key]`).                |
| `label`             | String  | Sì        |         | L'etichetta testuale visualizzata nell'header (`<th>`) della colonna.                                       |
| `sortable`          | Boolean | No        | `false` | Se `true`, la colonna sarà cliccabile per l'ordinamento.                                                      |
| `isSearchableField` | Boolean | No        | `true`  | Se `true` (default), questa colonna apparirà come opzione nel dropdown dei campi per la ricerca testuale.    |
| `headerClass`       | String  | No        | `''`    | Stringa di classi CSS personalizzate da applicare all'elemento `<th>` di questa colonna.                       |
| `cellClass`         | String  | No        | `''`    | Stringa di classi CSS personalizzate da applicare a tutti gli elementi `<td>` di questa colonna.               |

### Eventi Emessi

* **`add-item`**:
    * Payload: `undefined`
    * Emeso quando il pulsante di default "Aggiungi elemento" (visibile se `showAddButton` è `true` e lo slot `header-actions` non è utilizzato) viene cliccato.

* **`sort-change`**:
    * Payload: `Object` - `{ key: String, direction: String }` (es. `{ key: 'nome', direction: 'asc' }`)
    * Emeso **solo se** `externalSort` è `true` e l'utente clicca sull'intestazione di una colonna `sortable`. Il componente padre è responsabile di aggiornare i dati e le props `initialSortKey`/`initialSortDirection`.

* **`search`**:
    * Payload: `String`
    * Emeso dopo il `searchDebounceTime` quando l'utente modifica il testo nell'input di ricerca o cambia il campo selezionato nel dropdown di ricerca.
    * Il formato del payload è:
        * `''` (stringa vuota): Se il campo di testo della query è vuoto (usato per indicare di resettare o non applicare filtri di ricerca).
        * `'search=[query]'`: Se l'opzione "Cerca ovunque" è selezionata (richiede `searchAll: true`) e `[query]` è il testo inserito.
        * `'[fieldKey]=[query]'`: Se un campo specifico è selezionato dal dropdown (es. `'nome=Mario Rossi'`).

### Slot Disponibili

* **`header-actions`**:
    * Scopo: Nessuno.
    * Utilizza questo slot per inserire pulsanti o altri controlli personalizzati nell'area dell'header della tabella, a destra del titolo e della descrizione. Sostituisce completamente il pulsante di default "Aggiungi elemento".

* **`row-actions-header`**:
    * Scopo: Nessuno.
    * Permette di definire il contenuto dell'intestazione (`<th>`) per la colonna delle azioni per riga. Utile se `showDefaultActionsHeader` è `true` o se si usa lo slot `row-actions-cell`.

* **`row-actions-cell`**:
    * Scopo: `{ item: Object }` (l'oggetto dati completo per la riga corrente).
    * Utilizza questo slot per inserire controlli (es. pulsanti "Modifica", "Elimina") nella cella finale di ogni riga.

* **`cell-{column.key}`** (Slot Dinamici):
    * Scopo: `{ item: Object, value: any }` (`item` è l'oggetto dati completo per la riga corrente, `value` è il valore specifico della cella, cioè `item[column.key]`).
    * Permette di personalizzare completamente il rendering del contenuto di una cella specifica. Sostituisci `{column.key}` con la `key` effettiva della colonna che vuoi personalizzare.
    * Esempio: Per una colonna definita con `{ key: 'prezzo', ... }`, puoi usare `<template #cell-prezzo="{ value }">...</template>`.

## Licenza

MIT (o la licenza specificata nel `package.json` del tuo pacchetto)

---