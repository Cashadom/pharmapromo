import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './CreatePromotion.css';

export default function CreatePromotion({ setPage }) {
  const [form, setForm] = useState({
    titre: '',
    description: '',
    produit: '',
    type_promo: 'PERCENT',
    csp: '',
    remise_valeur: '',
    unite_offerte: '',
    condition_client: 'ALL',
    implantation: '',
    montant_minimum: '',
    date_debut: '',
    date_fin: '',
    famille: '',
    image_url: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [laboStatus, setLaboStatus] = useState(null); // null = chargement, 'ok', 'no_labo', 'expired'
  const [laboId, setLaboId] = useState(null);
  const [promoCount, setPromoCount] = useState(0);

  useEffect(() => {
    async function checkLabo() {
      // Récupérer le premier laboratoire (MVP simple)
      const { data, error } = await supabase
        .from('laboratoires')
        .select('*')
        .limit(1)
        .single();

      if (error || !data) {
        setLaboStatus('no_labo');
        return;
      }

      setLaboId(data.id);

      // Vérifier le statut
      // trial = autorisé, active = autorisé, expired = bloqué
      if (data.statut === 'expired') {
        setLaboStatus('expired');
        return;
      }

      // Compter les promotions actives
      const { count } = await supabase
        .from('promotions')
        .select('*', { count: 'exact', head: true })
        .eq('laboratoire_id', data.id)
        .eq('active', true);

      setPromoCount(count || 0);
      setLaboStatus('ok');
    }

    checkLabo();
  }, []);

  const typeOptions = [
    { value: 'PERCENT', label: 'Remise (%)' },
    { value: 'FREE_ITEM', label: 'Unité offerte' },
    { value: 'RETURN_EXPIRED', label: 'Reprise périmés' },
    { value: 'ORDER_THRESHOLD', label: 'Montant minimum commande' }
  ];

  const conditionOptions = [
    { value: 'ALL', label: 'Toutes les officines' },
    { value: 'REORDER', label: 'Commande de réassort (clients existants)' },
    { value: 'IMPLANTATION', label: 'Commande d\'implantation (nouveaux clients)' }
  ];

  // Structure hiérarchique des familles
  const familleOptions = [
    // === DERMOCOSMETIQUE ===
    { value: 'DERMOCOSMETIQUE', label: '━ Dermocosmétique', isCategory: true },
    { value: 'SOINS_VISAGE', label: '  └ Soins visage' },
    { value: 'SOINS_CORPS', label: '  └ Soins corps' },
    { value: 'ANTI_AGE', label: '  └ Anti-âge' },
    { value: 'ACNE', label: '  └ Acné' },
    { value: 'HYDRATATION', label: '  └ Hydratation' },
    { value: 'SOLAIRES', label: '  └ Solaires' },
    { value: 'HYGIENE_DERMATOLOGIQUE', label: '  └ Hygiène dermatologique' },
    { value: 'SOINS_BEBE', label: '  └ Soins bébé' },
    { value: 'PEAUX_ATOPIQUES', label: '  └ Peaux atopiques' },
    { value: 'CICATRISATION', label: '  └ Cicatrisation' },
    
    // === COMPLEMENTS ALIMENTAIRES ===
    { value: 'COMPLEMENTS_ALIMENTAIRES', label: '━ Compléments alimentaires', isCategory: true },
    { value: 'IMMUNITE', label: '  └ Immunité' },
    { value: 'VITALITE', label: '  └ Vitalité' },
    { value: 'STRESS', label: '  └ Stress' },
    { value: 'SOMMEIL', label: '  └ Sommeil' },
    { value: 'MEMOIRE', label: '  └ Mémoire' },
    { value: 'ARTICULATIONS', label: '  └ Articulations' },
    { value: 'DIGESTION', label: '  └ Digestion' },
    { value: 'TRANSIT', label: '  └ Transit' },
    { value: 'FOIE', label: '  └ Foie' },
    { value: 'MINCEUR', label: '  └ Minceur' },
    { value: 'BEAUTE_PEAU_CHEVEUX_ONGLES', label: '  └ Beauté peau cheveux ongles' },
    { value: 'GROSSESSE_COMPLEMENTS', label: '  └ Grossesse' },
    { value: 'ENFANTS_COMPLEMENTS', label: '  └ Enfants' },
    { value: 'SENIORS_COMPLEMENTS', label: '  └ Seniors' },
    { value: 'SPORT', label: '  └ Sport' },
    { value: 'MICRONUTRITION', label: '  └ Micronutrition' },
    { value: 'VITAMINES', label: '  └ Vitamines' },
    { value: 'MINERAUX', label: '  └ Minéraux' },
    { value: 'OMEGA', label: '  └ Oméga' },
    { value: 'PROBIOTIQUES', label: '  └ Probiotiques' },
    { value: 'PREBIOTIQUES', label: '  └ Prébiotiques' },
    { value: 'ANTIOXYDANTS', label: '  └ Antioxydants' },
    
    // === SANTE FEMININE ===
    { value: 'SANTE_FEMININE', label: '━ Santé féminine', isCategory: true },
    { value: 'MENOPAUSE', label: '  └ Ménopause' },
    { value: 'SECHERESSE_INTIME', label: '  └ Sécheresse intime' },
    { value: 'CONFORT_URINAIRE', label: '  └ Confort urinaire' },
    { value: 'FERTILITE_FEMININE', label: '  └ Fertilité' },
    { value: 'CYCLE_MENSTRUEL', label: '  └ Cycle menstruel' },
    
    // === SANTE MASCULINE ===
    { value: 'SANTE_MASCULINE', label: '━ Santé masculine', isCategory: true },
    { value: 'PROSTATE', label: '  └ Prostate' },
    { value: 'VITALITE_MASCULINE', label: '  └ Vitalité masculine' },
    { value: 'FERTILITE_MASCULINE', label: '  └ Fertilité masculine' },
    
    // === HYGIENE INTIME ===
    { value: 'HYGIENE_INTIME', label: '━ Hygiène intime', isCategory: true },
    { value: 'HYGIENE_FEMININE', label: '  └ Hygiène féminine' },
    { value: 'LUBRIFIANTS', label: '  └ Lubrifiants' },
    { value: 'CONFORT_INTIME', label: '  └ Confort intime' },
    
    // === ORL ===
    { value: 'ORL', label: '━ ORL', isCategory: true },
    { value: 'GORGE', label: '  └ Gorge' },
    { value: 'NEZ', label: '  └ Nez' },
    { value: 'SINUS', label: '  └ Sinus' },
    { value: 'OREILLES', label: '  └ Oreilles' },
    
    // === OPHTALMOLOGIE ===
    { value: 'OPHTALMOLOGIE', label: '━ Ophtalmologie', isCategory: true },
    { value: 'SECHERESSE_OCULAIRE', label: '  └ Sécheresse oculaire' },
    { value: 'LENTILLES', label: '  └ Lentilles' },
    { value: 'HYGIENE_OCULAIRE', label: '  └ Hygiène oculaire' },
    
    // === BUCCO-DENTAIRE ===
    { value: 'BUCCO_DENTAIRE', label: '━ Bucco-dentaire', isCategory: true },
    { value: 'DENTIFRICES', label: '  └ Dentifrices' },
    { value: 'BAINS_BOUCHE', label: '  └ Bains de bouche' },
    { value: 'GENCIVES', label: '  └ Gencives' },
    { value: 'HALITOSE', label: '  └ Halitose' },
    { value: 'ORTHODONTIE', label: '  └ Orthodontie' },
    
    // === DIGESTIF ===
    { value: 'DIGESTIF', label: '━ Digestif', isCategory: true },
    { value: 'REFLEX', label: '  └ Reflux' },
    { value: 'TRANSIT_DIGESTIF', label: '  └ Transit' },
    { value: 'BALLONNEMENTS', label: '  └ Ballonnements' },
    { value: 'DIARRHEE', label: '  └ Diarrhée' },
    { value: 'CONSTIPATION', label: '  └ Constipation' },
    
    // === DOULEUR ===
    { value: 'DOULEUR', label: '━ Douleur', isCategory: true },
    { value: 'DOULEURS_MUSCULAIRES', label: '  └ Douleurs musculaires' },
    { value: 'DOULEURS_ARTICULAIRES', label: '  └ Douleurs articulaires' },
    { value: 'DOULEURS_MENSTRUELLES', label: '  └ Douleurs menstruelles' },
    { value: 'MAUX_TETE', label: '  └ Maux de tête' },
    
    // === CIRCULATION ===
    { value: 'CIRCULATION', label: '━ Circulation', isCategory: true },
    { value: 'JAMBES_LOURDES', label: '  └ Jambes lourdes' },
    { value: 'VEINOTONIQUE', label: '  └ Veinotonique' },
    { value: 'COMPRESSION', label: '  └ Compression' },
    
    // === RESPIRATOIRE ===
    { value: 'RESPIRATOIRE', label: '━ Respiratoire', isCategory: true },
    { value: 'TOUX', label: '  └ Toux' },
    { value: 'RHUME', label: '  └ Rhume' },
    { value: 'ALLERGIES_RESPIRATOIRES', label: '  └ Allergies respiratoires' },
    
    // === ALLERGIES ===
    { value: 'ALLERGIES', label: '━ Allergies', isCategory: true },
    { value: 'ALLERGIES_SAISONNIERES', label: '  └ Allergies saisonnières' },
    { value: 'ALLERGIES_CUTANEES', label: '  └ Allergies cutanées' },
    
    // === PEDIATRIE ===
    { value: 'PEDIATRIE', label: '━ Pédiatrie', isCategory: true },
    { value: 'NOURRISSON', label: '  └ Nourrisson' },
    { value: 'ENFANT', label: '  └ Enfant' },
    { value: 'CROISSANCE', label: '  └ Croissance' },
    
    // === GERIATRIE ===
    { value: 'GERIATRIE', label: '━ Gériatrie', isCategory: true },
    { value: 'SENIOR', label: '  └ Senior' },
    { value: 'MEMOIRE_SENIOR', label: '  └ Mémoire' },
    { value: 'MOBILITE', label: '  └ Mobilité' },
    
    // === VETERINAIRE ===
    { value: 'VETERINAIRE', label: '━ Vétérinaire', isCategory: true },
    { value: 'CHIEN', label: '  └ Chien' },
    { value: 'CHAT', label: '  └ Chat' },
    { value: 'NAC', label: '  └ NAC' },
    
    // === DISPOSITIFS MEDICAUX ===
    { value: 'DISPOSITIFS_MEDICAUX', label: '━ Dispositifs médicaux', isCategory: true },
    { value: 'PANSEMENTS', label: '  └ Pansements' },
    { value: 'CICATRISATION_DM', label: '  └ Cicatrisation' },
    { value: 'ORTHESES', label: '  └ Orthèses' },
    { value: 'TESTS_DIAGNOSTIQUES', label: '  └ Tests diagnostiques' },
    
    // === MAINTIEN A DOMICILE ===
    { value: 'MAINTIEN_DOMICILE', label: '━ Maintien à domicile', isCategory: true },
    { value: 'INCONTINENCE', label: '  └ Incontinence' },
    { value: 'AIDES_TECHNIQUES', label: '  └ Aides techniques' },
    
    // === ORTHOPEDIE ===
    { value: 'ORTHOPEDIE', label: '━ Orthopédie', isCategory: true },
    { value: 'ATELLES', label: '  └ Attelles' },
    { value: 'CEINTURES', label: '  └ Ceintures' },
    { value: 'GENOUILLERES', label: '  └ Genouillères' },
    
    // === PREMIERS SOINS ===
    { value: 'PREMIERS_SOINS', label: '━ Premiers soins', isCategory: true },
    { value: 'DESINFECTION', label: '  └ Désinfection' },
    { value: 'URGENCES', label: '  └ Urgences' },
    
    // === NUTRITION CLINIQUE ===
    { value: 'NUTRITION_CLINIQUE', label: '━ Nutrition clinique', isCategory: true },
    { value: 'DENUTRITION', label: '  └ Dénutrition' },
    { value: 'HYPERPROTEINE', label: '  └ Hyperprotéiné' },
    { value: 'NUTRITION_ORALE', label: '  └ Nutrition orale' },
    
    // === DIABETE ===
    { value: 'DIABETE', label: '━ Diabète', isCategory: true },
    { value: 'GLYCEMIE', label: '  └ Glycémie' },
    { value: 'LECTEURS', label: '  └ Lecteurs' },
    { value: 'CONSOMMABLES', label: '  └ Consommables' },
    
    // === CARDIOVASCULAIRE ===
    { value: 'CARDIOVASCULAIRE', label: '━ Cardiovasculaire', isCategory: true },
    { value: 'TENSION', label: '  └ Tension' },
    { value: 'CHOLESTEROL', label: '  └ Cholestérol' },
    { value: 'COEUR', label: '  └ Cœur' },
    
    // === SANTE SEXUELLE ===
    { value: 'SANTE_SEXUELLE', label: '━ Santé sexuelle', isCategory: true },
    { value: 'PRESERVATIFS', label: '  └ Préservatifs' },
    { value: 'FERTILITE', label: '  └ Fertilité' },
    
    // === AROMATHERAPIE & PHYTOTHERAPIE ===
    { value: 'AROMATHERAPIE', label: '━ Aromathérapie', isCategory: true },
    { value: 'HUILES_ESSENTIELLES', label: '  └ Huiles essentielles' },
    { value: 'DIFFUSION', label: '  └ Diffusion' },
    { value: 'PHYTOTHERAPIE', label: '━ Phytothérapie', isCategory: true },
    { value: 'PLANTES_MEDICINALES', label: '  └ Plantes médicinales' },
    { value: 'HOMEOPATHIE', label: '  └ Homéopathie' },
    
    // === MATERIEL MEDICAL ===
    { value: 'MATERIEL_MEDICAL', label: '━ Matériel médical', isCategory: true },
    { value: 'TENSIOMETRES', label: '  └ Tensiomètres' },
    { value: 'THERMOMETRES', label: '  └ Thermomètres' },
    { value: 'OXYMETRES', label: '  └ Oxymètres' },
    
    // === HYGIENE ===
    { value: 'HYGIENE', label: '━ Hygiène', isCategory: true },
    { value: 'GEL_HYDROALCOOLIQUE', label: '  └ Gel hydroalcoolique' },
    { value: 'SAVONS', label: '  └ Savons' },
    
    // === BEBE & MATERNITE ===
    { value: 'BEBE_MATERNITE', label: '━ Bébé & maternité', isCategory: true },
    { value: 'ALLAITEMENT', label: '  └ Allaitement' },
    { value: 'CHANGE', label: '  └ Change' },
    { value: 'NUTRITION_INFANTILE', label: '  └ Nutrition infantile' },
    
    // === NUTRITION SPORTIVE ===
    { value: 'NUTRITION_SPORTIVE', label: '━ Nutrition sportive', isCategory: true },
    
    // === ONCOLOGIE SUPPORT ===
    { value: 'ONCOLOGIE_SUPPORT', label: '━ Oncologie support', isCategory: true },
    { value: 'MUQUEUSES', label: '  └ Muqueuses' },
    { value: 'PEAU_FRAGILISEE', label: '  └ Peau fragilisée' },
    
    // === TEXTILE ===
    { value: 'TEXTILE', label: '━ Textile', isCategory: true },
    { value: 'COMPRESSION_Textile', label: '  └ Compression' },
    { value: 'CONTENTION', label: '  └ Contention' },
    { value: 'ORTHOPEDIE_TEXTILE', label: '  └ Orthopédie' },
    { value: 'BIEN_ETRE_TEXTILE', label: '  └ Bien-être' },
    { value: 'SPORT_TEXTILE', label: '  └ Sport' },
    
    // === FORMATION ===
    { value: 'FORMATION', label: '━ Formation', isCategory: true },
    { value: 'FORMATION_CONTINUE', label: '  └ Formation continue' },
    { value: 'E_LEARNING', label: '  └ E-learning' },
    { value: 'ATELIERS_PRATIQUES', label: '  └ Ateliers pratiques' },
    { value: 'CONFERENCES', label: '  └ Conférences' },
    { value: 'CERTIFICATION', label: '  └ Certification' },
    
    // === SERVICES ===
    { value: 'SERVICES', label: '━ Services', isCategory: true },
    { value: 'CONSULTING', label: '  └ Consulting' },
    { value: 'AUDIT', label: '  └ Audit' },
    { value: 'ACCOMPAGNEMENT', label: '  └ Merchandising' },
    { value: 'MAINTENANCE', label: '  └ Logiciel' },
    { value: 'LOCATION', label: '  └ Location' },
    { value: 'SERVICE_APRES_VENTE', label: '  └ Service après-vente' },
    
    // === AUTRE ===
    { value: 'AUTRE', label: '━ Autre', isCategory: true }
  ];

  const getBadgeColor = (type) => {
    switch(type) {
      case 'PERCENT':
        return 'badge-percent';
      case 'FREE_ITEM':
        return 'badge-free';
      case 'ORDER_THRESHOLD':
        return 'badge-threshold';
      case 'RETURN_EXPIRED':
        return 'badge-return';
      default:
        return 'badge-default';
    }
  };

  const getBadgeLabel = (type) => {
    const option = typeOptions.find(opt => opt.value === type);
    return option ? option.label : '';
  };

  const getConditionLabel = (value) => {
    const option = conditionOptions.find(opt => opt.value === value);
    return option ? option.label : '';
  };

  const getFamilleLabel = (value) => {
    const option = familleOptions.find(opt => opt.value === value);
    return option ? option.label.replace(/[━└ ]/g, '').trim() : '';
  };

  const getOfferDetail = () => {
    switch(form.type_promo) {
      case 'PERCENT':
        return form.remise_valeur ? `Remise de ${form.remise_valeur} %` : 'Remise (%)';
      case 'FREE_ITEM':
        return form.unite_offerte ? `${form.unite_offerte} unités offertes` : 'Unités offertes';
      case 'RETURN_EXPIRED':
        return 'Reprise périmés';
      case 'ORDER_THRESHOLD':
        return form.montant_minimum ? `Montant minimum : ${form.montant_minimum} €` : 'Montant minimum de commande';
      default:
        return '';
    }
  };

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSubmitted(false);
  }

  function buildDescription() {
    const parts = [];
    
    if (form.csp) parts.push(`CSP : ${form.csp}`);
    if (form.condition_client && form.condition_client !== 'ALL') {
      parts.push(`Condition : ${getConditionLabel(form.condition_client)}`);
    }
    if (form.type_promo === 'PERCENT' && form.remise_valeur) {
      parts.push(`Offre : Remise de ${form.remise_valeur} %`);
    } else if (form.type_promo === 'FREE_ITEM' && form.unite_offerte) {
      parts.push(`Offre : ${form.unite_offerte} unités offertes`);
    } else if (form.type_promo === 'ORDER_THRESHOLD' && form.montant_minimum) {
      parts.push(`Offre : Montant minimum de ${form.montant_minimum} €`);
    } else {
      parts.push(`Offre : ${getOfferDetail()}`);
    }
    if (form.implantation) parts.push(`Détail : ${form.implantation}`);
    if (form.date_debut) parts.push(`Début : ${new Date(form.date_debut).toLocaleDateString('fr-FR')}`);
    if (form.date_fin) parts.push(`Fin : ${new Date(form.date_fin).toLocaleDateString('fr-FR')}`);
    if (form.famille) parts.push(`Famille : ${getFamilleLabel(form.famille)}`);
    if (form.description) parts.push(form.description);
    
    return parts.join(' | ');
  }

  async function uploadImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `promotions/${fileName}`;

    console.log('Upload vers bucket "promotions", chemin:', filePath);

    const { data, error: uploadError } = await supabase.storage
      .from('promotions')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Erreur upload détaillée:', uploadError);
      console.error('Message:', uploadError.message);
      console.error('Statut:', uploadError.statusCode);
      alert(`Erreur d'upload : ${uploadError.message}\n\nVérifie que le bucket "promotions" existe et est public.`);
      setUploading(false);
      return;
    }

    console.log('Upload réussi:', data);

    const { data: urlData } = supabase.storage
      .from('promotions')
      .getPublicUrl(filePath);

    console.log('URL publique:', urlData.publicUrl);

    setForm({ ...form, image_url: urlData.publicUrl });
    setUploading(false);
    alert('Image téléchargée avec succès !');
  }

  function validateForm() {
    if (!form.titre.trim()) {
      alert('Veuillez saisir un titre');
      return false;
    }
    if (!form.produit.trim()) {
      alert('Veuillez saisir un produit');
      return false;
    }
    if (!form.csp.trim()) {
      alert('Veuillez saisir le code produit (GS1-128 / EAN)');
      return false;
    }
    if (!form.famille) {
      alert('Veuillez sélectionner une famille de produit');
      return false;
    }
    if (!form.description.trim()) {
      alert('Veuillez saisir une description');
      return false;
    }
    if (form.type_promo === 'PERCENT' && !form.remise_valeur) {
      alert('Veuillez saisir le pourcentage de remise');
      return false;
    }
    if (form.type_promo === 'FREE_ITEM' && !form.unite_offerte) {
      alert('Veuillez saisir le nombre d\'unités offertes');
      return false;
    }
    if (form.type_promo === 'ORDER_THRESHOLD' && !form.montant_minimum) {
      alert('Veuillez saisir le montant minimum de commande');
      return false;
    }
    if (form.condition_client === 'IMPLANTATION' && !form.implantation.trim()) {
      alert('Veuillez saisir le détail de la commande d\'implantation');
      return false;
    }
    if (!form.date_debut) {
      alert('Veuillez sélectionner une date de début');
      return false;
    }
    if (!form.date_fin) {
      alert('Veuillez sélectionner une date de fin');
      return false;
    }
    if (form.date_fin < form.date_debut) {
      alert('La date de fin doit être postérieure à la date de début');
      return false;
    }
    return true;
  }

  async function submit(e) {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (promoCount >= 10) {
      alert(`Vous avez déjà ${promoCount} promotions actives. L'offre permet jusqu'à 10 promotions simultanées.`);
      return;
    }
    
    setLoading(true);

    const fullDescription = buildDescription();

    const { error } = await supabase.from('promotions').insert({
      titre: form.titre.trim(),
      description: fullDescription,
      produit: form.produit.trim(),
      type_promo: form.type_promo,
      famille: form.famille,
      image_url: form.image_url || null,
      laboratoire_id: laboId,
      active: true
    });

    if (error) {
      console.error('Erreur Supabase :', error);
      alert('Erreur lors de la création : ' + error.message);
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setForm({
      titre: '',
      description: '',
      produit: '',
      type_promo: 'PERCENT',
      csp: '',
      remise_valeur: '',
      unite_offerte: '',
      condition_client: 'ALL',
      implantation: '',
      montant_minimum: '',
      date_debut: '',
      date_fin: '',
      famille: '',
      image_url: ''
    });
    setLoading(false);
  }

  // États d'affichage
  if (laboStatus === null) {
    return (
      <div className="create-page">
        <div className="create-header">
          <button className="create-back-button" onClick={() => setPage('home')}>
            ← Retour à l'accueil
          </button>
          <h1 className="create-title">Créer une promotion</h1>
          <p className="create-subtitle">Chargement...</p>
        </div>
      </div>
    );
  }

  if (laboStatus === 'no_labo') {
    return (
      <div className="create-page">
        <div className="create-header">
          <button className="create-back-button" onClick={() => setPage('home')}>
            ← Retour à l'accueil
          </button>
          <h1 className="create-title">Créer une promotion</h1>
        </div>
        <div className="create-container">
          <div className="create-form-wrapper" style={{ textAlign: 'center', padding: '60px 40px' }}>
            <h2 style={{ color: '#061B5B', marginBottom: '12px', fontSize: '28px' }}>
              Créez votre espace laboratoire
            </h2>
            <p style={{ color: '#667399', fontSize: '16px', lineHeight: '1.6', maxWidth: '480px', margin: '0 auto' }}>
              Pour publier une promotion, vous devez d'abord créer votre espace laboratoire.
            </p>
            <p style={{ color: '#667399', fontSize: '15px', lineHeight: '1.6', maxWidth: '480px', margin: '12px auto 0' }}>
              L'inscription lance votre essai gratuit de 30 jours. Vous pourrez ensuite publier jusqu'à 10 promotions actives.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '28px', flexWrap: 'wrap' }}>
              <button 
                className="form-submit" 
                onClick={() => setPage('pricing')}
                style={{ width: 'auto', padding: '14px 40px' }}
              >
                Créer mon espace laboratoire
              </button>
              <button 
                className="form-submit" 
                onClick={() => setPage('home')}
                style={{ width: 'auto', padding: '14px 40px', background: 'white', color: '#061B5B', border: '2px solid #E4EAF7', boxShadow: 'none' }}
                onMouseOver={(e) => { e.target.style.background = '#F7FAFF'; }}
                onMouseOut={(e) => { e.target.style.background = 'white'; }}
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (laboStatus === 'expired') {
    return (
      <div className="create-page">
        <div className="create-header">
          <button className="create-back-button" onClick={() => setPage('home')}>
            ← Retour à l'accueil
          </button>
          <h1 className="create-title">Créer une promotion</h1>
        </div>
        <div className="create-container">
          <div className="create-form-wrapper" style={{ textAlign: 'center', padding: '60px 40px' }}>
            <h2 style={{ color: '#061B5B', marginBottom: '12px', fontSize: '28px' }}>
              Votre essai gratuit est terminé.
            </h2>
            <p style={{ color: '#667399', fontSize: '16px', lineHeight: '1.6', maxWidth: '480px', margin: '0 auto' }}>
              Pour continuer à publier vos promotions, activez votre abonnement à 50 € / mois.
            </p>
            <button 
              className="form-submit" 
              onClick={() => setPage('pricing')}
              style={{ marginTop: '28px', width: 'auto', padding: '14px 40px' }}
            >
              Voir l'abonnement
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Laboratoire actif - afficher le formulaire
  return (
    <div className="create-page">
      <div className="create-header">
        <button 
          type="button" 
          className="create-back-button"
          onClick={() => setPage('home')}
        >
          ← Retour à l'accueil
        </button>
        <h1 className="create-title">Créer une promotion</h1>
        <p className="create-subtitle">Diffusez vos offres auprès de 18.000 officines</p>
        {promoCount >= 8 && (
          <p style={{ color: promoCount >= 10 ? '#FF5F8F' : '#667399', fontSize: '14px', marginTop: '8px' }}>
            {promoCount}/10 promotions actives
          </p>
        )}
      </div>

      <div className="create-container">
        <div className="create-form-wrapper">
          <form onSubmit={submit} className="create-form">
            <div className="form-group">
              <label htmlFor="titre" className="form-label">Titre de la promotion</label>
              <input
                id="titre"
                name="titre"
                type="text"
                placeholder="Ex: -20% sur Doliprane"
                value={form.titre}
                onChange={update}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="produit" className="form-label">Produit</label>
              <input
                id="produit"
                name="produit"
                type="text"
                placeholder="Ex: Doliprane 1000mg"
                value={form.produit}
                onChange={update}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="csp" className="form-label">Code produit (GS1-128 / EAN)</label>
              <input
                id="csp"
                name="csp"
                type="text"
                placeholder="Ex: 0761234501236"
                value={form.csp}
                onChange={update}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="famille" className="form-label">Famille de produit</label>
              <select
                id="famille"
                name="famille"
                value={form.famille}
                onChange={update}
                className="form-select"
                required
              >
                <option value="">Sélectionner une famille</option>
                {familleOptions.map((option) => (
                  <option 
                    key={option.value} 
                    value={option.value}
                    style={option.isCategory ? { fontWeight: 'bold', background: '#F0F4FF' } : { paddingLeft: '20px' }}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="image" className="form-label">Photo du produit</label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={uploadImage}
                className="form-input-file"
                disabled={uploading}
              />
              {uploading && <span className="form-help">Téléchargement en cours...</span>}
              {form.image_url && (
                <div className="form-image-preview">
                  <img src={form.image_url} alt="Aperçu" />
                  <span className="form-help">Image téléchargée ✓</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="type_promo" className="form-label">Type de promotion</label>
              <select
                id="type_promo"
                name="type_promo"
                value={form.type_promo}
                onChange={update}
                className="form-select"
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {form.type_promo === 'PERCENT' && (
              <div className="form-group">
                <label htmlFor="remise_valeur" className="form-label">Pourcentage de remise</label>
                <div className="form-input-with-suffix">
                  <input
                    id="remise_valeur"
                    name="remise_valeur"
                    type="number"
                    placeholder="Ex: 10"
                    value={form.remise_valeur}
                    onChange={update}
                    className="form-input"
                    min="0"
                    max="100"
                    required
                  />
                  <span className="form-input-suffix">%</span>
                </div>
              </div>
            )}

            {form.type_promo === 'FREE_ITEM' && (
              <div className="form-group">
                <label htmlFor="unite_offerte" className="form-label">Unités offertes</label>
                <input
                  id="unite_offerte"
                  name="unite_offerte"
                  type="number"
                  placeholder="Ex: 2"
                  value={form.unite_offerte}
                  onChange={update}
                  className="form-input"
                  min="1"
                  required
                />
              </div>
            )}

            {form.type_promo === 'ORDER_THRESHOLD' && (
              <div className="form-group">
                <label htmlFor="montant_minimum" className="form-label">Montant minimum de commande</label>
                <div className="form-input-with-suffix">
                  <input
                    id="montant_minimum"
                    name="montant_minimum"
                    type="number"
                    placeholder="Ex: 150"
                    value={form.montant_minimum}
                    onChange={update}
                    className="form-input"
                    min="0"
                    step="0.01"
                    required
                  />
                  <span className="form-input-suffix">€</span>
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="condition_client" className="form-label">Condition client</label>
              <select
                id="condition_client"
                name="condition_client"
                value={form.condition_client}
                onChange={update}
                className="form-select"
              >
                {conditionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {form.condition_client === 'IMPLANTATION' && (
              <div className="form-group">
                <label htmlFor="implantation" className="form-label">Détail commande d'implantation</label>
                <input
                  id="implantation"
                  name="implantation"
                  type="text"
                  placeholder="Ex: Offre valable pour une première implantation de 15 unités minimum"
                  value={form.implantation}
                  onChange={update}
                  className="form-input"
                  required
                />
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date_debut" className="form-label">Date de début de l'offre</label>
                <input
                  id="date_debut"
                  name="date_debut"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  max="2032-12-31"
                  value={form.date_debut}
                  onChange={update}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="date_fin" className="form-label">Date de fin de l'offre</label>
                <input
                  id="date_fin"
                  name="date_fin"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  max="2032-12-31"
                  value={form.date_fin}
                  onChange={update}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">Description commerciale</label>
              <textarea
                id="description"
                name="description"
                placeholder="Ex: 15 unités achetées + 2 offertes pour les nouveaux clients."
                value={form.description}
                onChange={update}
                className="form-textarea"
                required
              />
              <span className="form-help">
                Précisez les quantités, conditions, dates et restrictions éventuelles.
              </span>
            </div>

            <button type="submit" className="form-submit" disabled={loading || uploading || promoCount >= 10}>
              {loading ? 'Publication en cours...' : promoCount >= 10 ? 'Limite de 10 promotions atteinte' : 'Publier la promotion'}
            </button>

            {submitted && (
              <div className="form-success">
                Promotion créée avec succès !
              </div>
            )}
          </form>
        </div>

        <div className="create-preview">
          <h3 className="preview-title">Aperçu de la promotion</h3>
          <div className="preview-card">
            {form.image_url && (
              <div className="preview-image">
                <img src={form.image_url} alt="Aperçu produit" />
              </div>
            )}
            <div className="preview-badge-wrapper">
              <div className={`preview-badge ${getBadgeColor(form.type_promo)}`}>
                {getBadgeLabel(form.type_promo)}
              </div>
              {form.famille && (
                <div className="preview-badge preview-badge-famille">
                  {getFamilleLabel(form.famille)}
                </div>
              )}
            </div>
            <div className="preview-content">
              <div className="preview-block">
                <p className="preview-label">Titre</p>
                <p className="preview-value">{form.titre || 'Titre de la promotion'}</p>
              </div>
              
              <div className="preview-block">
                <p className="preview-label">Produit</p>
                <p className="preview-value">{form.produit || 'Nom du produit'}</p>
              </div>

              {form.csp && (
                <div className="preview-block">
                  <p className="preview-label">Code produit (GS1-128 / EAN)</p>
                  <p className="preview-value">{form.csp}</p>
                </div>
              )}

              <div className="preview-block">
                <p className="preview-label">Condition client</p>
                <p className="preview-condition">{getConditionLabel(form.condition_client)}</p>
              </div>

              <div className="preview-block">
                <p className="preview-label">Offre</p>
                <p className="preview-offer">{getOfferDetail()}</p>
              </div>

              {form.date_debut && (
                <div className="preview-block">
                  <p className="preview-label">Début</p>
                  <p className="preview-value">{new Date(form.date_debut).toLocaleDateString('fr-FR')}</p>
                </div>
              )}

              {form.date_fin && (
                <div className="preview-block">
                  <p className="preview-label">Fin</p>
                  <p className="preview-value">{new Date(form.date_fin).toLocaleDateString('fr-FR')}</p>
                </div>
              )}

              {form.description && (
                <div className="preview-block">
                  <p className="preview-label">Description</p>
                  <p className="preview-description">{form.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}