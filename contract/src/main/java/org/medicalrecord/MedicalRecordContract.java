package org.medicalrecord;

import static java.nio.charset.StandardCharsets.UTF_8;

import org.hyperledger.fabric.contract.Context;
import org.hyperledger.fabric.contract.ContractInterface;
import org.hyperledger.fabric.contract.annotation.Contact;
import org.hyperledger.fabric.contract.annotation.Contract;
import org.hyperledger.fabric.contract.annotation.Default;
import org.hyperledger.fabric.contract.annotation.Info;
import org.hyperledger.fabric.contract.annotation.License;
import org.hyperledger.fabric.contract.annotation.Transaction;
import org.hyperledger.fabric.shim.ChaincodeStub;
import org.json.JSONArray;
import org.json.JSONObject;

@Contract(name = "org.medicalrecord", info = @Info(title = "Medical Record Contract", description = "", version = "0.0.1", license = @License(name = "SPDX-License-Identifier: Apache-2.0", url = ""), contact = @Contact(email = "tylerhlin@gmail.com", name = "medical-record-blockchain", url = "https://github.com/tytot/medical-record-blockchain/tree/master/contract")))
@Default
public class MedicalRecordContract implements ContractInterface {

    @Override
    public Context createContext(ChaincodeStub stub) {
        return new MedicalRecordContext(stub);
    }

    /**
     * Creates a medical record.
     *
     * @param ctx       the transaction context
     * @param id        the ID of the record
     * @param lastName  the record holder's last name
     * @param firstName the record holder's first name
     * @return the created record
     */
    @Transaction(intent = Transaction.TYPE.SUBMIT)
    public MedicalRecord createRecord(MedicalRecordContext ctx, String id, String lastName, String firstName) {
        if (recordExists(ctx, id)) {
            throw new RuntimeException("Record " + id + " already exists.");
        }
        MedicalRecord record = new MedicalRecord(id, lastName, firstName);
        System.out.println("Successfully created record:");
        System.out.println(new String(MedicalRecord.serialize(record), UTF_8));
        ctx.recordList.addRecord(record);

        return record;
    }

    /**
     * Updates a medical record.
     *
     * @param ctx  the transaction context
     * @param data the record to update in stringified JSON
     * @return the updated record
     */
    @Transaction(intent = Transaction.TYPE.SUBMIT)
    public MedicalRecord updateRecord(MedicalRecordContext ctx, String data) {
        MedicalRecord record = MedicalRecord.deserialize(data.getBytes(UTF_8));
        if (!recordExists(ctx, record.getID())) {
            throw new RuntimeException("Record " + record.getID() + " does not exist.");
        }
        ctx.recordList.updateRecord(record);
        System.out.println("Successfully updated record:");
        System.out.println(new String(MedicalRecord.serialize(record), UTF_8));

        return record;
    }

    /**
     * Retrieves a record from the ledger by ID.
     *
     * @param ctx the transaction context
     * @param id  the ID of the record
     * @return the record found on the ledger if there was one
     */
    @Transaction(intent = Transaction.TYPE.EVALUATE)
    public MedicalRecord readRecord(MedicalRecordContext ctx, String id) {
        MedicalRecord[] results = ctx.recordList.queryRecords(id);
        if (results.length == 0) {
            throw new RuntimeException("Record " + id + " does not exist.");
        }
        return results[0];
    }

    /**
     * Deletes a medical record.
     *
     * @param ctx       the transaction context
     * @param id        the ID of the record
     */
    @Transaction(intent = Transaction.TYPE.SUBMIT)
    public void deleteRecord(MedicalRecordContext ctx, String id) {
        MedicalRecord[] results = ctx.recordList.queryRecords(id);
        if (results.length == 0) {
            throw new RuntimeException("Record " + id + " does not exist.");
        }
        ctx.recordList.deleteRecord(results[0].getKey());
    }

    /**
     * Searches for records based on name and ID.
     *
     * @param ctx       the transaction context
     * @param id        the ID of the record
     * @param lastName  the record holder's last name
     * @param firstName the record holder's first name
     * @return an array of found records
     */
    @Transaction(intent = Transaction.TYPE.EVALUATE)
    public String searchRecords(MedicalRecordContext ctx, String id, String lastName, String firstName) {
        MedicalRecord[] results;
        if (id.length() > 0) {
            results = ctx.recordList.queryRecords(id);
        } else {
            results = ctx.recordList.queryRecords();
        }
        System.out.println(results.length + " results found before filtering.");
        JSONArray resultsArray = new JSONArray();
        for (MedicalRecord result : results) {
            JSONObject resultObj = new JSONObject(new String(MedicalRecord.serialize(result), UTF_8));
            boolean matchesLastName = lastName.length() == 0 || lastName.equals(resultObj.getString("lastName"));
            boolean matchesFirstName = firstName.length() == 0 || firstName.equals(resultObj.getString("firstName"));
            boolean matchesID = id.length() == 0 || id.equals(resultObj.getString("ID"));
            if (matchesLastName && matchesFirstName && matchesID) {
                resultsArray.put(resultObj);
            }
        }
        System.out.println(resultsArray.length() + " results found after filtering:");
        String output = resultsArray.toString();
        System.out.println(output);
        return output;
    }

    /**
     * Checks the existence of a record on the ledger
     *
     * @param ctx the transaction context
     * @param id  the ID of the record
     * @return boolean indicating the existence of the record
     */
    @Transaction(intent = Transaction.TYPE.EVALUATE)
    public boolean recordExists(MedicalRecordContext ctx, String id) {
        return ctx.recordList.queryRecords(id).length > 0;
    }
}