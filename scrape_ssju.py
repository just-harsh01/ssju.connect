import urllib.request
import re
import json

url = 'https://www.ssjuonline.com/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

try:
    with urllib.request.urlopen(req, timeout=15) as res:
        html = res.read().decode('utf-8', errors='ignore')
        
        # Find all paper links
        matches = re.findall(r'<a[^>]+href=["\'](https://www.ssjuonline.com/papers/[^"\']+)["\'][^>]*>(.*?)</a>', html, re.IGNORECASE)
        print(f"Total paper links found: {len(matches)}")
        
        papers_data = []
        for href, text in matches:
            clean_text = re.sub(r'<[^>]+>', '', text).strip()
            if not clean_text:
                continue
            papers_data.append({
                "url": href,
                "title": clean_text
            })
            
        print(f"Cleaned papers: {len(papers_data)}")
        with open('ssju_scraped_papers.json', 'w', encoding='utf-8') as f:
            json.dump(papers_data[:60], f, indent=2)
            
        for p in papers_data[:15]:
            print(p['title'])
            
except Exception as e:
    print(f"Scrape error: {e}")
