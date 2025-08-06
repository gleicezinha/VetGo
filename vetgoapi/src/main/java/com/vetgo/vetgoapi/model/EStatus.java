package com.vetgo.vetgoapi.model;

public enum EStatus {
    CANCELADO,
    SOLICITADO,
    AGENDADO,
    CONFIRMADO,
    CHEGADA,
    ATENDIMENTO,
    ENCERRADO;

    public EStatus proximo() {
        EStatus status = this;
        int index = ordinal();
        if (index > 0) {
            index = index + 1;
            if (index < values().length) {
                status = values()[index];
            }
        }
        return status;
    }
}