@echo off
chcp 65001 > nul
echo =======================================================================
echo   ĐĂNG KÝ LỊCH CHẠY TỰ ĐỘNG HÀNG NGÀY - META CAPI GOOGLE SHEET SYNC
echo =======================================================================
echo.

schtasks /create /tn "ClaudeAds_Daily_CAPI_Sync" /tr "python d:\AI\ClaudeCode\scripts\daily_auto_sync_capi.py" /sc daily /st 06:00 /f

echo.
echo ✅ ĐÃ ĐĂNG KÝ THÀNH CÔNG LỊCH CHẠY TỰ ĐỘNG VÀO 06:00 HÀNG NGÀY TRÊN WINDOWS!
echo Hàng ngày vào 06:00 sáng, hệ thống sẽ tự động quét file Google Sheet DATHEN, 
echo phát hiện khách hàng hẹn mới và bắn CAPI trực tiếp lên Meta Pixel 902489598915870!
echo.
pause
