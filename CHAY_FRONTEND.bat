@echo off
chcp 65001 > nul
title LabRepair - Frontend Web UI
echo ========================================================
echo   HE THONG LABREPAIR - KHOI DONG FRONTEND WEB REACT
echo   Sinh vien: Le Nguyen Ngoc Duy Anh - MSSV: 2124110340
echo ========================================================
echo.

cd /d "%~dp0frontend"

echo Dang khoi chay Vite Dev Server tai http://localhost:5173 ...
echo.
npm run dev

pause
