from bs4 import BeautifulSoup as bsoup
from pymongo import MongoClient

#connecting to Mongo
client = MongoClient()
db = client.aiub
collection = db.subjects

html_doc = open('/Users/tahmid/Desktop/Offered.html')
soup = bsoup(html_doc)
tr = soup.find('tr')
subjects = tr.find_next_siblings('tr')

class_struct = ['type', 'day', 'starts_at', 'ends_at', 'room_no']
key = ['class_id', 'status', 'capacity', 'count', 'title', 'class_schedule']
key_without_schedule = ['class_id', 'status', 'capacity', 'count', 'title']
for tr in subjects:
	li = []
	list_of_classes = []
	x = tr.find('td')
	li.append(x.string)
	print x.string
	for j in range(4):
		x = x.find_next_sibling('td')
		li.append(x.string)
	if tr.find('tbody') == None:
		print('error at',li[0])
		zippedList = zip(key_without_schedule, li)
		d = {i[0]: i[1] for i in zippedList}
		continue
	y = tr.find('tbody').findAll('td')
	if len(y) > 5:
		class1 = []
		class2 = []
		for k in range(5):
			class1.append(y[k].string)
		for k in range(5,10):
			class2.append(y[k].string)
		zippedcl1 = zip(class_struct, class1)
		zippedcl2 = zip(class_struct, class2)
		c1dict = {j[0]: j[1] for j in zippedcl1}
		c2dict = {j[0]: j[1] for j in zippedcl2}
		list_of_classes.append(c1dict)
		list_of_classes.append(c2dict)
	elif len(y) == 5:
		class1 = []
		for j in range(5):
			class1.append(y[j].string)
		zippedcl1 = zip(class_struct, class1)
		c1dict = {j[0]: j[1] for j in zippedcl1}
		list_of_classes.append(c1dict)
		print c1dict
	else:
		print('error at td length')

	li.append(list_of_classes)
	zippedLi = zip(key, li)
	d = {j[0] : j[1] for j in zippedLi}
	collection.insert(d)