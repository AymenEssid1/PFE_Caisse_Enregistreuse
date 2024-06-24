package com.PFE.order.services.implementation;

import com.PFE.order.entities.Issue;
import com.PFE.order.repos.ItemRepository;
import com.PFE.order.repos.OrderRepository;
import com.PFE.order.repos.SessionRepository;
import com.PFE.order.services.service.StatisticsService;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.awt.print.Pageable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Slf4j
@Service
public class StatisticsServiceImp implements StatisticsService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private ItemRepository itemRepository;

/*
    @Override
    public List<Integer> getTop5MostOrderedComboIds() {
        List<Integer> comboIds = itemRepository.findTop5MostOrderedCombos();
        return comboIds.size() > 5 ? comboIds.subList(0, 5) : comboIds;
    }

    @Override
    public List<Integer> getTop5MostOrderedSoldProductIds() {
        List<Integer> soldProductIds = itemRepository.findTop5MostOrderedSoldProducts();
        return soldProductIds.size() > 5 ? soldProductIds.subList(0, 5) : soldProductIds;
    }



    @Override
    public List<Integer> getWorst5MostOrderedComboIds() {
        List<Integer> comboIds = itemRepository.findWorst5MostOrderedCombos();
        return comboIds.size() > 5 ? comboIds.subList(0, 5) : comboIds;
    }

    @Override
    public List<Integer> getWorst5MostOrderedSoldProductIds() {
        List<Integer> soldProductIds = itemRepository.findWorst5MostOrderedSoldProducts();
        return soldProductIds.size() > 5 ? soldProductIds.subList(0, 5) : soldProductIds;
    }*/




    @Override
    public List<Object[]> getTop5MostOrderedComboIds(int year, int month, int establishmentId) {
        List<Object[]> results = itemRepository.findTop5MostOrderedCombos(year, month, establishmentId);
        return results.size() > 5 ? results.subList(0, 5) : results;
    }

    @Override
    public List<Object[]> getTop5MostOrderedSoldProductIds(int year, int month, int establishmentId) {
        List<Object[]> results = itemRepository.findTop5MostOrderedSoldProducts(year, month, establishmentId);
        return results.size() > 5 ? results.subList(0, 5) : results;
    }

    @Override
    public List<Object[]> getWorst5MostOrderedComboIds(int year, int month, int establishmentId) {
        List<Object[]> results = itemRepository.findWorst5MostOrderedCombos(year, month, establishmentId);
        return results.size() > 5 ? results.subList(0, 5) : results;
    }

    @Override
    public List<Object[]> getWorst5MostOrderedSoldProductIds(int year, int month, int establishmentId) {
        List<Object[]> results = itemRepository.findWorst5MostOrderedSoldProducts(year, month, establishmentId);
        return results.size() > 5 ? results.subList(0, 5) : results;
    }




    public List<Object[]> getOrdersSumByEstablishment(int year) {
        return orderRepository.getOrdersSumByEstablishment(year);
    }


   /* public float getTotalOrderAmountForDate(LocalDate date) {
        return orderRepository.getTotalOrderAmountForDate(date);
    }

    public float getTotalOrderAmountForMonthYear(int month, int year) {
        return orderRepository.getTotalOrderAmountForMonthYear(month, year);
    }

    public float getTotalOrderAmountForYear(int year) {
        return orderRepository.getTotalOrderAmountForYear(year);
    }*/
   @Override
   public float getTotalOrderAmountForDateRange(LocalDateTime start, LocalDateTime end) {
       Float result = orderRepository.sumTotalPriceByCreatedAtBetween(start, end);
       return result != null ? result : 0.0f;
   }

    @Override
    public float getTotalOrderAmountForMonthYear(int month, int year) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDateTime startOfMonth = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime endOfMonth = yearMonth.atEndOfMonth().atTime(23, 59, 59);
        return getTotalOrderAmountForDateRange(startOfMonth, endOfMonth);
    }

    @Override
    public float getTotalOrderAmountForYear(int year) {
        Year yearObj = Year.of(year);
        LocalDateTime startOfYear = yearObj.atDay(1).atStartOfDay();
        LocalDateTime endOfYear = yearObj.atDay(yearObj.length()).atTime(23, 59, 59);
        return getTotalOrderAmountForDateRange(startOfYear, endOfYear);
    }


    @Override
    public float getTotalOrderAmountForDateRange(LocalDateTime start, LocalDateTime end, Integer establishmentId) {
        Float result = orderRepository.sumTotalPriceByCreatedAtBetweenAndEstablishmentId(start, end, establishmentId);
        return result != null ? result : 0.0f;
    }

    @Override
    public float getTotalOrderAmountForMonthYear(int month, int year, Integer establishmentId) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDateTime startOfMonth = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime endOfMonth = yearMonth.atEndOfMonth().atTime(23, 59, 59);
        return getTotalOrderAmountForDateRange(startOfMonth, endOfMonth, establishmentId);
    }

    @Override
    public float getTotalOrderAmountForYear(int year, Integer establishmentId) {
        Year yearObj = Year.of(year);
        LocalDateTime startOfYear = yearObj.atDay(1).atStartOfDay();
        LocalDateTime endOfYear = yearObj.atDay(yearObj.length()).atTime(23, 59, 59);
        return getTotalOrderAmountForDateRange(startOfYear, endOfYear, establishmentId);
    }


    @Override
    public List<Object[]> getCashiersWithMinusSessions(Integer establishmentId, int year, int month) {
        return sessionRepository.getCashiersWithMinusSessions(establishmentId, year, month, Issue.MINUS);
    }




}
