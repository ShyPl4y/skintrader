import sys, json
d = json.load(sys.stdin)
print("Marketplaces:")
for m in d.get('marketplaces', []):
    price = f"{m['price']}EUR" if m['price'] else "---"
    print(f"  {m['name']}: {price} {m['url']}")