package com.PFE.stock.entities.discount;

public enum DiscountType {
    FLAT("Flat Discount"),
    BUY_X_GET_Y("Buy X Get Y"),
    TIME_BOUND("Time-bound Discount");

    private final String displayName;

    DiscountType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}

