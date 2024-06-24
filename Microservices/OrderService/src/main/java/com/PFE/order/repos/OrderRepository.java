package com.PFE.order.repos;

import com.PFE.order.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {

    @Query("SELECT o FROM Order o WHERE o.session.id = :sessionId AND o.paymentStatus = false AND o.tableId <> 0")
    List<Order> findPaidOrdersBySessionId(@Param("sessionId") Integer sessionId);





    @Query("SELECT o.session.establishmentId, " +
            "SUM(CASE WHEN MONTH(o.createdAt) BETWEEN 1 AND 3 THEN o.totalPrice ELSE 0 END) AS q1, " +
            "SUM(CASE WHEN MONTH(o.createdAt) BETWEEN 4 AND 6 THEN o.totalPrice ELSE 0 END) AS q2, " +
            "SUM(CASE WHEN MONTH(o.createdAt) BETWEEN 7 AND 9 THEN o.totalPrice ELSE 0 END) AS q3, " +
            "SUM(CASE WHEN MONTH(o.createdAt) BETWEEN 10 AND 12 THEN o.totalPrice ELSE 0 END) AS q4 " +
            "FROM Order o " +
            "WHERE YEAR(o.createdAt) = :year AND o.paymentStatus = true " +
            "GROUP BY o.session.establishmentId")
    List<Object[]> getOrdersSumByEstablishment(@Param("year") int year);





    @Query("SELECT SUM(o.totalPrice) FROM Order o WHERE o.createdAt BETWEEN :start AND :end AND o.paymentStatus = true")
    Float sumTotalPriceByCreatedAtBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);


    @Query("SELECT SUM(o.totalPrice) FROM Order o WHERE o.createdAt BETWEEN :start AND :end AND o.session.establishmentId = :establishmentId AND o.paymentStatus = true")
    Float sumTotalPriceByCreatedAtBetweenAndEstablishmentId(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end, @Param("establishmentId") Integer establishmentId);

 /* @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Order o WHERE DATE(o.createdAt) = :date")
    float getTotalOrderAmountForDate(@Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Order o WHERE MONTH(o.createdAt) = :month AND YEAR(o.createdAt) = :year")
    float getTotalOrderAmountForMonthYear(@Param("month") int month, @Param("year") int year);

    @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Order o WHERE YEAR(o.createdAt) = :year")
    float getTotalOrderAmountForYear(@Param("year") int year);*/

}
