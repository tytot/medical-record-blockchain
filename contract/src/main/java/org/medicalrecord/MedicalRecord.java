package org.medicalrecord;

import java.util.LinkedList;
import static java.nio.charset.StandardCharsets.UTF_8;

import org.medicalrecord.ledgerapi.State;
import org.hyperledger.fabric.contract.annotation.DataType;
import org.hyperledger.fabric.contract.annotation.Property;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONPropertyIgnore;

@DataType()
public class MedicalRecord extends State {

    @Property()
    private String lastName;
    @Property()
    private String firstName;
    @Property()
    private String id;
    @Property()
    private LinkedList<Immunization> immunizations = new LinkedList<Immunization>();
    @Property()
    private LinkedList<Medication> medications = new LinkedList<Medication>();

    MedicalRecord(String lastName, String firstName, String id) {
        super();
        this.lastName = lastName;
        this.firstName = firstName;
        this.id = id;
    }

    public String getLastName() {
        return this.lastName;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public String getid() {
        return this.id;
    }

    public int getNumImmunizations() {
        return this.immunizations.size();
    }

    public int getNumMedications() {
        return this.medications.size();
    }

    public LinkedList<Immunization> getImmunizations() {
        return this.immunizations;
    }

    @JSONPropertyIgnore()
    public Immunization getImmunizationByName(String name) {
        for (Immunization immunization : this.immunizations) {
            if (immunization.getName().equals(name)) {
                return immunization;
            }
        }
        return null;
    }

    public LinkedList<Medication> getMedications() {
        return this.medications;
    }

    @JSONPropertyIgnore()
    public Medication getMedicationByName(String name) {
        for (Medication medication : this.medications) {
            if (medication.getName().equals(name)) {
                return medication;
            }
        }
        return null;
    }

    public void addImmunization(Immunization immunization) {
        this.immunizations.add(immunization);
    }

    public void addMedication(Medication medication) {
        this.medications.add(medication);
    }

    public MedicalRecord setKey() {
        this.key = State.makeKey(new String[] { this.lastName, this.firstName, this.id });
        return this;
    }

        /**
     * Deserialize a state data to commercial paper
     *
     * @param {Buffer} data to form back into the object
     */
    public static MedicalRecord deserialize(byte[] data) {
        JSONObject json = new JSONObject(new String(data, UTF_8));

        String lastName = json.getString("lastName");
        String firstName = json.getString("paperNumber");
        String id = json.getString("id");
        MedicalRecord record = new MedicalRecord(lastName, firstName, id);
        JSONArray immunizationsJSON = json.getJSONArray("immunizations");
        for (int i = 0; i < immunizationsJSON.length(); i++) {
            record.addImmunization(Immunization.fromJSON(immunizationsJSON.getJSONObject(i)));
        }
        JSONArray medicationsJSON = json.getJSONArray("medications");  
        for (int i = 0; i < medicationsJSON.length(); i++) {
            record.addMedication(Medication.fromJSON(medicationsJSON.getJSONObject(i)));
        }
        return record;
    }

    public static byte[] serialize(MedicalRecord record) {
        return State.serialize(record);
    }

    public String toString() {
        return "Record::" + this.key;
    }
}