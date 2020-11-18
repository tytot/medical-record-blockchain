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
     * @param {String}  immunizationName the name of the immunization
     * @param {String}  dateDoseAdministered the date the dose was administered
     * @param {String}  doseAdministrator the individual/organization that administered the dose
     * @param {String}  doseManufacturer the manufacturer of the dose
     * @param {String}  doseLotNumber the lot number of the dose
     * @param {String}  doseNote a note to add to the dose listing
     */
    @Transaction
    public MedicalRecord addImmunizationDoseToRecord(MedicalRecordContext ctx, String lastName, String firstName,
            String id, String immunizationName, String dateDoseAdministered, String doseAdministrator,
            String doseManufacturer, String doseLotNumber, String doseNote) {

        String recordKey = State.makeKey(new String[] { lastName, firstName, id });
        MedicalRecord record = ctx.recordList.getRecord(recordKey);

        Immunization immunization = record.getImmunizationByName(immunizationName);
        if (immunization == null) {
            immunization = Immunization.newImmunization(immunizationName);
            record.addImmunization(immunization);
        }
        immunization.addDose(Dose.newDose(LocalDate.parse(dateDoseAdministered), doseAdministrator, doseManufacturer,
                doseLotNumber, doseNote));

        return record;
    }

    /**
     * Add a medication to a medical record
     *
     * @param {Context} ctx the transaction context
     * @param {String}  lastName the record holder's last name
     * @param {String}  firstName the record holder's first name
     * @param {String}  id the ID of the record
     * @param {String}  medicationName the name of the medication
     * @param {String}  medicationDose the medication dosage
     * @param {String}  medicationFrequency how frequently the medication is taken
     * @param {String}  medicationStartDate when the record holder began the medication
     * @param {String}  medicationEndDate when the record holder ended the medication
     * @param {String}  medicationPrescriber the individual/organizaion that prescribed the medication
     * @param {String}  medicationManufacturer the manufacturer of the medication
     * @param {String}  medicationNote a note to add to the medication listing
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