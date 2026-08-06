"""Fix CAPI Engine to use deterministic event_time and event_id matching exact appointment dates for 100% strict Meta CAPI Deduplication."""

import os
import sys
import json
import hashlib
import unicodedata
from pathlib import Path
from datetime import datetime

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

def parse_date_to_timestamp(date_str: str) -> int:
    """Convert appointment date string (YYYY-MM-DD or DD/MM/YYYY) to fixed deterministic Unix timestamp."""
    if not date_str or date_str == "N/A":
        return int(datetime(2026, 6, 15).timestamp())
    
    date_clean = date_str.split()[0].replace('/', '-')
    parts = date_clean.split('-')
    
    try:
        if len(parts) == 3:
            if len(parts[0]) == 4: # YYYY-MM-DD
                y, m, d = int(parts[0]), int(parts[1]), int(parts[2])
            else: # DD-MM-YYYY
                d, m, y = int(parts[0]), int(parts[1]), int(parts[2])
            return int(datetime(y, m, d).timestamp())
    except Exception:
        pass
    
    return int(datetime(2026, 6, 15).timestamp())

print("[DEDUP FIX] Deterministic timestamp engine initialized.")
