"""Inspect column headers, structure, and sample data of downloaded Google Lead CSV."""

import sys
import csv
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

def inspect_leads():
    csv_path = Path("data/google_leads.csv")
    if not csv_path.exists():
        print("[ERROR] data/google_leads.csv not found.")
        return

    with open(csv_path, "r", encoding="utf-8-sig", errors="ignore") as f:
        reader = list(csv.reader(f))

    print(f"Total Rows in Lead Sheet: {len(reader):,}")
    
    if reader:
        print("\nHeader Row (Columns):")
        for idx, col in enumerate(reader[0]):
            print(f"  Col {idx:2d}: {col}")

        print("\nTop 5 Sample Data Rows:")
        for r_idx, row in enumerate(reader[1:6], start=1):
            print(f"Row {r_idx}: {row[:10]}")

if __name__ == "__main__":
    inspect_leads()
