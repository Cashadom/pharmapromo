// src/routes/CreatePromotion.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './CreatePromotion.css';

export default function CreatePromotion({ setPage }) {
  const [form, setForm] = useState({
    produit: '',
    type_promo: 'PERCENT',
    famille: '',
    image_url: '',
    visibility_mode: 'PUBLIC',
    condition_client: 'ALL',
    date_debut: '',
    date_fin: '',
    csp: '',
    description: '',
    remise_valeur: '',
    unite_offerte: '',
    montant_minimum: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [laboId, setLaboId] = useState(null);
  const [laboStatus, setLaboStatus] = useState('loading');
  const [promoCount, setPromoCount] = useState(0);
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);

  // === FAMILLES (version complète) ===
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
    { value: 'GROSSESSE', label: '  └ Grossesse' },
    { value: 'ENFANTS', label: '  └ Enfants' },
    { value: 'SENIORS', label: '  └ Seniors' },
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
    { value: 'FERTILITE_FEMININE', label: '  └ Fertilité féminine' },
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
    { value: 'COMPRESSION_TEXTILE', label: '  └ Compression' },
    { value: 'CONTENTION', label: '  └ Contention' },
    { value: 'ORTHOPEDIE_TEXTILE', label: '  └ Orthopédie' },
    { value: 'BIEN_ETRE_TEXTILE', label: '  └ Bien-être' },
    { value: 'SPORT_TEXTILE', label: '  └ Sport' },
    
    // === SERVICES ===
    { value: 'SERVICES', label: '━ Services', isCategory: true },
    { value: 'LOGICIELS', label: '  └ Logiciels' },
    { value: 'FORMATION_SERVICES', label: '  └ Formation' },
    { value: 'MERCHANDISING', label: '  └ Merchandising' },
    { value: 'ACCOMPAGNEMENT', label: '  └ Accompagnement' },
    
    // === AUTRE ===
    { value: 'AUTRE', label: '━ Autre', isCategory: true }
  ];

  useEffect(() => {
    checkLabo();
  }, []);

  async function checkLabo() {
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData?.user) {
      setLaboStatus('no_labo');
      return;
    }

    const userId = authData.user.id;
    setUser(authData.user);

    const { data, error } = await supabase
      .from('laboratoires')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      setLaboStatus('no_labo');
      return;
    }

    setLaboId(data.id);

    if (data.statut === 'expired') {
      setLaboStatus('expired');
      return;
    }

    const { count } = await supabase
      .from('promotions')
      .select('*', { count: 'exact', head: true })
      .eq('laboratoire_id', data.id)
      .eq('active', true);

    setPromoCount(count || 0);
    setLaboStatus('ok');
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

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

  const typeOptions = [
    { value: 'PERCENT', label: 'Remise (%)' },
    { value: 'FREE_ITEM', label: 'Unité offerte' },
    { value: 'RETURN_EXPIRED', label: 'Reprise périmés' },
    { value: 'ORDER_THRESHOLD', label: 'Montant minimum commande' }
  ];

  const conditionOptions = [
    { value: 'ALL', label: 'Toutes les officines' },
    { value: 'REORDER', label: 'Commande de réassort' },
    { value: 'IMPLANTATION', label: 'Commande d\'implantation' }
  ];

  const visibilityOptions = [
    { value: 'PUBLIC', label: 'Publique - conditions visibles' },
    { value: 'SEMI_PRIVATE', label: 'Semi-privée - conditions sur demande' }
  ];

  const getFamilleLabel = (value) => {
    const option = familleOptions.find(opt => opt.value === value);
    return option ? option.label.replace(/[━└ ]/g, '').trim() : '';
  };

  const getConditionLabel = (value) => {
    const option = conditionOptions.find(opt => opt.value === value);
    return option ? option.label : '';
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

  async function uploadImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `promotions/${fileName}`;

    const { data, error: uploadError } = await supabase.storage
      .from('promotions')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Erreur upload:', uploadError);
      alert(`Erreur d'upload : ${uploadError.message}`);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('promotions')
      .getPublicUrl(filePath);

    setForm({ ...form, image_url: urlData.publicUrl });
    setUploading(false);
    alert('Image téléchargée avec succès !');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!laboId) {
      setError('Laboratoire non trouvé. Veuillez vous reconnecter.');
      setLoading(false);
      return;
    }

    if (!form.produit.trim()) {
      setError('Veuillez saisir le nom du produit.');
      setLoading(false);
      return;
    }

    if (!form.date_debut || !form.date_fin) {
      setError('Veuillez sélectionner les dates de début et de fin.');
      setLoading(false);
      return;
    }

    const fullDescription = form.description || '';

    const { error } = await supabase.from('promotions').insert({
      titre: form.produit.trim(),
      description: fullDescription,
      produit: form.produit.trim(),
      type_promo: form.type_promo,
      famille: form.famille || null,
      image_url: form.image_url || null,
      laboratoire_id: laboId,
      visibility_mode: form.visibility_mode,
      condition_client: form.condition_client,
      date_debut: form.date_debut,
      date_fin: form.date_fin,
      csp: form.csp || null,
      remise_valeur: form.type_promo === 'PERCENT' ? parseFloat(form.remise_valeur) || null : null,
      unite_offerte: form.type_promo === 'FREE_ITEM' ? parseInt(form.unite_offerte) || null : null,
      montant_minimum: form.type_promo === 'ORDER_THRESHOLD' ? parseFloat(form.montant_minimum) || null : null,
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Erreur création promotion:', error);
      setError('Erreur lors de la création de la promotion. Veuillez réessayer.');
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    setForm({
      produit: '',
      type_promo: 'PERCENT',
      famille: '',
      image_url: '',
      visibility_mode: 'PUBLIC',
      condition_client: 'ALL',
      date_debut: '',
      date_fin: '',
      csp: '',
      description: '',
      remise_valeur: '',
      unite_offerte: '',
      montant_minimum: '',
    });

    setTimeout(() => {
      setPage('dashboard');
    }, 2000);
  }

  if (laboStatus === 'loading') {
    return (
      <div className="create-page">
        <div className="create-container">
          <div className="create-form-wrapper" style={{ textAlign: 'center', padding: '60px 40px' }}>
            <p style={{ color: '#667399', fontSize: '16px' }}>Vérification du compte...</p>
          </div>
        </div>
      </div>
    );
  }

  if (laboStatus === 'no_labo') {
    return (
      <div className="create-page">
        <div className="create-container">
          <div className="create-form-wrapper" style={{ textAlign: 'center', padding: '60px 40px' }}>
            <h2 style={{ color: '#061B5B', marginBottom: '12px', fontSize: '28px' }}>
              Accès non autorisé
            </h2>
            <p style={{ color: '#667399', fontSize: '16px', lineHeight: '1.6' }}>
              Vous devez être connecté en tant que laboratoire pour créer une promotion.
            </p>
            <button 
              className="form-submit" 
              onClick={() => setPage('home')}
              style={{ marginTop: '28px', width: 'auto', padding: '14px 40px' }}
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (laboStatus === 'expired') {
    return (
      <div className="create-page">
        <div className="create-container">
          <div className="create-form-wrapper" style={{ textAlign: 'center', padding: '60px 40px' }}>
            <h2 style={{ color: '#061B5B', marginBottom: '12px', fontSize: '28px' }}>
              Abonnement expiré
            </h2>
            <p style={{ color: '#667399', fontSize: '16px', lineHeight: '1.6' }}>
              Votre période d'essai est terminée. Pour continuer à publier des offres, veuillez activer votre abonnement.
            </p>
            <button 
              className="form-submit" 
              onClick={() => setPage('pricing')}
              style={{ marginTop: '28px', width: 'auto', padding: '14px 40px' }}
            >
              Voir les offres
            </button>
          </div>
        </div>
      </div>
    );
  }

  const maxPromos = 3;
  const canCreate = promoCount < maxPromos;

  return (
    <div className="create-page">
      {/* Fonds animés */}
      <div className="create-bg" aria-hidden="true">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="blob blob-4"></div>
        <div className="blob blob-5"></div>
        <div className="blob blob-6"></div>
        <div className="blob blob-7"></div>
      </div>

      <div className="create-header">
        <button 
          type="button" 
          className="create-back-button"
          onClick={() => setPage('dashboard')}
        >
          ← Retour au dashboard
        </button>
        <h1 className="create-title">Créer une nouvelle promotion</h1>
        <p className="create-subtitle">
          {canCreate 
            ? `Il vous reste ${maxPromos - promoCount} offre${maxPromos - promoCount > 1 ? 's' : ''} à créer`
            : 'Vous avez atteint le nombre maximum d\'offres actives'}
        </p>
      </div>

      <div className="create-container">
        <div className="create-form-wrapper">
          {!canCreate && (
            <div style={{ 
              background: 'rgba(255, 95, 143, 0.08)', 
              padding: '16px 20px', 
              borderRadius: '14px',
              marginBottom: '20px',
              border: '1px solid rgba(255, 95, 143, 0.2)'
            }}>
              <p style={{ margin: 0, color: '#FF5F8F', fontWeight: 600 }}>
                Vous avez atteint le nombre maximum d'offres actives pour votre essai gratuit.
              </p>
              <button 
                className="form-submit" 
                onClick={() => setPage('pricing')}
                style={{ marginTop: '12px', width: 'auto', padding: '10px 28px' }}
              >
                Passer à l'abonnement
              </button>
            </div>
          )}

          {success && (
            <div className="form-success">
              Promotion créée avec succès ! Redirection vers le dashboard...
            </div>
          )}

          {error && (
            <div style={{ 
              background: 'rgba(255, 95, 143, 0.08)', 
              color: '#FF5F8F',
              padding: '16px 20px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 95, 143, 0.2)',
              fontWeight: 600,
              fontSize: '15px'
            }}>
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="create-form">
            <div className="form-group">
              <label htmlFor="produit" className="form-label">Produit *</label>
              <input
                id="produit"
                name="produit"
                type="text"
                className="form-input"
                placeholder="Ex: Doliprane 1000mg"
                value={form.produit}
                onChange={handleChange}
                required
                disabled={!canCreate}
              />
            </div>

            <div className="form-group">
              <label htmlFor="csp" className="form-label">Code produit (GS1-128 / EAN) *</label>
              <input
                id="csp"
                name="csp"
                type="text"
                className="form-input"
                placeholder="Ex: 0761234501236"
                value={form.csp}
                onChange={handleChange}
                required
                disabled={!canCreate}
              />
            </div>

            <div className="form-group">
              <label htmlFor="famille" className="form-label">Famille de produit *</label>
              <select
                id="famille"
                name="famille"
                className="form-select"
                value={form.famille}
                onChange={handleChange}
                required
                disabled={!canCreate}
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
                className="form-input-file"
                onChange={uploadImage}
                disabled={uploading || !canCreate}
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
              <label htmlFor="type_promo" className="form-label">Type de promotion *</label>
              <select
                id="type_promo"
                name="type_promo"
                className="form-select"
                value={form.type_promo}
                onChange={handleChange}
                required
                disabled={!canCreate}
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
                <label htmlFor="remise_valeur" className="form-label">Pourcentage de remise *</label>
                <div className="form-input-with-suffix">
                  <input
                    id="remise_valeur"
                    name="remise_valeur"
                    type="number"
                    className="form-input"
                    placeholder="Ex: 10"
                    value={form.remise_valeur}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    required
                    disabled={!canCreate}
                  />
                  <span className="form-input-suffix">%</span>
                </div>
              </div>
            )}

            {form.type_promo === 'FREE_ITEM' && (
              <div className="form-group">
                <label htmlFor="unite_offerte" className="form-label">Unités offertes *</label>
                <input
                  id="unite_offerte"
                  name="unite_offerte"
                  type="number"
                  className="form-input"
                  placeholder="Ex: 2"
                  value={form.unite_offerte}
                  onChange={handleChange}
                  min="1"
                  required
                  disabled={!canCreate}
                />
              </div>
            )}

            {form.type_promo === 'ORDER_THRESHOLD' && (
              <div className="form-group">
                <label htmlFor="montant_minimum" className="form-label">Montant minimum de commande *</label>
                <div className="form-input-with-suffix">
                  <input
                    id="montant_minimum"
                    name="montant_minimum"
                    type="number"
                    className="form-input"
                    placeholder="Ex: 150"
                    value={form.montant_minimum}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                    disabled={!canCreate}
                  />
                  <span className="form-input-suffix">€</span>
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="condition_client" className="form-label">Condition client *</label>
              <select
                id="condition_client"
                name="condition_client"
                className="form-select"
                value={form.condition_client}
                onChange={handleChange}
                required
                disabled={!canCreate}
              >
                {conditionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date_debut" className="form-label">Date de début *</label>
                <input
                  id="date_debut"
                  name="date_debut"
                  type="date"
                  className="form-input"
                  min={new Date().toISOString().split('T')[0]}
                  max="2032-12-31"
                  value={form.date_debut}
                  onChange={handleChange}
                  required
                  disabled={!canCreate}
                />
              </div>

              <div className="form-group">
                <label htmlFor="date_fin" className="form-label">Date de fin *</label>
                <input
                  id="date_fin"
                  name="date_fin"
                  type="date"
                  className="form-input"
                  min={new Date().toISOString().split('T')[0]}
                  max="2032-12-31"
                  value={form.date_fin}
                  onChange={handleChange}
                  required
                  disabled={!canCreate}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="visibility_mode" className="form-label">Visibilité de l'offre *</label>
              <select
                id="visibility_mode"
                name="visibility_mode"
                className="form-select"
                value={form.visibility_mode}
                onChange={handleChange}
                required
                disabled={!canCreate}
              >
                {visibilityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {form.visibility_mode === 'PUBLIC' && (
              <div className="form-group">
                <label htmlFor="description" className="form-label">Description commerciale *</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-textarea"
                  placeholder="Ex: 15 unités achetées + 2 offertes pour les nouveaux clients."
                  value={form.description}
                  onChange={handleChange}
                  required
                  disabled={!canCreate}
                />
                <span className="form-help">
                  Précisez les quantités, conditions, dates et restrictions éventuelles.
                </span>
              </div>
            )}

            {form.visibility_mode === 'SEMI_PRIVATE' && (
              <div className="form-group">
                <div className="form-info-box">
                  <p className="form-info-text">
                    Offre semi-privée : les pharmaciens verront : le laboratoire, la photo du produit, le nom du produit, le code EAN, le type d'offre, la condition client et la date de fin.
                  </p>
                  <p className="form-info-text">
                    Les conditions commerciales détaillées restent confidentielles. Les pharmaciens pourront contacter le laboratoire directement depuis l'offre.
                  </p>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className="form-submit"
              disabled={!canCreate || loading || uploading}
            >
              {loading ? 'Publication en cours...' : 
               uploading ? 'Téléchargement en cours...' :
               !canCreate ? 'Limite de 3 promotions atteinte' : 
               'Publier la promotion'}
            </button>
          </form>
        </div>

        {/* Preview */}
        <div className="create-preview">
          <h3 className="preview-title">Aperçu de la promotion</h3>
          <div className="preview-card">
            {form.image_url && (
              <div className="preview-image">
                <img src={form.image_url} alt="Aperçu produit" />
              </div>
            )}

            <div className="preview-lab-info">
              <span className="preview-lab-name">Laboratoire</span>
            </div>

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
                <p className="preview-label">Produit</p>
                <p className="preview-value">{form.produit || 'Nom du produit'}</p>
              </div>

              {form.csp && (
                <div className="preview-block">
                  <p className="preview-label">Code EAN</p>
                  <p className="preview-value">{form.csp}</p>
                </div>
              )}

              <div className="preview-block">
                <p className="preview-label">Type d'offre</p>
                <p className="preview-offer">{getOfferDetail()}</p>
              </div>

              <div className="preview-block">
                <p className="preview-label">Condition client</p>
                <p className="preview-condition">{getConditionLabel(form.condition_client)}</p>
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

              {form.visibility_mode === 'PUBLIC' && form.description && (
                <div className="preview-block">
                  <p className="preview-label">Description</p>
                  <p className="preview-description">{form.description}</p>
                </div>
              )}

              {form.visibility_mode === 'SEMI_PRIVATE' && (
                <>
                  <div className="preview-block">
                    <p className="preview-label">Conditions commerciales</p>
                    <p className="preview-description" style={{ color: '#0B45D9', fontWeight: '600' }}>
                      Sur demande
                    </p>
                  </div>
                  <div className="preview-block preview-block-contact">
                    <p className="preview-label">Contact</p>
                    <p className="preview-description" style={{ color: '#061B5B' }}>
                      📞 Téléphone non renseigné
                    </p>
                  </div>
                  <button className="preview-contact-btn">
                    Contacter le laboratoire
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}