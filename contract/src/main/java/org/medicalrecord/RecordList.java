package org.medicalrecord;

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

    public RecordList updateRecord(MedicalRecord record) {
        this.stateList.updateState(record);
        return this;
    }
}
