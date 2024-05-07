package com.PFE.order.repos;

import com.PFE.order.entities.Item;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item,Integer> {

    void deleteAllByIdIn(List<Integer> itemIds);

}
