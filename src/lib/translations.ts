import { useLanguage, type AppLanguage } from "@/app/providers/LanguageProvider";

export type TranslationKey =
  | "app.tagline"
  | "sidebar.preferences"
  | "sidebar.preferencesDesc"
  | "header.search"
  | "header.searchPlaceholder"
  | "header.notifications"
  | "bottomNav.label"
  // dashboard
  | "dashboard.eyebrow"
  | "dashboard.title"
  | "dashboard.description"
  | "dashboard.loading"
  | "dashboard.loadingDesc"
  | "dashboard.error"
  | "dashboard.errorDesc"
  | "dashboard.errorUnknown"
  | "dashboard.income"
  | "dashboard.expenses"
  | "dashboard.cashflow"
  | "dashboard.cashflowHealthy"
  | "dashboard.cashflowBalanced"
  | "dashboard.cashflowNegative"
  | "dashboard.liquidity"
  | "dashboard.financialScore"
  | "dashboard.savingsRate"
  | "dashboard.debtRatio"
  | "dashboard.burnRate"
  | "dashboard.perDay"
  | "dashboard.scoreBreakdown"
  | "dashboard.scoreCashflow"
  | "dashboard.scoreLiquidity"
  | "dashboard.scoreDebt"
  | "dashboard.scoreSavings"
  | "dashboard.scoreGoals"
  | "dashboard.scoreBudget"
  | "dashboard.alerts"
  | "dashboard.footer"
  | "dashboard.ofIncome"
  | "dashboard.pctUsed"
  // transactions
  | "transactions.eyebrow"
  | "transactions.title"
  | "transactions.description"
  | "transactions.loading"
  | "transactions.loadingDesc"
  | "transactions.error"
  | "transactions.errorDesc"
  | "transactions.errorUnknown"
  | "transactions.searchPlaceholder"
  | "transactions.all"
  | "transactions.income"
  | "transactions.expense"
  | "transactions.new"
  | "transactions.emptyFiltered"
  | "transactions.empty"
  | "transactions.uncategorized"
  | "transactions.editLabel"
  | "transactions.count"
  | "transactions.of"
  | "transactions.transactions"
  | "transactions.form.editTitle"
  | "transactions.form.newTitle"
  | "transactions.exportCsv"
  | "transactions.exportPdf"
  | "transactions.form.income"
  | "transactions.form.expense"
  | "transactions.form.category"
  | "transactions.form.select"
  | "transactions.form.account"
  | "transactions.form.amount"
  | "transactions.form.date"
  | "transactions.form.description"
  | "transactions.form.descriptionPlaceholder"
  | "transactions.form.notes"
  | "transactions.form.notesPlaceholder"
  | "transactions.form.cancel"
  | "transactions.form.saving"
  | "transactions.form.saveChanges"
  | "transactions.form.create"
  // budgets
  | "budgets.eyebrow"
  | "budgets.title"
  | "budgets.description"
  | "budgets.loadingDesc"
  | "budgets.errorDesc"
  | "budgets.errorUnknown"
  | "budgets.totalBudget"
  | "budgets.spent"
  | "budgets.available"
  | "budgets.pctUsed"
  | "budgets.add"
  | "budgets.empty"
  | "budgets.uncategorized"
  | "budgets.statusOnTrack"
  | "budgets.statusExceeded"
  | "budgets.statusWarning"
  | "budgets.statusHigh"
  | "budgets.statusCritical"
  | "budgets.alert"
  | "budgets.editLabel"
  | "budgets.form.editTitle"
  | "budgets.form.newTitle"
  | "budgets.form.category"
  | "budgets.form.select"
  | "budgets.form.monthlyLimit"
  | "budgets.form.cancel"
  | "budgets.form.saving"
  | "budgets.form.saveChanges"
  | "budgets.form.create"
  // debts
  | "debts.eyebrow"
  | "debts.title"
  | "debts.description"
  | "debts.loadingDesc"
  | "debts.errorDesc"
  | "debts.errorUnknown"
  | "debts.totalDebt"
  | "debts.original"
  | "debts.paid"
  | "debts.add"
  | "debts.empty"
  | "debts.installments"
  | "debts.perMonth"
  | "debts.pctPaid"
  | "debts.originalLabel"
  | "debts.remainingLabel"
  | "debts.installmentLabel"
  | "debts.interestLabel"
  | "debts.pay"
  | "debts.edit"
  | "debts.registeredPayments"
  | "debts.form.editTitle"
  | "debts.form.newTitle"
  | "debts.form.name"
  | "debts.form.namePlaceholder"
  | "debts.form.creditor"
  | "debts.form.creditorPlaceholder"
  | "debts.form.originalAmount"
  | "debts.form.remainingBalance"
  | "debts.form.monthlyInstallment"
  | "debts.form.totalInstallments"
  | "debts.form.remainingInstallments"
  | "debts.form.interestRate"
  | "debts.form.dueDay"
  | "debts.form.priority"
  | "debts.form.cancel"
  | "debts.form.saving"
  | "debts.form.saveChanges"
  | "debts.form.create"
  | "debts.payForm.title"
  | "debts.payForm.amount"
  | "debts.payForm.date"
  | "debts.payForm.notes"
  | "debts.payForm.notesPlaceholder"
  | "debts.payForm.cancel"
  | "debts.payForm.saving"
  | "debts.payForm.register"
  // goals
  | "goals.eyebrow"
  | "goals.title"
  | "goals.description"
  | "goals.loadingDesc"
  | "goals.errorDesc"
  | "goals.errorUnknown"
  | "goals.totalTarget"
  | "goals.saved"
  | "goals.globalProgress"
  | "goals.add"
  | "goals.empty"
  | "goals.of"
  | "goals.pctCompleted"
  | "goals.monthsLeft"
  | "goals.completed"
  | "goals.monthlySaving"
  | "goals.deadline"
  | "goals.contribute"
  | "goals.edit"
  | "goals.registeredContributions"
  | "goals.form.editTitle"
  | "goals.form.newTitle"
  | "goals.form.name"
  | "goals.form.namePlaceholder"
  | "goals.form.targetAmount"
  | "goals.form.savedAmount"
  | "goals.form.monthlySaving"
  | "goals.form.deadline"
  | "goals.form.priority"
  | "goals.form.cancel"
  | "goals.form.saving"
  | "goals.form.saveChanges"
  | "goals.form.create"
  | "goals.contributeForm.title"
  | "goals.contributeForm.amount"
  | "goals.contributeForm.date"
  | "goals.contributeForm.notes"
  | "goals.contributeForm.notesPlaceholder"
  | "goals.contributeForm.cancel"
  | "goals.contributeForm.saving"
  | "goals.contributeForm.contribute"
  // reports
  | "reports.eyebrow"
  | "reports.title"
  | "reports.description"
  | "reports.loadingDesc"
  | "reports.errorDesc"
  | "reports.errorUnknown"
  | "reports.months"
  | "reports.lastMonthIncome"
  | "reports.lastMonthExpenses"
  | "reports.cashflow"
  | "reports.vsPreviousMonth"
  | "reports.chartIncomeVsExpenses"
  | "reports.chartExpensesByCategory"
  | "reports.chartCashflowTrend"
  | "reports.monthlySummary"
  | "reports.exportCsv"
  | "reports.exportPdf"
  | "reports.tableMonth"
  | "reports.tableIncome"
  | "reports.tableExpenses"
  | "reports.tableCashflow"
  // simulator
  | "simulator.eyebrow"
  | "simulator.title"
  | "simulator.description"
  | "simulator.loadingDesc"
  | "simulator.errorDesc"
  | "simulator.errorUnknown"
  | "simulator.simulationMode"
  | "simulator.simulationModeDesc"
  | "simulator.adjustScenario"
  | "simulator.incomeChange"
  | "simulator.expensesChange"
  | "simulator.oneTimeExpense"
  | "simulator.newRecurringExpense"
  | "simulator.liquidityChange"
  | "simulator.debtChange"
  | "simulator.actualVsProjected"
  | "simulator.actual"
  | "simulator.projected"
  | "simulator.cashflow"
  | "simulator.income"
  | "simulator.expenses"
  | "simulator.financialScore"
  | "simulator.liquidity"
  | "simulator.debtRatio"
  | "simulator.savingsRate"
  | "simulator.burnRate"
  | "simulator.scoreProjection"
  | "simulator.scoreCurrent"
  | "simulator.scoreProjected"
  | "simulator.scoreCashflow"
  | "simulator.scoreLiquidity"
  | "simulator.scoreDebt"
  | "simulator.scoreSavings"
  | "simulator.scoreGoals"
  | "simulator.scoreBudget"
  | "simulator.perDay"
  // purchase advisor
  | "advisor.eyebrow"
  | "advisor.title"
  | "advisor.description"
  | "advisor.loadingDesc"
  | "advisor.errorDesc"
  | "advisor.errorUnknown"
  | "advisor.purchaseDetails"
  | "advisor.price"
  | "advisor.installments"
  | "advisor.currentFinances"
  | "advisor.availableCash"
  | "advisor.cashflow"
  | "advisor.financialScore"
  | "advisor.debtRatio"
  | "advisor.enterPrice"
  | "advisor.decisionYes"
  | "advisor.decisionWait"
  | "advisor.decisionNo"
  | "advisor.riskLow"
  | "advisor.riskMedium"
  | "advisor.riskHigh"
  | "advisor.financialImpact"
  | "advisor.impactCashflow"
  | "advisor.impactScore"
  | "advisor.impactBudget"
  | "advisor.impactDebt"
  | "advisor.monthlyInstallment"
  | "advisor.goalDelay"
  | "advisor.months"
  | "advisor.reasons"
  | "advisor.points"
  // timeline
  | "timeline.eyebrow"
  | "timeline.title"
  | "timeline.description"
  | "timeline.loadingDesc"
  | "timeline.errorDesc"
  | "timeline.errorUnknown"
  | "timeline.empty"
  | "timeline.budget"
  | "timeline.debtDue"
  | "timeline.day"
  | "timeline.remaining"
  // calendar
  | "calendar.eyebrow"
  | "calendar.title"
  | "calendar.description"
  | "calendar.loadingDesc"
  | "calendar.errorDesc"
  | "calendar.errorUnknown"
  | "calendar.dayNamesSun"
  | "calendar.dayNamesMon"
  | "calendar.dayNamesTue"
  | "calendar.dayNamesWed"
  | "calendar.dayNamesThu"
  | "calendar.dayNamesFri"
  | "calendar.dayNamesSat"
  | "calendar.legendIncome"
  | "calendar.legendExpense"
  | "calendar.legendDue"
  | "calendar.legendGoal"
  | "calendar.monthEvents"
  | "calendar.noEvents"
  | "calendar.more"
  // history
  | "history.eyebrow"
  | "history.title"
  | "history.description"
  | "history.loadingDesc"
  | "history.errorDesc"
  | "history.errorUnknown"
  | "history.income"
  | "history.expenses"
  | "history.cashflow"
  | "history.debt"
  | "history.savings"
  | "history.score"
  | "history.empty"
  | "history.generate"
  | "history.generating"
  | "history.generated"
  | "history.comparing"
  | "history.baseline"
  | "history.target"
  | "history.diff"
  | "history.vsPrevious"
  | "history.pctChange"
  | "history.monthsWithData"
  | "history.noDataForMonth"
  | "history.snapshotTitle"
  | "history.snapshotDesc"
  // settings
  | "settings.eyebrow"
  | "settings.title"
  | "settings.description"
  | "settings.loadingDesc"
  | "settings.errorDesc"
  | "settings.errorUnknown"
  | "settings.sectionAppearance"
  | "settings.sectionAppearanceDesc"
  | "settings.theme"
  | "settings.themeLight"
  | "settings.themeDark"
  | "settings.themeSystem"
  | "settings.language"
  | "settings.languageEs"
  | "settings.languageEn"
  | "settings.sectionProfile"
  | "settings.sectionProfileDesc"
  | "settings.defaultProfile"
  | "settings.defaultProfileDesc"
  | "settings.profileJulian"
  | "settings.profilePareja"
  | "settings.profileAmbos"
  | "settings.sectionPreferences"
  | "settings.sectionPreferencesDesc"
  | "settings.animations"
  | "settings.animationsDesc"
  | "settings.notifications"
  | "settings.notificationsDesc"
  | "settings.sectionData"
  | "settings.sectionDataDesc"
  | "settings.exportData"
  | "settings.exportDataDesc"
  | "settings.exportCsv"
  | "settings.exportPdf"
  | "settings.sectionAbout"
  | "settings.sectionAboutDesc"
  | "settings.version"
  | "settings.framework"
  | "settings.saved"
  | "settings.save"
  | "settings.saving"
  // engine status labels (used in dashboard)
  | "engine.statusHealthy"
  | "engine.statusAttention"
  | "engine.statusNegative"
  // priority labels
  | "priority.essential"
  | "priority.housing"
  | "priority.creditCard"
  | "priority.personalLoan"
  | "priority.installmentPurchase"
  | "priority.other"
  | "priority.critical"
  | "priority.high"
  | "priority.medium"
  | "priority.low"
  // goal status
  | "goalStatus.active"
  | "goalStatus.completed"
  | "goalStatus.paused"
  | "goalStatus.archived"
  // budget status
  | "budgetStatus.onTrack"
  | "budgetStatus.exceeded"
  | "budgetStatus.warning"
  | "budgetStatus.high"
  | "budgetStatus.critical";

export const translations: Record<AppLanguage, Record<TranslationKey, string>> = {
  es: {
    "app.tagline": "Sistema de finanzas personales",
    "sidebar.preferences": "Preferencias",
    "sidebar.preferencesDesc": "Ajustá idioma, tema y la navegación base desde el shell principal.",
    "header.search": "Buscar",
    "header.searchPlaceholder": "Buscar transacciones, metas, deudas...",
    "header.notifications": "Notificaciones",
    "bottomNav.label": "Navegación móvil",
    // dashboard
    "dashboard.eyebrow": "Dashboard",
    "dashboard.title": "Panel financiero",
    "dashboard.description": "Resumen de tu salud financiera",
    "dashboard.loading": "Cargando...",
    "dashboard.loadingDesc": "Obteniendo datos financieros...",
    "dashboard.error": "Error",
    "dashboard.errorDesc": "No se pudieron cargar los datos. Verificá la conexión con Supabase.",
    "dashboard.errorUnknown": "Error desconocido",
    "dashboard.income": "Ingresos",
    "dashboard.expenses": "Gastos",
    "dashboard.cashflow": "Flujo de caja",
    "dashboard.cashflowHealthy": "Positivo ✓",
    "dashboard.cashflowBalanced": "En equilibrio",
    "dashboard.cashflowNegative": "Negativo ⚠",
    "dashboard.liquidity": "Efectivo disponible",
    "dashboard.financialScore": "Score financiero",
    "dashboard.savingsRate": "Tasa de ahorro",
    "dashboard.debtRatio": "Endeudamiento",
    "dashboard.burnRate": "Burn rate",
    "dashboard.perDay": "/ día",
    "dashboard.scoreBreakdown": "Desglose del score",
    "dashboard.scoreCashflow": "Flujo de caja",
    "dashboard.scoreLiquidity": "Liquidez",
    "dashboard.scoreDebt": "Endeudamiento",
    "dashboard.scoreSavings": "Ahorro",
    "dashboard.scoreGoals": "Metas",
    "dashboard.scoreBudget": "Presupuesto",
    "dashboard.alerts": "Alertas",
    "dashboard.footer": "Los datos se actualizan cada 30 segundos. Configurá VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env para conectar con Supabase.",
    "dashboard.ofIncome": "% de ingresos",
    "dashboard.pctUsed": "utilizado",
    // transactions
    "transactions.eyebrow": "Transacciones",
    "transactions.title": "Transacciones",
    "transactions.description": "Tus ingresos y gastos mensuales",
    "transactions.loading": "Cargando...",
    "transactions.loadingDesc": "Obteniendo movimientos...",
    "transactions.error": "Error",
    "transactions.errorDesc": "No se pudieron cargar los movimientos.",
    "transactions.errorUnknown": "Error desconocido",
    "transactions.searchPlaceholder": "Buscar transacciones...",
    "transactions.exportCsv": "Exportar CSV",
    "transactions.exportPdf": "Exportar PDF",
    "transactions.all": "Todas",
    "transactions.income": "Ingresos",
    "transactions.expense": "Gastos",
    "transactions.new": "Nueva",
    "transactions.emptyFiltered": "No hay transacciones que coincidan con los filtros.",
    "transactions.empty": "Todavía no hay transacciones este mes. ¡Creá la primera!",
    "transactions.uncategorized": "Sin categoría",
    "transactions.editLabel": "Editar transacción",
    "transactions.count": "{count} de {total} transacciones",
    "transactions.of": "de",
    "transactions.transactions": "transacciones",
    "transactions.form.editTitle": "Editar transacción",
    "transactions.form.newTitle": "Nueva transacción",
    "transactions.form.income": "Ingreso",
    "transactions.form.expense": "Gasto",
    "transactions.form.category": "Categoría",
    "transactions.form.select": "Seleccionar",
    "transactions.form.account": "Cuenta",
    "transactions.form.amount": "Monto ($)",
    "transactions.form.date": "Fecha",
    "transactions.form.description": "Descripción",
    "transactions.form.descriptionPlaceholder": "Ej: Supermercado",
    "transactions.form.notes": "Notas (opcional)",
    "transactions.form.notesPlaceholder": "Notas adicionales...",
    "transactions.form.cancel": "Cancelar",
    "transactions.form.saving": "Guardando...",
    "transactions.form.saveChanges": "Guardar cambios",
    "transactions.form.create": "Crear transacción",
    // budgets
    "budgets.eyebrow": "Presupuestos",
    "budgets.title": "Presupuestos",
    "budgets.description": "Control mensual de gastos por categoría",
    "budgets.loadingDesc": "Cargando presupuestos...",
    "budgets.errorDesc": "No se pudieron cargar los presupuestos.",
    "budgets.errorUnknown": "Error desconocido",
    "budgets.totalBudget": "Presupuesto total",
    "budgets.spent": "Gastado",
    "budgets.available": "Disponible",
    "budgets.pctUsed": "utilizado",
    "budgets.add": "Agregar presupuesto",
    "budgets.empty": "No hay presupuestos para este mes. ¡Creá uno!",
    "budgets.uncategorized": "Sin categoría",
    "budgets.statusOnTrack": "En camino",
    "budgets.statusExceeded": "Excedido",
    "budgets.statusWarning": "Advertencia",
    "budgets.statusHigh": "Alto",
    "budgets.statusCritical": "Crítico",
    "budgets.alert": "Alerta",
    "budgets.editLabel": "Editar presupuesto",
    "budgets.form.editTitle": "Editar presupuesto",
    "budgets.form.newTitle": "Nuevo presupuesto",
    "budgets.form.category": "Categoría",
    "budgets.form.select": "Seleccionar",
    "budgets.form.monthlyLimit": "Límite mensual ($)",
    "budgets.form.cancel": "Cancelar",
    "budgets.form.saving": "Guardando...",
    "budgets.form.saveChanges": "Guardar cambios",
    "budgets.form.create": "Crear presupuesto",
    // debts
    "debts.eyebrow": "Deudas",
    "debts.title": "Seguimiento de deudas",
    "debts.description": "Controlá tus deudas y registrá pagos",
    "debts.loadingDesc": "Obteniendo tus deudas...",
    "debts.errorDesc": "No se pudieron cargar las deudas.",
    "debts.errorUnknown": "Error desconocido",
    "debts.totalDebt": "Deuda total",
    "debts.original": "Original",
    "debts.paid": "Pagado",
    "debts.add": "Nueva deuda",
    "debts.empty": "No hay deudas registradas.",
    "debts.installments": "cuotas",
    "debts.perMonth": "/mes",
    "debts.pctPaid": "pagado",
    "debts.originalLabel": "Original:",
    "debts.remainingLabel": "Restante:",
    "debts.installmentLabel": "Cuota:",
    "debts.interestLabel": "Interés:",
    "debts.pay": "Pagar",
    "debts.edit": "Editar",
    "debts.registeredPayments": "Pagos registrados",
    "debts.form.editTitle": "Editar deuda",
    "debts.form.newTitle": "Nueva deuda",
    "debts.form.name": "Nombre",
    "debts.form.namePlaceholder": "Ej: Tarjeta Visa",
    "debts.form.creditor": "Acreedor (opcional)",
    "debts.form.creditorPlaceholder": "Ej: Banco Galicia",
    "debts.form.originalAmount": "Monto original ($)",
    "debts.form.remainingBalance": "Saldo restante ($)",
    "debts.form.monthlyInstallment": "Cuota mensual ($)",
    "debts.form.totalInstallments": "Cuotas totales",
    "debts.form.remainingInstallments": "Cuotas restantes",
    "debts.form.interestRate": "Interés (%)",
    "debts.form.dueDay": "Día de vencimiento",
    "debts.form.priority": "Prioridad",
    "debts.form.cancel": "Cancelar",
    "debts.form.saving": "Guardando...",
    "debts.form.saveChanges": "Guardar cambios",
    "debts.form.create": "Crear deuda",
    "debts.payForm.title": "Registrar pago",
    "debts.payForm.amount": "Monto ($)",
    "debts.payForm.date": "Fecha",
    "debts.payForm.notes": "Notas (opcional)",
    "debts.payForm.notesPlaceholder": "Ej: Pago mensual",
    "debts.payForm.cancel": "Cancelar",
    "debts.payForm.saving": "Guardando...",
    "debts.payForm.register": "Registrar pago",
    // goals
    "goals.eyebrow": "Metas",
    "goals.title": "Metas financieras",
    "goals.description": "Seguí el progreso de tus objetivos",
    "goals.loadingDesc": "Obteniendo tus metas...",
    "goals.errorDesc": "No se pudieron cargar las metas.",
    "goals.errorUnknown": "Error desconocido",
    "goals.totalTarget": "Meta total",
    "goals.saved": "Ahorrado",
    "goals.globalProgress": "Progreso global",
    "goals.add": "Nueva meta",
    "goals.empty": "No hay metas financieras. ¡Creá una!",
    "goals.of": "de",
    "goals.pctCompleted": "completado",
    "goals.monthsLeft": "meses restantes",
    "goals.completed": "Completado",
    "goals.monthlySaving": "Ahorro mensual:",
    "goals.deadline": "Fecha límite:",
    "goals.contribute": "Aportar",
    "goals.edit": "Editar",
    "goals.registeredContributions": "Aportes registrados",
    "goals.form.editTitle": "Editar meta",
    "goals.form.newTitle": "Nueva meta",
    "goals.form.name": "Nombre",
    "goals.form.namePlaceholder": "Ej: Fondo de emergencia",
    "goals.form.targetAmount": "Meta total ($)",
    "goals.form.savedAmount": "Ahorrado ($)",
    "goals.form.monthlySaving": "Ahorro mensual ($)",
    "goals.form.deadline": "Fecha límite",
    "goals.form.priority": "Prioridad",
    "goals.form.cancel": "Cancelar",
    "goals.form.saving": "Guardando...",
    "goals.form.saveChanges": "Guardar cambios",
    "goals.form.create": "Crear meta",
    "goals.contributeForm.title": "Aportar a meta",
    "goals.contributeForm.amount": "Monto ($)",
    "goals.contributeForm.date": "Fecha",
    "goals.contributeForm.notes": "Notas (opcional)",
    "goals.contributeForm.notesPlaceholder": "Ej: Ahorro semanal",
    "goals.contributeForm.cancel": "Cancelar",
    "goals.contributeForm.saving": "Guardando...",
    "goals.contributeForm.contribute": "Aportar",
    // reports
    "reports.eyebrow": "Reportes",
    "reports.title": "Reportes financieros",
    "reports.description": "Visualizá ingresos, gastos y tendencias",
    "reports.loadingDesc": "Generando reportes...",
    "reports.errorDesc": "No se pudieron generar los reportes.",
    "reports.errorUnknown": "Error desconocido",
    "reports.months": "meses",
    "reports.lastMonthIncome": "Último mes - Ingresos",
    "reports.lastMonthExpenses": "Último mes - Gastos",
    "reports.cashflow": "Flujo de caja",
    "reports.vsPreviousMonth": "vs mes anterior",
    "reports.chartIncomeVsExpenses": "Ingresos vs Gastos",
    "reports.chartExpensesByCategory": "Gastos por categoría",
    "reports.chartCashflowTrend": "Evolución del flujo de caja",
    "reports.monthlySummary": "Resumen mensual",
    "reports.tableMonth": "Mes",
    "reports.tableIncome": "Ingresos",
    "reports.tableExpenses": "Gastos",
    "reports.tableCashflow": "Flujo de caja",
    "reports.exportCsv": "Exportar CSV",
    "reports.exportPdf": "Exportar PDF",
    // simulator
    "simulator.eyebrow": "Simulador",
    "simulator.title": "Simulador financiero",
    "simulator.description": "Proyectá escenarios hipotéticos sin afectar tus datos reales",
    "simulator.loadingDesc": "Preparando simulador...",
    "simulator.errorDesc": "No se pudieron cargar los datos base.",
    "simulator.errorUnknown": "Error desconocido",
    "simulator.simulationMode": "Modo simulación",
    "simulator.simulationModeDesc": "Los cambios solo afectan esta pantalla. Nunca se guardan en la base de datos.",
    "simulator.adjustScenario": "Ajustar escenario",
    "simulator.incomeChange": "Cambio en ingresos",
    "simulator.expensesChange": "Cambio en gastos",
    "simulator.oneTimeExpense": "Gasto único",
    "simulator.newRecurringExpense": "Nuevo gasto recurrente/mes",
    "simulator.liquidityChange": "Cambio en liquidez",
    "simulator.debtChange": "Cambio en deuda (%)",
    "simulator.actualVsProjected": "Actual → Proyectado",
    "simulator.actual": "Actual:",
    "simulator.projected": "Proyectado:",
    "simulator.cashflow": "Flujo de caja",
    "simulator.income": "Ingresos",
    "simulator.expenses": "Gastos",
    "simulator.financialScore": "Score financiero",
    "simulator.liquidity": "Liquidez",
    "simulator.debtRatio": "Endeudamiento",
    "simulator.savingsRate": "Tasa de ahorro",
    "simulator.burnRate": "Burn rate",
    "simulator.scoreProjection": "Proyección del score financiero",
    "simulator.scoreCurrent": "Actual:",
    "simulator.scoreProjected": "Proyectado:",
    "simulator.scoreCashflow": "Flujo",
    "simulator.scoreLiquidity": "Liquidez",
    "simulator.scoreDebt": "Deuda",
    "simulator.scoreSavings": "Ahorro",
    "simulator.scoreGoals": "Metas",
    "simulator.scoreBudget": "Presupuesto",
    "simulator.perDay": "/día",
    // purchase advisor
    "advisor.eyebrow": "Purchase Advisor",
    "advisor.title": "¿Puedo comprar esto?",
    "advisor.description": "Evaluá una compra antes de hacerla",
    "advisor.loadingDesc": "Analizando tus finanzas...",
    "advisor.errorDesc": "No se pudieron cargar los datos financieros.",
    "advisor.errorUnknown": "Error desconocido",
    "advisor.purchaseDetails": "Detalles de la compra",
    "advisor.price": "Precio ($)",
    "advisor.installments": "Cuotas",
    "advisor.currentFinances": "Finanzas actuales",
    "advisor.availableCash": "Efectivo disponible",
    "advisor.cashflow": "Flujo de caja",
    "advisor.financialScore": "Score financiero",
    "advisor.debtRatio": "Endeudamiento",
    "advisor.enterPrice": "Ingresá un precio para evaluar la compra",
    "advisor.decisionYes": "Compra recomendada",
    "advisor.decisionWait": "Esperá un poco",
    "advisor.decisionNo": "No es recomendable",
    "advisor.riskLow": "Bajo riesgo",
    "advisor.riskMedium": "Riesgo medio",
    "advisor.riskHigh": "Alto riesgo",
    "advisor.financialImpact": "Impacto financiero",
    "advisor.impactCashflow": "Flujo de caja",
    "advisor.impactScore": "Score financiero",
    "advisor.impactBudget": "Impacto en presupuesto",
    "advisor.impactDebt": "Endeudamiento",
    "advisor.monthlyInstallment": "Cuota mensual",
    "advisor.goalDelay": "Retraso en metas",
    "advisor.months": "meses",
    "advisor.reasons": "Razones",
    "advisor.points": "pts",
    // timeline
    "timeline.eyebrow": "Línea de tiempo",
    "timeline.title": "Línea de tiempo",
    "timeline.description": "Flujo financiero mensual",
    "timeline.loadingDesc": "Organizando eventos financieros...",
    "timeline.errorDesc": "No se pudieron cargar los eventos.",
    "timeline.errorUnknown": "Error desconocido",
    "timeline.empty": "No hay eventos financieros este mes.",
    "timeline.budget": "Presupuesto:",
    "timeline.debtDue": "Vence:",
    "timeline.day": "Día",
    "timeline.remaining": "restantes",
    // calendar
    "calendar.eyebrow": "Calendario",
    "calendar.title": "Calendario financiero",
    "calendar.description": "Vencimientos, cuotas y eventos del mes",
    "calendar.loadingDesc": "Preparando calendario financiero...",
    "calendar.errorDesc": "No se pudieron cargar los eventos.",
    "calendar.errorUnknown": "Error desconocido",
    "calendar.dayNamesSun": "Dom",
    "calendar.dayNamesMon": "Lun",
    "calendar.dayNamesTue": "Mar",
    "calendar.dayNamesWed": "Mié",
    "calendar.dayNamesThu": "Jue",
    "calendar.dayNamesFri": "Vie",
    "calendar.dayNamesSat": "Sáb",
    "calendar.legendIncome": "Ingreso",
    "calendar.legendExpense": "Gasto",
    "calendar.legendDue": "Vencimiento",
    "calendar.legendGoal": "Meta",
    "calendar.monthEvents": "Eventos del mes",
    "calendar.noEvents": "No hay eventos este mes.",
    "calendar.more": "más",
    // history
    "history.eyebrow": "History",
    "history.title": "Immutable monthly snapshots",
    "history.description": "Browse and compare monthly financial snapshots.",
    "history.loadingDesc": "Loading snapshot data...",
    "history.errorDesc": "Could not load snapshot data.",
    "history.errorUnknown": "Unknown error",
    "history.income": "Income",
    "history.expenses": "Expenses",
    "history.cashflow": "Cashflow",
    "history.debt": "Total Debt",
    "history.savings": "Savings",
    "history.score": "Financial Score",
    "history.empty": "No snapshots available. Generate one for the current month.",
    "history.generate": "Generate Snapshot",
    "history.generating": "Generating...",
    "history.generated": "Snapshot saved!",
    "history.comparing": "Comparing:",
    "history.baseline": "Baseline",
    "history.target": "Target",
    "history.diff": "Change",
    "history.vsPrevious": "vs previous month",
    "history.pctChange": "% change",
    "history.monthsWithData": "Months with data",
    "history.noDataForMonth": "No data for this month. Generate a snapshot.",
    "history.snapshotTitle": "Monthly snapshot",
    "history.snapshotDesc": "Immutable financial state for a given month.",
    // settings
    "settings.eyebrow": "Ajustes",
    "settings.title": "Configuración",
    "settings.description": "Personalizá tu experiencia en FinOS",
    "settings.loadingDesc": "Cargando configuración...",
    "settings.errorDesc": "No se pudo cargar la configuración.",
    "settings.errorUnknown": "Error desconocido",
    "settings.sectionAppearance": "Apariencia",
    "settings.sectionAppearanceDesc": "Tema e idioma de la aplicación",
    "settings.theme": "Tema",
    "settings.themeLight": "Claro",
    "settings.themeDark": "Oscuro",
    "settings.themeSystem": "Sistema",
    "settings.language": "Idioma",
    "settings.languageEs": "Español",
    "settings.languageEn": "English",
    "settings.sectionProfile": "Perfil",
    "settings.sectionProfileDesc": "Perfil financiero por defecto",
    "settings.defaultProfile": "Perfil por defecto",
    "settings.defaultProfileDesc": "Seleccioná qué perfil se usa al abrir la app",
    "settings.profileJulian": "Julián",
    "settings.profilePareja": "Pareja",
    "settings.profileAmbos": "Ambos",
    "settings.sectionPreferences": "Preferencias",
    "settings.sectionPreferencesDesc": "Opciones generales de la aplicación",
    "settings.animations": "Animaciones",
    "settings.animationsDesc": "Transiciones y efectos visuales",
    "settings.notifications": "Notificaciones",
    "settings.notificationsDesc": "Alertas de presupuesto, deudas y metas",
    "settings.sectionData": "Datos",
    "settings.sectionDataDesc": "Exportá y administrá tus datos",
    "settings.exportData": "Exportar datos",
    "settings.exportDataDesc": "Descargá tus transacciones y reportes",
    "settings.exportCsv": "Exportar CSV",
    "settings.exportPdf": "Exportar PDF",
    "settings.sectionAbout": "Acerca de",
    "settings.sectionAboutDesc": "Información de la aplicación",
    "settings.version": "Versión",
    "settings.framework": "Framework",
    "settings.saved": "Configuración guardada",
    "settings.save": "Guardar cambios",
    "settings.saving": "Guardando...",
    // engine status labels
    "engine.statusHealthy": "Positivo ✓",
    "engine.statusAttention": "En equilibrio",
    "engine.statusNegative": "Negativo ⚠",
    // priority labels
    "priority.essential": "Esencial",
    "priority.housing": "Vivienda",
    "priority.creditCard": "Tarjeta de crédito",
    "priority.personalLoan": "Préstamo personal",
    "priority.installmentPurchase": "Compra en cuotas",
    "priority.other": "Otro",
    "priority.critical": "Crítica",
    "priority.high": "Alta",
    "priority.medium": "Media",
    "priority.low": "Baja",
    // goal status
    "goalStatus.active": "Activa",
    "goalStatus.completed": "Completada",
    "goalStatus.paused": "En pausa",
    "goalStatus.archived": "Archivada",
    // budget status
    "budgetStatus.onTrack": "En camino",
    "budgetStatus.exceeded": "Excedido",
    "budgetStatus.warning": "Advertencia",
    "budgetStatus.high": "Alto",
    "budgetStatus.critical": "Crítico",
  },
  en: {
    "app.tagline": "Personal finance OS",
    "sidebar.preferences": "Preferences",
    "sidebar.preferencesDesc": "Adjust language, theme, and core navigation from the main shell.",
    "header.search": "Search",
    "header.searchPlaceholder": "Search transactions, goals, debts...",
    "header.notifications": "Notifications",
    "bottomNav.label": "Mobile navigation",
    // dashboard
    "dashboard.eyebrow": "Dashboard",
    "dashboard.title": "Financial Dashboard",
    "dashboard.description": "Your financial health overview",
    "dashboard.loading": "Loading...",
    "dashboard.loadingDesc": "Fetching financial data...",
    "dashboard.error": "Error",
    "dashboard.errorDesc": "Could not load data. Check your Supabase connection.",
    "dashboard.errorUnknown": "Unknown error",
    "dashboard.income": "Income",
    "dashboard.expenses": "Expenses",
    "dashboard.cashflow": "Cashflow",
    "dashboard.cashflowHealthy": "Positive ✓",
    "dashboard.cashflowBalanced": "Balanced",
    "dashboard.cashflowNegative": "Negative ⚠",
    "dashboard.liquidity": "Available Cash",
    "dashboard.financialScore": "Financial Score",
    "dashboard.savingsRate": "Savings Rate",
    "dashboard.debtRatio": "Debt Ratio",
    "dashboard.burnRate": "Burn Rate",
    "dashboard.perDay": "/ day",
    "dashboard.scoreBreakdown": "Score breakdown",
    "dashboard.scoreCashflow": "Cashflow",
    "dashboard.scoreLiquidity": "Liquidity",
    "dashboard.scoreDebt": "Debt",
    "dashboard.scoreSavings": "Savings",
    "dashboard.scoreGoals": "Goals",
    "dashboard.scoreBudget": "Budget",
    "dashboard.alerts": "Alerts",
    "dashboard.footer": "Data refreshes every 30 seconds. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env to connect to Supabase.",
    "dashboard.ofIncome": "% of income",
    "dashboard.pctUsed": "used",
    // transactions
    "transactions.eyebrow": "Transactions",
    "transactions.title": "Transactions",
    "transactions.description": "Your monthly income and expenses",
    "transactions.loading": "Loading...",
    "transactions.loadingDesc": "Fetching transactions...",
    "transactions.error": "Error",
    "transactions.errorDesc": "Could not load transactions.",
    "transactions.errorUnknown": "Unknown error",
    "transactions.searchPlaceholder": "Search transactions...",
    "transactions.exportCsv": "Export CSV",
    "transactions.exportPdf": "Export PDF",
    "transactions.all": "All",
    "transactions.income": "Income",
    "transactions.expense": "Expenses",
    "transactions.new": "New",
    "transactions.emptyFiltered": "No transactions match your filters.",
    "transactions.empty": "No transactions yet this month. Create one!",
    "transactions.uncategorized": "Uncategorized",
    "transactions.editLabel": "Edit transaction",
    "transactions.count": "{count} of {total} transactions",
    "transactions.of": "of",
    "transactions.transactions": "transactions",
    "transactions.form.editTitle": "Edit transaction",
    "transactions.form.newTitle": "New transaction",
    "transactions.form.income": "Income",
    "transactions.form.expense": "Expense",
    "transactions.form.category": "Category",
    "transactions.form.select": "Select",
    "transactions.form.account": "Account",
    "transactions.form.amount": "Amount ($)",
    "transactions.form.date": "Date",
    "transactions.form.description": "Description",
    "transactions.form.descriptionPlaceholder": "E.g.: Supermarket",
    "transactions.form.notes": "Notes (optional)",
    "transactions.form.notesPlaceholder": "Additional notes...",
    "transactions.form.cancel": "Cancel",
    "transactions.form.saving": "Saving...",
    "transactions.form.saveChanges": "Save changes",
    "transactions.form.create": "Create transaction",
    // budgets
    "budgets.eyebrow": "Budgets",
    "budgets.title": "Budgets",
    "budgets.description": "Monthly expense control by category",
    "budgets.loadingDesc": "Loading budgets...",
    "budgets.errorDesc": "Could not load budgets.",
    "budgets.errorUnknown": "Unknown error",
    "budgets.totalBudget": "Total Budget",
    "budgets.spent": "Spent",
    "budgets.available": "Available",
    "budgets.pctUsed": "used",
    "budgets.add": "Add budget",
    "budgets.empty": "No budgets for this month. Create one!",
    "budgets.uncategorized": "Uncategorized",
    "budgets.statusOnTrack": "On track",
    "budgets.statusExceeded": "Exceeded",
    "budgets.statusWarning": "Warning",
    "budgets.statusHigh": "High",
    "budgets.statusCritical": "Critical",
    "budgets.alert": "Alert",
    "budgets.editLabel": "Edit budget",
    "budgets.form.editTitle": "Edit budget",
    "budgets.form.newTitle": "New budget",
    "budgets.form.category": "Category",
    "budgets.form.select": "Select",
    "budgets.form.monthlyLimit": "Monthly limit ($)",
    "budgets.form.cancel": "Cancel",
    "budgets.form.saving": "Saving...",
    "budgets.form.saveChanges": "Save changes",
    "budgets.form.create": "Create budget",
    // debts
    "debts.eyebrow": "Debts",
    "debts.title": "Debt Tracking",
    "debts.description": "Track your debts and register payments",
    "debts.loadingDesc": "Fetching your debts...",
    "debts.errorDesc": "Could not load debts.",
    "debts.errorUnknown": "Unknown error",
    "debts.totalDebt": "Total Debt",
    "debts.original": "Original",
    "debts.paid": "Paid",
    "debts.add": "New debt",
    "debts.empty": "No debts registered.",
    "debts.installments": "installments",
    "debts.perMonth": "/mo",
    "debts.pctPaid": "paid",
    "debts.originalLabel": "Original:",
    "debts.remainingLabel": "Remaining:",
    "debts.installmentLabel": "Installment:",
    "debts.interestLabel": "Interest:",
    "debts.pay": "Pay",
    "debts.edit": "Edit",
    "debts.registeredPayments": "Registered payments",
    "debts.form.editTitle": "Edit debt",
    "debts.form.newTitle": "New debt",
    "debts.form.name": "Name",
    "debts.form.namePlaceholder": "E.g.: Visa Card",
    "debts.form.creditor": "Creditor (optional)",
    "debts.form.creditorPlaceholder": "E.g.: Banco Galicia",
    "debts.form.originalAmount": "Original amount ($)",
    "debts.form.remainingBalance": "Remaining balance ($)",
    "debts.form.monthlyInstallment": "Monthly installment ($)",
    "debts.form.totalInstallments": "Total installments",
    "debts.form.remainingInstallments": "Remaining installments",
    "debts.form.interestRate": "Interest rate (%)",
    "debts.form.dueDay": "Due day",
    "debts.form.priority": "Priority",
    "debts.form.cancel": "Cancel",
    "debts.form.saving": "Saving...",
    "debts.form.saveChanges": "Save changes",
    "debts.form.create": "Create debt",
    "debts.payForm.title": "Register payment",
    "debts.payForm.amount": "Amount ($)",
    "debts.payForm.date": "Date",
    "debts.payForm.notes": "Notes (optional)",
    "debts.payForm.notesPlaceholder": "E.g.: Monthly payment",
    "debts.payForm.cancel": "Cancel",
    "debts.payForm.saving": "Saving...",
    "debts.payForm.register": "Register payment",
    // goals
    "goals.eyebrow": "Goals",
    "goals.title": "Financial Goals",
    "goals.description": "Track your financial objectives progress",
    "goals.loadingDesc": "Fetching your goals...",
    "goals.errorDesc": "Could not load goals.",
    "goals.errorUnknown": "Unknown error",
    "goals.totalTarget": "Total Target",
    "goals.saved": "Saved",
    "goals.globalProgress": "Overall Progress",
    "goals.add": "New goal",
    "goals.empty": "No financial goals. Create one!",
    "goals.of": "of",
    "goals.pctCompleted": "completed",
    "goals.monthsLeft": "months left",
    "goals.completed": "Completed",
    "goals.monthlySaving": "Monthly saving:",
    "goals.deadline": "Deadline:",
    "goals.contribute": "Contribute",
    "goals.edit": "Edit",
    "goals.registeredContributions": "Registered contributions",
    "goals.form.editTitle": "Edit goal",
    "goals.form.newTitle": "New goal",
    "goals.form.name": "Name",
    "goals.form.namePlaceholder": "E.g.: Emergency fund",
    "goals.form.targetAmount": "Target amount ($)",
    "goals.form.savedAmount": "Saved ($)",
    "goals.form.monthlySaving": "Monthly saving ($)",
    "goals.form.deadline": "Deadline",
    "goals.form.priority": "Priority",
    "goals.form.cancel": "Cancel",
    "goals.form.saving": "Saving...",
    "goals.form.saveChanges": "Save changes",
    "goals.form.create": "Create goal",
    "goals.contributeForm.title": "Contribute to goal",
    "goals.contributeForm.amount": "Amount ($)",
    "goals.contributeForm.date": "Date",
    "goals.contributeForm.notes": "Notes (optional)",
    "goals.contributeForm.notesPlaceholder": "E.g.: Weekly saving",
    "goals.contributeForm.cancel": "Cancel",
    "goals.contributeForm.saving": "Saving...",
    "goals.contributeForm.contribute": "Contribute",
    // reports
    "reports.eyebrow": "Reports",
    "reports.title": "Financial Reports",
    "reports.description": "Visualize income, expenses and trends",
    "reports.loadingDesc": "Generating reports...",
    "reports.errorDesc": "Could not generate reports.",
    "reports.errorUnknown": "Unknown error",
    "reports.months": "months",
    "reports.lastMonthIncome": "Last month - Income",
    "reports.lastMonthExpenses": "Last month - Expenses",
    "reports.cashflow": "Cashflow",
    "reports.vsPreviousMonth": "vs previous month",
    "reports.chartIncomeVsExpenses": "Income vs Expenses",
    "reports.chartExpensesByCategory": "Expenses by Category",
    "reports.chartCashflowTrend": "Cashflow Trend",
    "reports.monthlySummary": "Monthly Summary",
    "reports.tableMonth": "Month",
    "reports.tableIncome": "Income",
    "reports.tableExpenses": "Expenses",
    "reports.tableCashflow": "Cashflow",
    "reports.exportCsv": "Export CSV",
    "reports.exportPdf": "Export PDF",
    // simulator
    "simulator.eyebrow": "Simulator",
    "simulator.title": "Financial Simulator",
    "simulator.description": "Project hypothetical scenarios without affecting your real data",
    "simulator.loadingDesc": "Preparing simulator...",
    "simulator.errorDesc": "Could not load baseline data.",
    "simulator.errorUnknown": "Unknown error",
    "simulator.simulationMode": "Simulation mode",
    "simulator.simulationModeDesc": "Changes only affect this screen. They are never saved to the database.",
    "simulator.adjustScenario": "Adjust scenario",
    "simulator.incomeChange": "Income change",
    "simulator.expensesChange": "Expenses change",
    "simulator.oneTimeExpense": "One-time expense",
    "simulator.newRecurringExpense": "New recurring expense/mo",
    "simulator.liquidityChange": "Liquidity change",
    "simulator.debtChange": "Debt change (%)",
    "simulator.actualVsProjected": "Actual → Projected",
    "simulator.actual": "Actual:",
    "simulator.projected": "Projected:",
    "simulator.cashflow": "Cashflow",
    "simulator.income": "Income",
    "simulator.expenses": "Expenses",
    "simulator.financialScore": "Financial Score",
    "simulator.liquidity": "Liquidity",
    "simulator.debtRatio": "Debt Ratio",
    "simulator.savingsRate": "Savings Rate",
    "simulator.burnRate": "Burn Rate",
    "simulator.scoreProjection": "Financial Score Projection",
    "simulator.scoreCurrent": "Current:",
    "simulator.scoreProjected": "Projected:",
    "simulator.scoreCashflow": "Cashflow",
    "simulator.scoreLiquidity": "Liquidity",
    "simulator.scoreDebt": "Debt",
    "simulator.scoreSavings": "Savings",
    "simulator.scoreGoals": "Goals",
    "simulator.scoreBudget": "Budget",
    "simulator.perDay": "/day",
    // purchase advisor
    "advisor.eyebrow": "Purchase Advisor",
    "advisor.title": "Can I Buy This?",
    "advisor.description": "Evaluate a purchase before making it",
    "advisor.loadingDesc": "Analyzing your finances...",
    "advisor.errorDesc": "Could not load financial data.",
    "advisor.errorUnknown": "Unknown error",
    "advisor.purchaseDetails": "Purchase details",
    "advisor.price": "Price ($)",
    "advisor.installments": "Installments",
    "advisor.currentFinances": "Current finances",
    "advisor.availableCash": "Available cash",
    "advisor.cashflow": "Cashflow",
    "advisor.financialScore": "Financial Score",
    "advisor.debtRatio": "Debt Ratio",
    "advisor.enterPrice": "Enter a price to evaluate the purchase",
    "advisor.decisionYes": "Purchase recommended",
    "advisor.decisionWait": "Wait a bit",
    "advisor.decisionNo": "Not recommended",
    "advisor.riskLow": "Low risk",
    "advisor.riskMedium": "Medium risk",
    "advisor.riskHigh": "High risk",
    "advisor.financialImpact": "Financial impact",
    "advisor.impactCashflow": "Cashflow",
    "advisor.impactScore": "Financial Score",
    "advisor.impactBudget": "Budget impact",
    "advisor.impactDebt": "Debt ratio",
    "advisor.monthlyInstallment": "Monthly installment",
    "advisor.goalDelay": "Goal delay",
    "advisor.months": "months",
    "advisor.reasons": "Reasons",
    "advisor.points": "pts",
    // timeline
    "timeline.eyebrow": "Timeline",
    "timeline.title": "Timeline",
    "timeline.description": "Monthly financial flow",
    "timeline.loadingDesc": "Organizing financial events...",
    "timeline.errorDesc": "Could not load events.",
    "timeline.errorUnknown": "Unknown error",
    "timeline.empty": "No financial events this month.",
    "timeline.budget": "Budget:",
    "timeline.debtDue": "Due:",
    "timeline.day": "Day",
    "timeline.remaining": "remaining",
    // calendar
    "calendar.eyebrow": "Calendar",
    "calendar.title": "Financial Calendar",
    "calendar.description": "Due dates, installments and monthly events",
    "calendar.loadingDesc": "Preparing financial calendar...",
    "calendar.errorDesc": "Could not load events.",
    "calendar.errorUnknown": "Unknown error",
    "calendar.dayNamesSun": "Sun",
    "calendar.dayNamesMon": "Mon",
    "calendar.dayNamesTue": "Tue",
    "calendar.dayNamesWed": "Wed",
    "calendar.dayNamesThu": "Thu",
    "calendar.dayNamesFri": "Fri",
    "calendar.dayNamesSat": "Sat",
    "calendar.legendIncome": "Income",
    "calendar.legendExpense": "Expense",
    "calendar.legendDue": "Due",
    "calendar.legendGoal": "Goal",
    "calendar.monthEvents": "Month events",
    "calendar.noEvents": "No events this month.",
    "calendar.more": "more",
    // history
    "history.eyebrow": "Historial",
    "history.title": "Instantáneas mensuales",
    "history.description": "Navegá y compará instantáneas financieras mensuales.",
    "history.loadingDesc": "Cargando instantáneas...",
    "history.errorDesc": "No se pudieron cargar las instantáneas.",
    "history.errorUnknown": "Error desconocido",
    "history.income": "Ingresos",
    "history.expenses": "Gastos",
    "history.cashflow": "Flujo de caja",
    "history.debt": "Deuda total",
    "history.savings": "Ahorro",
    "history.score": "Score financiero",
    "history.empty": "No hay instantáneas disponibles. Generá una para el mes actual.",
    "history.generate": "Generar instantánea",
    "history.generating": "Generando...",
    "history.generated": "¡Instantánea guardada!",
    "history.comparing": "Comparando:",
    "history.baseline": "Base",
    "history.target": "Objetivo",
    "history.diff": "Cambio",
    "history.vsPrevious": "vs mes anterior",
    "history.pctChange": "Cambio %",
    "history.monthsWithData": "Meses con datos",
    "history.noDataForMonth": "Sin datos para este mes. Generá una instantánea.",
    "history.snapshotTitle": "Instantánea mensual",
    "history.snapshotDesc": "Estado financiero inmutable de un mes determinado.",
    // settings
    "settings.eyebrow": "Settings",
    "settings.title": "Settings",
    "settings.description": "Customize your FinOS experience",
    "settings.loadingDesc": "Loading settings...",
    "settings.errorDesc": "Could not load settings.",
    "settings.errorUnknown": "Unknown error",
    "settings.sectionAppearance": "Appearance",
    "settings.sectionAppearanceDesc": "Theme and language",
    "settings.theme": "Theme",
    "settings.themeLight": "Light",
    "settings.themeDark": "Dark",
    "settings.themeSystem": "System",
    "settings.language": "Language",
    "settings.languageEs": "Español",
    "settings.languageEn": "English",
    "settings.sectionProfile": "Profile",
    "settings.sectionProfileDesc": "Default financial profile",
    "settings.defaultProfile": "Default profile",
    "settings.defaultProfileDesc": "Select which profile to use when opening the app",
    "settings.profileJulian": "Julián",
    "settings.profilePareja": "Partner",
    "settings.profileAmbos": "Both",
    "settings.sectionPreferences": "Preferences",
    "settings.sectionPreferencesDesc": "General application options",
    "settings.animations": "Animations",
    "settings.animationsDesc": "Transitions and visual effects",
    "settings.notifications": "Notifications",
    "settings.notificationsDesc": "Budget, debt, and goal alerts",
    "settings.sectionData": "Data",
    "settings.sectionDataDesc": "Export and manage your data",
    "settings.exportData": "Export data",
    "settings.exportDataDesc": "Download your transactions and reports",
    "settings.exportCsv": "Export CSV",
    "settings.exportPdf": "Export PDF",
    "settings.sectionAbout": "About",
    "settings.sectionAboutDesc": "Application information",
    "settings.version": "Version",
    "settings.framework": "Framework",
    "settings.saved": "Settings saved",
    "settings.save": "Save changes",
    "settings.saving": "Saving...",
    // engine status labels
    "engine.statusHealthy": "Positive ✓",
    "engine.statusAttention": "Balanced",
    "engine.statusNegative": "Negative ⚠",
    // priority labels
    "priority.essential": "Essential",
    "priority.housing": "Housing",
    "priority.creditCard": "Credit card",
    "priority.personalLoan": "Personal loan",
    "priority.installmentPurchase": "Installment purchase",
    "priority.other": "Other",
    "priority.critical": "Critical",
    "priority.high": "High",
    "priority.medium": "Medium",
    "priority.low": "Low",
    // goal status
    "goalStatus.active": "Active",
    "goalStatus.completed": "Completed",
    "goalStatus.paused": "Paused",
    "goalStatus.archived": "Archived",
    // budget status
    "budgetStatus.onTrack": "On track",
    "budgetStatus.exceeded": "Exceeded",
    "budgetStatus.warning": "Warning",
    "budgetStatus.high": "High",
    "budgetStatus.critical": "Critical",
  },
};

export function useTranslation() {
  const { language } = useLanguage();

  function t(key: TranslationKey, params?: Record<string, string | number>): string {
    let value = translations[language][key];
    if (value === undefined) {
      console.warn(`Missing translation key: ${key} for language: ${language}`);
      return key;
    }
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        value = value.replace(`{${k}}`, String(v));
      }
    }
    return value;
  }

  return { t, language };
}
