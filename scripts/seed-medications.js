/**
 * seed-medications.js
 * Task ID: meds-seed
 *
 * Seeds a comprehensive medication catalog for Clinique Centrale NYA
 * (hospital hosp_demo_001) in Douala, Cameroon.
 *
 * Usage:
 *   cd /home/z/my-project && node scripts/seed-medications.js
 */

const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

const HOSPITAL_ID = 'hosp_demo_001';

// ── Helper: generate an expiry date 6–24 months from now ──────────────────
function futureExpiry(minMonths, maxMonths) {
  const now = new Date();
  const months = minMonths + Math.floor(Math.random() * (maxMonths - minMonths + 1));
  const d = new Date(now.getFullYear(), now.getMonth() + months, 1 + Math.floor(Math.random() * 27));
  return d;
}

// ── Helper: batch number in realistic format ───────────────────────────────
function batchLot(prefix, year) {
  const seq = String(Math.floor(Math.random() * 9000) + 1000);
  return `${prefix}${year}${seq}`;
}

// ── Medication catalog (50+ real medications used in Cameroon/West Africa) ──
function buildMedications() {
  const now = new Date();
  const year = now.getFullYear();

  return [
    // ════════════════════════════════════════════════════════════════════════
    // ANTIBIOTIQUES
    // ════════════════════════════════════════════════════════════════════════
    {
      name: 'Amoxicilline 500mg',
      genericName: 'Amoxicilline',
      category: 'Antibiotique',
      form: 'Gélule',
      stockQuantity: 300,
      minStockAlert: 50,
      unitPrice: 75,
      salePrice: 125,
      supplier: 'Pharmacie Centrale',
      batchNumber: batchLot('AMX', year),
      expiryDate: futureExpiry(8, 18),
    },
    {
      name: 'Amoxicilline 1g',
      genericName: 'Amoxicilline',
      category: 'Antibiotique',
      form: 'Comprimé',
      stockQuantity: 200,
      minStockAlert: 30,
      unitPrice: 120,
      salePrice: 200,
      supplier: 'Sanofi',
      batchNumber: batchLot('AMX', year),
      expiryDate: futureExpiry(10, 20),
    },
    {
      name: 'Azithromycine 500mg',
      genericName: 'Azithromycine',
      category: 'Antibiotique',
      form: 'Comprimé',
      stockQuantity: 150,
      minStockAlert: 25,
      unitPrice: 350,
      salePrice: 600,
      supplier: 'Pfizer',
      batchNumber: batchLot('AZI', year),
      expiryDate: futureExpiry(12, 22),
    },
    {
      name: 'Ciprofloxacine 500mg',
      genericName: 'Ciprofloxacine',
      category: 'Antibiotique',
      form: 'Comprimé',
      stockQuantity: 120,
      minStockAlert: 20,
      unitPrice: 150,
      salePrice: 280,
      supplier: 'Bayer',
      batchNumber: batchLot('CIP', year),
      expiryDate: futureExpiry(10, 18),
    },
    {
      name: 'Doxycycline 100mg',
      genericName: 'Doxycycline',
      category: 'Antibiotique',
      form: 'Gélule',
      stockQuantity: 200,
      minStockAlert: 30,
      unitPrice: 80,
      salePrice: 150,
      supplier: 'Pharmacie Centrale',
      batchNumber: batchLot('DOX', year),
      expiryDate: futureExpiry(8, 16),
    },
    {
      name: 'Métronidazole 500mg',
      genericName: 'Métronidazole',
      category: 'Antibiotique',
      form: 'Comprimé',
      stockQuantity: 250,
      minStockAlert: 40,
      unitPrice: 50,
      salePrice: 100,
      supplier: 'Cameroon-pharm',
      batchNumber: batchLot('MTZ', year),
      expiryDate: futureExpiry(10, 20),
    },
    {
      name: 'Ceftriaxone 1g Injectable',
      genericName: 'Ceftriaxone',
      category: 'Antibiotique',
      form: 'Injectable',
      stockQuantity: 80,
      minStockAlert: 15,
      unitPrice: 800,
      salePrice: 1500,
      supplier: 'Roche',
      batchNumber: batchLot('CRO', year),
      expiryDate: futureExpiry(6, 14),
    },
    {
      name: 'Ampicilline 500mg',
      genericName: 'Ampicilline',
      category: 'Antibiotique',
      form: 'Gélule',
      stockQuantity: 180,
      minStockAlert: 30,
      unitPrice: 60,
      salePrice: 120,
      supplier: 'Pharmacie Centrale',
      batchNumber: batchLot('AMP', year),
      expiryDate: futureExpiry(8, 16),
    },
    {
      name: 'Cotrimoxazole 480mg',
      genericName: 'Cotrimoxazole (Triméthoprime/Sulfaméthoxazole)',
      category: 'Antibiotique',
      form: 'Comprimé',
      stockQuantity: 350,
      minStockAlert: 60,
      unitPrice: 35,
      salePrice: 75,
      supplier: 'Cameroon-pharm',
      batchNumber: batchLot('COT', year),
      expiryDate: futureExpiry(12, 22),
    },

    // ════════════════════════════════════════════════════════════════════════
    // ANTALGIQUES / AINS
    // ════════════════════════════════════════════════════════════════════════
    {
      name: 'Paracétamol 500mg',
      genericName: 'Paracétamol',
      category: 'Antalgique',
      form: 'Comprimé',
      stockQuantity: 500,
      minStockAlert: 100,
      unitPrice: 50,
      salePrice: 100,
      supplier: 'Cameroon-pharm',
      batchNumber: batchLot('PAR', year),
      expiryDate: futureExpiry(12, 24),
    },
    {
      name: 'Paracétamol 100mg/5ml Sirop',
      genericName: 'Paracétamol',
      category: 'Antalgique',
      form: 'Sirop',
      stockQuantity: 100,
      minStockAlert: 20,
      unitPrice: 500,
      salePrice: 900,
      supplier: 'UPSA',
      batchNumber: batchLot('PRS', year),
      expiryDate: futureExpiry(8, 16),
    },
    {
      name: 'Ibuprofène 400mg',
      genericName: 'Ibuprofène',
      category: 'AINS',
      form: 'Comprimé',
      stockQuantity: 300,
      minStockAlert: 50,
      unitPrice: 60,
      salePrice: 120,
      supplier: 'Pharmacie Centrale',
      batchNumber: batchLot('IBU', year),
      expiryDate: futureExpiry(10, 18),
    },
    {
      name: 'Aspirine 300mg',
      genericName: 'Acide acétylsalicylique',
      category: 'AINS',
      form: 'Comprimé',
      stockQuantity: 400,
      minStockAlert: 80,
      unitPrice: 30,
      salePrice: 75,
      supplier: 'Bayer',
      batchNumber: batchLot('ASP', year),
      expiryDate: futureExpiry(14, 24),
    },
    {
      name: 'Tramadol 50mg',
      genericName: 'Tramadol',
      category: 'Antalgique',
      form: 'Gélule',
      stockQuantity: 50,
      minStockAlert: 10,
      unitPrice: 150,
      salePrice: 300,
      supplier: 'Sanofi',
      batchNumber: batchLot('TRA', year),
      expiryDate: futureExpiry(10, 20),
    },
    {
      name: 'Diclofénac 50mg',
      genericName: 'Diclofénac',
      category: 'AINS',
      form: 'Comprimé',
      stockQuantity: 200,
      minStockAlert: 30,
      unitPrice: 80,
      salePrice: 160,
      supplier: 'Novartis',
      batchNumber: batchLot('DIC', year),
      expiryDate: futureExpiry(8, 16),
    },
    {
      name: 'Morphine 10mg Injectable',
      genericName: 'Morphine',
      category: 'Antalgique',
      form: 'Injectable',
      stockQuantity: 20,
      minStockAlert: 5,
      unitPrice: 2000,
      salePrice: 3500,
      supplier: 'Lafarge',
      batchNumber: batchLot('MOR', year),
      expiryDate: futureExpiry(6, 12),
    },

    // ════════════════════════════════════════════════════════════════════════
    // ANTIPALUDÉENS
    // ════════════════════════════════════════════════════════════════════════
    {
      name: 'Coartem (Artéméther/Luméfantrine) 20/120mg',
      genericName: 'Artéméther / Luméfantrine',
      category: 'Antipaludéen',
      form: 'Comprimé',
      stockQuantity: 200,
      minStockAlert: 40,
      unitPrice: 1200,
      salePrice: 2500,
      supplier: 'Novartis',
      batchNumber: batchLot('COA', year),
      expiryDate: futureExpiry(10, 20),
    },
    {
      name: 'Quinine 500mg',
      genericName: 'Quinine',
      category: 'Antipaludéen',
      form: 'Comprimé',
      stockQuantity: 150,
      minStockAlert: 25,
      unitPrice: 100,
      salePrice: 200,
      supplier: 'Cameroon-pharm',
      batchNumber: batchLot('QUI', year),
      expiryDate: futureExpiry(12, 22),
    },
    {
      name: 'Amodiaquine 150mg',
      genericName: 'Amodiaquine',
      category: 'Antipaludéen',
      form: 'Comprimé',
      stockQuantity: 120,
      minStockAlert: 20,
      unitPrice: 75,
      salePrice: 150,
      supplier: 'Pharmacie Centrale',
      batchNumber: batchLot('AMO', year),
      expiryDate: futureExpiry(10, 18),
    },
    {
      name: 'Fansidar (Sulfadoxine/Pyriméthamine) 500/25mg',
      genericName: 'Sulfadoxine / Pyriméthamine',
      category: 'Antipaludéen',
      form: 'Comprimé',
      stockQuantity: 80,
      minStockAlert: 15,
      unitPrice: 200,
      salePrice: 450,
      supplier: 'Roche',
      batchNumber: batchLot('FAN', year),
      expiryDate: futureExpiry(8, 16),
    },

    // ════════════════════════════════════════════════════════════════════════
    // ANTIHYPERTENSEURS
    // ════════════════════════════════════════════════════════════════════════
    {
      name: 'Amlodipine 5mg',
      genericName: 'Amlodipine',
      category: 'Antihypertenseur',
      form: 'Comprimé',
      stockQuantity: 200,
      minStockAlert: 40,
      unitPrice: 120,
      salePrice: 250,
      supplier: 'Pfizer',
      batchNumber: batchLot('AML', year),
      expiryDate: futureExpiry(12, 22),
    },
    {
      name: 'Amlodipine 10mg',
      genericName: 'Amlodipine',
      category: 'Antihypertenseur',
      form: 'Comprimé',
      stockQuantity: 150,
      minStockAlert: 25,
      unitPrice: 180,
      salePrice: 350,
      supplier: 'Pfizer',
      batchNumber: batchLot('AML', year),
      expiryDate: futureExpiry(12, 22),
    },
    {
      name: 'Losartan 50mg',
      genericName: 'Losartan',
      category: 'Antihypertenseur',
      form: 'Comprimé',
      stockQuantity: 120,
      minStockAlert: 20,
      unitPrice: 250,
      salePrice: 500,
      supplier: 'MSD',
      batchNumber: batchLot('LOS', year),
      expiryDate: futureExpiry(10, 20),
    },
    {
      name: 'Hydrochlorothiazide 25mg',
      genericName: 'Hydrochlorothiazide',
      category: 'Antihypertenseur',
      form: 'Comprimé',
      stockQuantity: 250,
      minStockAlert: 40,
      unitPrice: 40,
      salePrice: 100,
      supplier: 'Cameroon-pharm',
      batchNumber: batchLot('HCT', year),
      expiryDate: futureExpiry(14, 24),
    },
    {
      name: 'Captopril 25mg',
      genericName: 'Captopril',
      category: 'Antihypertenseur',
      form: 'Comprimé',
      stockQuantity: 100,
      minStockAlert: 15,
      unitPrice: 150,
      salePrice: 300,
      supplier: 'Sanofi',
      batchNumber: batchLot('CAP', year),
      expiryDate: futureExpiry(10, 18),
    },
    {
      name: 'Nifédipine 20mg',
      genericName: 'Nifédipine',
      category: 'Antihypertenseur',
      form: 'Comprimé',
      stockQuantity: 80,
      minStockAlert: 15,
      unitPrice: 100,
      salePrice: 220,
      supplier: 'Bayer',
      batchNumber: batchLot('NIF', year),
      expiryDate: futureExpiry(8, 16),
    },

    // ════════════════════════════════════════════════════════════════════════
    // ANTIDIABÉTIQUES
    // ════════════════════════════════════════════════════════════════════════
    {
      name: 'Metformine 500mg',
      genericName: 'Metformine',
      category: 'Antidiabétique',
      form: 'Comprimé',
      stockQuantity: 300,
      minStockAlert: 50,
      unitPrice: 50,
      salePrice: 120,
      supplier: 'Merck',
      batchNumber: batchLot('MET', year),
      expiryDate: futureExpiry(12, 22),
    },
    {
      name: 'Metformine 850mg',
      genericName: 'Metformine',
      category: 'Antidiabétique',
      form: 'Comprimé',
      stockQuantity: 200,
      minStockAlert: 40,
      unitPrice: 80,
      salePrice: 180,
      supplier: 'Merck',
      batchNumber: batchLot('MET', year),
      expiryDate: futureExpiry(12, 22),
    },
    {
      name: 'Glibenclamide 5mg',
      genericName: 'Glibenclamide',
      category: 'Antidiabétique',
      form: 'Comprimé',
      stockQuantity: 150,
      minStockAlert: 25,
      unitPrice: 60,
      salePrice: 130,
      supplier: 'Pharmacie Centrale',
      batchNumber: batchLot('GLB', year),
      expiryDate: futureExpiry(10, 20),
    },
    {
      name: 'Insuline NPH 100 UI/ml',
      genericName: 'Insuline NPH',
      category: 'Antidiabétique',
      form: 'Injectable',
      stockQuantity: 30,
      minStockAlert: 10,
      unitPrice: 5000,
      salePrice: 8500,
      supplier: 'Novo Nordisk',
      batchNumber: batchLot('INS', year),
      expiryDate: futureExpiry(6, 12),
    },

    // ════════════════════════════════════════════════════════════════════════
    // ANTIULCÉREUX
    // ════════════════════════════════════════════════════════════════════════
    {
      name: 'Oméprazole 20mg',
      genericName: 'Oméprazole',
      category: 'Antiulcéreux',
      form: 'Gélule',
      stockQuantity: 250,
      minStockAlert: 40,
      unitPrice: 90,
      salePrice: 200,
      supplier: 'AstraZeneca',
      batchNumber: batchLot('OMP', year),
      expiryDate: futureExpiry(12, 22),
    },
    {
      name: 'Pantoprazole 40mg',
      genericName: 'Pantoprazole',
      category: 'Antiulcéreux',
      form: 'Comprimé',
      stockQuantity: 150,
      minStockAlert: 25,
      unitPrice: 120,
      salePrice: 260,
      supplier: 'Wyeth',
      batchNumber: batchLot('PAN', year),
      expiryDate: futureExpiry(10, 20),
    },
    {
      name: 'Ranitidine 150mg',
      genericName: 'Ranitidine',
      category: 'Antiulcéreux',
      form: 'Comprimé',
      stockQuantity: 100,
      minStockAlert: 20,
      unitPrice: 70,
      salePrice: 150,
      supplier: 'GSK',
      batchNumber: batchLot('RAN', year),
      expiryDate: futureExpiry(10, 18),
    },

    // ════════════════════════════════════════════════════════════════════════
    // ANTIHISTAMINIQUES
    // ════════════════════════════════════════════════════════════════════════
    {
      name: 'Loratadine 10mg',
      genericName: 'Loratadine',
      category: 'Antihistaminique',
      form: 'Comprimé',
      stockQuantity: 200,
      minStockAlert: 30,
      unitPrice: 60,
      salePrice: 130,
      supplier: 'Schering-Plough',
      batchNumber: batchLot('LOR', year),
      expiryDate: futureExpiry(12, 22),
    },
    {
      name: 'Cétirizine 10mg',
      genericName: 'Cétirizine',
      category: 'Antihistaminique',
      form: 'Comprimé',
      stockQuantity: 250,
      minStockAlert: 40,
      unitPrice: 40,
      salePrice: 100,
      supplier: 'UCB',
      batchNumber: batchLot('CET', year),
      expiryDate: futureExpiry(12, 24),
    },
    {
      name: 'Chlorphéniramine 4mg',
      genericName: 'Chlorphéniramine',
      category: 'Antihistaminique',
      form: 'Comprimé',
      stockQuantity: 180,
      minStockAlert: 30,
      unitPrice: 25,
      salePrice: 60,
      supplier: 'Cameroon-pharm',
      batchNumber: batchLot('CHL', year),
      expiryDate: futureExpiry(14, 24),
    },

    // ════════════════════════════════════════════════════════════════════════
    // BRONCHODILATATEURS
    // ════════════════════════════════════════════════════════════════════════
    {
      name: 'Salbutamol 100µg/dose Spray',
      genericName: 'Salbutamol',
      category: 'Bronchodilatateur',
      form: 'Aérosol',
      stockQuantity: 40,
      minStockAlert: 10,
      unitPrice: 1500,
      salePrice: 3500,
      supplier: 'GSK',
      batchNumber: batchLot('SAL', year),
      expiryDate: futureExpiry(8, 18),
    },
    {
      name: 'Budesonide 200µg/dose Aérosol',
      genericName: 'Budesonide',
      category: 'Bronchodilatateur',
      form: 'Aérosol',
      stockQuantity: 25,
      minStockAlert: 8,
      unitPrice: 3000,
      salePrice: 5500,
      supplier: 'AstraZeneca',
      batchNumber: batchLot('BUD', year),
      expiryDate: futureExpiry(6, 14),
    },

    // ════════════════════════════════════════════════════════════════════════
    // CORTICOÏDES
    // ════════════════════════════════════════════════════════════════════════
    {
      name: 'Prednisolone 5mg',
      genericName: 'Prednisolone',
      category: 'Corticoïde',
      form: 'Comprimé',
      stockQuantity: 150,
      minStockAlert: 25,
      unitPrice: 40,
      salePrice: 100,
      supplier: 'Pharmacie Centrale',
      batchNumber: batchLot('PRED', year),
      expiryDate: futureExpiry(12, 22),
    },
    {
      name: 'Dexaméthasone 4mg Injectable',
      genericName: 'Dexaméthasone',
      category: 'Corticoïde',
      form: 'Injectable',
      stockQuantity: 60,
      minStockAlert: 10,
      unitPrice: 200,
      salePrice: 450,
      supplier: 'Sanofi',
      batchNumber: batchLot('DEX', year),
      expiryDate: futureExpiry(8, 16),
    },
    {
      name: 'Hydrocortisone 100mg Injectable',
      genericName: 'Hydrocortisone',
      category: 'Corticoïde',
      form: 'Injectable',
      stockQuantity: 40,
      minStockAlert: 8,
      unitPrice: 300,
      salePrice: 600,
      supplier: 'Pfizer',
      batchNumber: batchLot('HYD', year),
      expiryDate: futureExpiry(6, 14),
    },

    // ════════════════════════════════════════════════════════════════════════
    // VITAMINES / SUPPLÉMENTS
    // ════════════════════════════════════════════════════════════════════════
    {
      name: 'Vitamine C 500mg',
      genericName: 'Acide ascorbique',
      category: 'Vitamine/Supplément',
      form: 'Comprimé',
      stockQuantity: 400,
      minStockAlert: 60,
      unitPrice: 50,
      salePrice: 120,
      supplier: 'UPSA',
      batchNumber: batchLot('VITC', year),
      expiryDate: futureExpiry(14, 24),
    },
    {
      name: 'Vitamine B1 B6 B12 Complexe',
      genericName: 'Vitamine B complexe',
      category: 'Vitamine/Supplément',
      form: 'Comprimé',
      stockQuantity: 250,
      minStockAlert: 40,
      unitPrice: 100,
      salePrice: 220,
      supplier: 'Pharmacie Centrale',
      batchNumber: batchLot('VITB', year),
      expiryDate: futureExpiry(12, 22),
    },
    {
      name: 'Fer + Acide folique',
      genericName: 'Sulfate ferreux / Acide folique',
      category: 'Vitamine/Supplément',
      form: 'Comprimé',
      stockQuantity: 200,
      minStockAlert: 40,
      unitPrice: 80,
      salePrice: 180,
      supplier: 'Cameroon-pharm',
      batchNumber: batchLot('FER', year),
      expiryDate: futureExpiry(12, 20),
    },

    // ════════════════════════════════════════════════════════════════════════
    // ANTIPARASITAIRES
    // ════════════════════════════════════════════════════════════════════════
    {
      name: 'Albendazole 400mg',
      genericName: 'Albendazole',
      category: 'Antiparasitaire',
      form: 'Comprimé',
      stockQuantity: 200,
      minStockAlert: 30,
      unitPrice: 50,
      salePrice: 120,
      supplier: 'Cameroon-pharm',
      batchNumber: batchLot('ALB', year),
      expiryDate: futureExpiry(12, 22),
    },
    {
      name: 'Mébendazole 100mg',
      genericName: 'Mébendazole',
      category: 'Antiparasitaire',
      form: 'Comprimé',
      stockQuantity: 180,
      minStockAlert: 30,
      unitPrice: 45,
      salePrice: 100,
      supplier: 'Janssen',
      batchNumber: batchLot('MEB', year),
      expiryDate: futureExpiry(12, 22),
    },
    {
      name: 'Ivermectine 3mg',
      genericName: 'Ivermectine',
      category: 'Antiparasitaire',
      form: 'Comprimé',
      stockQuantity: 100,
      minStockAlert: 15,
      unitPrice: 150,
      salePrice: 300,
      supplier: 'Merck',
      batchNumber: batchLot('IVE', year),
      expiryDate: futureExpiry(10, 18),
    },

    // ════════════════════════════════════════════════════════════════════════
    // ANTIFONGIQUES
    // ════════════════════════════════════════════════════════════════════════
    {
      name: 'Fluconazole 150mg',
      genericName: 'Fluconazole',
      category: 'Antifongique',
      form: 'Gélule',
      stockQuantity: 120,
      minStockAlert: 20,
      unitPrice: 350,
      salePrice: 700,
      supplier: 'Pfizer',
      batchNumber: batchLot('FLU', year),
      expiryDate: futureExpiry(10, 20),
    },
    {
      name: 'Kétoconazole 200mg',
      genericName: 'Kétoconazole',
      category: 'Antifongique',
      form: 'Comprimé',
      stockQuantity: 80,
      minStockAlert: 15,
      unitPrice: 200,
      salePrice: 400,
      supplier: 'Janssen',
      batchNumber: batchLot('KET', year),
      expiryDate: futureExpiry(8, 16),
    },
    {
      name: 'Clotrimazole Crème 1%',
      genericName: 'Clotrimazole',
      category: 'Antifongique',
      form: 'Crème',
      stockQuantity: 60,
      minStockAlert: 10,
      unitPrice: 500,
      salePrice: 1000,
      supplier: 'Bayer',
      batchNumber: batchLot('CLO', year),
      expiryDate: futureExpiry(12, 22),
    },

    // ════════════════════════════════════════════════════════════════════════
    // ANTISPASMODIQUES
    // ════════════════════════════════════════════════════════════════════════
    {
      name: 'Spasfon (Phloroglucinol) 80mg',
      genericName: 'Phloroglucinol',
      category: 'Antispasmodique',
      form: 'Comprimé',
      stockQuantity: 150,
      minStockAlert: 25,
      unitPrice: 120,
      salePrice: 250,
      supplier: 'Sanofi',
      batchNumber: batchLot('SPF', year),
      expiryDate: futureExpiry(12, 22),
    },
    {
      name: 'Dicétel (Pinavérium) 50mg',
      genericName: 'Pinavérium bromure',
      category: 'Antispasmodique',
      form: 'Comprimé',
      stockQuantity: 80,
      minStockAlert: 15,
      unitPrice: 300,
      salePrice: 600,
      supplier: 'Abbott',
      batchNumber: batchLot('DICET', year),
      expiryDate: futureExpiry(10, 20),
    },

    // ════════════════════════════════════════════════════════════════════════
    // SÉDATIFS
    // ════════════════════════════════════════════════════════════════════════
    {
      name: 'Diazépam 5mg',
      genericName: 'Diazépam',
      category: 'Sédatif',
      form: 'Comprimé',
      stockQuantity: 30,
      minStockAlert: 5,
      unitPrice: 80,
      salePrice: 180,
      supplier: 'Roche',
      batchNumber: batchLot('DIA', year),
      expiryDate: futureExpiry(12, 22),
    },
    {
      name: 'Diazépam 10mg Injectable',
      genericName: 'Diazépam',
      category: 'Sédatif',
      form: 'Injectable',
      stockQuantity: 20,
      minStockAlert: 5,
      unitPrice: 200,
      salePrice: 450,
      supplier: 'Roche',
      batchNumber: batchLot('DIA', year),
      expiryDate: futureExpiry(10, 18),
    },

    // ════════════════════════════════════════════════════════════════════════
    // AUTRES — Solutions, Urgences, Pédiatrie
    // ════════════════════════════════════════════════════════════════════════
    {
      name: 'SRO (Sels de Réhydratation Orale)',
      genericName: 'Sels de réhydratation orale',
      category: 'Autre',
      form: 'Solution',
      stockQuantity: 300,
      minStockAlert: 50,
      unitPrice: 100,
      salePrice: 200,
      supplier: 'Cameroon-pharm',
      batchNumber: batchLot('SRO', year),
      expiryDate: futureExpiry(12, 24),
    },
    {
      name: 'Sérum Physiologique 0.9% 500ml',
      genericName: 'Chlorure de sodium 0.9%',
      category: 'Autre',
      form: 'Solution',
      stockQuantity: 100,
      minStockAlert: 20,
      unitPrice: 250,
      salePrice: 500,
      supplier: 'Pharmacie Centrale',
      batchNumber: batchLot('SER', year),
      expiryDate: futureExpiry(12, 24),
    },
    {
      name: 'Glucose 5% 500ml',
      genericName: 'Glucose 5%',
      category: 'Autre',
      form: 'Solution',
      stockQuantity: 80,
      minStockAlert: 15,
      unitPrice: 200,
      salePrice: 450,
      supplier: 'Pharmacie Centrale',
      batchNumber: batchLot('GLU', year),
      expiryDate: futureExpiry(12, 24),
    },
    {
      name: 'Adrénaline 1mg/ml Injectable',
      genericName: 'Adrénaline (Épinéphrine)',
      category: 'Autre',
      form: 'Injectable',
      stockQuantity: 25,
      minStockAlert: 5,
      unitPrice: 1500,
      salePrice: 3000,
      supplier: 'Sanofi',
      batchNumber: batchLot('ADR', year),
      expiryDate: futureExpiry(6, 12),
    },
    {
      name: 'Paracétamol Suppositoire 125mg (Enfant)',
      genericName: 'Paracétamol',
      category: 'Antalgique',
      form: 'Suppositoire',
      stockQuantity: 100,
      minStockAlert: 20,
      unitPrice: 75,
      salePrice: 150,
      supplier: 'UPSA',
      batchNumber: batchLot('PSP', year),
      expiryDate: futureExpiry(10, 20),
    },
  ];
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════════════════
async function main() {
  console.log('💊 Seeding medication catalog for hosp_demo_001 …\n');

  // 1. Verify the hospital exists
  const hospital = await db.hospital.findUnique({ where: { id: HOSPITAL_ID } });
  if (!hospital) {
    console.error(`❌ Hospital "${HOSPITAL_ID}" not found. Aborting.`);
    process.exit(1);
  }
  console.log(`✅ Hospital found: ${hospital.name} (${hospital.city}, ${hospital.country})`);

  // 2. Delete existing medications for this hospital
  const deleted = await db.medication.deleteMany({ where: { hospitalId: HOSPITAL_ID } });
  console.log(`🗑️  Deleted ${deleted.count} existing medication(s) for this hospital.\n`);

  // 3. Build and insert new medications
  const medications = buildMedications();
  console.log(`📦 Inserting ${medications.length} medications …`);

  let inserted = 0;
  for (const med of medications) {
    await db.medication.create({
      data: {
        hospitalId: HOSPITAL_ID,
        ...med,
      },
    });
    inserted++;
  }

  console.log(`\n✅ ${inserted} medications inserted successfully!\n`);

  // 4. Summary by category
  const allMeds = await db.medication.findMany({
    where: { hospitalId: HOSPITAL_ID },
    orderBy: { category: 'asc' },
  });

  const categoryCounts = {};
  for (const m of allMeds) {
    const cat = m.category || 'Non classé';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  }

  console.log('📊 Summary by category:');
  for (const [cat, count] of Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${cat}: ${count}`);
  }
  console.log(`   ─────────────────`);
  console.log(`   TOTAL: ${allMeds.length}\n`);

  // 5. Low-stock alerts
  const lowStock = allMeds.filter((m) => m.stockQuantity <= m.minStockAlert);
  if (lowStock.length > 0) {
    console.log('⚠️  Low-stock alerts (stock ≤ minStockAlert):');
    for (const m of lowStock) {
      console.log(`   - ${m.name}  (stock: ${m.stockQuantity}, alert threshold: ${m.minStockAlert})`);
    }
    console.log('');
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());