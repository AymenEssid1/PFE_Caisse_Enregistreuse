package com.PFE.order.services.service;

import com.PFE.order.entities.Item;

import java.util.List;

public interface ItemService {

    Item createItem(Item item);

    Item getItemById(Integer id);
    Item updateItem(Integer id, Item item);
    void deleteItem(Integer id);
    List<Item> getAllItems();
    void deleteAllItems();

    void deleteItemsByIds(List<Integer> itemIds);




}
