@echo off
chcp 65001 > nul
title LabRepair - Backend Spring Boot
echo ========================================================
echo   HE THONG LABREPAIR - KHOI DONG BACKEND SPRING BOOT
echo   Sinh vien: Le Nguyen Ngoc Duy Anh - MSSV: 2124110340
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/2] Kiem tra file JAR dong goi...
if exist "target\labrepair-0.0.1-SNAPSHOT.jar" (
    echo Da tim thay file JAR san sang! Dang khoi chay tren cong 8080...
    echo (Luu y: Hay dam bao ban da bat Start MySQL trong XAMPP/Laragon)
    echo.
    java -jar target\labrepair-0.0.1-SNAPSHOT.jar
) else (
    echo Dang khoi dong bang Maven Wrapper...
    call .\mvnw.cmd spring-boot:run
)

pause
