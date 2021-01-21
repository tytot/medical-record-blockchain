package org.medicalrecord.ledgerapi.impl;

import java.util.List;
import java.util.ArrayList;

import org.medicalrecord.ledgerapi.State;
import org.medicalrecord.ledgerapi.StateDeserializer;
import org.medicalrecord.ledgerapi.StateList;
import org.hyperledger.fabric.contract.Context;
import org.hyperledger.fabric.shim.ChaincodeStub;
import org.hyperledger.fabric.shim.ledger.CompositeKey;
import org.hyperledger.fabric.shim.ledger.KeyValue;
import org.hyperledger.fabric.shim.ledger.QueryResultsIterator;

public class StateListImpl implements StateList {

    private Context ctx;
    private String name;
    private StateDeserializer deserializer;

    public StateListImpl(Context ctx, String listName, StateDeserializer deserializer) {
        this.ctx = ctx;
        this.name = listName;
        this.deserializer = deserializer;
    }

    @Override
    public StateList addState(State state) {
        ChaincodeStub stub = this.ctx.getStub();
        String[] splitKey = state.getSplitKey();
        CompositeKey ledgerKey = stub.createCompositeKey(this.name, splitKey);
        byte[] data = State.serialize(state);
        this.ctx.getStub().putState(ledgerKey.toString(), data);

        return this;
    }

    @Override
    public State getState(String key) {
        CompositeKey ledgerKey = this.ctx.getStub().createCompositeKey(this.name, State.splitKey(key));
        byte[] data = this.ctx.getStub().getState(ledgerKey.toString());
        if (data != null && data.length > 0) {
            State state = this.deserializer.deserialize(data);
            return state;
        } else {
            return null;
        }
    }

    @Override
    public List<State> queryStates(String... attributes) {
        QueryResultsIterator<KeyValue> results = this.ctx.getStub().getStateByPartialCompositeKey(this.name, attributes);
        List<State> output = new ArrayList<State>();
        for (KeyValue result : results) {
            State state = this.deserializer.deserialize(result.getValue());
            output.add(state);
        }
        try {
            results.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return output;
    }

    @Override
    public StateList updateState(State state) {
        CompositeKey ledgerKey = this.ctx.getStub().createCompositeKey(this.name, state.getSplitKey());
        byte[] data = State.serialize(state);
        this.ctx.getStub().putState(ledgerKey.toString(), data);

        return this;
    }

    @Override
    public StateList deleteState(String key) {
        CompositeKey ledgerKey = this.ctx.getStub().createCompositeKey(this.name, State.splitKey(key));
        this.ctx.getStub().delState(ledgerKey.toString());
        return this;
    }
}
