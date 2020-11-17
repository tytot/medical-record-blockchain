package org.medicalrecord;

import java.time.LocalDate;

import org.hyperledger.fabric.contract.annotation.DataType;
import org.hyperledger.fabric.contract.annotation.Property;
import org.json.JSONObject;

@DataType()
public class Dose {

    @Property()
    private LocalDate dateAdministered;

    @Property()
    private String administrator;

    @Property()
    private String manufacturer;

    @Property()
    private String lotNumber;

    public LocalDate getDateAdministered() {
        return this.dateAdministered;
    }

    public Dose setDateAdministered(LocalDate dateAdministered) {
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

    public static Dose newDose(LocalDate dateAdministered, String administrator, String manufacturer,
            String lotNumber) {
        return new Dose().setDateAdministered(dateAdministered).setAdministrator(administrator)
                .setManufacturer(manufacturer).setLotNumber(lotNumber);
    }

    public JSONObject toJSON() {
        return new JSONObject(this);
    }

    public static Dose fromJSON(JSONObject json) {
        return Dose.newDose(LocalDate.parse(json.getString("dateAdministered")), json.getString("administrator"),
                json.getString("manufacturer"), json.getString("lotNumber"));
    }
}