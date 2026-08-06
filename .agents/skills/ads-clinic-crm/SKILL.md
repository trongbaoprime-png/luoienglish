---
name: ads-clinic-crm
description: "Audit, build, and operate multi-channel messaging CRM automation (Pancake CRM, Meta Business Suite, WhatsApp, Instagram, Facebook Fanpage) integrated with Meta Conversions API (CAPI). Synchronize full customer funnel stages (Inbox, Booked Appointment, Converted Service, Lost/Dropped Leads) to Meta AI for dual-target optimization: Lookalike 1% expansion for converted patients and Custom Audience Retargeting for lost/dropped leads."
---

# Ads Clinic CRM & CAPI Funnel Automation

## Overview

The `ads-clinic-crm` skill connects multi-channel customer conversations (Meta Business Suite, Pancake CRM, WhatsApp, Instagram, Facebook Fanpage) with clinic service outcomes to drive closed-loop Meta advertising performance.

It automates the full customer lifecycle:
1. **Multi-Channel Inbox Tracking**: Captures and categorizes leads from Meta Business Suite, Pancake CRM, WhatsApp, and Instagram.
2. **Funnel Stage Segmentation**:
   - **`INBOX_NEW`**: Initial lead inquiry.
   - **`APPOINTMENT_BOOKED`** (`DATHEN`): Qualified appointment booked ➔ Pushes CAPI `Lead` event (Retargeting pool).
   - **`SHOWED_CONVERTED`**: Patient arrived and completed service ➔ Pushes CAPI `Purchase` event (Lookalike seed).
   - **`SHOWED_LOST`**: Patient arrived but did not convert ➔ Pushes CAPI `LostLead` event (High-intent Retargeting pool).
   - **`INBOX_GHOSTED`**: Lead stopped responding ➔ Pushes CAPI `GhostedLead` event (Nurturing Retargeting pool).
3. **Dual-Target Meta CAPI Optimization**:
   - **Converted Patients (`Purchase`)**: Builds high-LTV Lookalike Audiences (1% - 3%) to acquire new high-spending patients.
   - **Lost/Dropped Leads (`LostLead` / `GhostedLead` / `Lead`)**: Builds Custom Audiences for retargeting campaigns with targeted offer messages and appointment reminders.
4. **Performance & Attribution Analytics**: Reports cost per booked appointment, show-up rate, conversion rate, CAC, ROAS, and revenue across Facebook, Instagram, and WhatsApp.

---

## Operating Procedure

1. **Intake & Scope**:
   - Identify active messaging channels (Meta Business Suite, Pancake CRM, WhatsApp, Instagram).
   - Verify Meta Pixel ID and Conversions API Access Token.
   - Load customer dataset (Clinic EMR/CRM, Google Sheet `DATHEN`, Monthly Revenue Excel files).

2. **Data Cleansing & E.164 Normalization**:
   - Format Vietnamese phone numbers to international E.164 (`84...`).
   - Split full names into First Name (`fn`) and Last Name (`ln`).
   - Map clinic branch names to Meta city tokens (`ct`).
   - Generate deterministic `event_id` keys (`PURCHASE_84...` / `LEAD_DATHEN_84...`) for 100% strict deduplication.

3. **CAPI Dual-Target Payload Construction**:
   - Conform strictly to Meta Parameter Builder Library standards (EMQ Grade 9.5+).
   - Route `SHOWED_CONVERTED` records to event `Purchase` with transaction value and currency `VND`.
   - Route `APPOINTMENT_BOOKED` records to event `Lead` with `lead_type: "AppointmentBooked"`.
   - Route `SHOWED_LOST` records to event `Lead` / custom event with `lead_type: "ShowedLost"`.

4. **Execution & Batch Sync**:
   - Execute batch CAPI pushes (100 events per request) via Meta Graph API v20.0.
   - Verify `events_received` response and EMQ matching score.
   - Save completion ledger manifest to `.claude-ads/manifests/capi_completion_ledger.json`.

5. **Reporting & Dashboard Integration**:
   - Update executive HTML dashboards (`customer_roi_enterprise_v9.html` and `customer_analytics_dashboard.html`).
   - Report funnel conversion rates (Inbox ➔ Booked %, Booked ➔ Showed %, Showed ➔ Paid %).

---

## Boundaries & Governance

- All PII (Phone, Name, Email, Address) MUST be SHA-256 hashed before transmission to Meta Graph API.
- Do not transmit raw patient medical history or sensitive medical notes.
- Use fixed deterministic timestamps and `event_id` keys to prevent double-counting across multiple script runs.
- Require explicit approval before mutating active campaign budgets or targeting settings.
