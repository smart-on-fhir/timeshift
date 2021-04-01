const jsonPaths = {
    Patient: [
        "birthDate",
        "deceasedDateTime"
    ],
    Encounter: [
        "statusHistory..period.start",
        "statusHistory..period.end",
        "classHistory..period.start",
        "classHistory..period.end",
        "participant..period.start",
        "participant..period.end",
        "location..period.start",
        "location..period.end",
        "period.start",
        "period.end"
    ],
    Condition: [
        "onsetDateTime",
        "recordedDate",
        "dateRecorded",
        "abatementDateTime",
        "abatementRange.start",
        "abatementRange.end",
        "assertedDate"
    ],
    MedicationRequest: [
        "authoredOn",
        "dispenseRequest.validityPeriod.start",
        "dispenseRequest.validityPeriod.end"
    ],
    Claim: [
        "billablePeriod.start",
        "billablePeriod.end",
        "created"
    ],
    CarePlan: [
        "period.start",
        "period.end"
    ],
    ExplanationOfBenefit: [
        "billablePeriod.start",
        "billablePeriod.end",
        "created"
    ],
    Organization: [],
    Practitioner: [],
    Observation: [
        "effectiveDateTime",
        "effectivePeriod.start",
        "effectivePeriod.end",
        // "effectivePeriod.created",
        "effectiveTiming..event",
        "effectiveInstant",
        "issued",
        "valueDateTime",
        "valuePeriod.start",
        "valuePeriod.end",
        "valuePeriod.created",
        "component..valueDateTime",
        "component..valuePeriod.start",
        "component..valuePeriod.end",
        "component..valuePeriod.created"
    ],
    Immunization: [
        "occurrenceDateTime",
        "recorded",
        "expirationDate",
        "education..publicationDate",
        "education..presentationDate",
        "reaction..date"
    ],
    DiagnosticReport: [
        "effectiveDateTime",
        "effectivePeriod.start",
        "effectivePeriod.end",
        // "effectivePeriod.created",
        "issued"
    ],
    Procedure: [
        "performedDateTime",
        "performedPeriod.start",
        "performedPeriod.end",
        "performedPeriod.created"
    ],
    ImagingStudy: [
        "started",
        "series..started"
    ],
    Goal: [
        "startDate",
        "target..dueDate",
        "statusDate"
    ],
    AllergyIntolerance: [
        "onsetDateTime",
        "onsetPeriod.start",
        "onsetPeriod.end",
        "onsetPeriod.created",
        "recordedDate",
        "reaction..onset"
    ],
    MedicationOrder: [
        "dateWritten",
        "dateEnded",
        "dispenseRequest.validityPeriod.start",
        "dispenseRequest.validityPeriod.end"
    ],
    MedicationStatement: [
        "dateAsserted",
        "effectiveDateTime",
        "effectivePeriod.start",
        "effectivePeriod.end"
    ],
    Schedule: [
        "planningHorizon.start",
        "planningHorizon.end"
    ],
    Slot: [
        "start",
        "end"
    ],
    Appointment: [
        "start",
        "end",
        "created",
        "participant..period.start",
        "participant..period.end",
        "requestedPeriod..start",
        "requestedPeriod..end"
    ],
    AppointmentResponse: [
        "start",
        "end"
    ],
    Coverage: [
        "period.start",
        "period.end",
        "costToBeneficiary..exception..period.start",
        "costToBeneficiary..exception..period.end"
    ],
    FamilyMemberHistory: [
        "date",
        "bornPeriod.start",
        "bornPeriod.end",
        "bornDate",
        "deceasedDate",
        "condition..onsetPeriod.start",
        "condition..onsetPeriod.end"
    ],
    NutritionOrder: [
        "dateTime",
        "supplement..schedule..event",
        "supplement..schedule.boundsPeriod.start",
        "supplement..schedule.boundsPeriod.end",
        "enteralFormula.administration..schedule.boundsPeriod.start",
        "enteralFormula.administration..schedule.boundsPeriod.end",
        "oralDiet..schedule.boundsPeriod.start",
        "oralDiet..schedule.boundsPeriod.end",
    ],
    ValueSet: [
        "date",
        "lockedDate",
        "compose.lockedDate",
        "expansion.timestamp",
        "expansion.parameter..valueDateTime"
    ],
    Questionnaire: [
        "date",
        "approvalDate",
        "lastReviewDate",
        "effectivePeriod.start",
        "effectivePeriod.end",
        "item..enableWhen..answerDate",
        "item..enableWhen..answerDateTime",
        "item..option..valueDate",
        "item..answerOption..valueDate",
        "item..initialDate",
        "item..initialDateTime",
        "item..initial..valueDate",
        "item..initial..valueDateTime"
    ],
    QuestionnaireResponse: [
        "authored",
        "group.question..answer..valueDate",
        "group.question..answer..valueDateTime",
        "group.question..answer..valueInstant"
    ],
    MedicationDispense: [
        "whenPrepared",
        "whenHandedOver",
        "dosageInstruction..timing..event",
        "dosageInstruction..timing.repeat.boundsPeriod.start",
        "dosageInstruction..timing.repeat.boundsPeriod.end"
    ],
    Binary: [],
    DocumentReference: [
        "date",
        "created",
        "indexed",
        "context.period.start",
        "context.period.end"
    ],
    Medication: [
        "product.batch..expirationDate",
        "package.batch..expirationDate",
        "batch.expirationDate"
    ]
};

const xmlPaths = [

    // Patient
    "Bundle.entry.resource.Patient.birthDate.value",
    "Bundle.entry.resource.Patient.deceasedDateTime.value",

    // Encounter
    "Bundle.entry.resource.Encounter.statusHistory.period.start.value",
    "Bundle.entry.resource.Encounter.statusHistory.period.end.value",
    "Bundle.entry.resource.Encounter.classHistory.period.start.value",
    "Bundle.entry.resource.Encounter.classHistory.period.end.value",
    "Bundle.entry.resource.Encounter.participant.period.start.value",
    "Bundle.entry.resource.Encounter.participant.period.end.value",
    "Bundle.entry.resource.Encounter.location.period.start.value",
    "Bundle.entry.resource.Encounter.location.period.end.value",
    "Bundle.entry.resource.Encounter.period.start.value",
    "Bundle.entry.resource.Encounter.period.end.value",
    
    // Condition
    "Bundle.entry.resource.Condition.onsetDateTime.value",
    "Bundle.entry.resource.Condition.recordedDate.value",
    "Bundle.entry.resource.Condition.dateRecorded.value",
    "Bundle.entry.resource.Condition.abatementDateTime.value",
    "Bundle.entry.resource.Condition.abatementRange.start.value",
    "Bundle.entry.resource.Condition.abatementRange.end.value",
    "Bundle.entry.resource.Condition.assertedDate.value",

    // MedicationRequest
    "Bundle.entry.resource.MedicationRequest.authoredOn.value",
    "Bundle.entry.resource.MedicationRequest.dispenseRequest.validityPeriod.start.value",
    "Bundle.entry.resource.MedicationRequest.dispenseRequest.validityPeriod.end.value",

    // Claim
    "Bundle.entry.resource.Claim.billablePeriod.start.value",
    "Bundle.entry.resource.Claim.billablePeriod.end.value",
    "Bundle.entry.resource.Claim.created.value",

    // CarePlan
    "Bundle.entry.resource.CarePlan.period.start.value",
    "Bundle.entry.resource.CarePlan.period.end.value",

    // ExplanationOfBenefit
    "Bundle.entry.resource.ExplanationOfBenefit.billablePeriod.start.value",
    "Bundle.entry.resource.ExplanationOfBenefit.billablePeriod.end.value",
    "Bundle.entry.resource.ExplanationOfBenefit.created.value",

    // Observation
    "Bundle.entry.resource.Observation.effectiveDateTime.value",
    "Bundle.entry.resource.Observation.effectivePeriod.start.value",
    "Bundle.entry.resource.Observation.effectivePeriod.end.value",
    // "Bundle.entry.resource.Observation.effectivePeriod.created",
    "Bundle.entry.resource.Observation.effectiveTiming.event.value",
    "Bundle.entry.resource.Observation.effectiveInstant.value",
    "Bundle.entry.resource.Observation.issued.value",
    "Bundle.entry.resource.Observation.valueDateTime.value",
    "Bundle.entry.resource.Observation.valuePeriod.start.value",
    "Bundle.entry.resource.Observation.valuePeriod.end.value",
    // "Bundle.entry.resource.Observation.valuePeriod.created",
    "Bundle.entry.resource.Observation.component.valueDateTime.value",
    "Bundle.entry.resource.Observation.component.valuePeriod.start.value",
    "Bundle.entry.resource.Observation.component.valuePeriod.end.value",
    // "Bundle.entry.resource.Observation.component.valuePeriod.created",

    // Immunization
    "Bundle.entry.resource.Immunization.occurrenceDateTime.value",
    "Bundle.entry.resource.Immunization.recorded.value",
    "Bundle.entry.resource.Immunization.expirationDate.value",
    "Bundle.entry.resource.Immunization.education.publicationDate.value",
    "Bundle.entry.resource.Immunization.education.presentationDate.value",
    "Bundle.entry.resource.Immunization.reaction.date",

    // DiagnosticReport
    "Bundle.entry.resource.DiagnosticReport.effectiveDateTime.value",
    "Bundle.entry.resource.DiagnosticReport.effectivePeriod.start.value",
    "Bundle.entry.resource.DiagnosticReport.effectivePeriod.end.value",
    // "Bundle.entry.resource.DiagnosticReport.effectivePeriod.created",
    "Bundle.entry.resource.DiagnosticReport.issued.value",

    // Procedure
    "Bundle.entry.resource.Procedure.performedDateTime.value",
    "Bundle.entry.resource.Procedure.performedPeriod.start.value",
    "Bundle.entry.resource.Procedure.performedPeriod.end.value",
    // "Bundle.entry.resource.Procedure.performedPeriod.created",

    // ImagingStudy
    "Bundle.entry.resource.ImagingStudy.started.value",
    "Bundle.entry.resource.ImagingStudy.series.started.value",

    // Goal
    "Bundle.entry.resource.Goal.startDate.value",
    "Bundle.entry.resource.Goal.target.dueDate.value",
    "Bundle.entry.resource.Goal.statusDate.value",

    // AllergyIntolerance
    "Bundle.entry.resource.AllergyIntolerance.onsetDateTime.value",
    "Bundle.entry.resource.AllergyIntolerance.onsetPeriod.start.value",
    "Bundle.entry.resource.AllergyIntolerance.onsetPeriod.end.value",
    // "Bundle.entry.resource.AllergyIntolerance.onsetPeriod.created",
    "Bundle.entry.resource.AllergyIntolerance.recordedDate.value",
    "Bundle.entry.resource.AllergyIntolerance.reaction.onset.value",

    // MedicationOrder
    "Bundle.entry.resource.MedicationOrder.dateWritten.value",
    "Bundle.entry.resource.MedicationOrder.dateEnded.value",
    "Bundle.entry.resource.MedicationOrder.dispenseRequest.validityPeriod.start.value",
    "Bundle.entry.resource.MedicationOrder.dispenseRequest.validityPeriod.end.value",

    // MedicationStatement
    "Bundle.entry.resource.MedicationStatement.dateAsserted.value",
    "Bundle.entry.resource.MedicationStatement.effectiveDateTime.value",
    "Bundle.entry.resource.MedicationStatement.effectivePeriod.start.value",
    "Bundle.entry.resource.MedicationStatement.effectivePeriod.end.value",

    // Schedule
    "Bundle.entry.resource.Schedule.planningHorizon.start",
    "Bundle.entry.resource.Schedule.planningHorizon.end",

    // Slot
    "Bundle.entry.resource.Slot.start",
    "Bundle.entry.resource.Slot.end",

    // Appointment
    "Bundle.entry.resource.Appointment.start.value",
    "Bundle.entry.resource.Appointment.end.value",
    // "Bundle.entry.resource.Appointment.created",
    "Bundle.entry.resource.Appointment.participant.period.start.value",
    "Bundle.entry.resource.Appointment.participant.period.end.value",
    "Bundle.entry.resource.Appointment.requestedPeriod.start.value",
    "Bundle.entry.resource.Appointment.requestedPeriod.end.value",
    "Bundle.entry.resource.AppointmentResponse.start.value",
    "Bundle.entry.resource.AppointmentResponse.end.value",

    // Coverage
    "Bundle.entry.resource.Coverage.period.start.value",
    "Bundle.entry.resource.Coverage.period.end.value",
    "Bundle.entry.resource.Coverage.costToBeneficiary.exception.period.start.value",
    "Bundle.entry.resource.Coverage.costToBeneficiary.exception.period.end.value",

    // FamilyMemberHistory
    "Bundle.entry.resource.FamilyMemberHistory.date.value",
    "Bundle.entry.resource.FamilyMemberHistory.bornPeriod.start.value",
    "Bundle.entry.resource.FamilyMemberHistory.bornPeriod.end.value",
    "Bundle.entry.resource.FamilyMemberHistory.bornDate.value",
    "Bundle.entry.resource.FamilyMemberHistory.deceasedDate.value",
    "Bundle.entry.resource.FamilyMemberHistory.condition.onsetPeriod.start.value",
    "Bundle.entry.resource.FamilyMemberHistory.condition.onsetPeriod.end.value",

    // NutritionOrder
    "Bundle.entry.resource.NutritionOrder.dateTime.value",
    "Bundle.entry.resource.NutritionOrder.supplement.schedule.event.value",
    "Bundle.entry.resource.NutritionOrder.supplement.schedule.boundsPeriod.start.value",
    "Bundle.entry.resource.NutritionOrder.supplement.schedule.boundsPeriod.end.value",
    "Bundle.entry.resource.NutritionOrder.enteralFormula.administration.schedule.boundsPeriod.start.value",
    "Bundle.entry.resource.NutritionOrder.enteralFormula.administration.schedule.boundsPeriod.end.value",
    "Bundle.entry.resource.NutritionOrder.oralDiet.schedule.boundsPeriod.start.value",
    "Bundle.entry.resource.NutritionOrder.oralDiet.schedule.boundsPeriod.end.value",
    
    // ValueSet
    "Bundle.entry.resource.ValueSet.date.value",
    "Bundle.entry.resource.ValueSet.lockedDate.value",
    "Bundle.entry.resource.ValueSet.compose.lockedDate.value",
    "Bundle.entry.resource.ValueSet.expansion.timestamp.value",
    "Bundle.entry.resource.ValueSet.expansion.parameter.valueDateTime.value",

    // Questionnaire
    "Bundle.entry.resource.Questionnaire.date.value",
    "Bundle.entry.resource.Questionnaire.approvalDate.value",
    "Bundle.entry.resource.Questionnaire.lastReviewDate.value",
    "Bundle.entry.resource.Questionnaire.effectivePeriod.start.value",
    "Bundle.entry.resource.Questionnaire.effectivePeriod.end.value",
    "Bundle.entry.resource.Questionnaire.item.enableWhen.answerDate.value",
    "Bundle.entry.resource.Questionnaire.item.enableWhen.answerDateTime.value",
    "Bundle.entry.resource.Questionnaire.item.option.valueDate.value",
    "Bundle.entry.resource.Questionnaire.item.answerOption.valueDate.value",
    "Bundle.entry.resource.Questionnaire.item.initialDate.value",
    "Bundle.entry.resource.Questionnaire.item.initialDateTime.value",
    "Bundle.entry.resource.Questionnaire.item.initial.valueDate.value",
    "Bundle.entry.resource.Questionnaire.item.initial.valueDateTime.value",

    // QuestionnaireResponse
    "Bundle.entry.resource.QuestionnaireResponse.authored.value",
    "Bundle.entry.resource.QuestionnaireResponse.group.question.answer.valueDate.value",
    "Bundle.entry.resource.QuestionnaireResponse.group.question.answer.valueDateTime.value",
    "Bundle.entry.resource.QuestionnaireResponse.group.question.answer.valueInstant.value",

    // MedicationDispense
    "Bundle.entry.resource.MedicationDispense.whenPrepared.value",
    "Bundle.entry.resource.MedicationDispense.whenHandedOver.value",
    "Bundle.entry.resource.MedicationDispense.dosageInstruction.timing.event.value",
    "Bundle.entry.resource.MedicationDispense.dosageInstruction.timing.repeat.boundsPeriod.start.value",
    "Bundle.entry.resource.MedicationDispense.dosageInstruction.timing.repeat.boundsPeriod.end.value",

    // DocumentReference
    "Bundle.entry.resource.DocumentReference.date.value",
    "Bundle.entry.resource.DocumentReference.created.value",
    "Bundle.entry.resource.DocumentReference.indexed.value",
    "Bundle.entry.resource.DocumentReference.context.period.start.value",
    "Bundle.entry.resource.DocumentReference.context.period.end.value",

    // Medication
    "Bundle.entry.resource.Medication.product.batch.expirationDate.value",
    "Bundle.entry.resource.Medication.package.batch.expirationDate.value",
    "Bundle.entry.resource.Medication.batch.expirationDate.value"
];

module.exports = {
    jsonPaths,
    xmlPaths
};

