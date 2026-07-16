import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const HOSPITAL_ID = 'hosp_demo_001'

async function seed() {
  console.log('🌱 Seeding NYA Santé database...')

  // ── Hospital ──
  const hospital = await db.hospital.upsert({
    where: { slug: 'nya-clinique-centrale' },
    update: {},
    create: {
      id: HOSPITAL_ID,
      name: 'Clinique Centrale NYA',
      slug: 'nya-clinique-centrale',
      address: '45 Rue de la Liberté, Quartier administratif',
      city: 'Douala',
      country: 'Cameroun',
      phone: '+237 6 99 88 77 66',
      email: 'contact@cliniq-nya.cm',
      type: 'clinique',
      ownerName: 'Dr. Amina Nya',
      ownerPhone: '+237 6 55 44 33 22',
      ownerEmail: 'a.nya@cliniq-nya.cm',
    },
  })

  // ── Roles ──
  const rolesData = [
    { name: 'super_admin', label: 'Super Administrateur', permissions: '["all"]', isDefault: false },
    { name: 'medecin_chef', label: 'Médecin Chef', permissions: '["patients.read","patients.write","consultations.read","consultations.write","prescriptions.read","prescriptions.write","appointments.read","appointments.write","reports.read","departments.read"]', isDefault: false },
    { name: 'medecin', label: 'Médecin', permissions: '["patients.read","patients.write","consultations.read","consultations.write","prescriptions.read","prescriptions.write","appointments.read","appointments.write"]', isDefault: false },
    { name: 'infirmier', label: 'Infirmier(e)', permissions: '["patients.read","patients.write","vitals.read","vitals.write","consultations.read"]', isDefault: false },
    { name: 'pharmacien', label: 'Pharmacien(ne)', permissions: '["patients.read","prescriptions.read","medications.read","medications.write","invoices.read"]', isDefault: false },
    { name: 'laborantin', label: 'Laborantin', permissions: '["patients.read","consultations.read","lab.read","lab.write"]', isDefault: false },
    { name: 'recepteur', label: 'Réceptionniste', permissions: '["patients.read","patients.write","appointments.read","appointments.write","invoices.read","invoices.write","payments.read","payments.write"]', isDefault: false },
  ]

  const roles: Record<string, string> = {}
  for (const r of rolesData) {
    const role = await db.role.create({ data: { hospitalId: HOSPITAL_ID, ...r } })
    roles[r.name] = role.id
  }

  // ── Departments ──
  const departmentsData = [
    { name: 'Médecine Interne', type: 'clinique', color: '#047857', description: 'Consultations médicales générales et spécialisées' },
    { name: 'Chirurgie Générale', type: 'chirurgique', color: '#dc2626', description: 'Interventions chirurgicales' },
    { name: 'Pédiatrie', type: 'clinique', color: '#2563eb', description: 'Soins médicaux pour enfants' },
    { name: 'Maternité', type: 'clinique', color: '#ec4899', description: 'Suivi de grossesse et accouchements' },
    { name: 'Urgences', type: 'clinique', color: '#f59e0b', description: 'Accueil et prise en charge des urgences' },
    { name: 'Laboratoire', type: 'technique', color: '#8b5cf6', description: 'Analyses médicales et biologiques' },
    { name: 'Pharmacie', type: 'technique', color: '#14b8a6', description: 'Délivrance et gestion des médicaments' },
    { name: 'Imagerie Médicale', type: 'technique', color: '#f97316', description: 'Radiologie et échographie' },
  ]

  const departments: Record<string, string> = {}
  let sortOrder = 0
  for (const d of departmentsData) {
    const dept = await db.department.create({
      data: { hospitalId: HOSPITAL_ID, ...d, sortOrder: sortOrder++ },
    })
    departments[d.name] = dept.id
  }

  // ── Services (sous-services de Médecine Interne) ──
  const medIntId = departments['Médecine Interne']
  await db.service.createMany({
    data: [
      { departmentId: medIntId!, name: 'Cardiologie', consultationFee: 10000 },
      { departmentId: medIntId!, name: 'Pneumologie', consultationFee: 10000 },
      { departmentId: medIntId!, name: 'Gastro-entérologie', consultationFee: 10000 },
      { departmentId: medIntId!, name: 'Dermatologie', consultationFee: 8000 },
      { departmentId: medIntId!, name: 'Neurologie', consultationFee: 15000 },
    ],
  })

  // ── Staff ──
  const staffData = [
    { firstName: 'Amina', lastName: 'Nya', phone: '655443322', email: 'a.nya@cliniq-nya.cm', gender: 'F', specialty: 'Médecine Interne', roleName: 'super_admin', dept: 'Médecine Interne', licenseNumber: 'MED-2024-001', salary: 800000 },
    { firstName: 'Jean-Pierre', lastName: 'Mbeki', phone: '677112233', email: 'jp.mbeki@cliniq-nya.cm', gender: 'M', specialty: 'Cardiologie', roleName: 'medecin_chef', dept: 'Médecine Interne', licenseNumber: 'MED-2024-002', salary: 600000 },
    { firstName: 'Fatou', lastName: 'Diallo', phone: '699334455', email: 'f.diallo@cliniq-nya.cm', gender: 'F', specialty: 'Pédiatrie', roleName: 'medecin', dept: 'Pédiatrie', licenseNumber: 'MED-2024-003', salary: 500000 },
    { firstName: 'Olivier', lastName: 'Nganou', phone: '678556677', email: 'o.nganou@cliniq-nya.cm', gender: 'M', specialty: 'Chirurgie', roleName: 'medecin', dept: 'Chirurgie Générale', licenseNumber: 'MED-2024-004', salary: 550000 },
    { firstName: 'Marie-Claire', lastName: 'Tchamba', phone: '696778899', email: 'mc.tchamba@cliniq-nya.cm', gender: 'F', specialty: null, roleName: 'infirmier', dept: 'Urgences', licenseNumber: 'INF-2024-001', salary: 250000 },
    { firstName: 'Patrick', lastName: 'Kamga', phone: '694112233', email: 'p.kamga@cliniq-nya.cm', gender: 'M', specialty: null, roleName: 'laborantin', dept: 'Laboratoire', licenseNumber: 'LAB-2024-001', salary: 280000 },
    { firstName: 'Sylvie', lastName: 'Fotso', phone: '693556688', email: 's.fotso@cliniq-nya.cm', gender: 'F', specialty: null, roleName: 'pharmacien', dept: 'Pharmacie', licenseNumber: 'PHA-2024-001', salary: 300000 },
    { firstName: 'Carine', lastName: 'Moukouri', phone: '692889900', email: 'c.moukouri@cliniq-nya.cm', gender: 'F', specialty: null, roleName: 'recepteur', dept: null, licenseNumber: null, salary: 180000 },
  ]

  const staff: Record<string, any> = {}
  for (const s of staffData) {
    const created = await db.staff.create({
      data: {
        hospitalId: HOSPITAL_ID,
        departmentId: s.dept ? departments[s.dept] : null,
        roleId: roles[s.roleName],
        firstName: s.firstName,
        lastName: s.lastName,
        phone: s.phone,
        email: s.email,
        gender: s.gender,
        specialty: s.specialty,
        licenseNumber: s.licenseNumber,
        salary: s.salary,
        pin: '123456',
      },
    })
    staff[`${s.firstName} ${s.lastName}`] = created
  }

  // ── Patients ──
  const patientsData = [
    { firstName: 'Ibrahim', lastName: 'Aboubakar', phone: '690112233', gender: 'M', bloodType: 'A+', folderNumber: 'PAT-2024-0001', city: 'Douala', allergies: '["Pénicilline"]', insuranceProvider: 'Activa', insuranceNumber: 'ACT-001234' },
    { firstName: 'Aïssatou', lastName: 'Bah', phone: '691223344', gender: 'F', bloodType: 'O+', folderNumber: 'PAT-2024-0002', city: 'Douala', allergies: '[]', insuranceProvider: 'CNP', insuranceNumber: 'CNP-005678' },
    { firstName: 'Emmanuel', lastName: 'Tchouameni', phone: '692334455', gender: 'M', bloodType: 'B+', folderNumber: 'PAT-2024-0003', city: 'Yaoundé', allergies: '["Sulfamides","Aspirine"]', insuranceProvider: null, insuranceNumber: null },
    { firstName: 'Mariam', lastName: 'Djamo', phone: '693445566', gender: 'F', bloodType: 'AB+', folderNumber: 'PAT-2024-0004', city: 'Douala', allergies: '[]', insuranceProvider: 'Allianz', insuranceNumber: 'ALL-009012' },
    { firstName: 'Samuel', lastName: 'Eto\'o', phone: '694556677', gender: 'M', bloodType: 'O-', folderNumber: 'PAT-2024-0005', city: 'Douala', allergies: '[]', insuranceProvider: 'Activa', insuranceNumber: 'ACT-003456' },
    { firstName: 'Fabiola', lastName: 'Ngassa', phone: '695667788', gender: 'F', bloodType: 'A-', folderNumber: 'PAT-2024-0006', city: 'Douala', allergies: '["Ibuprofène"]', insuranceProvider: null, insuranceNumber: null },
    { firstName: 'Alhaji', lastName: 'Mohamadou', phone: '696778899', gender: 'M', bloodType: 'B-', folderNumber: 'PAT-2024-0007', city: 'Garoua', allergies: '[]', insuranceProvider: 'CNP', insuranceNumber: 'CNP-007890' },
    { firstName: 'Chantal', lastName: 'Biyong', phone: '697889900', gender: 'F', bloodType: 'AB-', folderNumber: 'PAT-2024-0008', city: 'Bafoussam', allergies: '["Latex"]', insuranceProvider: null, insuranceNumber: null },
    { firstName: 'Yvan', lastName: 'Ndongo', phone: '698990011', gender: 'M', bloodType: 'A+', folderNumber: 'PAT-2024-0009', city: 'Douala', allergies: '[]', insuranceProvider: 'Activa', insuranceNumber: 'ACT-005678' },
    { firstName: 'Nadège', lastName: 'Kamga', phone: '699001122', gender: 'F', bloodType: 'O+', folderNumber: 'PAT-2024-0010', city: 'Douala', allergies: '[]', insuranceProvider: 'Allianz', insuranceNumber: 'ALL-001234' },
    { firstName: 'Patrice', lastName: 'Mbarga', phone: '690223344', gender: 'M', bloodType: 'B+', folderNumber: 'PAT-2024-0011', city: 'Douala', allergies: '["Pénicilline","Céphalosporines"]', insuranceProvider: null, insuranceNumber: null },
    { firstName: 'Rachelle', lastName: 'Tchuente', phone: '691334455', gender: 'F', bloodType: 'A+', folderNumber: 'PAT-2024-0012', city: 'Douala', allergies: '[]', insuranceProvider: 'CNP', insuranceNumber: 'CNP-002345' },
  ]

  const patientsList: any[] = []
  for (const p of patientsData) {
    const dob = new Date(
      1980 + Math.floor(Math.random() * 40),
      Math.floor(Math.random() * 12),
      1 + Math.floor(Math.random() * 28)
    )
    const patient = await db.patient.create({
      data: {
        hospitalId: HOSPITAL_ID,
        firstName: p.firstName,
        lastName: p.lastName,
        phone: p.phone,
        gender: p.gender,
        bloodType: p.bloodType,
        folderNumber: p.folderNumber,
        city: p.city,
        dateOfBirth: dob,
        allergies: p.allergies,
        insuranceProvider: p.insuranceProvider,
        insuranceNumber: p.insuranceNumber,
        emergencyContact: 'Famille ' + p.lastName,
        emergencyPhone: '6' + String(Math.floor(Math.random() * 90000000 + 10000000)),
      },
    })
    patientsList.push(patient)
  }

  // ── Appointments ──
  const today = new Date()
  const appointmentsData = [
    { patientIdx: 0, staffName: 'Jean-Pierre Mbeki', date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0), status: 'confirme', type: 'consultation', reason: 'Contrôle cardiaque' },
    { patientIdx: 1, staffName: 'Fatou Diallo', date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0), status: 'en_attente', type: 'consultation', reason: 'Fièvre de l\'enfant' },
    { patientIdx: 2, staffName: 'Olivier Nganou', date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0), status: 'en_attente', type: 'consultation', reason: 'Douleur abdominale' },
    { patientIdx: 4, staffName: 'Jean-Pierre Mbeki', date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0), status: 'confirme', type: 'controle', reason: 'Suivi hypertension' },
    { patientIdx: 5, staffName: 'Fatou Diallo', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 9, 30), status: 'en_attente', type: 'consultation', reason: 'Vaccination' },
    { patientIdx: 6, staffName: 'Jean-Pierre Mbeki', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 10, 30), status: 'en_attente', type: 'consultation', reason: 'Examen de routine' },
    { patientIdx: 0, staffName: 'Jean-Pierre Mbeki', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7, 9, 0), status: 'termine', type: 'consultation', reason: 'Première consultation' },
    { patientIdx: 3, staffName: 'Olivier Nganou', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5, 14, 0), status: 'termine', type: 'consultation', reason: 'Douleur thoracique' },
    { patientIdx: 7, staffName: 'Fatou Diallo', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3, 10, 0), status: 'annule', type: 'consultation', reason: 'Consultation pédiatrique' },
    { patientIdx: 9, staffName: 'Jean-Pierre Mbeki', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2, 11, 0), status: 'termine', type: 'controle', reason: 'Suivi diabète' },
  ]

  for (const a of appointmentsData) {
    const staffMember = staff[a.staffName]
    const patient = patientsList[a.patientIdx]
    if (staffMember && patient) {
      await db.appointment.create({
        data: {
          hospitalId: HOSPITAL_ID,
          patientId: patient.id,
          staffId: staffMember.id,
          departmentId: staffMember.departmentId,
          date: a.date,
          status: a.status,
          type: a.type,
          reason: a.reason,
        },
      })
    }
  }

  // ── Consultations (for past appointments) ──
  const pastConsultations = [
    { patientIdx: 0, staffName: 'Jean-Pierre Mbeki', chiefComplaint: 'Douleurs thoraciques récurrentes', diagnosis: 'Hypertension artérielle stade 2', plan: 'Mise sous traitement antihypertenseur. Contrôle dans 2 semaines.' },
    { patientIdx: 3, staffName: 'Olivier Nganou', chiefComplaint: 'Douleur thoracique gauche', diagnosis: 'Angine de poitrine stable', plan: 'Traitement médicamenteux + bilans complémentaires. Orientation cardiologie.' },
    { patientIdx: 9, staffName: 'Jean-Pierre Mbeki', chiefComplaint: 'Suivi diabète type 2', diagnosis: 'Diabète type 2 déséquilibré (HbA1c: 9.2%)', plan: 'Ajustement du traitement. Bilan rétinien et rénal.' },
  ]

  for (const c of pastConsultations) {
    const staffMember = staff[c.staffName]
    const patient = patientsList[c.patientIdx]
    if (staffMember && patient) {
      await db.consultation.create({
        data: {
          hospitalId: HOSPITAL_ID,
          patientId: patient.id,
          staffId: staffMember.id,
          departmentId: staffMember.departmentId,
          type: 'consultation',
          chiefComplaint: c.chiefComplaint,
          diagnosis: c.diagnosis,
          plan: c.plan,
          status: 'terminee',
        },
      })
    }
  }

  // ── Medications (Pharmacie) ──
  const medicationsData = [
    { name: 'Paracétamol 500mg', genericName: 'Paracétamol', category: 'Antalgique', form: 'Comprimé', unitPrice: 50, salePrice: 100, stockQuantity: 500, minStockAlert: 100, supplier: 'CENAME' },
    { name: 'Amoxicilline 500mg', genericName: 'Amoxicilline', category: 'Antibiotique', form: 'Gélule', unitPrice: 75, salePrice: 150, stockQuantity: 300, minStockAlert: 50, supplier: 'CENAME' },
    { name: 'Amlodipine 5mg', genericName: 'Amlodipine', category: 'Antihypertenseur', form: 'Comprimé', unitPrice: 120, salePrice: 250, stockQuantity: 200, minStockAlert: 40, supplier: 'LaboPharma' },
    { name: 'Metformine 850mg', genericName: 'Metformine', category: 'Antidiabétique', form: 'Comprimé', unitPrice: 80, salePrice: 180, stockQuantity: 250, minStockAlert: 50, supplier: 'LaboPharma' },
    { name: 'Ibuprofène 400mg', genericName: 'Ibuprofène', category: 'AINS', form: 'Comprimé', unitPrice: 60, salePrice: 120, stockQuantity: 400, minStockAlert: 80, supplier: 'CENAME' },
    { name: 'Oméprazole 20mg', genericName: 'Oméprazole', category: 'Antiulcéreux', form: 'Gélule', unitPrice: 90, salePrice: 200, stockQuantity: 150, minStockAlert: 30, supplier: 'LaboPharma' },
    { name: 'Cétirizine 10mg', genericName: 'Cétirizine', category: 'Antihistaminique', form: 'Comprimé', unitPrice: 40, salePrice: 100, stockQuantity: 300, minStockAlert: 50, supplier: 'CENAME' },
    { name: 'Salbutamol Spray', genericName: 'Salbutamol', category: 'Bronchodilatateur', form: 'Aérosol', unitPrice: 1500, salePrice: 3500, stockQuantity: 30, minStockAlert: 10, supplier: 'PharmaExport' },
    { name: 'Artemether/Luméfantrine', genericName: 'Artémisinine', category: 'Antipaludéen', form: 'Comprimé', unitPrice: 200, salePrice: 500, stockQuantity: 100, minStockAlert: 20, supplier: 'CENAME' },
    { name: 'Cotrimoxazole 480mg', genericName: 'Cotrimoxazole', category: 'Antibiotique', form: 'Comprimé', unitPrice: 35, salePrice: 75, stockQuantity: 8, minStockAlert: 50, supplier: 'CENAME' },
  ]

  for (const m of medicationsData) {
    await db.medication.create({
      data: {
        hospitalId: HOSPITAL_ID,
        ...m,
        batchNumber: 'LOT-' + Date.now().toString(36).toUpperCase(),
        expiryDate: new Date(2026, 11, 31),
      },
    })
  }

  // ── Invoices ──
  const invoicesData = [
    { patientIdx: 0, amount: 10000, paidAmount: 10000, status: 'payee', method: 'mobile_money', provider: 'mtn' },
    { patientIdx: 3, amount: 15000, paidAmount: 10000, status: 'partiellement_payee', method: 'cash', provider: null },
    { patientIdx: 4, amount: 10000, paidAmount: 0, status: 'impayee', method: null, provider: null },
    { patientIdx: 9, amount: 10000, paidAmount: 10000, status: 'payee', method: 'orange_money', provider: 'orange' },
  ]

  for (let i = 0; i < invoicesData.length; i++) {
    const inv = invoicesData[i]
    const patient = patientsList[inv.patientIdx]
    if (patient) {
      await db.invoice.create({
        data: {
          hospitalId: HOSPITAL_ID,
          patientId: patient.id,
          invoiceNumber: `FAC-2024-${String(i + 1).padStart(4, '0')}`,
          amount: inv.amount,
          discount: 0,
          totalAmount: inv.amount,
          paidAmount: inv.paidAmount,
          status: inv.status,
          paymentMethod: inv.method,
          paymentProvider: inv.provider,
          paidAt: inv.status === 'payee' ? new Date() : null,
        },
      })
    }
  }

  // ── Hospital Settings ──
  await db.hospitalSetting.createMany({
    data: [
      { hospitalId: HOSPITAL_ID, key: 'currency', value: 'XAF' },
      { hospitalId: HOSPITAL_ID, key: 'country', value: 'Cameroun' },
      { hospitalId: HOSPITAL_ID, key: 'language', value: 'fr' },
      { hospitalId: HOSPITAL_ID, key: 'consultation_fee_default', value: '5000' },
      { hospitalId: HOSPITAL_ID, key: 'mobile_money_enabled', value: 'true' },
      { hospitalId: HOSPITAL_ID, key: 'sms_enabled', value: 'true' },
    ],
  })

  console.log('✅ Seed completed successfully!')
  console.log(`   Hospital: ${hospital.name}`)
  console.log(`   Departments: ${departmentsData.length}`)
  console.log(`   Staff: ${staffData.length}`)
  console.log(`   Patients: ${patientsData.length}`)
  console.log(`   Medications: ${medicationsData.length}`)
  console.log(`   Appointments: ${appointmentsData.length}`)
}

seed()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => db.$disconnect())