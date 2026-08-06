# Claude Ads Audit Report

> Run completeness: **Complete** · Evidence status: **Normal**

## Run summary

- Run ID: meta\-audit\-20260728\-160627
- Started: 2026\-07\-28T16:06:27\.649391Z
- Platform: Meta
- Account: Meta Business Account
- Window: 2026\-07\-25 to 2026\-07\-28
- Privacy class: Public

## Decision status

- Run completeness: **Complete**
- Evidence status: **Normal**
- Health score: **88.50 / 100**
- Evidence coverage: **92.00%**

## Category health

- **Uncategorized:** Not scored; evidence 0.00%
- **Uncategorized:** Not scored; evidence 0.00%
- **Uncategorized:** Not scored; evidence 0.00%
- **Uncategorized:** Not scored; evidence 0.00%

## Findings

### [PASS] M01\-PIXEL — Measurement

- Severity: Critical
- Confidence: High
- Source classification: Evidence Based

**Observation:** Meta Pixel Purchase events detected with 82 total conversions across the active window\.

**Diagnosis:** Conversion tracking is active and receiving conversion signals\.

**Recommended action:** Verify CAPI server\-side deduplication \(event\_id\) to prevent duplicate pixel counts\.

**Evidence:**

1.

        {"field":"total_conversions","value":"82.0 Purchases"}

### [PASS] M11\-FRAGMENTATION — Account\_Structure

- Severity: High
- Confidence: High
- Source classification: Evidence Based

**Observation:** Account structure is consolidated into 2 main campaigns \(Advantage\+ Sales & Retargeting\)\.

**Diagnosis:** Low fragmentation allows Meta Advantage\+ auction algorithms to exit the learning phase efficiently\.

**Recommended action:** Maintain strict campaign consolidation and avoid splitting budgets into unnecessary micro\-campaigns\.

**Evidence:**

1.

        {"field":"campaign_count","value":"2 active campaigns"}

### [PASS] M25\-CREATIVE\-DIVERSITY — Creative

- Severity: High
- Confidence: High
- Source classification: Evidence Based

**Observation:** Creative assets cover multiple formats: Feed Video Hook V1, Carousel Product Features, and Social Proof Testimonials\.

**Diagnosis:** Good format diversity reduces creative fatigue and expands placement coverage across Feed, Stories, and Reels\.

**Recommended action:** Test new UGC \(User\-Generated Content\) video hooks weekly to keep creative fatigue low\.

**Evidence:**

1.

        {"field":"creative_count","value":"3 distinct ad formats (Feed Video, Carousel, Social Proof)"}

### [UNKNOWN] M39\-UTM\-TRACKING — Tracking

- Severity: Medium
- Confidence: Medium
- Source classification: Evidence Based

**Observation:** Export data does not include exact landing page destination URL UTM tags\.

**Diagnosis:** GA4 / third\-party attribution alignment cannot be cross\-referenced from CSV export alone\.

**Recommended action:** Ensure all Meta ad\-level URLs use standardized UTM tags \(utm\_source=facebook&utm\_medium=cpc&utm\_campaign=\{\{campaign\.name\}\}\)\.

**Evidence:**

1.

        {"field":"url_parameters","value":"not_in_export"}

## Contradictions

No contradictions were reported.

## Prioritized actions

1. Ensure all Meta ad\-level URLs use standardized UTM tags \(utm\_source=facebook&utm\_medium=cpc&utm\_campaign=\{\{campaign\.name\}\}\)\. \(Confidence: medium; Control Id: M39\-UTM\-TRACKING\)

---

Generated deterministically from ReportBundle JSON. Scores were not recalculated.
