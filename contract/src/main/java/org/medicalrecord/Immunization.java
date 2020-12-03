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
        this.doses.addFirst(dose);
    }

    public static Immunization newImmunization(String name) {
        return new Immunization().setName(name);
    }

    public JSONObject toJSON() {
        return new JSONObject(this);
    }

    public static Immunization fromJSON(JSONObject json) {
        Immunization immunization = Immunization.newImmunization(json.getString("name"));
        JSONArray dosesJSON = json.getJSONArray("doses");
        for (int i = 0; i < dosesJSON.length(); i++) {
            immunization.addDose(Dose.fromJSON(dosesJSON.getJSONObject(i)));
        }
        return immunization;
    }
}