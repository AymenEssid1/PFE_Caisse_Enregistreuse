package com.PFE.order.controllers;



import com.PFE.order.entities.PercentageChangeResponse;
import com.PFE.order.services.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/stats")
public class StatsController {

    @Autowired
    private StatisticsService statisticsService;


    /*@GetMapping("/top5-combos")
    public ResponseEntity<List<Integer>> getTop5MostOrderedCombos() {
        List<Integer> comboIds = statisticsService.getTop5MostOrderedComboIds();
        return ResponseEntity.ok(comboIds);
    }

    @GetMapping("/top5-sold-products")
    public ResponseEntity<List<Integer>> getTop5MostOrderedSoldProducts() {
        List<Integer> soldProductIds = statisticsService.getTop5MostOrderedSoldProductIds();
        return ResponseEntity.ok(soldProductIds);
    }*/

    @GetMapping("/top5-combos")
    public ResponseEntity<List<Object[]>> getTop5Combos(@RequestParam("year") int year, @RequestParam("month") int month, @RequestParam("establishmentId") int establishmentId) {
        List<Object[]> top5Combos = statisticsService.getTop5MostOrderedComboIds(year, month, establishmentId);
        return new ResponseEntity<>(top5Combos, HttpStatus.OK);
    }

    @GetMapping("/top5-sold-products")
    public ResponseEntity<List<Object[]>> getTop5SoldProducts(@RequestParam("year") int year, @RequestParam("month") int month, @RequestParam("establishmentId") int establishmentId) {
        List<Object[]> top5SoldProducts = statisticsService.getTop5MostOrderedSoldProductIds(year, month, establishmentId);
        return new ResponseEntity<>(top5SoldProducts, HttpStatus.OK);
    }

    @GetMapping("/worst5-combos")
    public ResponseEntity<List<Object[]>> getWorst5Combos(@RequestParam("year") int year, @RequestParam("month") int month, @RequestParam("establishmentId") int establishmentId) {
        List<Object[]> worst5Combos = statisticsService.getWorst5MostOrderedComboIds(year, month, establishmentId);
        return new ResponseEntity<>(worst5Combos, HttpStatus.OK);
    }

    @GetMapping("/worst5-sold-products")
    public ResponseEntity<List<Object[]>> getWorst5SoldProducts(@RequestParam("year") int year, @RequestParam("month") int month, @RequestParam("establishmentId") int establishmentId) {
        List<Object[]> worst5SoldProducts = statisticsService.getWorst5MostOrderedSoldProductIds(year, month, establishmentId);
        return new ResponseEntity<>(worst5SoldProducts, HttpStatus.OK);
    }




    @GetMapping("/sum/{year}")
    public List<Object[]> getOrdersSumByEstablishment(@PathVariable("year") int year) {
        return statisticsService.getOrdersSumByEstablishment(year);
    }


    @GetMapping("/percentage-change")
    public ResponseEntity<PercentageChangeResponse> getPercentageChange() {
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        LocalDateTime startOfToday = today.atStartOfDay();
        LocalDateTime endOfToday = today.atTime(23, 59, 59);
        LocalDateTime startOfYesterday = yesterday.atStartOfDay();
        LocalDateTime endOfYesterday = yesterday.atTime(23, 59, 59);

        float todayTotal = statisticsService.getTotalOrderAmountForDateRange(startOfToday, endOfToday);
        float yesterdayTotal = statisticsService.getTotalOrderAmountForDateRange(startOfYesterday, endOfYesterday);

        float monthTotal = statisticsService.getTotalOrderAmountForMonthYear(today.getMonthValue(), today.getYear());
        float lastMonthTotal = statisticsService.getTotalOrderAmountForMonthYear(today.minusMonths(1).getMonthValue(), today.minusMonths(1).getYear());
        float yearTotal = statisticsService.getTotalOrderAmountForYear(today.getYear());
        float lastYearTotal = statisticsService.getTotalOrderAmountForYear(today.minusYears(1).getYear());

        float todayYesterdayPercentage = calculatePercentageChange(todayTotal, yesterdayTotal);
        float monthLastMonthPercentage = calculatePercentageChange(monthTotal, lastMonthTotal);
        float yearLastYearPercentage = calculatePercentageChange(yearTotal, lastYearTotal);

        PercentageChangeResponse response = new PercentageChangeResponse(
                todayYesterdayPercentage, todayTotal, yesterdayTotal,
                monthLastMonthPercentage, monthTotal, lastMonthTotal,
                yearLastYearPercentage, yearTotal, lastYearTotal);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    private float calculatePercentageChange(float current, float previous) {
        if (previous == 0) {
            return current == 0 ? 0 : 100;
        }
        return ((current - previous) / previous) * 100;
    }




    @GetMapping("/percentage-change2")
    public ResponseEntity<PercentageChangeResponse> getPercentageChange(@RequestParam("establishmentId") Integer establishmentId) {
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        LocalDateTime startOfToday = today.atStartOfDay();
        LocalDateTime endOfToday = today.atTime(23, 59, 59);
        LocalDateTime startOfYesterday = yesterday.atStartOfDay();
        LocalDateTime endOfYesterday = yesterday.atTime(23, 59, 59);

        float todayTotal = statisticsService.getTotalOrderAmountForDateRange(startOfToday, endOfToday, establishmentId);
        float yesterdayTotal = statisticsService.getTotalOrderAmountForDateRange(startOfYesterday, endOfYesterday, establishmentId);

        float monthTotal = statisticsService.getTotalOrderAmountForMonthYear(today.getMonthValue(), today.getYear(), establishmentId);
        float lastMonthTotal = statisticsService.getTotalOrderAmountForMonthYear(today.minusMonths(1).getMonthValue(), today.minusMonths(1).getYear(), establishmentId);
        float yearTotal = statisticsService.getTotalOrderAmountForYear(today.getYear(), establishmentId);
        float lastYearTotal = statisticsService.getTotalOrderAmountForYear(today.minusYears(1).getYear(), establishmentId);

        float todayYesterdayPercentage = calculatePercentageChange(todayTotal, yesterdayTotal);
        float monthLastMonthPercentage = calculatePercentageChange(monthTotal, lastMonthTotal);
        float yearLastYearPercentage = calculatePercentageChange(yearTotal, lastYearTotal);

        PercentageChangeResponse response = new PercentageChangeResponse(
                todayYesterdayPercentage, todayTotal, yesterdayTotal,
                monthLastMonthPercentage, monthTotal, lastMonthTotal,
                yearLastYearPercentage, yearTotal, lastYearTotal);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }





    @GetMapping("/cashiers/minus")
    public ResponseEntity<List<Object[]>> getCashiersWithMinusSessions(
            @RequestParam("establishmentId") Integer establishmentId,
            @RequestParam("year") int year,
            @RequestParam("month") int month) {
        List<Object[]> cashiers = statisticsService.getCashiersWithMinusSessions(establishmentId, year, month);
        return ResponseEntity.ok(cashiers);
    }




}
