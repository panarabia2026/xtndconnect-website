param([string]$Scrape, [string]$Out)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System; using System.Drawing; using System.Drawing.Imaging; using System.Drawing.Drawing2D; using System.Runtime.InteropServices;
public static class Img {
  static ImageCodecInfo Jpeg() { foreach (var c in ImageCodecInfo.GetImageEncoders()) if (c.MimeType == "image/jpeg") return c; return null; }
  static bool Light(Color c) { return c.R > 228 && c.G > 228 && c.B > 228; }
  // Largest run of occupied lines (allowing small gaps), so stray border lines are dropped.
  static void MainRun(int[] n, int gap, out int a, out int b) {
    // Split occupied lines into runs; ignore thin runs (stray lines) that carry little ink.
    long total = 0; foreach (var v in n) total += v;
    var runs = new System.Collections.Generic.List<int[]>();
    int s = -1;
    for (int i = 0; i <= n.Length; i++) {
      bool on = i < n.Length && n[i] > 0;
      if (on && s < 0) s = i;
      if (!on && s >= 0) { runs.Add(new[]{ s, i - 1 }); s = -1; }
    }
    a = int.MaxValue; b = -1;
    int thin = Math.Max(4, n.Length / 60);
    foreach (var r in runs) {
      long sum = 0; for (int i = r[0]; i <= r[1]; i++) sum += n[i];
      if (r[1] - r[0] + 1 <= thin && sum < total * 0.06) continue;
      if (r[0] < a) a = r[0]; if (r[1] > b) b = r[1];
    }
    if (b < 0) { a = 0; b = n.Length - 1; }
  }
  // Returns "contain" or "cover" depending on how the image was framed.
  public static string Normalize(string src, string dst, int size) {
    using (var raw = Image.FromFile(src)) {
      int w = raw.Width, h = raw.Height;
      var bmp = new Bitmap(w, h, PixelFormat.Format32bppArgb);
      using (var g = Graphics.FromImage(bmp)) { g.Clear(Color.White); g.DrawImage(raw, 0, 0, w, h); }
      var d = bmp.LockBits(new Rectangle(0,0,w,h), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
      var px = new byte[d.Stride * h]; Marshal.Copy(d.Scan0, px, 0, px.Length); bmp.UnlockBits(d);
      Func<int,int,Color> at = (x,y) => { int i = y*d.Stride + x*4; return Color.FromArgb(px[i+2], px[i+1], px[i]); };
      int lightCorners = 0;
      foreach (var p in new[]{ at(2,2), at(w-3,2), at(2,h-3), at(w-3,h-3) }) if (Light(p)) lightCorners++;
      Rectangle box;
      string mode;
      if (lightCorners >= 3) {
        var colN = new int[w]; var rowN = new int[h];
        for (int y = 0; y < h; y++) for (int x = 0; x < w; x++) {
          int i = y*d.Stride + x*4;
          if (px[i] < 232 || px[i+1] < 232 || px[i+2] < 232) { colN[x]++; rowN[y]++; }
        }
        int x0, x1, y0, y1;
        MainRun(colN, Math.Max(4, w/30), out x0, out x1);
        MainRun(rowN, Math.Max(4, h/30), out y0, out y1);
        if (x1 < x0 || y1 < y0) { x0 = 0; y0 = 0; x1 = w-1; y1 = h-1; }
        box = Rectangle.FromLTRB(x0, y0, x1+1, y1+1);
        mode = "contain";
      } else {
        // Photo / screenshot with its own background: centre-crop to a square.
        int s = Math.Min(w, h);
        box = new Rectangle((w-s)/2, (h-s)/2, s, s);
        mode = "cover";
      }
      using (var outB = new Bitmap(size, size))
      using (var g = Graphics.FromImage(outB)) {
        g.Clear(Color.White);
        g.InterpolationMode = InterpolationMode.HighQualityBicubic;
        g.SmoothingMode = SmoothingMode.HighQuality; g.PixelOffsetMode = PixelOffsetMode.HighQuality;
        Rectangle dest;
        if (mode == "contain") {
          double inner = size * 0.80, sc = Math.Min(inner / box.Width, inner / box.Height);
          int dw = (int)(box.Width*sc), dh = (int)(box.Height*sc);
          dest = new Rectangle((size-dw)/2, (size-dh)/2, dw, dh);
        } else dest = new Rectangle(0, 0, size, size);
        g.DrawImage(bmp, dest, box, GraphicsUnit.Pixel);
        var ep = new EncoderParameters(1); ep.Param[0] = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, 86L);
        outB.Save(dst, Jpeg(), ep);
      }
      bmp.Dispose();
      return mode;
    }
  }
}
"@

$roots = @{
  20 = 'fiber-cables'; 21 = 'fiber-networking'; 22 = 'panels'; 23 = 'copper';
  24 = 'racks'; 25 = 'tools'; 26 = 'laying'; 96 = 'active'
}
$cats = Get-Content (Join-Path $Scrape 'cats.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$catById = @{}; $cats | ForEach-Object { $catById[[int]$_.id] = $_ }
function RootOf($id) { $c = $catById[[int]$id]; while ($c -and $c.parent -ne 0) { $c = $catById[[int]$c.parent] }; if ($c) { [int]$c.id } }

$prods = @()
foreach ($f in 'p1.json','p2.json') { $prods += (Get-Content (Join-Path $Scrape $f) -Raw -Encoding UTF8 | ConvertFrom-Json) }

$imgDir = Join-Path $Out 'assets\products'; New-Item -ItemType Directory -Force $imgDir | Out-Null
$rawDir = Join-Path $Scrape 'raw'; New-Item -ItemType Directory -Force $rawDir | Out-Null
$seen = @{}; $list = New-Object System.Collections.ArrayList
Add-Type -AssemblyName System.Web

foreach ($p in $prods) {
  $name = [System.Web.HttpUtility]::HtmlDecode($p.name) -replace '\s*\(Copy\)', '' -replace '\s+', ' '
  $name = $name.Trim().TrimEnd(',')
  if ($name -match 'Example \d+$') { continue }
  if ($name -cmatch '^[^a-z]+$') {
    $name = ($name.ToLower() -split ' ' | ForEach-Object { if ($_ -match '^(onu|ip\d+|wme|\d+u)$') { $_.ToUpper() } elseif ($_.Length) { $_.Substring(0,1).ToUpper() + $_.Substring(1) } }) -join ' '
    $name = $name -replace 'Cabİnets', 'Cabinets' -replace 'Welted', 'Welded'
  }
  if ($seen[$name] -or -not $p.images -or $p.images.Count -eq 0) { continue }
  $root = $null; $sub = $null
  foreach ($c in $p.categories) {
    $r = RootOf $c.id
    if ($roots.ContainsKey($r)) {
      if (-not $root) { $root = $roots[$r] }
      if ([int]$c.id -ne $r -and -not $sub) { $sub = [System.Web.HttpUtility]::HtmlDecode($c.name) }
    }
  }
  if (-not $root) { continue }
  $seen[$name] = $true
  $desc = [System.Web.HttpUtility]::HtmlDecode(($p.short_description -replace '<[^>]+>', ' ')) -replace '\s+', ' '
  $desc = $desc.Trim()
  if (-not $desc) { $desc = [System.Web.HttpUtility]::HtmlDecode(($p.description -replace '<[^>]+>', ' ')) -replace '\s+', ' '; $desc = $desc.Trim() }
  if ($desc.Length -gt 190) { $desc = $desc.Substring(0, 190); $desc = $desc.Substring(0, $desc.LastIndexOf(' ')) + '…' }

  $src = $p.images[0].src
  $ext = [IO.Path]::GetExtension(([Uri]$src).AbsolutePath)
  $rawFile = Join-Path $rawDir ("$($p.id)$ext")
  $outFile = Join-Path $imgDir ("$($p.id).jpg")
  try {
    if (-not (Test-Path $rawFile)) { Invoke-WebRequest -Uri $src -OutFile $rawFile -UserAgent 'Mozilla/5.0' -UseBasicParsing }
    $mode = [Img]::Normalize($rawFile, $outFile, 720)
  } catch { Write-Warning "image failed for $($p.id): $_"; continue }

  [void]$list.Add([ordered]@{
    id = $p.id; name = $name; cat = $root; sub = $sub; desc = $desc
    img = "assets/products/$($p.id).jpg"; fit = $mode; url = $p.permalink
  })
}
$json = $list | ConvertTo-Json -Depth 4 -Compress
$dataDir = Join-Path $Out 'data'; New-Item -ItemType Directory -Force $dataDir | Out-Null
[IO.File]::WriteAllText((Join-Path $dataDir 'products.js'), "window.XTND_PRODUCTS = $json;`n", (New-Object Text.UTF8Encoding $false))
"products: $($list.Count)"
$list | Group-Object { $_.cat } | ForEach-Object { "$($_.Name): $($_.Count)" }
$list | Group-Object { $_.fit } | ForEach-Object { "fit $($_.Name): $($_.Count)" }
