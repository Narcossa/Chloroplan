# ToDoNOEM (Daniel Moquet) - Blueprint Implementation

## Phase 1 : Architecture des Données (Zustand)
- [ ] Créer les interfaces `Task`, `Client`, `User`, `Vehicle`, `Invoice`, `Expense`, `Supplier`
- [ ] Ajouter les actions CRUD (Create, Read, Update, Delete) dans `useAppStore.ts` pour chaque entité

## Phase 2 : Espace Administrateur (Bureau)
- [ ] Mettre à jour la `Sidebar.tsx` avec les nouveaux menus (Tâches, Clients, RH/Utilisateurs, Flotte, Factures, Annuaire)
- [ ] **Tableau de Bord** : Raccourcis, Statuts des tâches, Alertes
- [ ] **Page Tâches** : Liste, Filtres, Création (Client, Chantier, Assignation, Temps)
- [ ] **Page Clients** : Liste, Fiche Client (Google Maps, Chantiers liés, Fichiers)
- [ ] **Page Utilisateurs (RH)** : Création de compte (rôle, couleur, taux horaire, accès)
- [ ] **Page Véhicules** : Gestion de flotte, dates CT, documents (Carte Grise)
- [ ] **Page Factures** : Validation des heures, statuts de paiement, génération PDF
- [ ] **Page Planning (Équipe)** : Matrice verticale (Collaborateur) / Horizontale (Jours)
- [ ] **Page Frais** : Validation ou refus des notes de frais
- [ ] **Annuaire** : Trombinoscope et base Fournisseurs

## Phase 3 : Espace Collaborateur (Mobile PWA)
- [ ] **Authentification** : Simulation de connexion (Email fictif / Mot de passe)
- [ ] **Dashboard Mobile** : Filtre des tâches assignées uniquement
- [ ] **Agenda** : Vue lecture seule du planning de la semaine
- [ ] **Notes de Frais** : Formulaire d'upload photo ticket + montant + client
- [ ] **Saisie des Heures** : Formulaire par client/semaine -> Génération d'un brouillon de facture
