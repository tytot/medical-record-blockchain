package org.medicalrecord;

import org.hyperledger.fabric.contract.annotation.DataType;
import org.hyperledger.fabric.contract.annotation.Property;
import org.json.JSONObject;

@DataType()
public class Medication {

    @Property()
    private String name;

    @Property()
    private String dose;

    @Property()
    private String frequency;

    @Property()
    private String startDate;

    @Property()
    private String endDate;

    @Property()
    private String prescriber;

    @Property()
    private String manufacturer;

    @Property()
    private String note;

    public String getName() {
        return name;
    }

    public Medication setName(String name) {
        this.name = name;
        return this;
    }

    public String getDose() {
        return dose;
    }

    public Medication setDose(String dose) {
        this.dose = dose;
        return this;
    }

    public String getFrequency() {
        return frequency;
    }

    public Medication setFrequency(String frequency) {
        this.frequency = frequency;
        return this;
    }

    public String getStartDate() {
        return startDate;
    }

    public Medication setStartDate(String startDate) {
        this.startDate = startDate;
        return this;
    }

    public String getEndDate() {
        return endDate;
    }

    public Medication setEndDate(String endDate) {
        this.endDate = endDate;
        return this;
    }

    public String getPrescriber() {
        return prescriber;
    }

    public Medication setPrescriber(String prescriber) {
        this.prescriber = prescriber;
        return this;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public Medication setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
        return this;
    }

    public String getNote() {
        return note;
    }

    public Medication setNote(String note) {
        this.note = note;
        return this;
    }

    public static Medication newMedication(String name, String dose, String frequency, String startDate, String endDate,
            String prescriber, String manufacturer, String note) {
        return new Medication().setName(name).setDose(dose).setFrequency(frequency).setStartDate(startDate)
                .setEndDate(endDate).setPrescriber(prescriber).setManufacturer(manufacturer).setNote(note);
    }

    public JSONObject toJSON() {
        return new JSONObject(this);
    }

    public static Medication fromJSON(JSONObject json) {
        return Medication.newMedication(json.getString("name"), json.getString("dose"), json.getString("frequency"),
                json.getString("startDate"), json.getString("endDate"), json.getString("prescriber"),
                json.getString("manufacturer"), json.getString("note"));
    }
}
