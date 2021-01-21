package org.medicalrecord;

import java.util.List;

import org.medicalrecord.ledgerapi.State;
import org.medicalrecord.ledgerapi.StateList;

import org.hyperledger.fabric.contract.Context;

public class RecordList {
    
    private StateList stateList;

    public RecordList(Context ctx){
        this.stateList = StateList.getStateList(ctx, MedicalRecord.class.getSimpleName(), MedicalRecord::deserialize);
    }

    public RecordList addRecord(MedicalRecord record) {
        this.stateList.addState(record);
        return this;
    }

    public MedicalRecord getRecord(String recordKey) {
        return (MedicalRecord) this.stateList.getState(recordKey);
    }

    public MedicalRecord[] queryRecords(String... attributes) {
        List<State> results = this.stateList.queryStates(attributes);
        MedicalRecord[] records = new MedicalRecord[results.size()];
        for (int i = 0; i < records.length; i++) {
            records[i] = (MedicalRecord) results.get(i);
        }
        return records;
    }

    public RecordList updateRecord(MedicalRecord record) {
        this.stateList.updateState(record);
        return this;
    }

    public RecordList deleteRecord(String recordKey) {
        this.stateList.deleteState(recordKey);
        return this;
    }
}
