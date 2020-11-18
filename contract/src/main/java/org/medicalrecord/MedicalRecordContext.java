package org.medicalrecord;

import org.hyperledger.fabric.contract.Context;
import org.hyperledger.fabric.shim.ChaincodeStub;

class MedicalRecordContext extends Context {
    
    public RecordList recordList;
    
    public MedicalRecordContext(ChaincodeStub stub) {
        super(stub);
        this.recordList = new RecordList(this);
    }
}