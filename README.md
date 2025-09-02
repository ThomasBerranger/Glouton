<div align="center">
  <a href="https://glouton-1.web.app">
      <img src="https://github.com/ThomasBerranger/Glouton-Front/assets/15357887/0e3494c1-36f9-492d-be39-586d18905de7" alt="Glouton logo" title="Glouton" />
  </a>
</div>

<br>

<img src="https://github.com/user-attachments/assets/d08c6b74-380e-40fa-ba62-1a07cb9051ff" width="300" align="right" style="margin-right: 20px;" />

### 🍏 Glouton - Anti-gaspillage intelligent

<br>

Votre compagnon digital pour une cuisine organisée et zéro gaspillage.

Scannez, cuisinez, gérez et surveillez les dates de péremption de vos aliments favoris avec l'application **Glouton**.

<br>

✨ **Fonctionnalités clés :**
- Scan et enregistrement de produits par code-barres
- Suivi des dates d'expiration automatique  
- Génération de listes de courses intelligentes
- Création et proposition de recettes avec les ingrédients disponibles
- Accès aux informations nutritionnelles détaillées
- Interface mobile-first responsive multi-appareils

<br>
<br clear="left" />

### 🛠 Stack Technique 

| Catégorie | Technologies |
|-----------|--------------|
| **Core Framework** | Vue.js 3.5.13 (composition API) + TypeScript 5.7.3<br>Vite 5.4.14 (build tool)<br>Vue Router 4.5.0 (routing + navigation guards)<br>Pinia 2.3.1 (state management) |
| **PWA & Performance** | vite-plugin-pwa 0.17.5 (service workers + manifest)<br>Workbox 7.0 (cache strategies + offline)<br>@vitejs/plugin-vue 5.0.4 (SFC compilation) |
| **Scan & Métier** | html5-qrcode 2.3.8 (scan principal)<br>@zxing/library 0.21.3 + @zxing/browser 0.1.5 (décodage avancé)<br>axios 1.7.9 (HTTP client + interceptors)<br>moment.js 2.29.4 (dates françaises)<br>Chart.js 4.4.7 (graphiques) |
| **UI & Styling** | Tailwind CSS 3.3.2 (utility-first + responsive)<br>@fortawesome/vue-fontawesome 3.0.3 (icônes) |

### 📋 Roadmap

<details>
  <summary>Création du projet Vue.js x Vite</summary><br>
  Configuration PWA complète (service workers, manifest)<br>
  Création des premières interfaces responsive avec le framework CSS Tailwind<br>
  Intégration de FontAwesome et des icons nécessaires
</details>

<details>
  <summary>Gestion des aliments pour utilisateurs</summary><br>
  Utilisation de token JWT et protection des routes<br>
  Intégration du scan de code-barres<br>
  Recherche de donneés sur l'api OpenFoodFact<br>
  Création d'un composant datepicker polyvalent<br>
  Enregistrement d'un produit lié à l'utiliasteur connecté (POST)<br> 
  Affichage de la liste des produits liés à l'utilisateur connecté (GET collection)<br>
  Modification des informations liées à un produit sélectionné (GET & PATCH)<br>
  Affichage des données nutritionnelles<br>
  Création d'un modale de confirmation polyvalente<br>
  Suppression d'un produit après validation (DELETE)<br>
</details>

<details>
  <summary>Création de la liste de course</summary><br>
  Affichage des produits liés à l'utilisateur et ajoutés à la liste de course (GET collection)<br>
  Ajout d'un bouton sur les produits afin de les ajouter / retirer à la liste de course (PATCH)<br>
  Affichage du nombre de produit sur la liste depuis le Footer (GET collection)<br>
</details>

<details>
  <summary>Design & UI/UX</summary><br>
  Customisation de la Homepage (affichage des produits bientôt périmés et des futures recettes)<br>
  Création d'une interface polyvalentes affichant tous les produits enregistrés (GET collection)<br>
  Création de plusieurs modes d'affichage<br>
</details>

<details>
  <summary>Gestion des recettes</summary><br>
  Création de recette depuis une interface permettant d'ajouter les produits concernés et les informations nécessaires (POST)<br>
  Affichage sur la Homepage des recettes en fonction des aliments requis (GET collection)<br>
  Affichage de la liste (GET collection)<br>
  Suppression après confirmation d'une recette (DELETE)
</details>

<details>
  <summary>Améliorations futures</summary><br>
  Proposition de recette par une IA en fonction des produits présents<br>
  Connexion aux APIs de supermarché pour faciliter la commande d'aliments<br>
  Notifications Push en cas de risque de gaspillage<br>
  Gamification de l'application<br>
  Analyse des dépenses personnelles<br>
  Partage de recettes entre utilisateurs<br>
  Alternatives santé pour éviter les produits trop transformé et non écologique<br>
</details>

### 📱 Scan de code-barres

https://github.com/user-attachments/assets/4028cbc7-2837-4f89-a62b-b812333e2556

**Architecture technique :** Utilisation de `@zxing/browser` pour décoder les codes-barres en temps réel depuis le flux vidéo de la caméra. Le BrowserMultiFormatReader analyse les frames vidéo continuellement jusqu'à détection d'un motif valide.

**Pipeline de données :** Une fois le code-barres détecté, appel automatique à l'API OpenFoodFacts pour récupérer les informations produit (nom, scores nutritionnels, images). Les données sont normalisées et validées avant affichage.

**Gestion d'états :** Trois modes via Vue 3 reactivity - scanning (caméra active), found (produit trouvé), manual (saisie manuelle). Transitions automatiques selon le résultat de détection.

**Optimisations UX :** Vérification préalable en base locale avant appel externe, mode fallback pour produits non référencés, personnalisation des textes d'interface via manipulation DOM.

**Permissions navigateur :** Gestion des autorisations caméra avec interface dédiée et messages d'erreur explicites en cas de refus ou indisponibilité.

### 📱 Affichage polyvalent des aliments

https://github.com/user-attachments/assets/d1cac01c-750d-420a-883d-391349576bdc

**Affichage ordonné :** Liste des produits triable par catégories ou vue globale. Les 7 catégories (Fruits & Légumes, Produits Laitiers, etc.) sont extraites d'OpenFoodFacts et assignées automatiquement via algorithme de matching sur les tags produits.

**Filtres transversaux :** Filtrage par dates d'expiration, statut liste de course, et catégories. Ces filtres s'appliquent uniformément quel que soit le mode d'affichage sélectionné.

### 📱 Liste de courses

https://github.com/user-attachments/assets/0eee01b2-d60f-410b-b1b3-4ade82f64a9e

**Ajout/retrait contextuel :** Bouton toggle avec états visuels différenciés intégré aux fiches produits. Modification du statut via requête API sur le timestamp d'ajout.

**Interface dédiée :** Page shopping list affichant uniquement les produits ajoutés. Tri chronologique par date d'ajout via endpoint dédié. Le but est de permettre à l'utilisateur de facilement modifier sa liste de course lors de ses achats.

**Compteur temps réel :** Store Pinia maintenant la cohérence entre l'affichage du compteur en footer et les actions utilisateur. Synchronisation automatique via appels API au montage des composants et mise à jour incrémentale lors des ajouts/retraits.

### 📱 Recettes

https://github.com/user-attachments/assets/618d7c35-74bc-4034-a86b-b1e9ae2faf6e

**Création d'une recette :** Interface avec un infinite scroll chargeant les aliments de l'utilisateur. Barre de recherche filtrant par nom de produit.

**Indicateurs de disponibilité :** Affichage du nombre d'aliments manquants sur chaque recette de la liste, permettant priorisation des recettes réalisables.

### 📬 Contact

Thomas Berranger - <a href="https://www.linkedin.com/in/thomas-berranger/">Linkedin</a> - tberranger@hotmail.fr
