import json
from pymongo import MongoClient

client = MongoClient('mongodb+srv://test:test@cluster0-n6nfv.mongodb.net/test')
db = client['fs-shop']

with open('test.json') as f:
    file_data = json.load(f)

# if pymongo < 3.0, use insert()
#collection_currency.insert(file_data)
# if pymongo >= 3.0 use insert_one() for inserting one document
###collection_currency.insert_one(file_data)
# if pymongo >= 3.0 use insert_many() for inserting many documents
#collection_currency.insert_many(file_data)
#print(file_data)
if (file_data):
    for a in file_data["categories"]:
        name = a["categoryName"]
        #collection = db[name]
        collection = db["Products"]
        for b in a["subCategories"]:     
            #collection.insert_one(b)
            for c in b["products"]:
                collection.insert_one(c)
                print("insert mongodb: ", c["name"])
client.close()