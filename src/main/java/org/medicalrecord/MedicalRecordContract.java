package org.medicalrecord;

import java.time.LocalDate;

import org.medicalrecord.ledgerapi.State;
import org.hyperledger.fabric.contract.Context;
import org.hyperledger.fabric.contract.ContractInterface;
import org.hyperledger.fabric.contract.annotation.Contact;
import org.hyperledger.fabric.contract.annotation.Contract;
import org.hyperledger.fabric.contract.annotation.Default;
import org.hyperledger.fabric.contract.annotation.Info;
import org.hyperledger.fabric.contract.annotation.License;
import org.hyperledger.fabric.contract.annotation.Transaction;
import org.hyperledger.fabric.shim.ChaincodeStub;

@Contract(name = "org.medicalrecord", info = @Info(title = "Medical Record Contract", description = "", version = "0.0.1", license = @License(name = "SPDX-License-Identifier: Apache-2.0", url = ""), contact = @Contact(email = "java-contract@example.com", name = "java-contract", url = "http://java-contract.me")))
@Default
public class MedicalRecordContract implements ContractInterface {

    @Override
    public Context createContext(ChaincodeStub stub) {
        return new MedicalRecordContext(stub);
    }

    /**
     * Create a medical record
     *
     * @param {Context} ctx the transaction context
     * @param {String}  lastName the record holder's last name
     * @param {String}  firstName the record holder's first name
     * @param {String}  id the ID of the record
     */
    @Transaction
    public MedicalRecord createRecord(MedicalRecordContext ctx, String lastName, String firstName, String id) {

        MedicalRecord record = new MedicalRecord(lastName, firstName, id);

        System.out.println(record);
        ctx.recordList.addRecord(record);

        return record;
    }

    /**
     * Add an immunization dose to a medical record
     *
     * @param {Context} ctx the transaction context
     * @param {String}  lastName the record holder's last name
     * @param {String}  firstName the record holder's first name
     * @param {String}  id the ID of the record
     */
    @Transaction
    public MedicalRecord addImmunizationDoseToRecord(MedicalRecordContext ctx, String lastName, String firstName,
            String id, String immunizationName, String immunizationNote, String dateDoseAdministered,
            String doseAdministrator, String doseManufacturer, String doseLotNumber) {

        String recordKey = State.makeKey(new String[] { lastName, firstName, id });
        MedicalRecord record = ctx.recordList.getRecord(recordKey);

        Immunization immunization = record.getImmunizationByName(immunizationName);
        if (immunization == null) {
            immunization = Immunization.newImmunization(immunizationName, immunizationNote);
            record.addImmunization(immunization);
        }
        immunization.addDose(Dose.newDose(LocalDate.parse(dateDoseAdministered), doseAdministrator, doseManufacturer,
                doseLotNumber));

        return record;
    }

    /**
     * Add a medication to a medical record
     *
     * @param {Context} ctx the transaction context
     * @param {String}  lastName the record holder's last name
     * @param {String}  firstName the record holder's first name
     * @param {String}  id the ID of the record
     */
    @Transaction
    public MedicalRecord addMedicationToRecord(MedicalRecordContext ctx, String lastName, String firstName, String id,
            String medicationName, String medicationDose, String medicationFrequency, LocalDate medicationStartDate,
            LocalDate medicationEndDate, String medicationPrescriber, String medicationManufacturer,
            String medicationNote) {

        String recordKey = State.makeKey(new String[] { lastName, firstName, id });
        MedicalRecord record = ctx.recordList.getRecord(recordKey);

        record.addMedication(Medication.newMedication(medicationName, medicationDose, medicationFrequency,
                medicationStartDate, medicationEndDate, medicationPrescriber, medicationManufacturer, medicationNote));

        return record;
    }
}