$dirs = Get-ChildItem -Directory | Where-Object { $_.Name -ne 'node_modules' }
foreach ($d in $dirs) {
    $files = Get-ChildItem $d.FullName -Recurse -File -ErrorAction SilentlyContinue
    $size = ($files | Measure-Object -Property Length -Sum).Sum
    $count = $files.Count
    $sizeKB = [math]::Round($size / 1024, 1)
    Write-Host "$($d.Name): $sizeKB KB ($count files)"
}
Write-Host ""
Write-Host "--- node_modules ---"
$nmFiles = Get-ChildItem node_modules -Recurse -File -ErrorAction SilentlyContinue
$nmSize = ($nmFiles | Measure-Object -Property Length -Sum).Sum
$nmCount = $nmFiles.Count
Write-Host "node_modules: $([math]::Round($nmSize / 1024 / 1024, 1)) MB ($nmCount files)"
Write-Host ""
Write-Host "--- Root files ---"
Get-ChildItem -File | ForEach-Object { Write-Host "$($_.Name): $([math]::Round($_.Length / 1024, 1)) KB" }
