# Tiny local web server for Oil Wheel.
# Browsers only offer "Install" for pages served from a web address, not a double-clicked file.
# Run:   powershell -ExecutionPolicy Bypass -File serve.ps1
# Then open http://localhost:8766 in Chrome or Edge and click INSTALL AS APP.
param([int]$Port = 8766)
$root = $PSScriptRoot
$types = @{ '.html'='text/html; charset=utf-8'; '.js'='text/javascript'; '.webmanifest'='application/manifest+json';
            '.png'='image/png'; '.svg'='image/svg+xml'; '.json'='application/json'; '.md'='text/plain; charset=utf-8' }
$l = New-Object System.Net.HttpListener
$l.Prefixes.Add("http://localhost:$Port/")
$l.Start()
Write-Host "Oil Wheel running at http://localhost:$Port  (Ctrl+C to stop)"
while ($l.IsListening) {
  $ctx = $l.GetContext()
  $path = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath.TrimStart('/'))
  if ($path -eq '') { $path = 'index.html' }
  $file = [IO.Path]::GetFullPath((Join-Path $root $path))
  $res = $ctx.Response
  if ($file.StartsWith($root) -and (Test-Path $file -PathType Leaf)) {
    $bytes = [IO.File]::ReadAllBytes($file)
    $ext = [IO.Path]::GetExtension($file).ToLower()
    $res.ContentType = if ($types[$ext]) { $types[$ext] } else { 'application/octet-stream' }
    $res.Headers.Add('Cache-Control', 'no-cache')
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
  } else { $res.StatusCode = 404 }
  $res.Close()
}

