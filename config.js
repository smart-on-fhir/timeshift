module.exports = {
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
        "billablePeriod.created"
    ],
    Organization: [],
    Practitioner: [],
    Observation: [
        "effectiveDateTime",
        "effectivePeriod.start",
        "effectivePeriod.end",
        "effectivePeriod.created",
        "effectiveTiming",
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
        "effectivePeriod.created",
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

