package org.medicalrecord;

import java.util.LinkedList;

import org.hyperledger.fabric.contract.annotation.DataType;
import org.hyperledger.fabric.contract.annotation.Property;
import org.json.JSONArray;
import org.json.JSONObject;

@DataType()
public class Immunization {

    @Property()
    private String name;

    @Property()
    private LinkedList<Dose> doses = new LinkedList<Dose>();

    @Property()
    private String note;

    public String getName() {
        return this.name;
    }

    public Immunization setName(String name) {
        this.name = name;
        return this;
    }

    public int getNumDoses() {
        return this.doses.size();
    }

    public LinkedList<Dose> getDoses() {
        return this.doses;
    }

    public void addDose(Dose dose) {
        this.doses.add(dose);
    }

    public String getNote() {
        return this.note;
    }

    public Immunization setNote(String note) {
        this.note = note;
        return this;
    }

    public static Immunization newImmunization(String name, String note) {
        return new Immunization().setName(name).setNote(note);
    }

    public JSONObject toJSON() {
        return new JSONObject(this);
    }

    public static Immunization fromJSON(JSONObject json) {
        Immunization immunization = Immunization.newImmunization(json.getString("name"), json.getString("note"));
        JSONArray dosesJSON = json.getJSONArray("doses");
        for (int i = 0; i < dosesJSON.length(); i++) {
            immunization.addDose(Dose.fromJSON(dosesJSON.getJSONObject(i)));
        }
        return immunization;
    }
}