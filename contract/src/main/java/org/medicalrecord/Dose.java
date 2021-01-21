package org.medicalrecord;

import org.hyperledger.fabric.contract.annotation.DataType;
import org.hyperledger.fabric.contract.annotation.Property;
import org.json.JSONObject;

@DataType()
public class Dose {

    @Property()
    private String dateAdministered;

    @Property()
    private String administrator;

    @Property()
    private String manufacturer;

    @Property()
    private String lotNumber;

    @Property()
    private String note;

    public String getDateAdministered() {
        return this.dateAdministered;
    }

    public Dose setDateAdministered(String dateAdministered) {
        this.dateAdministered = dateAdministered;
        return this;
    }

    public String getAdministrator() {
        return this.administrator;
    }

    public Dose setAdministrator(String administrator) {
        this.administrator = administrator;
        return this;
    }

    public String getManufacturer() {
        return this.manufacturer;
    }

    public Dose setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
        return this;
    }

    public String getLotNumber() {
        return this.lotNumber;
    }

    public Dose setLotNumber(String lotNumber) {
        this.lotNumber = lotNumber;
        return this;
    }

    public static Dose newDose(String dateAdministered, String administrator, String manufacturer, String lotNumber,
            String note) {
        return new Dose().setDateAdministered(dateAdministered).setAdministrator(administrator)
                .setManufacturer(manufacturer).setLotNumber(lotNumber).setNote(note);
    }

    public String getNote() {
        return this.note;
    }

    public Dose setNote(String note) {
        this.note = note;
        return this;
    }

    public JSONObject toJSON() {
        return new JSONObject(this);
    }

    public static Dose fromJSON(JSONObject json) {
        return Dose.newDose(json.getString("dateAdministered"), json.getString("administrator"),
                json.getString("manufacturer"), json.getString("lotNumber"), json.getString("note"));
    }
}