// src/index.js
import Table from './Table.vue';

// Esporta il componente direttamente per l'importazione on-demand
export { Table };

// Opzionale: Esporta un oggetto plugin per l'uso con app.use()
// Questo permette la registrazione globale automatica del componente
export default {
  install: (app, options) => {
    // Registra il componente globalmente
    // Il nome 'Table' può essere sovrascritto tramite le opzioni se necessario
    const componentName = options?.componentName || 'Table';
    app.component(componentName, Table);

    // Qui potresti anche fornire configurazioni globali tramite options
    // se il tuo componente Table ne avesse bisogno in futuro.
  }
};