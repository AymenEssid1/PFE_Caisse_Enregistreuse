package com.PFE.order.entities;


import lombok.Data;

@Data
public class PercentageChangeResponse {
    private float todayYesterdayPercentage;
    private float todayTotal;
    private float yesterdayTotal;
    private float monthLastMonthPercentage;
    private float monthTotal;
    private float lastMonthTotal;
    private float yearLastYearPercentage;
    private float yearTotal;
    private float lastYearTotal;

    // Constructor, getters, and setters
    public PercentageChangeResponse(float todayYesterdayPercentage, float todayTotal, float yesterdayTotal,
                                    float monthLastMonthPercentage, float monthTotal, float lastMonthTotal,
                                    float yearLastYearPercentage, float yearTotal, float lastYearTotal) {
        this.todayYesterdayPercentage = todayYesterdayPercentage;
        this.todayTotal = todayTotal;
        this.yesterdayTotal = yesterdayTotal;
        this.monthLastMonthPercentage = monthLastMonthPercentage;
        this.monthTotal = monthTotal;
        this.lastMonthTotal = lastMonthTotal;
        this.yearLastYearPercentage = yearLastYearPercentage;
        this.yearTotal = yearTotal;
        this.lastYearTotal = lastYearTotal;
    }

    // Getters and setters omitted for brevity
}



