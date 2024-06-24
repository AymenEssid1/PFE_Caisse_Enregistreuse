package com.PFE.order.repos;

import com.PFE.order.entities.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.awt.print.Pageable;
import java.util.List;

public interface ItemRepository extends JpaRepository<Item,Integer> {

    void deleteAllByIdIn(List<Integer> itemIds);



   /* @Query("SELECT i.comboId FROM Item i JOIN i.order o WHERE i.comboId IS NOT NULL AND o.paymentStatus = true GROUP BY i.comboId ORDER BY SUM(i.quantity) DESC")
    List<Integer> findTop5MostOrderedCombos();

    @Query("SELECT i.soldProductId FROM Item i JOIN i.order o WHERE i.soldProductId IS NOT NULL AND o.paymentStatus = true GROUP BY i.soldProductId ORDER BY SUM(i.quantity) DESC")
    List<Integer> findTop5MostOrderedSoldProducts();



    @Query("SELECT i.comboId FROM Item i JOIN i.order o WHERE i.comboId IS NOT NULL AND o.paymentStatus = true GROUP BY i.comboId ORDER BY SUM(i.quantity) ASC")
    List<Integer> findWorst5MostOrderedCombos();

    @Query("SELECT i.soldProductId FROM Item i JOIN i.order o WHERE i.soldProductId IS NOT NULL AND o.paymentStatus = true GROUP BY i.soldProductId ORDER BY SUM(i.quantity) ASC")
    List<Integer> findWorst5MostOrderedSoldProducts();*/


    @Query("SELECT i.comboId, SUM(i.quantity) FROM Item i JOIN i.order o WHERE i.comboId IS NOT NULL AND o.paymentStatus = true " +
            "AND (o.session.establishmentId = :establishmentId OR :establishmentId = -1) " +
            "AND YEAR(o.createdAt) = :year " +
            "AND (:month = -1 OR MONTH(o.createdAt) = :month) " +
            "GROUP BY i.comboId ORDER BY SUM(i.quantity) DESC")
    List<Object[]> findTop5MostOrderedCombos(@Param("year") int year, @Param("month") int month, @Param("establishmentId") int establishmentId);

    @Query("SELECT i.soldProductId, SUM(i.quantity) FROM Item i JOIN i.order o WHERE i.soldProductId IS NOT NULL AND o.paymentStatus = true " +
            "AND (o.session.establishmentId = :establishmentId OR :establishmentId = -1) " +
            "AND YEAR(o.createdAt) = :year " +
            "AND (:month = -1 OR MONTH(o.createdAt) = :month) " +
            "GROUP BY i.soldProductId ORDER BY SUM(i.quantity) DESC")
    List<Object[]> findTop5MostOrderedSoldProducts(@Param("year") int year, @Param("month") int month, @Param("establishmentId") int establishmentId);

    @Query("SELECT i.comboId, SUM(i.quantity) FROM Item i JOIN i.order o WHERE i.comboId IS NOT NULL AND o.paymentStatus = true " +
            "AND (o.session.establishmentId = :establishmentId OR :establishmentId = -1) " +
            "AND YEAR(o.createdAt) = :year " +
            "AND (:month = -1 OR MONTH(o.createdAt) = :month) " +
            "GROUP BY i.comboId ORDER BY SUM(i.quantity) ASC")
    List<Object[]> findWorst5MostOrderedCombos(@Param("year") int year, @Param("month") int month, @Param("establishmentId") int establishmentId);

    @Query("SELECT i.soldProductId, SUM(i.quantity) FROM Item i JOIN i.order o WHERE i.soldProductId IS NOT NULL AND o.paymentStatus = true " +
            "AND (o.session.establishmentId = :establishmentId OR :establishmentId = -1) " +
            "AND YEAR(o.createdAt) = :year " +
            "AND (:month = -1 OR MONTH(o.createdAt) = :month) " +
            "GROUP BY i.soldProductId ORDER BY SUM(i.quantity) ASC")
    List<Object[]> findWorst5MostOrderedSoldProducts(@Param("year") int year, @Param("month") int month, @Param("establishmentId") int establishmentId);

}
