package org.medicalrecord.ledgerapi;

import java.util.List;

import org.medicalrecord.ledgerapi.impl.StateListImpl;
import org.hyperledger.fabric.contract.Context;

public interface StateList {

    static StateList getStateList(Context ctx, String listName, StateDeserializer deserializer) {
        return new StateListImpl(ctx, listName, deserializer);
    }

    public StateList addState(State state);

    public State getState(String key);

    public List<State> queryStates(String... attributes);

    public StateList updateState(State state);

    public StateList deleteState(String key);
}
