<?php
$m = new MongoClient();
$db = $m->selectDB("prereg");
$collection = $db->selectCollection("subjects");
$search_doc = array('title','a ');
echo "hello world";
