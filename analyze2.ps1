$folders = @('ms','nanoid','picocolors','react','react-refresh','semver','source-map-js','tiny-invariant','update-browserslist-db','vite','yallist')
Write-Host "=== ROOT LOOSE FOLDERS vs NODE_MODULES ==="
foreach ($f in $folders) {
    $existsInNM = Test-Path "node_modules/$f"
    Write-Host "  $f -> also exists in node_modules: $existsInNM"
}
Write-Host ""
Write-Host "=== ASSETS FOLDER ==="
Get-ChildItem assets -Recurse -File | ForEach-Object { Write-Host "  $($_.Name): $([math]::Round($_.Length/1024,1)) KB" }
