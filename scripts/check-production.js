#!/usr/bin/env node

/**
 * Production Deployment Checker
 * Checks GitHub repo and Vercel deployments
 * 
 * Usage: node scripts/check-production.js
 */

const https = require('https');
const http = require('http');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Test URLs
const VERCEL_URLS = [
  'https://estate-baanpakpoolvilla.vercel.app',
  'https://poolvilla-estate.vercel.app',
  'https://estate.vercel.app',
];

const TEST_PAGES = [
  { path: '/', name: 'Homepage' },
  { path: '/villas', name: 'Villas Page' },
  { path: '/projects', name: 'Projects Page' },
  { path: '/articles', name: 'Articles Page' },
];

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DeploymentChecker/1.0)',
      },
    };

    const startTime = Date.now();
    
    const req = client.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const duration = Date.now() - startTime;
        resolve({
          url,
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          duration,
          success: res.statusCode >= 200 && res.statusCode < 400,
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        url,
        statusCode: null,
        error: error.message,
        duration: Date.now() - startTime,
        success: false,
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        url,
        statusCode: null,
        error: 'Request timeout',
        duration: Date.now() - startTime,
        success: false,
      });
    });

    req.end();
  });
}

function analyzeContent(html) {
  const analysis = {
    hasVillas: false,
    villaCount: 0,
    hasProjects: false,
    projectCount: 0,
    hasArticles: false,
    articleCount: 0,
    hasImages: false,
    imageCount: 0,
    hasError: false,
    errorMessages: [],
  };

  if (!html) return analysis;

  // Check for villas
  const villaMatches = html.match(/วิลล่า|villa/gi);
  analysis.hasVillas = villaMatches && villaMatches.length > 5;
  analysis.villaCount = villaMatches ? villaMatches.length : 0;

  // Check for projects
  const projectMatches = html.match(/โครงการ|project/gi);
  analysis.hasProjects = projectMatches && projectMatches.length > 3;
  analysis.projectCount = projectMatches ? projectMatches.length : 0;

  // Check for articles
  const articleMatches = html.match(/บทความ|article/gi);
  analysis.hasArticles = articleMatches && articleMatches.length > 2;
  analysis.articleCount = articleMatches ? articleMatches.length : 0;

  // Check for images
  const imageMatches = html.match(/<img[^>]+src=["']([^"']+)["']/gi);
  analysis.hasImages = imageMatches && imageMatches.length > 0;
  analysis.imageCount = imageMatches ? imageMatches.length : 0;

  // Check for Unsplash images specifically
  const unsplashMatches = html.match(/unsplash\.com/gi);
  analysis.hasUnsplashImages = unsplashMatches && unsplashMatches.length > 0;
  analysis.unsplashCount = unsplashMatches ? unsplashMatches.length : 0;

  // Check for errors
  if (html.includes('Error') || html.includes('error') || html.includes('404')) {
    analysis.hasError = true;
    
    // Try to extract error messages
    const errorPattern = /(Error:|error:)\s*([^\n<]+)/gi;
    let match;
    while ((match = errorPattern.exec(html)) !== null) {
      analysis.errorMessages.push(match[2].trim());
    }
  }

  // Check for database connection issues
  if (html.includes('database') && html.includes('error')) {
    analysis.hasDatabaseError = true;
  }

  return analysis;
}

async function testVercelUrl(baseUrl) {
  log(`\n${'='.repeat(70)}`, 'blue');
  log(`Testing: ${baseUrl}`, 'cyan');
  log('='.repeat(70), 'blue');

  const results = [];

  for (const page of TEST_PAGES) {
    const url = `${baseUrl}${page.path}`;
    log(`\n📄 Testing ${page.name} (${page.path})...`, 'gray');
    
    const result = await fetchUrl(url);
    results.push({ page: page.name, ...result });

    if (result.success) {
      log(`   ✓ Status: ${result.statusCode} (${result.duration}ms)`, 'green');
      
      // Analyze content
      const analysis = analyzeContent(result.body);
      
      if (analysis.hasImages) {
        log(`   ✓ Images found: ${analysis.imageCount} images`, 'green');
        if (analysis.hasUnsplashImages) {
          log(`   ✓ Unsplash images: ${analysis.unsplashCount}`, 'green');
        }
      } else {
        log(`   ✗ No images found`, 'red');
      }

      if (page.path === '/') {
        if (analysis.hasVillas) {
          log(`   ✓ Villas detected (${analysis.villaCount} mentions)`, 'green');
        } else {
          log(`   ⚠ No villas detected`, 'yellow');
        }
        
        if (analysis.hasProjects) {
          log(`   ✓ Projects detected (${analysis.projectCount} mentions)`, 'green');
        } else {
          log(`   ⚠ No projects detected`, 'yellow');
        }
        
        if (analysis.hasArticles) {
          log(`   ✓ Articles detected (${analysis.articleCount} mentions)`, 'green');
        } else {
          log(`   ⚠ No articles detected`, 'yellow');
        }
      }

      if (analysis.hasError) {
        log(`   ⚠ Possible errors detected`, 'yellow');
        if (analysis.errorMessages.length > 0) {
          analysis.errorMessages.forEach(msg => {
            log(`     - ${msg}`, 'yellow');
          });
        }
      }

      if (analysis.hasDatabaseError) {
        log(`   ✗ Database connection error detected`, 'red');
      }
    } else {
      log(`   ✗ Failed: ${result.error || `HTTP ${result.statusCode}`}`, 'red');
    }
  }

  return results;
}

async function checkGitHubRepo() {
  log('\n' + '='.repeat(70), 'blue');
  log('Checking GitHub Repository', 'cyan');
  log('='.repeat(70), 'blue');
  log('\nRepo: https://github.com/baanpakpoolvilla/estate\n', 'gray');

  const result = await fetchUrl('https://github.com/baanpakpoolvilla/estate');
  
  if (result.success) {
    log('✓ GitHub repository is accessible', 'green');
    
    // Try to find last commit info
    const commitMatch = result.body.match(/datetime="([^"]+)"/);
    if (commitMatch) {
      const commitDate = new Date(commitMatch[1]);
      const now = new Date();
      const minutesAgo = Math.floor((now - commitDate) / 60000);
      
      if (minutesAgo < 60) {
        log(`✓ Last commit: ${minutesAgo} minute(s) ago`, 'green');
      } else {
        const hoursAgo = Math.floor(minutesAgo / 60);
        log(`✓ Last commit: ${hoursAgo} hour(s) ago`, 'green');
      }
    }
    
    return true;
  } else {
    log(`✗ Failed to access GitHub repo: ${result.error}`, 'red');
    return false;
  }
}

async function main() {
  log('\n╔════════════════════════════════════════════════════════════════════╗', 'blue');
  log('║                                                                    ║', 'blue');
  log('║        Production Deployment Checker                              ║', 'blue');
  log('║        Pool Villa Estate Website                                  ║', 'blue');
  log('║                                                                    ║', 'blue');
  log('╚════════════════════════════════════════════════════════════════════╝', 'blue');

  // Check GitHub repo
  await checkGitHubRepo();

  // Test each Vercel URL
  const allResults = {};
  
  for (const url of VERCEL_URLS) {
    const results = await testVercelUrl(url);
    allResults[url] = results;
    await new Promise(resolve => setTimeout(resolve, 1000)); // Delay between tests
  }

  // Summary
  log('\n\n' + '='.repeat(70), 'blue');
  log('DEPLOYMENT SUMMARY', 'cyan');
  log('='.repeat(70), 'blue');

  let workingUrl = null;
  let bestScore = 0;

  for (const [url, results] of Object.entries(allResults)) {
    const successCount = results.filter(r => r.success).length;
    const score = successCount / results.length;
    
    log(`\n${url}`, 'cyan');
    log(`  Pages working: ${successCount}/${results.length}`, score === 1 ? 'green' : 'yellow');
    
    if (score > bestScore) {
      bestScore = score;
      workingUrl = url;
    }
  }

  if (workingUrl && bestScore === 1) {
    log('\n╔════════════════════════════════════════════════════════════════════╗', 'green');
    log('║                                                                    ║', 'green');
    log(`║  ✓ PRODUCTION URL FOUND:                                          ║`, 'green');
    log(`║    ${workingUrl.padEnd(66)}║`, 'green');
    log('║                                                                    ║', 'green');
    log('╚════════════════════════════════════════════════════════════════════╝', 'green');
  } else if (workingUrl) {
    log('\n╔════════════════════════════════════════════════════════════════════╗', 'yellow');
    log('║                                                                    ║', 'yellow');
    log(`║  ⚠ PARTIAL DEPLOYMENT:                                            ║`, 'yellow');
    log(`║    ${workingUrl.padEnd(66)}║`, 'yellow');
    log(`║    Some pages working (${Math.round(bestScore * 100)}%)                                      ║`, 'yellow');
    log('║                                                                    ║', 'yellow');
    log('╚════════════════════════════════════════════════════════════════════╝', 'yellow');
  } else {
    log('\n╔════════════════════════════════════════════════════════════════════╗', 'red');
    log('║                                                                    ║', 'red');
    log('║  ✗ NO WORKING DEPLOYMENT FOUND                                    ║', 'red');
    log('║                                                                    ║', 'red');
    log('╚════════════════════════════════════════════════════════════════════╝', 'red');
  }

  log('\n');
}

main().catch(error => {
  log(`\n✗ Error: ${error.message}`, 'red');
  process.exit(1);
});
