package com.PFE.order.services.implementation.pdf;

import com.PFE.order.entities.Issue;
import com.PFE.order.entities.Item;
import com.PFE.order.entities.Order;
import com.PFE.order.entities.Session;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PdfService {



    @Transactional
    public byte[] generateSessionsPdf(List<Session> sessions) {
        Document document = new Document();
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, byteArrayOutputStream);
            document.open();

            // French Titles
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.BLACK);
            Font subTitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, BaseColor.BLACK);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12, BaseColor.BLACK);

            // Big Title for Daily Report
            Paragraph bigTitle = new Paragraph("Rapport quotidien des sessions", titleFont);
            bigTitle.setAlignment(Element.ALIGN_CENTER);
            document.add(bigTitle);

            document.add(Chunk.NEWLINE);

            // Map to aggregate item quantities
            Map<String, Integer> itemQuantities = new HashMap<>();
            double totalOrderPrice = 0.0;

            for (int i = 0; i < sessions.size(); i++) {
                Session session = sessions.get(i);

                // Session Details
                Paragraph sessionTitle = new Paragraph("Session ID: " + session.getId(), subTitleFont);
                document.add(sessionTitle);

                document.add(new Paragraph("Nom du caissier: " + session.getCashierUsername(), normalFont));
                document.add(new Paragraph("ID de l'établissement: " + session.getEstablishmentId(), normalFont));
                document.add(new Paragraph("Heure de début: " + session.getStartTime(), normalFont));
                document.add(new Paragraph("Heure de fermeture: " + session.getCloseTime(), normalFont));
                if(session.getIssue()!= Issue.NOISSUE){
                    if(session.getIssue()== Issue.MINUS){
                        document.add(new Paragraph("Problème: monnaie perdue "  ,normalFont));

                    }


                }

                document.add(new Paragraph("Argent de départ: " + session.getStartMoney()+"Dinars", normalFont));
                document.add(new Paragraph("Argent attendu: " + session.getExpectedMoney()+"Dinars", normalFont));
                document.add(new Paragraph("Argent réel: " + session.getActualMoney()+"Dinars", normalFont));

                document.add(Chunk.NEWLINE);

                // Table for Orders
                PdfPTable table = new PdfPTable(3);
                table.setWidthPercentage(100);
                table.setSpacingBefore(10f);
                table.setSpacingAfter(10f);

                // Set column widths
                float[] columnWidths = {20f, 20f, 60f};
                table.setWidths(columnWidths);

                PdfPCell orderIdCell = new PdfPCell(new Paragraph("ID de commande", normalFont));
                PdfPCell totalCell = new PdfPCell(new Paragraph("Total", normalFont));
                PdfPCell itemsCell = new PdfPCell(new Paragraph("Articles", normalFont));
                table.addCell(orderIdCell);
                table.addCell(totalCell);
                table.addCell(itemsCell);

                for (Order order : session.getOrders()) {
                    if(order.isPaymentStatus()==true){
                        PdfPCell orderIdData = new PdfPCell(new Paragraph(String.valueOf(order.getId()), normalFont));
                        PdfPCell totalData = new PdfPCell(new Paragraph(String.valueOf(order.getTotalPrice()), normalFont));
                        PdfPCell itemsData = new PdfPCell();

                        // Build bullet points for items
                        StringBuilder itemsDetails = new StringBuilder();
                        for (Item item : order.getItems()) {
                            itemsDetails.append("\u2022 ").append(item.getName()).append(" (Quantité: ").append(item.getQuantity()).append(", Prix: ").append(item.getPrice()).append(")\n");

                            // Aggregate item quantities
                            itemQuantities.put(item.getName(), itemQuantities.getOrDefault(item.getName(), 0) + item.getQuantity());
                        }
                        itemsData.addElement(new Phrase(itemsDetails.toString(), normalFont));

                        table.addCell(orderIdData);
                        table.addCell(totalData);
                        table.addCell(itemsData);

                        // Aggregate total order price
                        totalOrderPrice += order.getTotalPrice();
                    }

                }

                document.add(table);

                // Check if there is another session and there's enough room on the current page

                    document.newPage();

            }

            // Add summary of all items sold
            document.add(Chunk.NEWLINE);
            Paragraph summaryTitle = new Paragraph("Résumé des articles vendus", titleFont);
            summaryTitle.setAlignment(Element.ALIGN_CENTER);
            document.add(summaryTitle);
            document.add(Chunk.NEWLINE);

            for (Map.Entry<String, Integer> entry : itemQuantities.entrySet()) {
                String itemName = entry.getKey();
                int quantity = entry.getValue();
                Paragraph itemSummary = new Paragraph(itemName + ": " + quantity, normalFont);
                document.add(itemSummary);
            }

            document.add(Chunk.NEWLINE);
            Paragraph totalSummary = new Paragraph("Total des commandes: " + totalOrderPrice +"DT ", titleFont);
            totalSummary.setAlignment(Element.ALIGN_CENTER);
            document.add(totalSummary);

            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }

        return byteArrayOutputStream.toByteArray();
    }
}

