package com.PFE.order.services.service;



import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface StatisticsService {

    List<Object[]>getTop5MostOrderedComboIds(int year, int month, int establishmentId);
    List<Object[]> getTop5MostOrderedSoldProductIds(int year, int month, int establishmentId);

    List<Object[]> getWorst5MostOrderedComboIds(int year, int month, int establishmentId);
    List<Object[]> getWorst5MostOrderedSoldProductIds(int year, int month, int establishmentId);

    public List<Object[]> getOrdersSumByEstablishment(int year);


   /* public float getTotalOrderAmountForYear(int year);
    public float getTotalOrderAmountForMonthYear(int month, int year);
    public float getTotalOrderAmountForDate(LocalDate date);*/

    float getTotalOrderAmountForDateRange(LocalDateTime start, LocalDateTime end);
    public float getTotalOrderAmountForDateRange(LocalDateTime start, LocalDateTime end, Integer establishmentId);
    float getTotalOrderAmountForMonthYear(int month, int year);
    float getTotalOrderAmountForMonthYear(int month, int year, Integer establishmentId);
    float getTotalOrderAmountForYear(int year);
    float getTotalOrderAmountForYear(int year,Integer establishmentId);



    List<Object[]> getCashiersWithMinusSessions(Integer establishmentId, int year, int month);


}
