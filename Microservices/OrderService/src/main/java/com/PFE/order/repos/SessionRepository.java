package com.PFE.order.repos;

import com.PFE.order.entities.Issue;
import com.PFE.order.entities.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface SessionRepository extends JpaRepository<Session,Integer> {

    List<Session> findByEstablishmentId(Integer establishmentId);

    List<Session> findByCashierUsername(String establishmentId);




    @Query("SELECT s FROM Session s WHERE s.establishmentId = :establishmentId AND s.closeTime >= :todayStart AND s.closeTime < :tomorrowStart")
    List<Session> findClosedSessionsForEstablishmentToday(@Param("establishmentId") Integer establishmentId, @Param("todayStart") LocalDateTime todayStart, @Param("tomorrowStart") LocalDateTime tomorrowStart);

    @Query("SELECT s FROM Session s WHERE s.establishmentId = :establishmentId AND YEAR(s.closeTime) = :year AND MONTH(s.closeTime) = :month")
    List<Session> findClosedSessionsForEstablishmentThisMonth(@Param("establishmentId") Integer establishmentId, @Param("year") int year, @Param("month") int month);

    @Query("SELECT s FROM Session s WHERE s.establishmentId = :establishmentId AND YEAR(s.closeTime) = :year")
    List<Session> findClosedSessionsForEstablishmentThisYear(@Param("establishmentId") Integer establishmentId, @Param("year") int year);



    @Query("SELECT s.cashierUsername, COUNT(s) " +
            "FROM Session s " +
            "WHERE s.establishmentId = :establishmentId " +
            "AND (s.issue = :issue ) " +
            "AND YEAR(s.startTime) = :year " +
            "AND (:month = -1 OR MONTH(s.startTime) = :month) " +
            "GROUP BY s.cashierUsername")
    List<Object[]> getCashiersWithMinusSessions(@Param("establishmentId") Integer establishmentId,
                                                @Param("year") int year,
                                                @Param("month") int month,
                                                @Param("issue") Issue issue);
}
